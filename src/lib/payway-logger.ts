import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from './supabase-admin';

export interface PaywayLog {
    order_id: string;
    checkout?: {
        request: any;
        response: any;
        timestamp: string;
    };
    webhooks?: Array<{
        payload: any;
        timestamp: string;
    }>;
    refunds?: Array<{
        request: any;
        response: any;
        timestamp: string;
    }>;
}

export async function logPaywayOperation(
    orderId: string,
    type: 'checkout' | 'webhook' | 'refund',
    data: any
): Promise<PaywayLog | null> {
    try {
        if (!orderId) return null;

        // 1. Inicializar log y obtener registro existente desde Supabase (como fuente de verdad)
        let currentLog: PaywayLog = {
            order_id: orderId,
            webhooks: [],
            refunds: []
        };

        try {
            const { data: orderData, error: fetchError } = await supabaseAdmin
                .from('pedidos')
                .select('payway_log')
                .eq('id', orderId)
                .single();

            if (!fetchError && orderData && orderData.payway_log) {
                const dbLog = orderData.payway_log as any;
                currentLog = {
                    order_id: orderId,
                    checkout: dbLog.checkout || undefined,
                    webhooks: Array.isArray(dbLog.webhooks) ? dbLog.webhooks : [],
                    refunds: Array.isArray(dbLog.refunds) ? dbLog.refunds : []
                };
            }
        } catch (dbFetchErr) {
            console.error('Error fetching existing payway log from DB:', dbFetchErr);
        }

        const timestamp = new Date().toISOString();

        // 2. Actualizar el log según el tipo de operación
        if (type === 'checkout') {
            currentLog.checkout = {
                request: data.request,
                response: data.response,
                timestamp
            };
        } else if (type === 'webhook') {
            currentLog.webhooks!.push({
                payload: data,
                timestamp
            });
        } else if (type === 'refund') {
            currentLog.refunds!.push({
                request: data.request,
                response: data.response,
                timestamp
            });
        }

        // 3. Intentar guardar en el sistema de archivos local de forma segura (silencioso si falla en serverless)
        try {
            const logDir = path.join(process.cwd(), 'public', 'logs', 'payway');
            const logPath = path.join(logDir, `${orderId}.json`);

            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }
            fs.writeFileSync(logPath, JSON.stringify(currentLog, null, 2), 'utf8');
            console.log(`Saved Payway log locally for order ${orderId} to ${logPath}`);
        } catch (fsErr) {
            // Advertencia silenciosa (esperada en entornos serverless como Vercel donde es de solo lectura)
            console.warn(`Aviso: No se pudo escribir el log local en ${orderId}.json (comportamiento esperado en serverless/Vercel)`);
        }

        // 4. Actualizar columna payway_log en la base de datos de manera definitiva
        try {
            const { error } = await supabaseAdmin
                .from('pedidos')
                .update({ 
                    payway_log: currentLog 
                } as any)
                .eq('id', orderId);

            if (error) {
                console.warn(
                    `Could not update payway_log in Supabase for order ${orderId} (might be missing column payway_log):`, 
                    error.message
                );
            } else {
                console.log(`Successfully updated payway_log in Supabase for order ${orderId}`);
            }
        } catch (dbErr) {
            console.error('Error updating payway_log in database:', dbErr);
        }

        return currentLog;
    } catch (err) {
        console.error('Error in logPaywayOperation:', err);
        return null;
    }
}
