import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { calculateShippingCost } from '@/lib/shipping';
import { logPaywayOperation } from '@/lib/payway-logger';

// Configuración de MercadoPago
const mpClient = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

// Helper para extraer el motivo amigable de rechazo de Payway/Decidir
function getPaywayErrorMessage(decidirData: any): string {
    // 1. Intentar obtener el error detallado de status_details
    const statusError = decidirData.status_details?.error?.reason;
    if (statusError) {
        const desc = statusError.description;
        const addDesc = statusError.additional_description;
        if (desc && addDesc && desc !== addDesc) {
            return `${desc} (${addDesc})`;
        }
        if (desc) return desc;
        if (addDesc) return addDesc;
    }

    // 2. Intentar de error.reason directo
    const reasonError = decidirData.error?.reason?.description;
    if (reasonError) return reasonError;

    // 3. Errores de validación de campos
    if (decidirData.validation_errors && decidirData.validation_errors.length > 0) {
        return decidirData.validation_errors
            .map((err: any) => `${err.param}: ${err.error || err.code || 'inválido'}`)
            .join(', ');
    }

    // 4. Mensajes genéricos de Decidir
    if (decidirData.message) {
        if (decidirData.message === 'payment_rejected') {
            return 'Pago rechazado por la entidad emisora (ej. saldo insuficiente o tarjeta inhabilitada)';
        }
        return decidirData.message;
    }

    if (decidirData.error?.type) {
        return decidirData.error.type;
    }

    return 'Pago rechazado o denegado por el emisor';
}

