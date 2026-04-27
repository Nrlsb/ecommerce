import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';

export async function GET() {
    const session = await verifySession();
    
    // Si no hay sesión, devolvemos 200 con user: null para evitar el error 401 en consola
    if (!session) {
        return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: session });
}
