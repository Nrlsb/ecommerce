import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Iniciando sincronización de productos...');
    const response = await fetch('http://119.8.78.68:9078/rest/MERWS01B', {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Error al obtener productos de la API externa');
    }
    const products = await response.json();
    console.log(`Se obtuvieron ${products.length} productos de la API externa.`);

    // Utilidad para limpiar números con comas
    const parseNumber = (val) => {
      if (val === null || val === undefined) return 0;
      if (typeof val === 'number') return val;
      const str = val.toString().replace(',', '.');
      const num = parseFloat(str);
      return isNaN(num) ? 0 : num;
    };

    // Utilidad para procesar en lotes
    const chunkArray = (array, size) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    // 1. Obtener todas las categorías únicas del JSON externo (soporta códigos de 3 y 6 dígitos)
    const uniqueCategoryCodes = new Set();
    products.forEach(p => {
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

    // 2. Asegurar que todas las categorías existan en Supabase (Solo insertar si no existen)
    if (finalCategoryCodes.length > 0) {
      // Primero obtenemos las categorías que ya existen
      const { data: existingCats } = await supabase
        .from('categorias')
        .select('codigo_externo')
        .in('codigo_externo', finalCategoryCodes);

      const existingCodes = new Set(existingCats?.map(c => c.codigo_externo) || []);

      // Filtramos para quedarnos solo con las que NO existen
      const newCategoryCodes = finalCategoryCodes.filter(code => !existingCodes.has(code));

      if (newCategoryCodes.length > 0) {
        const categoriesToInsert = newCategoryCodes.map(code => ({
          nombre: `Categoría ${code}`,
          slug: `cat-${code.toLowerCase()}`,
          codigo_externo: code
        }));

        const catChunks = chunkArray(categoriesToInsert, 100);
        console.log(`Insertando ${categoriesToInsert.length} nuevas categorías detectadas en ${catChunks.length} lotes...`);

        for (const chunk of catChunks) {
          const { error: catInsertError } = await supabase
            .from('categorias')
            .insert(chunk);

          if (catInsertError) {
            console.error('Error al insertar lote de categorías:', catInsertError);
          }
        }
      } else {
        console.log('No se detectaron categorías nuevas para insertar.');
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

    // 4. Preparar productos para upsert por lotes (con deduplicación)
    const productsMap = new Map();

    products.forEach(item => {
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

    // 5. UPSERT por lotes de productos
    const productChunks = chunkArray(productsToUpsert, 100);
    console.log(`Sincronizando ${productsToUpsert.length} productos en ${productChunks.length} lotes...`);

    let processedCount = 0;
    for (const [index, chunk] of productChunks.entries()) {
      const { error: upsertError } = await supabase
        .from('productos')
        .upsert(chunk, { onConflict: 'codigo_externo' });

      if (upsertError) {
        console.error(`Error en lote de productos ${index + 1}:`, upsertError);
        throw upsertError;
      }
      processedCount += chunk.length;
      console.log(`Lote ${index + 1}/${productChunks.length} completado (${processedCount} productos)`);
    }

    return NextResponse.json({
      message: 'Sincronización completada',
      processed: products.length
    });

  } catch (error) {
    console.error('Error fatal en sincronización:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
