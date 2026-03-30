import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const response = await fetch('http://119.8.78.68:9078/rest/MERWS01B');
    if (!response.ok) {
      throw new Error('Error al obtener productos de la API externa');
    }
    const products = await response.json();

    const results = [];

    for (const item of products) {
      try {
        // 1. Manejar Categoría
        let categoriaId = null;
        if (item.Categoria) {
          // Buscar si ya existe por el código externo
          const { data: catData, error: catError } = await supabase
            .from('categorias')
            .select('id')
            .eq('codigo_externo', item.Categoria)
            .maybeSingle();

          if (catData) {
            categoriaId = catData.id;
          } else {
            // Crear categoría (usamos el código como nombre y slug inicialmente)
            const { data: newCat, error: newCatError } = await supabase
              .from('categorias')
              .insert({
                nombre: `Categoría ${item.Categoria}`,
                slug: `cat-${item.Categoria.toLowerCase()}`,
                codigo_externo: item.Categoria
              })
              .select()
              .single();
            
            if (newCat) {
              categoriaId = newCat.id;
            } else if (newCatError) {
              console.error('Error creando categoría:', newCatError);
            }
          }
        }

        // 2. Upsert Producto
        const productData = {
          nombre: item["Descripcion Corta"] || item.Descripcion,
          descripcion: item.Descripcion,
          precio: item.Precio,
          stock: item.Stock,
          imagen_url: item.Imagen,
          marca: item.Marca,
          codigo_externo: item.Producto,
          categoria_id: categoriaId,
          descripcion_corta: item["Descripcion Corta"],
          peso: item.Peso || 0,
          precio_con_descuento: item["Precio desc"] || item.Precio,
          descuento_porcentual: item.Descuento || 0,
          fecha_imagen: item.FechaImagen
        };

        const { data, error } = await supabase
          .from('productos')
          .upsert(productData, { onConflict: 'codigo_externo' })
          .select();

        if (error) {
          console.error(`Error al sincronizar producto ${item.Producto}:`, error);
          results.push({ producto: item.Producto, status: 'error', message: error.message });
        } else {
          results.push({ producto: item.Producto, status: 'success' });
        }
      } catch (innerError) {
        console.error(`Error procesando item ${item.Producto}:`, innerError);
        results.push({ producto: item.Producto, status: 'error', message: innerError.message });
      }
    }

    return NextResponse.json({
      message: 'Sincronización completada',
      processed: products.length,
      details: results
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
