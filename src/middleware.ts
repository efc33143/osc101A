import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const session = request.cookies.get('session')?.value
        const payload = session ? await verifySession(session) : null

        if (!payload && !request.nextUrl.pathname.startsWith('/admin/login')) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // If logged in and trying to go to login page, redirect to dashboard
        if (payload && request.nextUrl.pathname.startsWith('/admin/login')) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
