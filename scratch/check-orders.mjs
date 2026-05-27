import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching last 20 orders from database...");
  const { data: orders, error } = await supabase
    .from('pedidos')
    .select('id, created_at, cliente_nombre, cliente_email, total, estado, metodo_pago, payment_id')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching orders:", error);
    return;
  }

  if (!orders || orders.length === 0) {
    console.log("No orders found in database.");
    return;
  }

  console.log("\n--- LAST 20 ORDERS ---");
  orders.forEach((order) => {
    console.log(`ID: ${order.id}`);
    console.log(`Fecha: ${order.created_at}`);
    console.log(`Cliente: ${order.cliente_nombre} (${order.cliente_email})`);
    console.log(`Total: $${order.total}`);
    console.log(`Estado: ${order.estado}`);
    console.log(`Pago: ${order.metodo_pago} (ID: ${order.payment_id || 'N/A'})`);
    console.log("------------------------");
  });
}

main().catch(console.error);
