import { supabaseAdmin } from './supabase-admin';
import { env } from './env';
import fs from 'fs';
import path from 'path';

const TIPO_FACTURA: Record<string, string> = {
  "Consumidor Final": "F",
  "Factura A": "I",
  "Factura B": "F"
};

const PROVINCIAS_INTEGRACION: Record<string, string> = {
  "AR-C": "CF", "AR-B": "BA", "AR-GB": "BA", "AR-K": "CA", "AR-H": "CH",
  "AR-U": "CB", "AR-X": "CO", "AR-W": "CR", "AR-E": "ER", "AR-P": "FO",
  "AR-Y": "JU", "AR-L": "LP", "AR-F": "LR", "AR-M": "ME", "AR-N": "MI",
  "AR-Q": "NE", "AR-R": "RN", "AR-A": "SA", "AR-J": "SJ", "AR-D": "SL",
  "AR-Z": "SC", "AR-S": "SF", "AR-G": "SE", "AR-V": "TF", "AR-T": "TU"
};

const getFacturaTipoCode = (tipo: string | null | undefined): string => {
  const t = tipo || 'Consumidor Final';
  return TIPO_FACTURA[t] || "F";
};

const getProvinciaCode = (provincia: string | null | undefined): string => {
  const p = (provincia || '').trim();
  if (p.length === 2) return p.toUpperCase();
  if (PROVINCIAS_INTEGRACION[p]) return PROVINCIAS_INTEGRACION[p];

  const provsNombres: Record<string, string> = {
    "capital federal": "CF", "caba": "CF", "ciudad autonoma de buenos aires": "CF",
    "buenos aires": "BA", "catamarca": "CA", "chaco": "CH", "chubut": "CB",
    "cordoba": "CO", "córdoba": "CO", "corrientes": "CR", "entre rios": "ER", "entre ríos": "ER",
    "formosa": "FO", "jujuy": "JU", "la pampa": "LP", "la rioja": "LR", "mendoza": "ME",
    "misiones": "MI", "neuquen": "NE", "neuquén": "NE", "rio negro": "RN", "río negro": "RN",
    "salta": "SA", "san juan": "SJ", "san luis": "SL", "santa cruz": "SC", "santa fe": "SF",
    "santiago del estero": "SE", "tierra del fuego": "TF", "tucuman": "TU", "tucumán": "TU"
  };
  return provsNombres[p.toLowerCase()] || "CF"; // Default: CABA
};

/**
 * Sincroniza un pedido aprobado con el sistema externo de facturación (ERP).
 * 
 * @param orderId UUID del pedido en Supabase
 * @returns boolean indicando si la operación fue exitosa
 */
