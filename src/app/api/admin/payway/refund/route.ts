import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { logPaywayOperation } from '@/lib/payway-logger';

export async function POST(req: Request) {
    try {
        const { payment_id, amount, pedido_id } = await req.json();

        if (!payment_id) {
            return NextResponse.json({ error: 'ID de pago requerido' }, { status: 400 });
        }

        const isProduction = process.env.NEXT_PUBLIC_PAYWAY_ENV === 'production';
        const apiUrl = isProduction 
            ? `https://ventasonline.payway.com.ar/api/v2/payments/${payment_id}/refunds`
            : `https://developers-ventasonline.payway.com.ar/api/v2/payments/${payment_id}/refunds`;

        const payload = amount ? { amount: Math.round(amount) } : {}; // Si no se envía amount, se anula por el total

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
        if (pedido_id) {
            await logPaywayOperation(pedido_id, 'refund', {
                request: payload,
                response: data
            });
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: `Error procesando devolución en Payway: ${data.message || 'Rechazado'}` },
                { status: response.status }
            );
        }

        // Actualizar el estado en la base de datos a reembolsado
        if (pedido_id) {
            await supabaseAdmin
                .from('pedidos')
                .update({ 
                    estado: 'reembolsado'
                })
                .eq('id', pedido_id);
        }

        return NextResponse.json({ 
            message: 'Devolución procesada exitosamente', 
            refund_id: data.id,
            status: data.status 
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error procesando devolución:', error);
        return NextResponse.json(
            { error: error.message || 'Error interno del servidor al procesar devolución' },
            { status: 500 }
        );
    }
}
