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

        const logDir = path.join(process.cwd(), 'public', 'logs', 'payway');
        const logPath = path.join(logDir, `${orderId}.json`);

        // Ensure directories exist
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        // 1. Read existing log file or initialize new
        let currentLog: PaywayLog = {
            order_id: orderId,
            webhooks: [],
            refunds: []
        };

        if (fs.existsSync(logPath)) {
            try {
                const fileContent = fs.readFileSync(logPath, 'utf8');
                currentLog = JSON.parse(fileContent);
                // Ensure array fields exist
                if (!currentLog.webhooks) currentLog.webhooks = [];
                if (!currentLog.refunds) currentLog.refunds = [];
            } catch (err) {
                console.error('Error parsing existing payway log file:', err);
            }
        }

        const timestamp = new Date().toISOString();

        // 2. Update log based on operation type
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

        // 3. Save to local filesystem
        try {
            fs.writeFileSync(logPath, JSON.stringify(currentLog, null, 2), 'utf8');
            console.log(`Saved Payway log locally for order ${orderId} to ${logPath}`);
        } catch (fsErr) {
            console.error('Failed to write Payway log file:', fsErr);
        }

        // 4. Update database column payway_log gracefully
        try {
            const { error } = await supabaseAdmin
                .from('pedidos')
                .update({ 
                    payway_log: currentLog 
                } as any) // Cast to avoid TypeScript lint errors if column type is not yet in definition
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
