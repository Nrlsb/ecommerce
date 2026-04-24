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
        
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        
        const preferenceData = {
            body: {
                items: items.map((item: any) => ({
                    id: String(item.id),
                    title: String(item.name || 'Producto'),
                    quantity: parseInt(item.quantity) || 1,
                    unit_price: parseFloat(item.price) || 0,
                    currency_id: 'ARS'
                })),
                back_urls: {
                    success: `${baseUrl}/checkout/success`,
                    failure: `${baseUrl}/checkout/failure`,
                    pending: `${baseUrl}/checkout/pending`,
                },
                auto_return: 'approved',
                external_reference: String(pedido.id), 
                notification_url: `${baseUrl}/api/webhooks/mercadopago`,
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

    } catch (error: any) {
        console.error('Error detallado procesando checkout:', error);
        
        // Error específico de Supabase
        if (error.code) {
            return NextResponse.json(
                { error: `Error de Base de Datos: ${error.message} (Código: ${error.code})` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Error interno del servidor al procesar el pago' },
            { status: 500 }
        );
    }
}
