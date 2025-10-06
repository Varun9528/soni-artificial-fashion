import { NextRequest, NextResponse } from 'next/server';
import { securityHeadersService } from './src/lib/security/headers';
import { authorizeRoute } from './src/lib/auth/middleware';

export async function middleware(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  
  // Apply security headers to all responses
  const response = NextResponse.next();
  const secureResponse = securityHeadersService.applySecurityHeaders(response);
  
  // Add custom headers for debugging (remove in production)
  secureResponse.headers.set('X-Powered-By', 'Pachmarhi-Security-v1.0');
  
  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const authResult = await authorizeRoute(request);
    
    if (!authResult.success) {
      // For API routes, return JSON error
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: authResult.error || 'Authentication required' },
          { status: authResult.statusCode || 401 }
        );
      }
      
      // For page routes, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return secureResponse;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/login (allow login)
     * - api/auth/register (allow registration)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};