import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length < 3) {
      return NextResponse.json({ message: 'Query too short' }, { status: 400 });
    }

    const cleanQuery = query.trim().toLowerCase();

    // Upsert logic: If query exists, increment count, else insert.
    // Using RPC or a clever select-then-update/insert.
    // Since Supabase doesn't have an atomic increment in upsert via JS Easily
    // We can use a custom function or just select then update.
    
    const { data: existing } = await supabase
      .from('busquedas_stats')
      .select('id, conteo')
      .eq('query', cleanQuery)
      .single();

    if (existing) {
      await supabase
        .from('busquedas_stats')
        .update({ 
            conteo: existing.conteo + 1,
            ultima_busqueda: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('busquedas_stats')
        .insert({ query: cleanQuery, conteo: 1 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking search:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
