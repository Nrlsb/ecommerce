import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password, nombre, rol } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
        }

        // 1. Verificar si el usuario ya existe
        const { data: existingUser } = await supabase
            .from('usuarios')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
        }

        // 2. Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear el usuario
        const { data, error } = await supabase
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
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Error al registrar el usuario' }, { status: 500 });
    }
}
