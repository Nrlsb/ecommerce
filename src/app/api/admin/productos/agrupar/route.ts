
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const marca = searchParams.get('marca') || '';

    let query = supabaseAdmin
      .from('productos')
      .select('id, nombre, marca, familia_id, producto_familias(nombre)')
      .order('nombre', { ascending: true });

    if (search) {
      query = query.ilike('nombre', `%${search}%`);
    }
    if (marca) {
      query = query.eq('marca', marca);
    }

    const { data, error } = await query.limit(100);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productIds, familiaName, familiaId } = await request.json();

    if (!productIds || productIds.length === 0) {
      return NextResponse.json({ error: 'No se seleccionaron productos' }, { status: 400 });
    }

    let finalFamiliaId = familiaId;

    // Si no hay familiaId pero sí nombre, crear una nueva familia
    if (!finalFamiliaId && familiaName) {
      const slug = familiaName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const { data: newFamilia, error: famError } = await supabaseAdmin
        .from('producto_familias')
        .insert({ nombre: familiaName, slug })
        .select('id')
        .single();

      if (famError) throw famError;
      finalFamiliaId = newFamilia.id;
    }

    // Actualizar los productos con el familia_id (o null si se desea desagrupar)
    const { error: updateError } = await supabaseAdmin
      .from('productos')
      .update({ familia_id: finalFamiliaId })
      .in('id', productIds);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, familiaId: finalFamiliaId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
