import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/checkout
// Endpoint para procesar la orden del carrito
export async function POST(request) {
    try {
        const body = await request.json();
        const { items, cliente_nombre, cliente_email, total } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
        }

        // 1. Crear el pedido en la tabla "pedidos"
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .insert([
                { cliente_nombre, cliente_email, total, estado: 'pendiente' }
            ])
            .select()
            .single();

        if (pedidoError) throw pedidoError;

        // 2. Insertar los ítems del pedido en "pedido_items"
        const pedidoItemsData = items.map(item => ({
            pedido_id: pedido.id,
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: item.price
        }));

        const { error: itemsError } = await supabase
            .from('pedido_items')
            .insert(pedidoItemsData);

        if (itemsError) throw itemsError;

        // Retornamos éxito al frontend
        return NextResponse.json(
            { message: 'Pedido creado exitosamente', pedidoId: pedido.id },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error procesando checkout:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar el pedido' },
            { status: 500 }
        );
    }
}
