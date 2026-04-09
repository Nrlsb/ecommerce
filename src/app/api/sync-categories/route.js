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

        const categoriesToUpsert = categoriesData.map(item => {
            const nombre = item.Descripcion || `Categoría ${item.Categoria}`;
            const slug = item.Descripcion
                ? item.Descripcion.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-0]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                : `cat-${item.Categoria.toLowerCase()}`;

            return {
                nombre: nombre,
                slug: slug,
                codigo_externo: item.Categoria,
                descripcion: item.Descripcion || ''
            };
        });

        // Upsert por lote
        const { data, error } = await supabase
            .from('categorias')
            .upsert(categoriesToUpsert, { onConflict: 'codigo_externo' })
            .select();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            message: 'Sincronización de categorías completada',
            processed: categoriesToUpsert.length
        });

    } catch (error) {
        console.error('Error general en sync-categories:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
