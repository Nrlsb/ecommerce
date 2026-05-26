import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Obtener todas las sucursales
export async function GET() {
  try {
    const { data: sucursales, error } = await supabase
      .from('sucursales')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;

    return NextResponse.json(sucursales);
  } catch (error) {
    console.error('Error fetching sucursales:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
