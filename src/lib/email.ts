import { supabaseAdmin } from './supabase-admin';

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.log('==================================================');
        console.log(`[SIMULACIÓN EMAIL] Enviando email a: ${to}`);
        console.log(`[ASUNTO]: ${subject}`);
        console.log('--------------------------------------------------');
        console.log(html);
        console.log('==================================================');
        return true;
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: 'Pinturerias Mercurio <onboarding@resend.dev>', // Usar remitente verificado en prod si aplica
                to: [to],
                subject: subject,
                html: html,
            }),
        });

        if (response.ok) {
            console.log(`Email enviado con éxito a ${to} a través de Resend.`);
            return true;
        } else {
            const errData = await response.json();
            console.error('Error de API Resend al enviar email:', errData);
            return false;
        }
    } catch (error) {
        console.error('Excepción al enviar email con Resend:', error);
        return false;
    }
}

// Templates de Emails Premium con diseño Mercurio
export function getContactConfirmationTemplate(name: string, subject: string, message: string): string {
    return `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
            <!-- Header Accent -->
            <div style="height: 6px; background: linear-gradient(90deg, #1e3773 0%, #ffc107 50%, #4caf50 100%); border-top-left-radius: 16px; border-top-right-radius: 16px; margin: -20px -20px 20px -20px;"></div>
            
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #1e3773; font-size: 24px; font-weight: 800; text-transform: uppercase; margin: 0; letter-spacing: 1px;">Pinturerías Mercurio</h1>
                <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Atención al Cliente</p>
            </div>
            
            <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">¡Hola ${name}!</h2>
            
            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
                Hemos recibido tu mensaje correctamente. Nuestro equipo de asesores técnicos analizará tu consulta y te responderá a la brevedad.
            </p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #1e3773; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="font-size: 12px; font-weight: bold; color: #64748b; margin: 0 0 6px 0; text-transform: uppercase; tracking: 0.05em;">Tu Consulta:</p>
                <p style="font-size: 14px; font-weight: bold; color: #1e293b; margin: 0 0 8px 0;">Asunto: ${subject || 'Sin Asunto'}</p>
                <p style="font-size: 14px; font-style: italic; color: #475569; margin: 0; line-height: 1.5;">"${message}"</p>
            </div>
            
            <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin-bottom: 24px;">
                Si necesitas agregar información urgente a esta consulta, puedes responder directamente a este correo electrónico.
            </p>
            
            <div style="border-t: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">© ${new Date().getFullYear()} Pinturerías Mercurio. Todos los derechos reservados.</p>
                <p style="font-size: 10px; color: #cbd5e1; margin-top: 4px;">Este es un correo automático, por favor no respondas a menos que necesites soporte técnico sobre esta consulta.</p>
            </div>
        </div>
    `;
}

