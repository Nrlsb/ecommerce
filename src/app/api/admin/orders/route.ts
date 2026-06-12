import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { MercadoPagoConfig, PaymentRefund } from 'mercadopago';
import { z } from 'zod';
import { sendOrderConfirmationEmail, sendOrderDispatchedEmail } from '@/lib/email';
import { logPaywayOperation } from '@/lib/payway-logger';

export const dynamic = 'force-dynamic';

// Esquema de validación para el PATCH de pedidos
const updateOrderSchema = z.object({
    id: z.string().uuid({ message: "ID de pedido inválido" }),
    estado: z.enum(['pendiente', 'pagado', 'enviado', 'anulado'], { 
        errorMap: () => ({ message: "Estado no válido" }) 
    })
});

// GET /api/admin/orders - Listar todos los pedidos con sus ítems
export async function GET() {
    try {
        const { data: orders, error } = await supabaseAdmin
            .from('pedidos')
            .select(`
                *,
                items:pedido_items (
                    *,
                    producto:productos (nombre, marca, imagen_url)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error('Error al listar pedidos:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// PATCH /api/admin/orders - Actualizar estado y procesar reembolso si aplica
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validar entrada con Zod
        const validation = updateOrderSchema.safeParse(body);
        
        if (!validation.success) {
            return NextResponse.json({ 
                error: 'Validación fallida', 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const { id, estado } = validation.data;

        // Inicializar cliente MP dentro del handler para asegurar uso de variables de entorno actuales
        const client = new MercadoPagoConfig({ 
            accessToken: process.env.MP_ACCESS_TOKEN || '' 
        });

        // 1. Obtener el pedido actual para ver si tiene payment_id
        const { data: pedido, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('id', id)
            .single();

        if (pedidoError || !pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
        }

        // 2. Si el nuevo estado es 'anulado' y hay un payment_id, procedemos al reembolso
        if (estado === 'anulado' && pedido.payment_id) {
            if (pedido.metodo_pago === 'payway') {
                console.log(`Iniciando reembolso Payway para el pago ${pedido.payment_id} del pedido ${id}`);
                try {
                    const isProduction = process.env.NEXT_PUBLIC_PAYWAY_ENV === 'production';
                    const apiUrl = isProduction 
                        ? `https://ventasonline.payway.com.ar/api/v2/payments/${pedido.payment_id}/refunds`
                        : `https://developers-ventasonline.payway.com.ar/api/v2/payments/${pedido.payment_id}/refunds`;

                    const payload = { amount: Math.round(pedido.total * 100) };

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': process.env.PAYWAY_PRIVATE_KEY || ''
                        },
                        body: JSON.stringify(payload)
                    });

                    const data = await response.json();

                    // Log de la operación de Payway (Reembolso)
                    await logPaywayOperation(id, 'refund', {
                        request: payload,
                        response: data
                    });

                    if (!response.ok) {
                        throw new Error(data.message || 'Rechazado');
                    }
                    console.log('Reembolso Payway procesado exitosamente:', data.id);
                } catch (paywayError: any) {
                    console.error('Error detallado al procesar el reembolso en Payway:', paywayError);
                    return NextResponse.json({ 
                        error: 'Error al procesar el reembolso en Payway', 
                        details: paywayError.message || 'Error desconocido' 
                    }, { status: 500 });
                }
            } else {
                const token = process.env.MP_ACCESS_TOKEN || '';
                console.log(`Iniciando reembolso para el pago ${pedido.payment_id} del pedido ${id}`);
                console.log(`Usando token que empieza con: ${token.substring(0, 10)}... (Longitud: ${token.length})`);
                
                // Verificar si tenemos token configurado
                if (!token) {
                    console.error('Error: MP_ACCESS_TOKEN no configurado');
                    return NextResponse.json({ 
                        error: 'Configuración incompleta', 
                        details: 'No se encontró el token de Mercado Pago en el servidor.' 
                    }, { status: 500 });
                }

                try {
                    const refund = new PaymentRefund(client);
                    // Aseguramos que el payment_id sea string y no tenga espacios
                    const refundResult = await refund.create({ 
                        payment_id: String(pedido.payment_id).trim(),
                        body: {}
                    });
                    console.log('Reembolso procesado exitosamente:', refundResult.id);
                } catch (refundError: any) {
                    console.error('Error detallado al procesar el reembolso en Mercado Pago:', refundError);
                    
                    // Extraer el mensaje de error más específico de la respuesta de MP
                    let mensajeError = 'Error al procesar el reembolso en Mercado Pago';
                    let detallesError = refundError.message || 'Error desconocido';

                    // Si es un error del SDK de MP, suele tener una estructura con 'message' o 'cause'
                    if (refundError.cause && Array.isArray(refundError.cause) && refundError.cause.length > 0) {
                        detallesError = refundError.cause[0].description || detallesError;
                    } else if (refundError.error) {
                        detallesError = refundError.error;
                    }

                    return NextResponse.json({ 
                        error: mensajeError, 
                        details: detallesError 
                    }, { status: 500 });
                }
            }
        }

        // 3. Actualizar el estado en la base de datos
        const { error: updateError } = await supabaseAdmin
            .from('pedidos')
            .update({ estado })
            .eq('id', id);

        if (updateError) throw updateError;

        // Enviar notificaciones por correo según el nuevo estado
        if (estado === 'enviado') {
            sendOrderDispatchedEmail(id).catch(err => {
                console.error('Error al enviar correo de despacho:', err);
            });
        } else if (estado === 'pagado' && pedido.estado !== 'pagado') {
            sendOrderConfirmationEmail(id).catch(err => {
                console.error('Error al enviar correo de confirmación (marcado manual):', err);
            });
        }

        return NextResponse.json({ 
            message: `Pedido ${id} actualizado a ${estado} correctamente.`,
            refunded: !!(estado === 'anulado' && pedido.payment_id)
        });

    } catch (error: any) {
        console.error('Error al actualizar pedido:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
