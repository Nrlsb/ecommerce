import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// GET /api/admin/productos - Obtener todos los productos con paginación/búsqueda básica para la administración
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const categoria = searchParams.get('categoria') || '';
        
        let query = supabase
            .from('productos')
            .select(`
                *,
                categorias (
                    id,
                    nombre
                )
            `)
            .order('nombre', { ascending: true });

        if (search) {
            query = query.or(`nombre.ilike.%${search}%,marca.ilike.%${search}%,codigo_externo.ilike.%${search}%`);
        }

        if (categoria) {
            query = query.eq('categoria_id', categoria);
        }

        const { data: products, error } = await query;

        if (error) throw error;

        return NextResponse.json(products);
    } catch (error: any) {
        console.error('Error al obtener productos para admin:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// Esquema para validar cada item de actualización
const productUpdateItemSchema = z.object({
    id: z.number(),
    precio: z.number().min(0, "El precio no puede ser negativo"),
    precio_con_descuento: z.number().nullable().optional(),
    stock: z.number().int().min(0, "El stock no puede ser negativo"),
    destacado: z.boolean().optional()
});

const bulkUpdateSchema = z.array(productUpdateItemSchema);

// PATCH /api/admin/productos - Edición masiva de productos (precio y stock)
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validar datos
        const validation = bulkUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ 
                error: 'Validación de datos fallida', 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const updates = validation.data;

        // Ejecutar las actualizaciones de forma secuencial en una transacción lógica
        const errors = [];
        const updatedIds = [];

        for (const update of updates) {
            const { id, precio, precio_con_descuento, stock, destacado } = update;
            
            const updatePayload: any = { precio, stock };
            if (precio_con_descuento !== undefined) {
                updatePayload.precio_con_descuento = precio_con_descuento;
            }
            if (destacado !== undefined) {
                updatePayload.destacado = destacado;
            }

            const { error } = await supabase
                .from('productos')
                .update(updatePayload)
                .eq('id', id);

            if (error) {
                console.error(`Error actualizando producto #${id}:`, error);
                errors.push({ id, error: error.message });
            } else {
                updatedIds.push(id);
            }
        }

        if (errors.length > 0) {
            return NextResponse.json({
                message: 'Actualización parcial completada con algunos errores.',
                updatedCount: updatedIds.length,
                errors
            }, { status: 270 }); // 270 Custom status code for partial success
        }

        return NextResponse.json({
            message: 'Todos los productos fueron actualizados exitosamente.',
            updatedCount: updatedIds.length
        });

    } catch (error: any) {
        console.error('Error en edición masiva de productos:', error);
        return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}
