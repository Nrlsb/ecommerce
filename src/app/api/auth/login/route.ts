import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
        }

        // 1. Buscar al usuario
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // 2. Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // 3. Retornar el usuario (sin el password)
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ user: userWithoutPassword }, { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
    }
}
