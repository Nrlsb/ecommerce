import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = body.email?.trim().toLowerCase();
        const password = body.password;
        const nombre = body.nombre;
        const rol = body.rol;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
        }

        // 1. Verificar si el usuario ya existe usando el cliente Admin
        const { data: existingUser } = await supabaseAdmin
            .from('usuarios')
            .select('id')
            .ilike('email', email)
            .maybeSingle();

        if (existingUser) {
            return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
        }

        // 2. Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear el usuario
        const { data, error } = await supabaseAdmin
            .from('usuarios')
            .insert([
                { 
                    email, 
                    password: hashedPassword, 
                    nombre: nombre || email.split('@')[0],
                    rol: rol || 'usuario'
                }
            ])
            .select()
            .single();

        if (error) throw error;

        // 4. Retornar el usuario (sin el password)
        const { password: _, ...userWithoutPassword } = data;
        return NextResponse.json({ user: userWithoutPassword }, { status: 201 });

    } catch (error) {
        console.error('[Signup Error]:', error);
        return NextResponse.json({ error: 'Error al registrar el usuario' }, { status: 500 });
    }
}
