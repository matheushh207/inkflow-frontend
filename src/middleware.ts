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

    const userRole = request.cookies.get('user_role')?.value;
    const userEmail = request.cookies.get('user_email')?.value;

    // 3. Super Admin Restriction (Rigorosa)
    const isSuperAdminEmail = userEmail === 'admin@inkflow.com';
    const hasSuperAdminRole = userRole === 'SUPER_ADMIN';
    const isActuallySuperAdmin = isSuperAdminEmail && hasSuperAdminRole;

    if (isActuallySuperAdmin) {
        // O Super Admin VERDADEIRO deve estar apenas na Torre de Comando
        if (!pathname.startsWith('/super-admin') && !pathname.startsWith('/api')) {
            return NextResponse.redirect(new URL('/super-admin', request.url));
        }
    } else {
        // Qualquer outro usuário (mesmo se tiver a role SUPER_ADMIN por erro) não pode acessar a Torre de Comando
        if (pathname.startsWith('/super-admin')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
