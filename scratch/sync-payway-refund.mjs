import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Leer archivo .env manualmente para cargar credenciales
const envPath = path.join(process.cwd(), '.env');
const envConfig = {};
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let value = match[2] ? match[2].trim() : '';
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            envConfig[match[1]] = value;
        }
    }
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const paywayPrivateKey = envConfig.PAYWAY_PRIVATE_KEY || process.env.PAYWAY_PRIVATE_KEY;
const paywayEnv = envConfig.NEXT_PUBLIC_PAYWAY_ENV || process.env.NEXT_PUBLIC_PAYWAY_ENV || 'sandbox';

const isProduction = paywayEnv === 'production';
const paymentId = '15665392';
const pedidoId = '1249a00a-fa5c-4708-a577-19bcba209bda';

const baseUrl = isProduction 
    ? 'https://ventasonline.payway.com.ar/api/v2'
    : 'https://developers-ventasonline.payway.com.ar/api/v2';

async function fetchPayway() {
    console.log(`\n🔍 Consultando Payway (${paywayEnv}) para pago ID: ${paymentId}...`);
    
    // 1. Consultar el pago
    const paymentRes = await fetch(`${baseUrl}/payments/${paymentId}`, {
        headers: { 'apikey': paywayPrivateKey }
    });
    
    if (!paymentRes.ok) {
        console.error(`❌ Error al obtener pago: ${paymentRes.status} ${paymentRes.statusText}`);
        return null;
    }
    
    const paymentData = await paymentRes.json();
    console.log('✅ Pago obtenido con éxito de Payway.');

    // 2. Consultar los reembolsos del pago
    const refundsRes = await fetch(`${baseUrl}/payments/${paymentId}/refunds`, {
        headers: { 'apikey': paywayPrivateKey }
    });
    
    let refundsData = [];
    if (refundsRes.ok) {
        refundsData = await refundsRes.json();
        console.log(`✅ Reembolsos obtenidos con éxito (${refundsData.length || 0} encontrados).`);
    } else {
        console.warn(`⚠️ Aviso al obtener reembolsos de Payway (HTTP ${refundsRes.status}).`);
    }

    return { paymentData, refundsData };
}

async function run() {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error('❌ Falta configuración de Supabase URL o Service Role Key.');
        return;
    }
    if (!paywayPrivateKey) {
        console.error('❌ Falta la clave privada de Payway.');
        return;
    }

    const data = await fetchPayway();
    if (!data) return;

    const { paymentData, refundsData } = data;

    // Conectar a Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Obtener log existente
    const { data: pedido, error: getError } = await supabase
        .from('pedidos')
        .select('payway_log')
        .eq('id', pedidoId)
        .single();

    if (getError) {
        console.error('❌ Error al obtener el pedido de Supabase:', getError);
        return;
    }

    let existingLog = pedido?.payway_log || {
        order_id: pedidoId,
        webhooks: [],
        refunds: []
    };

    // Estructurar / actualizar checkout response
    existingLog.checkout = {
        request: existingLog.checkout?.request || {},
        response: paymentData,
        timestamp: existingLog.checkout?.timestamp || new Date().toISOString()
    };

    // Estructurar reembolsos
    const refundsList = Array.isArray(refundsData) ? refundsData : (refundsData.results || []);
    existingLog.refunds = refundsList.map(ref => ({
        request: { amount: ref.amount },
        response: ref,
        timestamp: ref.created_or_updated_at || new Date().toISOString()
    }));

    // Actualizar en base de datos
    const { error: updateError } = await supabase
        .from('pedidos')
        .update({ 
            payway_log: existingLog 
        })
        .eq('id', pedidoId);

    if (updateError) {
        console.error('❌ Error al actualizar payway_log en Supabase:', updateError);
    } else {
        console.log('\n🎉 ¡Completado con éxito!');
        console.log('✅ Base de datos actualizada con los detalles de la transacción y el reembolso.');
        console.log('El panel de administración ya mostrará la información real y completa del reembolso de Payway.');
    }
}

run().catch(console.error);
