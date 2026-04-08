import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Allow public routes (Landing Page, Login, Register, Reserva)
    const publicPaths = ['/', '/login', '/register', '/reserva', '/api/auth'];
    
    // Check for exact root or other public paths
    const isPublicPath = publicPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
    );

    if (isPublicPath) {
        return NextResponse.next();
    }

    // 2. Redirect to login if no token
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Logic to check tenant context (if subdomain or path based)
    // For now, simple check. In a real scenario, we would decode JWT 
    // to check if subscription is ACTIVE.
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
