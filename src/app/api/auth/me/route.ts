import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    const session = await verifySession() as any;
    
    // Si no hay sesión, devolvemos 200 con user: null para evitar el error 401 en consola
    if (!session) {
        return NextResponse.json({ user: null });
    }

    try {
        // Consultar el perfil más actualizado de Supabase
        const { data: dbUser, error } = await supabaseAdmin
            .from('usuarios')
            .select('id, email, nombre, rol, telefono, direccion, ciudad, codigo_postal, provincia, dni, created_at')
            .eq('id', session.id)
            .maybeSingle();

        if (error || !dbUser) {
            // Fallback si no se encuentra en la base de datos por algún motivo
            return NextResponse.json({ user: session });
        }

        return NextResponse.json({ user: dbUser });
    } catch (err) {
        console.error('[Get Profile Error]:', err);
        return NextResponse.json({ user: session });
    }
}

