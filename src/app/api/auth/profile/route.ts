import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(request: Request) {
    try {
        const session = await verifySession() as any;
        
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { nombre, telefono, direccion, ciudad, codigo_postal, provincia, dni } = body;

        // Validaciones básicas opcionales
        if (!nombre || nombre.trim() === '') {
            return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
        }

        // Actualizar el perfil en Supabase
        const { data, error } = await supabaseAdmin
            .from('usuarios')
            .update({
                nombre: nombre.trim(),
                telefono: telefono?.trim() || null,
                direccion: direccion?.trim() || null,
                ciudad: ciudad?.trim() || null,
                codigo_postal: codigo_postal?.trim() || null,
                provincia: provincia || null,
                dni: dni?.trim() || null
            })
            .eq('id', session.id)
            .select('id, email, nombre, rol, telefono, direccion, ciudad, codigo_postal, provincia, dni, created_at')
            .single();

        if (error) {
            console.error('[Update Profile DB Error]:', error);
            return NextResponse.json({ error: 'Error al actualizar el perfil en la base de datos' }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Perfil actualizado correctamente',
            user: data 
        });

    } catch (error) {
        console.error('[Update Profile Route Error]:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
