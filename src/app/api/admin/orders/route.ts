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
            try {
                const refund = new PaymentRefund(client);
                await refund.create({ payment_id: pedido.payment_id });
                console.log('Reembolso procesado exitosamente en Mercado Pago');
            } catch (refundError: any) {
                console.error('Error al procesar el reembolso en MP:', refundError);
                // Si falla el reembolso, podrías decidir si cancelar o no la anulación en DB.
                // Aquí seguiremos para al menos marcarlo como anulado en DB, pero avisamos.
                return NextResponse.json({ 
                    error: 'Error al procesar el reembolso en Mercado Pago', 
                    details: refundError.message 
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
