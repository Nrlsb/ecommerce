import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MercadoPagoConfig, PaymentRefund } from 'mercadopago';

// Configuración de MercadoPago
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export const dynamic = 'force-dynamic';

// GET /api/admin/orders - Listar todos los pedidos con sus ítems
export async function GET() {
    try {
        const { data: orders, error } = await supabase
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
        const { id, estado } = await request.json();

        if (!id || !estado) {
            return NextResponse.json({ error: 'ID y estado son requeridos' }, { status: 400 });
        }

        // 1. Obtener el pedido actual para ver si tiene payment_id
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', id)
            .single();

        if (pedidoError || !pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
        }

        // 2. Si el nuevo estado es 'anulado' y hay un payment_id, procedemos al reembolso
        if (estado === 'anulado' && pedido.payment_id) {
            console.log(`Iniciando reembolso para el pago ${pedido.payment_id} del pedido ${id}`);
            
            // Verificar si tenemos token configurado
            if (!process.env.MP_ACCESS_TOKEN) {
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
                    payment_id: String(pedido.payment_id).trim() 
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

        // 3. Actualizar el estado en la base de datos
        const { error: updateError } = await supabase
            .from('pedidos')
            .update({ estado })
            .eq('id', id);

        if (updateError) throw updateError;

        return NextResponse.json({ 
            message: `Pedido ${id} actualizado a ${estado} correctamente.`,
            refunded: !!(estado === 'anulado' && pedido.payment_id)
        });

    } catch (error: any) {
        console.error('Error al actualizar pedido:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
