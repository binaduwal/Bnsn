import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value

    const authPages = ['/login', '/register']

    if (token && authPages.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    } else if (!token && !authPages.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', "/login",],
}
