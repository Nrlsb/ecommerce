import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me');

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Definir rutas que requieren autenticación de admin/vendedor
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        // Excluir la página de login de admin si existe una específica, 
        // pero aquí parece que /admin redirige si no hay sesión.
        
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            // Si es una API, retornar 401
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            // Si es una página, redirigir al login
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await jwtVerify(token, SECRET);
            
            // Verificar roles permitidos para el panel admin
            const rol = payload.rol as string;
            if (rol !== 'admin' && rol !== 'vendedor') {
                if (pathname.startsWith('/api/')) {
                    return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
                }
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Configurar en qué rutas se debe ejecutar el middleware
export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
    ],
};
