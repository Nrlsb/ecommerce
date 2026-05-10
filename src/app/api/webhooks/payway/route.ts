import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        
        console.log('Webhook Payway recibido:', payload);

        // Extraer los datos principales enviados por Payway
        const paymentId = payload.id;
        const orderId = payload.site_transaction_id;
        const status = payload.status; // ej. 'approved', 'rejected', 'annulled'

        if (orderId && status) {
            console.log(`Actualizando pedido ${orderId} con estado Payway: ${status}`);
            
            // Mapear estados de Payway a nuestros estados
            let nuevoEstado = 'pendiente';
            if (status === 'approved') nuevoEstado = 'pagado';
            else if (status === 'rejected' || status === 'annulled') nuevoEstado = 'cancelado';

            const updateData: any = { estado: nuevoEstado };
            
            // Si está pagado, guardamos el payment_id (aunque ya debería haberse guardado en el route del checkout)
            // Esto sirve en caso de que el webhook llegue por una confirmación asíncrona
            if (status === 'approved' && paymentId) {
                updateData.payment_id = String(paymentId);
            }

            const { error } = await supabaseAdmin
                .from('pedidos')
                .update(updateData)
                .eq('id', orderId);

            if (error) {
                console.error('Error al actualizar pedido en webhook de Payway:', error);
                throw error;
            }
            
            console.log(`Pedido ${orderId} actualizado exitosamente vía Webhook Payway.`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error('Error en webhook de Payway:', error);
        // Retornar 200 evita reintentos infinitos si el problema es nuestro,
        // pero puedes cambiarlo a 500 si la documentación de Payway recomienda reintentos ante fallos.
        return NextResponse.json({ error: error.message }, { status: 200 });
    }
}
