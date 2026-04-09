import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Fetch de categorías desde la API externa
        const response = await fetch('http://119.8.78.68:9078/rest/merws01d/');
        if (!response.ok) {
            throw new Error('Error al obtener categorías de la API externa');
        }
        const categoriesData = await response.json();

        const results = [];

        for (const item of categoriesData) {
            try {
                // Preparamos los datos de la categoría
                const nombre = item.Descripcion || `Categoría ${item.Categoria}`;
                const slug = item.Descripcion
                    ? item.Descripcion.toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-0]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '')
                    : `cat-${item.Categoria.toLowerCase()}`;

                const categoryData = {
                    nombre: nombre,
                    slug: slug,
                    codigo_externo: item.Categoria,
                    descripcion: item.Descripcion || ''
                };

                // Upsert por codigo_externo
                const { data, error } = await supabase
                    .from('categorias')
                    .upsert(categoryData, { onConflict: 'codigo_externo' })
                    .select();

                if (error) {
                    console.error(`Error sincronizando categoría ${item.Categoria}:`, error);
                    results.push({ categoria: item.Categoria, status: 'error', message: error.message });
                } else {
                    results.push({ categoria: item.Categoria, status: 'success' });
                }
            } catch (innerError) {
                console.error(`Error procesando categoría ${item.Categoria}:`, innerError);
                results.push({ categoria: item.Categoria, status: 'error', message: innerError.message });
            }
        }

        return NextResponse.json({
            message: 'Sincronización de categorías completada',
            processed: categoriesData.length,
            details: results
        });

    } catch (error) {
        console.error('Error general en sync-categories:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
