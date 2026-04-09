import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const response = await fetch('http://119.8.78.68:9078/rest/MERWS01B');
    if (!response.ok) {
      throw new Error('Error al obtener productos de la API externa');
    }
    const products = await response.json();

    // 1. Obtener todas las categorías únicas del JSON externo
    const uniqueCategoryCodes = [...new Set(products.map(p => p.Categoria).filter(Boolean))];

    // 2. Asegurar que todas las categorías existan en Supabase (Upsert por lotes)
    if (uniqueCategoryCodes.length > 0) {
      const categoriesToUpsert = uniqueCategoryCodes.map(code => ({
        nombre: `Categoría ${code}`,
        slug: `cat-${code.toLowerCase()}`,
        codigo_externo: code
      }));

      const { error: catUpsertError } = await supabase
        .from('categorias')
        .upsert(categoriesToUpsert, { onConflict: 'codigo_externo' });

      if (catUpsertError) {
        console.error('Error al sincronizar categorías previas:', catUpsertError);
      }
    }

    // 3. Obtener mapeo de categorías (codigo_externo -> id)
    const { data: catList, error: catListError } = await supabase
      .from('categorias')
      .select('id, codigo_externo');

    if (catListError) throw catListError;

    const categoryMap = {};
    catList.forEach(c => {
      categoryMap[c.codigo_externo] = c.id;
    });

    // 4. Preparar productos para upsert por lotes
    const productsToUpsert = products.map(item => ({
      nombre: item["Descripcion Corta"] || item.Descripcion,
      descripcion: item.Descripcion,
      precio: item.Precio,
      stock: item.Stock,
      imagen_url: item.Imagen,
      marca: item.Marca,
      codigo_externo: item.Producto,
      categoria_id: categoryMap[item.Categoria] || null,
      descripcion_corta: item["Descripcion Corta"],
      peso: item.Peso || 0,
      precio_con_descuento: item["Precio desc"] || item.Precio,
      descuento_porcentual: item.Descuento || 0,
      fecha_imagen: item.FechaImagen
    }));

    // 5. UPSERT por lotes de productos
    const { data: upsertData, error: upsertError } = await supabase
      .from('productos')
      .upsert(productsToUpsert, { onConflict: 'codigo_externo' });

    if (upsertError) throw upsertError;

    return NextResponse.json({
      message: 'Sincronización completada',
      processed: products.length
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
