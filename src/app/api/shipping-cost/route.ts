import { NextRequest, NextResponse } from 'next/server';
import { calculateShippingCost } from '@/lib/shipping';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, provincia, totalCompra } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
        }

        if (!provincia) {
            return NextResponse.json({ error: 'La provincia es requerida' }, { status: 400 });
        }

        const result = await calculateShippingCost({
            items,
            provincia,
            totalCompra
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error calculando costo de envío en API endpoint:', error);
        return NextResponse.json({ error: error.message || 'Error interno al calcular el costo de envío' }, { status: 500 });
    }
}
