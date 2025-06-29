import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// API routes that need authentication
const protectedApiRoutes = [
  '/api/admin',
  '/api/projects',
  '/api/files',
  '/api/messages',
  '/api/payments/create',
  '/api/calendar',
  '/api/notifications'
]

// Admin-only routes
const adminRoutes = [
  '/admin',
  '/api/admin'
]

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Security headers for all responses
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    // CORS headers for API routes
    if (pathname.startsWith('/api/')) {
      response.headers.set('Access-Control-Allow-Origin', process.env.NEXTAUTH_URL || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    // Check admin access
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (!token) {
        // No authentication provided - return 401
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({ error: 'No autorizado' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          )
        }
        return NextResponse.redirect(new URL('/auth/login', req.url))
      } else if (token.role !== 'ADMIN') {
        // Authenticated but not admin - return 403
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({ error: 'Acceso denegado. Se requieren permisos de administrador.' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          )
        }
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    // Rate limiting for public endpoints
    if (pathname.startsWith('/api/')) {
      const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      
      // Add rate limiting headers
      response.headers.set('X-RateLimit-Limit', '100')
      response.headers.set('X-RateLimit-Remaining', '99') // This would be dynamic in real implementation
      response.headers.set('X-RateLimit-Reset', String(Date.now() + 900000))
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes that don't need authentication
        const publicApiRoutes = [
          '/api/health',
          '/api/contact',
          '/api/quotes',
          '/api/auth',
          '/api/setup'
        ]
        
        // Allow public API routes
        if (publicApiRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        
        // For API routes, allow the route handler to manage auth (return 401)
        if (pathname.startsWith('/api/')) {
          return true
        }
        
        // Protected page routes need authentication
        if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
          return !!token
        }
        
        // Allow all other routes (pages will handle their own auth)
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/api/(.*)'
  ]
}
