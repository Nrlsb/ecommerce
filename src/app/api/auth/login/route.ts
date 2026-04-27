import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth-server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = body.email?.trim().toLowerCase();
        const password = body.password;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
        }

        console.log(`[Login] Intentando ingresar: ${email}`);

        // 1. Buscar al usuario usando el cliente Admin (se salta RLS)
        const { data: user, error } = await supabaseAdmin
            .from('usuarios')
            .select('*')
            .ilike('email', email)
            .single();

        if (error) {
            console.error('[Login] Error al buscar usuario:', error.message, error.code);
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        if (!user) {
            console.log('[Login] Usuario no encontrado');
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // 2. Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('[Login] Password incorrecta para:', email);
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // 3. Crear sesión segura (Cookie HttpOnly)
        console.log('[Login] Sesión iniciada con éxito para:', email);
        await createSession(user);

        // 4. Retornar el usuario (sin el password)
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ user: userWithoutPassword }, { status: 200 });

    } catch (error) {
        console.error('[Login Error]:', error);
        return NextResponse.json({ error: 'Error interno al iniciar sesión' }, { status: 500 });
    }
}
