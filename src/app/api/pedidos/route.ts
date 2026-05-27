import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await verifySession() as any;
    
    // Si no hay sesión, retornar 401
    if (!session || !session.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const { data: orders, error } = await supabaseAdmin
            .from('pedidos')
            .select(`
                *,
                pedido_items (
                    *,
                    productos (nombre, imagen_url)
                )
            `)
            .eq('cliente_email', session.email)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[API Pedidos GET Error]:', error);
            return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
        }

        return NextResponse.json(orders || []);
    } catch (err) {
        console.error('[API Pedidos Catch Error]:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
