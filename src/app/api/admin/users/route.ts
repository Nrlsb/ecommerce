import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Listar usuarios
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, rol, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Actualizar rol
export async function PATCH(request: Request) {
  try {
    const { id, rol } = await request.json();

    if (!id || !rol) {
      return NextResponse.json({ error: 'ID y rol son requeridos' }, { status: 400 });
    }

    const { error } = await supabase
      .from('usuarios')
      .update({ rol })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Rol actualizado con éxito' });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Eliminar usuario
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
