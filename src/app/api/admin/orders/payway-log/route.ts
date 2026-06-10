import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('id');

        if (!orderId) {
            return NextResponse.json({ error: 'ID de pedido requerido' }, { status: 400 });
        }

        // 1. Intentar buscar el log en la base de datos
        let dbLog: any = null;
        try {
            const { data: pedido, error } = await supabaseAdmin
                .from('pedidos')
                .select('payway_log, metodo_pago, payment_id, payway_tid, payway_auth_code')
                .eq('id', orderId)
                .single();

            if (!error && pedido) {
                if (pedido.payway_log) {
                    dbLog = pedido.payway_log;
                } else if (pedido.metodo_pago !== 'payway') {
                    return NextResponse.json({ 
                        error: 'Este pedido no fue abonado con Payway',
                        metodo_pago: pedido.metodo_pago 
                    }, { status: 400 });
                }
            }
        } catch (dbErr) {
            console.error('Error al consultar payway_log en BD:', dbErr);
        }

        if (dbLog) {
            return NextResponse.json(dbLog);
        }

        // 2. Si no está en la base de datos, intentar leer del archivo local
        const logPath = path.join(process.cwd(), 'public', 'logs', 'payway', `${orderId}.json`);
        if (fs.existsSync(logPath)) {
            try {
                const fileContent = fs.readFileSync(logPath, 'utf8');
                const logData = JSON.parse(fileContent);
                return NextResponse.json(logData);
            } catch (err: any) {
                console.error('Error parseando archivo log local:', err);
                return NextResponse.json({ error: 'Log existente corrupto o ilegible' }, { status: 500 });
            }
        }

        // 3. Si no hay registro pero el pedido existe y fue con Payway, podemos intentar construir un log sintético
        try {
            const { data: pedido } = await supabaseAdmin
                .from('pedidos')
                .select('id, payment_id, payway_tid, payway_auth_code, metodo_pago, total, estado')
                .eq('id', orderId)
                .single();

            if (pedido && pedido.metodo_pago === 'payway') {
                const syntheticLog = {
                    order_id: pedido.id,
                    info: "No se encontró un registro detallado en disco ni en BD. Datos sintéticos generados a partir del pedido.",
                    checkout: {
                        response: {
                            id: pedido.payment_id,
                            status: pedido.estado === 'pagado' ? 'approved' : pedido.estado,
                            amount: pedido.total * 100,
                            currency: "ARS",
                            status_details: {
                                ticket: pedido.payway_tid,
                                card_authorization_code: pedido.payway_auth_code
                            }
                        },
                        timestamp: new Date().toISOString()
                    }
                };
                return NextResponse.json(syntheticLog);
            }
        } catch (synthErr) {
            console.error('Error al crear log sintético:', synthErr);
        }

        return NextResponse.json({ error: 'No se encontraron registros de Payway para este pedido' }, { status: 404 });

    } catch (error: any) {
        console.error('Error en API payway-log:', error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
