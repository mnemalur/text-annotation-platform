import { NextRequest, NextResponse } from "next/server"
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'

// Temporarily disable all middleware checks
export function middleware(_req: NextRequest) {
  return null
}

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAdmin = token?.role === "admin"
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/labels')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      
      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Protect all routes that require authentication
export const config = {
  matcher: [
    '/admin/:path*',
    '/labels/:path*',
    '/annotate/:path*',
    '/auth/:path*'
  ]
} 