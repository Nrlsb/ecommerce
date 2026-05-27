import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendArrepentimientoEmails } from '@/lib/email';
import { z } from 'zod';

const arrepentimientoSchema = z.object({
    pedidoId: z.string().uuid().optional().nullable(),
    pedidoNumero: z.string().min(1, "El número de pedido es obligatorio"),
    nombre: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("El email no es válido"),
    telefono: z.string().min(1, "El teléfono es obligatorio"),
    motivo: z.string().optional()
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validar datos
        const validation = arrepentimientoSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ 
                error: 'Validación fallida', 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const { pedidoId, pedidoNumero, nombre, email, telefono, motivo } = validation.data;

        // 1. Guardar en la base de datos con supabaseAdmin
        const { data, error } = await supabaseAdmin
            .from('solicitudes_arrepentimiento')
            .insert({
                pedido_id: pedidoId || null,
                pedido_numero: pedidoNumero,
                nombre,
                email,
                telefono,
                motivo: motivo || null,
                estado: 'pendiente'
            })
            .select()
            .single();

        if (error) {
            console.error('Error al insertar solicitud de arrepentimiento:', error);
            throw error;
        }

        // 2. Enviar emails de confirmación y alerta
        try {
            await sendArrepentimientoEmails(nombre, email, telefono, pedidoNumero, motivo || '');
        } catch (emailErr) {
            // Logueamos el error pero no bloqueamos la respuesta al cliente
            console.error('Error enviando correos de arrepentimiento:', emailErr);
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Solicitud de arrepentimiento registrada con éxito.',
            data 
        });

    } catch (error: any) {
        console.error('Error en POST /api/arrepentimiento:', error);
        return NextResponse.json({ 
            error: error.message || 'Error interno del servidor' 
        }, { status: 500 });
    }
}
