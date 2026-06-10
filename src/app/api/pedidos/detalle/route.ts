import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const querySchema = z.object({
    id: z.string().uuid({ message: "ID de pedido inválido" })
});

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const validation = querySchema.safeParse({ id });
    if (!validation.success) {
        return NextResponse.json({ error: 'ID de pedido inválido' }, { status: 400 });
    }

    try {
        const { data: order, error } = await supabaseAdmin
            .from('pedidos')
            .select('id, nro_pedido, cliente_nombre, total, metodo_pago, estado')
            .eq('id', id)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (err) {
        console.error('[API Pedidos Detalle Error]:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
