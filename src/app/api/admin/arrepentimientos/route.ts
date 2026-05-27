import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateStatusSchema = z.object({
    id: z.string().uuid({ message: "ID de solicitud inválido" }),
    estado: z.enum(['pendiente', 'procesado', 'rechazado'], {
        errorMap: () => ({ message: "Estado no válido" })
    })
});

// GET /api/admin/arrepentimientos - Listar todas las solicitudes de arrepentimiento
export async function GET() {
    try {
        const { data: solicitudes, error } = await supabaseAdmin
            .from('solicitudes_arrepentimiento')
            .select(`
                *,
                pedido:pedido_id (
                    id,
                    cliente_nombre,
                    cliente_email,
                    total,
                    estado,
                    created_at,
                    metodo_pago
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(solicitudes);
    } catch (error: any) {
        console.error('Error al listar solicitudes de arrepentimiento:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// PATCH /api/admin/arrepentimientos - Actualizar el estado de una solicitud
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validar con Zod
        const validation = updateStatusSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ 
                error: 'Validación fallida', 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const { id, estado } = validation.data;

        // Actualizar estado en base de datos
        const { data, error } = await supabaseAdmin
            .from('solicitudes_arrepentimiento')
            .update({ estado })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ 
            success: true, 
            message: `Solicitud marcada como ${estado} correctamente.`,
            data 
        });

    } catch (error: any) {
        console.error('Error al actualizar estado de solicitud de arrepentimiento:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