// POST /api/checkout
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            items, 
            cliente_nombre, 
            cliente_email, 
            cliente_telefono,
            metodo_pago = 'mercadopago', 
            payway_token, 
            bin, 
            payment_method_id, 
            installments = 1, 
            cupon_codigo,
            
            // Datos de Envío / Entrega
            metodo_entrega = 'envio',
            envio_direccion,
            envio_ciudad,
            envio_codigo_postal,
            envio_provincia,
            envio_telefono,
            envio_notas,
            
            // Datos de Facturación
            facturacion_tipo = 'Consumidor Final',
            facturacion_nombre,
            facturacion_documento
        } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
        }

        // --- INICIO DE VALIDACIÓN DE PRECIOS EN EL SERVIDOR ---
        const itemIds = items.map((item: any) => item.id);
        const { data: dbProducts, error: dbError } = await supabaseAdmin
            .from('productos')
            .select('id, precio, precio_con_descuento')
            .in('id', itemIds);

        if (dbError || !dbProducts) {
            return NextResponse.json({ error: 'Error al verificar productos en el servidor' }, { status: 500 });
        }

        let totalValidado = 0;
        const validatedItems = items.map((item: any) => {
            const dbProduct = dbProducts.find((p) => p.id === item.id);
            if (!dbProduct) throw new Error(`Producto con ID ${item.id} no encontrado`);
            
            const precioReal = dbProduct.precio_con_descuento || dbProduct.precio;
            totalValidado += precioReal * (item.quantity || 1);
            
            return { ...item, price: precioReal };
        });
        // --- FIN DE VALIDACIÓN DE PRECIOS ---

        // --- VALIDACIÓN DE CUPÓN EN EL SERVIDOR ---
        let descuento = 0;
        let cuponAplicado = null;

        if (cupon_codigo) {
            const { data: cupon } = await supabaseAdmin
                .from('cupones')
                .select('*')
                .eq('codigo', cupon_codigo.toUpperCase().trim())
                .eq('activo', true)
                .single();

            if (cupon) {
                const ahora = new Date();
                const vencimiento = cupon.fecha_expiracion ? new Date(cupon.fecha_expiracion) : null;
                const expirado = vencimiento && ahora > vencimiento;

                if (!expirado && totalValidado >= Number(cupon.compra_minima)) {
                    if (Number(cupon.descuento_porcentual) > 0) {
                        descuento = Number(((totalValidado * Number(cupon.descuento_porcentual)) / 100).toFixed(2));
                    } else if (Number(cupon.descuento_fijo) > 0) {
                        descuento = Math.min(Number(cupon.descuento_fijo), totalValidado);
                    }
                    cuponAplicado = cupon.codigo;
                }
            }
        }

        const totalProductosConDescuento = Math.max(0, totalValidado - descuento);

        // --- CÁLCULO SEGURO DEL COSTO DE ENVÍO EN EL SERVIDOR ---
        let finalShippingCost = 0;
        if (metodo_entrega === 'envio' && envio_provincia) {
            try {
                const shippingResult = await calculateShippingCost({
                    items: validatedItems.map((item: any) => ({ id: item.id, quantity: item.quantity })),
                    provincia: envio_provincia,
                    totalCompra: totalProductosConDescuento
                });
                finalShippingCost = shippingResult.costoEnvio;
            } catch (err) {
                console.error('Error calculando costo de envío en backend checkout:', err);
                finalShippingCost = 8500; // Tarifa de contingencia
            }
        }

        const totalFinal = totalProductosConDescuento + finalShippingCost;

        // 1. Crear el pedido en la tabla "pedidos"
        const { data: pedido, error: pedidoError } = await supabaseAdmin
            .from('pedidos')
            .insert([
                { 
                    cliente_nombre, 
                    cliente_email, 
                    total: totalFinal, 
                    estado: 'pendiente',
                    metodo_pago,
                    cupon_aplicado: cuponAplicado,
                    descuento_aplicado: descuento,
                    
                    // Datos de envío
                    metodo_entrega,
                    envio_costo: finalShippingCost,
                    envio_direccion: metodo_entrega === 'envio' ? envio_direccion : null,
                    envio_ciudad: metodo_entrega === 'envio' ? envio_ciudad : null,
                    envio_codigo_postal: metodo_entrega === 'envio' ? envio_codigo_postal : null,
                    envio_provincia: metodo_entrega === 'envio' ? envio_provincia : null,
                    envio_telefono: cliente_telefono || envio_telefono || null,
                    envio_notas: metodo_entrega === 'envio' ? envio_notas : null,
                    
                    // Datos de facturación
                    facturacion_tipo,
                    facturacion_nombre: facturacion_nombre || cliente_nombre,
                    facturacion_documento: facturacion_documento || null
                }
            ])
            .select()
            .single();

        if (pedidoError) throw pedidoError;

        // 2. Insertar los ítems del pedido en "pedido_items"
        const pedidoItemsData = validatedItems.map((item: any) => ({
            pedido_id: pedido.id,
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: item.price
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('pedido_items')
            .insert(pedidoItemsData);

        if (itemsError) throw itemsError;

        let baseUrl = process.env.NEXT_PUBLIC_URL || 
                      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
                      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
                      
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        // 3. Procesar según método de pago
        if (metodo_pago === 'mercadopago') {
            const mpPreference = new Preference(mpClient);
            
            const discountFactor = totalValidado > 0 ? (totalProductosConDescuento / totalValidado) : 1;
            
            // Mapear los ítems descontados
            const mpItems = validatedItems.map((item: any) => ({
                id: String(item.id),
                title: String(item.name || item.nombre || 'Producto'),
                quantity: parseInt(item.quantity) || 1,
                unit_price: parseFloat((item.price * discountFactor).toFixed(2)),
                currency_id: 'ARS'
            }));

            // Si hay costo de envío, lo agregamos como un ítem en la preferencia de Mercado Pago
            if (finalShippingCost > 0) {
                mpItems.push({
                    id: 'costo_envio',
                    title: 'Costo de Envío a Domicilio',
                    quantity: 1,
                    unit_price: parseFloat(finalShippingCost.toFixed(2)),
                    currency_id: 'ARS'
                });
            }

            const preferenceData = {
                body: {
                    items: mpItems,
                    back_urls: {
                        success: `${baseUrl}/checkout/success`,
                        failure: `${baseUrl}/checkout/failure`,
                        pending: `${baseUrl}/checkout/pending`,
                    },
                    auto_return: 'approved',
                    external_reference: String(pedido.id), 
                    notification_url: `${baseUrl}/api/webhooks/mercadopago`,
                }
            };

            const result = await mpPreference.create(preferenceData);

            return NextResponse.json(
                { 
                    message: 'Pedido creado exitosamente con Mercado Pago', 
                    pedidoId: pedido.id,
                    initPoint: result.init_point 
                },
                { status: 201 }
            );

        } else if (metodo_pago === 'payway') {
            // Integración Decidir 2.0 (Payway)
            if (!payway_token) {
                return NextResponse.json({ error: 'Token de Payway no proporcionado' }, { status: 400 });
            }

            const isProduction = process.env.NEXT_PUBLIC_PAYWAY_ENV === 'production';
            const decidirApiUrl = isProduction 
                ? 'https://ventasonline.payway.com.ar/api/v2/payments' 
                : 'https://developers-ventasonline.payway.com.ar/api/v2/payments';
            
            // Cálculo de recargos por cuotas (ejemplo)
            let recargoMult = 1;
            if (installments === 3) recargoMult = 1.15; // 15% de recargo
            if (installments === 6) recargoMult = 1.30; // 30% de recargo
            if (installments === 12) recargoMult = 1.60; // 60% de recargo
            // Payway (Decidir) requiere el monto expresado en centavos (multiplicado por 100)
            const amountTotal = Math.round(totalFinal * recargoMult * 100);

            // Requerimientos mínimos para el pago V2
            // Para "Cuota Simple" en Argentina (Decidir/Payway):
            // Plan Cuota Simple 3 se envía como installments: 3 (según caso de prueba)
            // Plan Cuota Simple 6 se envía como installments: 16
            let paywayInstallments = installments || 1;
            if (installments === 3) paywayInstallments = 3;
            else if (installments === 6) paywayInstallments = 16;

            const decidirPayload = {
                site_transaction_id: String(pedido.id),
                token: payway_token,
                payment_method_id: payment_method_id || 1, // Dinámico
                bin: bin || "450799", 
                amount: amountTotal,
                currency: "ARS",
                installments: paywayInstallments,
                description: `Compra Ecommerce - Pedido #${pedido.id}`,
                payment_type: "single",
                establishment_name: "PINTURERIA MERCURIO",
                sub_payments: []
            };

            console.log('--- ENVIANDO DATOS A PAYWAY ---');
            console.log('URL:', decidirApiUrl);
            console.log('Payload:', JSON.stringify(decidirPayload, null, 2));
            console.log('Headers: { Content-Type: application/json, apikey: ' + (process.env.PAYWAY_PRIVATE_KEY ? 'CONFIGURADA (Longitud: ' + process.env.PAYWAY_PRIVATE_KEY.length + ')' : 'NO CONFIGURADA') + ' }');

            const response = await fetch(decidirApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.PAYWAY_PRIVATE_KEY || ''
                },
                body: JSON.stringify(decidirPayload)
            });

            const decidirData = await response.json();

            console.log('--- RESPUESTA DE PAYWAY ---');
            console.log('Status HTTP:', response.status);
            console.log('Response Body:', JSON.stringify(decidirData, null, 2));

            // Log de la operación de Payway
            await logPaywayOperation(pedido.id, 'checkout', {
                request: decidirPayload,
                response: decidirData
            });

            if (!response.ok) {
                // Registrar fallo en base de datos
                await supabaseAdmin
                    .from('pedidos')
                    .update({ estado: 'cancelado' })
                    .eq('id', pedido.id);

                const errorMessage = getPaywayErrorMessage(decidirData);
                
                return NextResponse.json(
                    { error: `Error en Payway: ${errorMessage}`, code: decidirData.error?.type || 'payment_error' },
                    { status: 400 }
                );
            }

            // Pago aprobado por Decidir
            if (decidirData.status === 'approved') {
                // Actualizar pedido a pagado y persistir IDs de auditoría
                // NOTA: El disparador (trigger) trigger_deducir_stock_pedido en la BD
                // descontará el stock e incrementará 'comprados' de forma segura e inmediata.
                const finalAmountCharged = decidirData.amount ? (decidirData.amount / 100) : (totalFinal * recargoMult);
                await supabaseAdmin
                    .from('pedidos')
                    .update({ 
                        estado: 'pagado',
                        total: finalAmountCharged,
                        payment_id: String(decidirData.id),
                        payway_tid: decidirData.status_details?.ticket || '',
                        payway_auth_code: decidirData.status_details?.card_authorization_code || ''
                    })
                    .eq('id', pedido.id);

                // Enviar correo de confirmación de forma asíncrona
                sendOrderConfirmationEmail(pedido.id).catch(err => {
                    console.error('Error al enviar correo de confirmación de pedido Payway:', err);
                });

                return NextResponse.json(
                    { 
                        message: 'Pago con Payway procesado exitosamente', 
                        pedidoId: pedido.id,
                        status: 'approved',
                        redirectUrl: `${baseUrl}/checkout/success?pedido_id=${pedido.id}`
                    },
                    { status: 201 }
                );
            } else {
                // Registrar fallo en base de datos para evitar pedidos huérfanos/pendientes
                await supabaseAdmin
                    .from('pedidos')
                    .update({ estado: 'cancelado' })
                    .eq('id', pedido.id);

                const errorMessage = getPaywayErrorMessage(decidirData);

                return NextResponse.json(
                    { error: `Error en Payway: ${errorMessage}` },
                    { status: 400 }
                );
            }

        } else {
            return NextResponse.json({ error: 'Método de pago no soportado' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Error detallado procesando checkout:', error);
        
        if (error.code) {
            return NextResponse.json(
                { error: `Error de Base de Datos: ${error.message} (Código: ${error.code})` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Error interno del servidor al procesar el pago' },
            { status: 500 }
        );
    }
}
