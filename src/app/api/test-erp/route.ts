import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { syncOrderToERP } from '@/lib/erp';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    console.log('[Test-ERP] Iniciando endpoint de pruebas...');

    // 1. Intentar buscar el último pedido
    const { data: pedido } = await supabaseAdmin
      .from('pedidos')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let orderId = pedido?.id;

    // 2. Si no hay pedidos, crear uno de prueba
    if (!orderId) {
      console.log('[Test-ERP] No se encontraron pedidos. Creando un pedido de prueba en la base de datos...');
      
      // Buscar un producto existente para el item de prueba
      const { data: producto, error: prodError } = await supabaseAdmin
        .from('productos')
        .select('id, precio')
        .limit(1)
        .maybeSingle();

      if (prodError || !producto) {
        return NextResponse.json({ 
          error: 'No hay productos en la tabla "productos" para crear un pedido de prueba. Por favor, asegúrate de tener productos cargados.',
          details: prodError 
        }, { status: 400 });
      }

      // Insertar pedido de prueba ficticio
      const { data: nuevoPedido, error: createError } = await supabaseAdmin
        .from('pedidos')
        .insert({
          cliente_nombre: 'Cliente de Prueba ERP',
          cliente_email: 'prueba-erp@pintureriasmercurio.com.ar',
          total: Number(producto.precio) * 2 + 1500, // Producto * 2 + envío
          estado: 'pendiente',
          metodo_pago: 'mercadopago',
          metodo_entrega: 'envio',
          envio_costo: 1500,
          envio_direccion: 'Calle Ficticia 123',
          envio_ciudad: 'Santa Fe',
          envio_codigo_postal: '3000',
          envio_provincia: 'santa_fe',
          envio_telefono: '3425555555',
          envio_notas: 'Retirar por la tarde',
          facturacion_tipo: 'Consumidor Final'
        })
        .select()
        .single();

      if (createError || !nuevoPedido) {
        return NextResponse.json({ error: 'Error al crear pedido de prueba en Supabase', details: createError }, { status: 500 });
      }

      // Insertar item de pedido
      const { error: createItemError } = await supabaseAdmin
        .from('pedido_items')
        .insert({
          pedido_id: nuevoPedido.id,
          producto_id: producto.id,
          cantidad: 2,
          precio_unitario: producto.precio
        });

      if (createItemError) {
        return NextResponse.json({ error: 'Error al crear item del pedido de prueba', details: createItemError }, { status: 500 });
      }

      orderId = nuevoPedido.id;
    }

    console.log(`[Test-ERP] Ejecutando syncOrderToERP para pedido: ${orderId}`);
    
    // 3. Ejecutar la sincronización
    const success = await syncOrderToERP(orderId!);

    // 4. Leer la bitácora api.txt para retornar el log
    let logContent = 'No se pudo leer la bitácora api.txt';
    try {
      const logPath = path.join(process.cwd(), 'api.txt');
      if (fs.existsSync(logPath)) {
        logContent = fs.readFileSync(logPath, 'utf-8');
      }
    } catch (e: any) {
      logContent = `Error al leer api.txt: ${e.message}`;
    }

    return NextResponse.json({
      success,
      pedidoId: orderId,
      message: success ? '¡Sincronización de prueba exitosa!' : 'La sincronización falló. Revisa el log.',
      bitacora: logContent
    });

  } catch (error: any) {
    console.error('[Test-ERP] Excepción en endpoint de pruebas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
