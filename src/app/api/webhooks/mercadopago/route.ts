import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { syncOrderToERP } from '@/lib/erp';

// Configuración de MercadoPago
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        let body: any = {};
        try {
            body = await request.json();
        } catch (error) {
            // El body puede estar vacío si los parámetros vienen por URL
        }
        const type = url.searchParams.get('type') || body.type || url.searchParams.get('topic') || body.topic;
        const id = url.searchParams.get('data.id') || body.data?.id || url.searchParams.get('id') || body.id;

        console.log(`Webhook MP recibido: tipo=${type}, id=${id}, query=${url.searchParams.toString()}, body=${JSON.stringify(body)}`);

        if (type === 'payment' && id) {
            const payment = new Payment(client);
            const paymentData = await payment.get({ id });

            const orderId = paymentData.external_reference;
            const status = paymentData.status;

            if (orderId) {
                console.log(`Actualizando pedido ${orderId} con estado MP: ${status}`);
                
                // Mapear estados de MP a nuestros estados
                let nuevoEstado = 'pendiente';
                if (status === 'approved') nuevoEstado = 'pagado';
                else if (status === 'rejected') nuevoEstado = 'cancelado';
                else if (status === 'in_process') nuevoEstado = 'en_proceso';

                const updateData: any = { estado: nuevoEstado };
                
                // Si está pagado, guardamos el payment_id para futuros reembolsos
                if (status === 'approved') {
                    updateData.payment_id = String(id);
                }

                const { error } = await supabaseAdmin
                    .from('pedidos')
                    .update(updateData)
                    .eq('id', orderId);

                if (error) {
                    console.error('Error al actualizar pedido en webhook:', error);
                    throw error;
                }
                
                console.log(`Pedido ${orderId} actualizado exitosamente.`);

                if (status === 'approved') {
                    sendOrderConfirmationEmail(orderId).catch(err => {
                        console.error('Error al enviar correo de confirmación de pedido:', err);
                    });
                    syncOrderToERP(orderId).catch(err => {
                        console.error('Error al sincronizar pedido con ERP:', err);
                    });
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error('Error en webhook de MercadoPago:', error);
        // Retornamos 200 para evitar que MP reintente infinitamente si es un error de lógica nuestro, 
        // pero podrías devolver 500 si quieres que MP reintente.
        return NextResponse.json({ error: error.message }, { status: 200 });
    }
}
