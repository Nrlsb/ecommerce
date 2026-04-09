import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utilidad para procesar en lotes
const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};


export async function GET() {
    try {
        console.log('Iniciando sincronización de categorías...');
        // Fetch de categorías desde la API externa (usamos MERWS01D en mayúsculas para consistencia)
        const response = await fetch('http://119.8.78.68:9078/rest/MERWS01D');
        if (!response.ok) {
            throw new Error('Error al obtener categorías de la API externa');
        }
        const categoriesData = await response.json();
        console.log(`Se obtuvieron ${categoriesData.length} categorías de la API externa.`);

        // Usamos un Map para deduplicar por codigo_externo (Categoria)
        const categoriesMap = new Map();

        categoriesData.forEach(item => {
            const codigoExterno = String(item.Categoria || '');
            if (!codigoExterno) return;

            const nombre = item.Descripcion || `Categoría ${codigoExterno}`;
            const baseSlug = item.Descripcion
                ? item.Descripcion.toString().toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                : 'cat';

            // Siempre agregamos el código externo para garantizar unicidad y cumplir con el constraint de la DB
            const slug = `${baseSlug}-${codigoExterno.toLowerCase()}`;


            categoriesMap.set(codigoExterno, {
                nombre: nombre,
                slug: slug,
                codigo_externo: codigoExterno,
                descripcion: item.Descripcion || ''
            });
        });

        const categoriesToUpsert = Array.from(categoriesMap.values());
        console.log(`Categorías únicas a sincronizar: ${categoriesToUpsert.length}`);

        // Upsert por lotes de 100
        const categoryChunks = chunkArray(categoriesToUpsert, 100);
        let totalProcessed = 0;

        for (const [index, chunk] of categoryChunks.entries()) {
            const { error: upsertError } = await supabase
                .from('categorias')
                .upsert(chunk, { onConflict: 'codigo_externo' });

            if (upsertError) {
                console.error(`Error en lote de categorías ${index + 1}:`, upsertError);
                throw upsertError;
            }
            totalProcessed += chunk.length;
            console.log(`Lote ${index + 1}/${categoryChunks.length} completado (${totalProcessed} categorías)`);
        }

        return NextResponse.json({
            message: 'Sincronización de categorías completada',
            processed: totalProcessed
        });

    } catch (error) {
        console.error('Error general en sync-categories:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

