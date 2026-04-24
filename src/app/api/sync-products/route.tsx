import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  let syncId = '';
  
  try {
    console.log('Iniciando sincronización de productos...');
    
    // Registrar inicio en el historial
    const { data: syncEntry } = await supabase
      .from('sync_history')
      .insert({
        estado: 'en_progreso',
        fecha_inicio: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (syncEntry) syncId = syncEntry.id;

    const response = await fetch('http://119.8.78.68:9078/rest/MERWS01B', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener productos de la API externa');
    }
    const products = await response.json();
    console.log(`Se obtuvieron ${products.length} productos de la API externa.`);

    // Utilidad para limpiar números con comas
    const parseNumber = (val: any): number => {
      if (val === null || val === undefined) return 0;
      if (typeof val === 'number') return val;
      const str = val.toString().replace(',', '.');
      const num = parseFloat(str);
      return isNaN(num) ? 0 : num;
    };

    // Utilidad para procesar en lotes
    const chunkArray = <T,>(array: T[], size: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    // 1. Obtener todas las categorías únicas 
    const uniqueCategoryCodes = new Set<string>();
    products.forEach((p: any) => {
      const code = String(p.Categoria || '');
      if (!code) return;
      if (code.length === 6) {
        uniqueCategoryCodes.add(code.substring(0, 3));
        uniqueCategoryCodes.add(code.substring(3, 6));
      } else {
        uniqueCategoryCodes.add(code);
      }
    });

    const finalCategoryCodes = [...uniqueCategoryCodes];

    if (finalCategoryCodes.length > 0) {
      const { data: existingCats } = await supabase
        .from('categorias')
        .select('codigo_externo')
        .in('codigo_externo', finalCategoryCodes);

      const existingCodes = new Set(existingCats?.map(c => c.codigo_externo) || []);
      const newCategoryCodes = finalCategoryCodes.filter(code => !existingCodes.has(code));

      if (newCategoryCodes.length > 0) {
        const categoriesToInsert = newCategoryCodes.map(code => ({
          nombre: `Categoría ${code}`,
          slug: `cat-${code.toLowerCase()}`,
          codigo_externo: code
        }));

        const catChunks = chunkArray(categoriesToInsert, 100);
        for (const chunk of catChunks) {
          await supabase.from('categorias').insert(chunk);
        }
      }
    }

    const { data: catList } = await supabase.from('categorias').select('id, codigo_externo');
    const categoryMap: Record<string, string> = {};
    catList?.forEach((c: any) => { categoryMap[c.codigo_externo] = c.id; });

    const productsMap = new Map<string, any>();
    products.forEach((item: any) => {
      const codigo = item.Producto;
      if (!codigo) return;

      const catCode = String(item.Categoria || '');
      let categoriaId = null;
      let subcategoriaId = null;

      if (catCode.length === 6) {
        categoriaId = categoryMap[catCode.substring(0, 3)] || null;
        subcategoriaId = categoryMap[catCode.substring(3, 6)] || null;
      } else if (catCode) {
        categoriaId = categoryMap[catCode] || null;
      }

      productsMap.set(codigo, {
        nombre: item["Descripcion Corta"] || item.Descripcion,
        descripcion: item.Descripcion,
        precio: parseNumber(item.Precio),
        stock: item.Stock,
        imagen_url: item.Imagen,
        marca: item.Marca,
        codigo_externo: codigo,
        categoria_id: categoriaId,
        subcategoria_id: subcategoriaId,
        descripcion_corta: item["Descripcion Corta"],
        peso: parseNumber(item.Peso),
        precio_con_descuento: parseNumber(item["Precio desc"] || item.Precio),
        descuento_porcentual: item.Descuento || 0,
        fecha_imagen: item.FechaImagen
      });
    });

    const productsToUpsert = Array.from(productsMap.values());
    const productChunks = chunkArray(productsToUpsert, 100);
    
    let processedCount = 0;
    for (const chunk of productChunks) {
      const { error: upsertError } = await supabase
        .from('productos')
        .upsert(chunk, { onConflict: 'codigo_externo' });

      if (upsertError) throw upsertError;
      processedCount += chunk.length;
    }

    // Registrar éxito
    if (syncId) {
      await supabase
        .from('sync_history')
        .update({
          estado: 'exito',
          fecha_fin: new Date().toISOString(),
          productos_procesados: processedCount
        })
        .eq('id', syncId);
    }

    return NextResponse.json({ message: 'Sincronización completada', processed: processedCount });

  } catch (error) {
    console.error('Error fatal en sincronización:', error);
    
    // Registrar error en el historial
    if (syncId) {
       await supabase
        .from('sync_history')
        .update({
          estado: 'error',
          fecha_fin: new Date().toISOString(),
          mensaje_error: error instanceof Error ? error.message : String(error)
        })
        .eq('id', syncId);
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
