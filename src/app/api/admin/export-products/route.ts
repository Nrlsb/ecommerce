import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Obtener TODOS los productos en lotes (evita el límite de 1000 de Supabase)
        let allProducts: any[] = [];
        let from = 0;
        const step = 1000;
        let hasMore = true;

        while (hasMore) {
            const { data: productos, error } = await supabase
                .from('productos')
                .select(`
                    id,
                    nombre,
                    marca,
                    descripcion,
                    precio,
                    stock,
                    codigo_externo,
                    descripcion_corta,
                    peso,
                    precio_con_descuento,
                    descuento_porcentual,
                    destacado,
                    created_at,
                    categorias:categoria_id(nombre)
                `)
                .order('id', { ascending: true })
                .range(from, from + step - 1);

            if (error) {
                console.error('Supabase Error at range', from, ':', error);
                throw error;
            }

            if (productos && productos.length > 0) {
                allProducts = [...allProducts, ...productos];
                from += step;
                // Si el lote trajo menos de 1000, es que ya no hay más
                if (productos.length < step) hasMore = false;
            } else {
                hasMore = false;
            }
        }

        if (allProducts.length === 0) throw new Error('No se encontraron productos');

        // 2. Transformar datos para el Excel
        const dataParaExcel = allProducts.map(p => ({
            ID: p.id,
            Nombre: p.nombre,
            Marca: p.marca || '-',
            Categoría: (p.categorias as any)?.nombre || '-',
            Precio: p.precio,
            'Precio con Descuento': p.precio_con_descuento || p.precio,
            'Descuento %': p.descuento_porcentual || 0,
            Stock: p.stock,
            Código: p.codigo_externo || '-',
            'Descripción Corta': p.descripcion_corta || '-',
            Descripción: p.descripcion || '-',
            Peso: p.peso || 0,
            Destacado: p.destacado ? 'Sí' : 'No',
            'Fecha de Creación': p.created_at ? new Date(p.created_at).toLocaleString() : '-'
        }));

        // 3. Crear el libro de Excel
        const worksheet = XLSX.utils.json_to_sheet(dataParaExcel);
        
        // Ajustar anchos de columna (opcional, para mejor estética)
        const wscols = [
            { wch: 5 },  // ID
            { wch: 40 }, // Nombre
            { wch: 15 }, // Marca
            { wch: 20 }, // Categoría
            { wch: 10 }, // Precio
            { wch: 15 }, // Precio con Descuento
            { wch: 12 }, // Descuento %
            { wch: 10 }, // Stock
            { wch: 15 }, // Código
            { wch: 40 }, // Descripción Corta
            { wch: 50 }, // Descripción
            { wch: 10 }, // Peso
            { wch: 10 }, // Destacado
            { wch: 25 }  // Fecha de Creación
        ];
        worksheet['!cols'] = wscols;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

        // 4. Generar el buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        // 5. Retornar el archivo
        return new NextResponse(excelBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=productos_ecommerce.xlsx',
            },
        });

    } catch (error) {
        console.error('Error al exportar productos:', error);
        return NextResponse.json({ 
            error: 'Error al generar el archivo Excel',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