export async function syncOrderToERP(orderId: string): Promise<boolean> {
  try {
    console.log(`[ERP] Iniciando sincronización del pedido: ${orderId}`);

    // 1. Obtener los datos del pedido
    const { data: order, error: orderError } = await supabaseAdmin
      .from('pedidos')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error(`[ERP] Error al buscar pedido ${orderId}:`, orderError);
      return false;
    }

    // 2. Obtener los items del pedido y código externo del producto
    const { data: items, error: itemsError } = await supabaseAdmin
      .from('pedido_items')
      .select(`
        cantidad,
        precio_unitario,
        producto_id,
        productos (
          nombre,
          codigo_externo
        )
      `)
      .eq('pedido_id', orderId);

    if (itemsError || !items) {
      console.error(`[ERP] Error al buscar items del pedido ${orderId}:`, itemsError);
      return false;
    }

    const fechaEmision = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const provCode = getProvinciaCode(order.envio_provincia);

    // 3. Estructurar el encabezado de facturación e integración
    const integracion: any = {
      encabezado: {
        emision: fechaEmision,
        nombre: order.facturacion_nombre || order.cliente_nombre,
        nomFant: order.facturacion_nombre || order.cliente_nombre,
        tipo: getFacturaTipoCode(order.facturacion_tipo),
        direccion: order.envio_direccion || "",
        provincia: provCode,
        localidad: order.envio_ciudad || "",
        cpostal: order.envio_codigo_postal || "",
        cuit: order.facturacion_documento || '20222222223',
        telefono: order.envio_telefono || "",
        mail: order.cliente_email,
        dirent: order.envio_direccion || "",
        provent: provCode,
        locent: order.envio_ciudad || "",
        cpent: order.envio_codigo_postal || "",
        codseg: " ",
        codcom: order.nro_pedido ? String(order.nro_pedido) : order.id.substring(0, 8)
      },
      detalle: [],
      medios: []
    };

    // Ajustar campos de entrega si es Retiro en Sucursal (LOCAL)
    if (order.metodo_entrega === 'retiro') {
      integracion.dirent = (order.envio_notes || order.envio_notas || "Retira por sucursal").replace(/\((.*?)\)/gi, '').trim();
      integracion.provent = "SF";
      integracion.locent = "Santa Fe";
      integracion.cpent = "3000";
    }

    // 4. Procesar el detalle de productos
    let itemIdx = 1;
    let totalCalculado = 0;

    for (const item of items) {
      const dbProduct = item.productos as any;
      const codigoExterno = dbProduct?.codigo_externo || `PROD-${item.producto_id}`;
      
      const precioUnitario = Math.ceil(Number(item.precio_unitario) * 100) / 100;
      const subtotalItem = Number(item.cantidad) * precioUnitario;
      totalCalculado += subtotalItem;

      integracion.detalle.push({
        item: String(itemIdx++).padStart(2, '0'),
        codigo: codigoExterno,
        precio: precioUnitario,
        cantidad: Number(item.cantidad),
        total: subtotalItem
      });
    }

    // Agregar el costo de envío al detalle si aplica
    if (order.metodo_entrega === 'envio' && Number(order.envio_costo) > 0) {
      const envioCosto = Number(order.envio_costo);
      totalCalculado += envioCosto;

      integracion.detalle.push({
        item: String(itemIdx++).padStart(2, '0'),
        codigo: "COSTOENVIO",
        precio: envioCosto,
        shadow: false,
        cantidad: 1,
        total: envioCosto
      });
    }

    // 5. Configurar medios de pago (mantenemos tipoMedio 'MP' y código 63 por retrocompatibilidad del ERP)
    integracion.medios.push({
      tipoMedio: "MP",
      codigo: 63,
      valor: totalCalculado,
      nroCupon: "12233454556",
      autorizacion: "1121212121"
    });

    const jsonSend = JSON.stringify(integracion);
    const logPath = path.join(process.cwd(), 'api.txt');
    const timestamp = new Date().toLocaleString('es-AR');

    // 6. Registrar log local de envío (SEND)
    fs.appendFileSync(logPath, `${timestamp}: \r\n SEND: ${jsonSend}\r\n\r\n`);

    // 7. Enviar la petición POST HTTP al ERP
    const response = await fetch(env.protheusApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': '*/*'
      },
      body: jsonSend,
      signal: AbortSignal.timeout(30000) // Timeout de 30 segundos
    });

    const resultText = await response.text();

    // 8. Registrar log local de respuesta (RECEIVE)
    fs.appendFileSync(logPath, `${timestamp}: \r\n RECEIVE: ${resultText}\r\n\r\n`);

    console.log(`[ERP] Sincronización finalizada para pedido ${orderId}. Status HTTP: ${response.status}`);
    return response.ok;

  } catch (error: any) {
    console.error(`[ERP] Excepción durante la sincronización del pedido ${orderId}:`, error);
    try {
      const logPath = path.join(process.cwd(), 'api.txt');
      const timestamp = new Date().toLocaleString('es-AR');
      fs.appendFileSync(logPath, `${timestamp}: \r\n EXCEPTION ERROR: ${error.message}\r\n\r\n`);
    } catch (logErr) {
      console.error('[ERP] No se pudo escribir el log de la excepción en api.txt:', logErr);
    }
    return false;
  }
}