export function getOrderConfirmationTemplate(orderId: string, clientName: string, items: any[], total: number, paymentMethod: string): string {
    const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 8px; font-size: 14px; color: #334155; font-weight: bold;">${item.name || item.nombre || 'Producto'}</td>
            <td style="padding: 12px 8px; font-size: 14px; color: #475569; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 8px; font-size: 14px; color: #1e3773; font-weight: bold; text-align: right;">$${Number(item.price || item.precio_unitario).toLocaleString('es-AR')}</td>
        </tr>
    `).join('');

    return `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
            <!-- Header Accent -->
            <div style="height: 6px; background: linear-gradient(90deg, #1e3773 0%, #ffc107 50%, #4caf50 100%); border-top-left-radius: 16px; border-top-right-radius: 16px; margin: -20px -20px 20px -20px;"></div>
            
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #1e3773; font-size: 24px; font-weight: 800; text-transform: uppercase; margin: 0; letter-spacing: 1px;">Pinturerías Mercurio</h1>
                <p style="color: #4caf50; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; font-weight: bold;">✔ Pago Confirmado</p>
            </div>
            
            <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">¡Gracias por tu compra, ${clientName}!</h2>
            <p style="font-size: 13px; color: #64748b; margin: 0 0 20px 0;">ID del Pedido: <span style="font-family: monospace; font-weight: bold; color: #1e3773;">${orderId}</span></p>
            
            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
                Hemos registrado tu pago de manera exitosa a través de <strong>${paymentMethod.toUpperCase()}</strong>. Tu pedido ya está ingresando a nuestro centro de preparación.
            </p>
            
            <h3 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-bottom: 12px;">Detalle del Pedido</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                    <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                        <th style="padding: 10px 8px; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Producto</th>
                        <th style="padding: 10px 8px; text-align: center; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Cant.</th>
                        <th style="padding: 10px 8px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding: 16px 8px 8px 8px; font-size: 14px; color: #64748b; text-align: right; font-weight: bold;">Total abonado:</td>
                        <td style="padding: 16px 8px 8px 8px; font-size: 18px; color: #1e3773; font-weight: 900; text-align: right;">$${Number(total).toLocaleString('es-AR')}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <p style="font-size: 14px; font-weight: bold; color: #166534; margin: 0 0 4px 0;">Plazo de entrega estimado</p>
                <p style="font-size: 13px; color: #14532d; margin: 0;">Tu pedido se entregará en un plazo máximo de 24 a 48 horas hábiles.</p>
            </div>
            
            <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">© ${new Date().getFullYear()} Pinturerías Mercurio. Todos los derechos reservados.</p>
            </div>
        </div>
    `;
}

export function getOrderDispatchedTemplate(orderId: string, clientName: string): string {
    return `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
            <!-- Header Accent -->
            <div style="height: 6px; background: linear-gradient(90deg, #1e3773 0%, #ffc107 50%, #4caf50 100%); border-top-left-radius: 16px; border-top-right-radius: 16px; margin: -20px -20px 20px -20px;"></div>
            
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #1e3773; font-size: 24px; font-weight: 800; text-transform: uppercase; margin: 0; letter-spacing: 1px;">Pinturerías Mercurio</h1>
                <p style="color: #ffc107; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; font-weight: bold;">🚚 Pedido en camino</p>
            </div>
            
            <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">¡Tu pedido ha sido despachado, ${clientName}!</h2>
            
            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
                Nos alegra informarte que tu pedido <strong>#${orderId.substring(0, 8)}</strong> ya se encuentra en manos de nuestro equipo de distribución express.
            </p>
            
            <div style="background-color: #fffbeb; border-left: 4px solid #ffc107; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="font-size: 13px; font-weight: bold; color: #b45309; margin: 0 0 4px 0;">¿Qué sigue?</p>
                <p style="font-size: 13px; color: #78350f; margin: 0; line-height: 1.5;">
                    El repartidor se pondrá en contacto contigo vía telefónica antes de realizar la entrega. Por favor, asegúrate de tener tu identificación a mano.
                </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 24px;">
                <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/perfil/pedidos" style="background-color: #1e3773; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                    Seguir mi Pedido en la Web
                </a>
            </div>
            
            <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">© ${new Date().getFullYear()} Pinturerías Mercurio. Todos los derechos reservados.</p>
            </div>
        </div>
    `;
}

export async function sendOrderConfirmationEmail(orderId: string): Promise<boolean> {
    try {
        const { data: order, error: orderError } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Error fetching order for confirmation email:', orderError);
            return false;
        }

        const { data: items, error: itemsError } = await supabaseAdmin
            .from('pedido_items')
            .select(`
                cantidad,
                precio_unitario,
                productos (
                    nombre
                )
            `)
            .eq('pedido_id', orderId);

        if (itemsError || !items) {
            console.error('Error fetching order items for confirmation email:', itemsError);
            return false;
        }

        const formattedItems = items.map((item: any) => ({
            name: item.productos?.nombre || 'Producto',
            quantity: item.cantidad,
            price: item.precio_unitario
        }));

        const html = getOrderConfirmationTemplate(
            order.id,
            order.cliente_nombre,
            formattedItems,
            order.total,
            order.metodo_pago
        );

        return await sendEmail({
            to: order.cliente_email,
            subject: `Pinturerías Mercurio - Confirmación de Pedido #${order.id.substring(0, 8)}`,
            html
        });
    } catch (e) {
        console.error('Exception in sendOrderConfirmationEmail:', e);
        return false;
    }
}

export async function sendOrderDispatchedEmail(orderId: string): Promise<boolean> {
    try {
        const { data: order, error: orderError } = await supabaseAdmin
            .from('pedidos')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Error fetching order for dispatched email:', orderError);
            return false;
        }

        const html = getOrderDispatchedTemplate(order.id, order.cliente_nombre);

        return await sendEmail({
            to: order.cliente_email,
            subject: `¡Tu pedido #${order.id.substring(0, 8)} ha sido despachado! - Pinturerías Mercurio`,
            html
        });
    } catch (e) {
        console.error('Exception in sendOrderDispatchedEmail:', e);
        return false;
    }
}
