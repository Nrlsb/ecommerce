import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuración de MercadoPago
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

// POST /api/checkout
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, cliente_nombre, cliente_email, total } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
        }

        // 1. Crear el pedido en la tabla "pedidos"
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .insert([
                { 
                    cliente_nombre, 
                    cliente_email, 
                    total, 
                    estado: 'pendiente' 
                }
            ])
            .select()
            .single();

        if (pedidoError) throw pedidoError;

        // 2. Insertar los ítems del pedido en "pedido_items"
        const pedidoItemsData = items.map((item: any) => ({
            pedido_id: pedido.id,
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: item.price
        }));

        const { error: itemsError } = await supabase
            .from('pedido_items')
            .insert(pedidoItemsData);

        if (itemsError) throw itemsError;

        // 3. Crear la preferencia de MercadoPago
        const mpPreference = new Preference(client);
        
        const preferenceData = {
            body: {
                items: items.map((item: any) => ({
                    id: String(item.id),
                    title: item.name,
                    quantity: item.quantity,
                    unit_price: Number(item.price),
                    currency_id: 'ARS'
                })),
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/success`,
                    failure: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/failure`,
                    pending: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/pending`,
                },
                auto_return: 'approved',
                external_reference: pedido.id, // Referencia interna para vincular el pago
                notification_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`,
            }
        };

        const result = await mpPreference.create(preferenceData);

        // Retornamos éxito y el enlace de pago
        return NextResponse.json(
            { 
                message: 'Pedido creado exitosamente', 
                pedidoId: pedido.id,
                initPoint: result.init_point // URL de MercadoPago para pagar
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error procesando checkout:', error instanceof Error ? error.message : String(error));
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar el pago' },
            { status: 500 }
        );
    }
}
