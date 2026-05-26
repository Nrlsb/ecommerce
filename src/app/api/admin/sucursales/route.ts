import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Crear una sucursal
export async function POST(request: Request) {
  try {
    const { nombre, direccion, latitud, longitud, telefono, horarios } = await request.json();

    if (!nombre || !direccion) {
      return NextResponse.json({ error: 'Nombre y dirección son requeridos' }, { status: 400 });
    }

    // Convertir latitud y longitud a float si se pasaron, de lo contrario guardar como null
    const lat = latitud ? parseFloat(latitud) : null;
    const lng = longitud ? parseFloat(longitud) : null;

    const { data: sucursal, error } = await supabase
      .from('sucursales')
      .insert([
        { 
          nombre, 
          direccion, 
          latitud: isNaN(Number(lat)) ? null : lat, 
          longitud: isNaN(Number(lng)) ? null : lng, 
          telefono: telefono || null, 
          horarios: horarios || null 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Sucursal creada con éxito', sucursal });
  } catch (error) {
    console.error('Error creating sucursal:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Actualizar una sucursal
export async function PUT(request: Request) {
  try {
    const { id, nombre, direccion, latitud, longitud, telefono, horarios } = await request.json();

    if (!id || !nombre || !direccion) {
      return NextResponse.json({ error: 'ID, nombre y dirección son requeridos' }, { status: 400 });
    }

    const lat = latitud ? parseFloat(latitud) : null;
    const lng = longitud ? parseFloat(longitud) : null;

    const { data: sucursal, error } = await supabase
      .from('sucursales')
      .update({ 
        nombre, 
        direccion, 
        latitud: isNaN(Number(lat)) ? null : lat, 
        longitud: isNaN(Number(lng)) ? null : lng, 
        telefono: telefono || null, 
        horarios: horarios || null 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Sucursal actualizada con éxito', sucursal });
  } catch (error) {
    console.error('Error updating sucursal:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Eliminar una sucursal
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'El ID es requerido' }, { status: 400 });
    }

    const { error } = await supabase
      .from('sucursales')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Sucursal eliminada con éxito' });
  } catch (error) {
    console.error('Error deleting sucursal:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
