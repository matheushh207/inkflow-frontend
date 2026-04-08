import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Allow public routes
    const publicPaths = ['/login', '/register', '/api/auth'];
    if (publicPaths.some(path => pathname.startsWith(path))) {
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
