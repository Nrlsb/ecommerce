import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';

export async function GET() {
    const session = await verifySession();
    
    if (!session) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: session });
}
