import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuración de MercadoPago
const mpClient = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

// POST /api/checkout
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, cliente_nombre, cliente_email, total, metodo_pago = 'mercadopago', payway_token, bin } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
        }

        // --- INICIO DE VALIDACIÓN DE PRECIOS EN EL SERVIDOR ---
        const itemIds = items.map((item: any) => item.id);
        const { data: dbProducts, error: dbError } = await supabaseAdmin
            .from('productos')
            .select('id, precio, precio_con_descuento')
            .in('id', itemIds);

        if (dbError || !dbProducts) {
            return NextResponse.json({ error: 'Error al verificar productos en el servidor' }, { status: 500 });
        }

        let totalValidado = 0;
        const validatedItems = items.map((item: any) => {
            const dbProduct = dbProducts.find((p) => p.id === item.id);
            if (!dbProduct) throw new Error(`Producto con ID ${item.id} no encontrado`);
            
            const precioReal = dbProduct.precio_con_descuento || dbProduct.precio;
            totalValidado += precioReal * (item.quantity || 1);
            
            return { ...item, price: precioReal };
        });
        // --- FIN DE VALIDACIÓN DE PRECIOS ---

        // 1. Crear el pedido en la tabla "pedidos"
        const { data: pedido, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .insert([
                { 
                    cliente_nombre, 
                    cliente_email, 
                    total: totalValidado, 
                    estado: 'pendiente' 
                }
            ])
            .select()
            .single();

        if (pedidoError) throw pedidoError;

        // 2. Insertar los ítems del pedido en "pedido_items"
        const pedidoItemsData = validatedItems.map((item: any) => ({
            pedido_id: pedido.id,
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: item.price
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('pedido_items')
            .insert(pedidoItemsData);

        if (itemsError) throw itemsError;

        let baseUrl = process.env.NEXT_PUBLIC_URL || 
                      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
                      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
                      
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        // 3. Procesar según método de pago
        if (metodo_pago === 'mercadopago') {
            const mpPreference = new Preference(mpClient);
            
            const preferenceData = {
                body: {
                    items: validatedItems.map((item: any) => ({
                        id: String(item.id),
                        title: String(item.name || item.nombre || 'Producto'),
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

            return NextResponse.json(
                { 
                    message: 'Pedido creado exitosamente con Mercado Pago', 
                    pedidoId: pedido.id,
                    initPoint: result.init_point 
                },
                { status: 201 }
            );

        } else if (metodo_pago === 'payway') {
            // Integración Decidir 2.0 (Payway)
            if (!payway_token) {
                return NextResponse.json({ error: 'Token de Payway no proporcionado' }, { status: 400 });
            }

            const decidirApiUrl = 'https://developers.decidir.com/api/v2/payments'; // O Sandbox: https://sandbox.decidir.com/api/v2/payments
            
            // Requerimientos mínimos para el pago V2
            const decidirPayload = {
                site_transaction_id: String(pedido.id),
                token: payway_token,
                payment_method_id: 1, // 1 es VISA. Habría que ajustarlo según la tarjeta (bin o selección en frontend)
                bin: bin || "450799", 
                amount: totalValidado,
                currency: "ARS",
                installments: 1,
                description: `Compra Ecommerce - Pedido #${pedido.id}`,
                payment_type: "single",
                establishment_name: "ECOMMERCE",
                sub_payments: []
            };

            const response = await fetch(decidirApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.PAYWAY_PRIVATE_KEY || ''
                },
                body: JSON.stringify(decidirPayload)
            });

            const decidirData = await response.json();

            if (!response.ok) {
                // Registrar fallo en base de datos si es necesario
                await supabaseAdmin
                    .from('pedidos')
                    .update({ estado: 'cancelado' })
                    .eq('id', pedido.id);

                return NextResponse.json(
                    { error: `Error en Payway: ${decidirData.message || JSON.stringify(decidirData.validation_errors) || 'Rechazado'}` },
                    { status: 400 }
                );
            }

            // Pago aprobado por Decidir
            if (decidirData.status === 'approved') {
                // Actualizar pedido a pagado
                await supabaseAdmin
                    .from('pedidos')
                    .update({ estado: 'pagado' })
                    .eq('id', pedido.id);

                return NextResponse.json(
                    { 
                        message: 'Pago con Payway procesado exitosamente', 
                        pedidoId: pedido.id,
                        status: 'approved',
                        redirectUrl: `${baseUrl}/checkout/success`
                    },
                    { status: 201 }
                );
            } else {
                return NextResponse.json(
                    { error: `El pago fue rechazado. Estado: ${decidirData.status}` },
                    { status: 400 }
                );
            }

        } else {
            return NextResponse.json({ error: 'Método de pago no soportado' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Error detallado procesando checkout:', error);
        
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
