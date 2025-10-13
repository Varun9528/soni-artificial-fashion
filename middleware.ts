import { NextRequest, NextResponse } from 'next/server';
import { securityHeadersService } from './src/lib/security/headers';
import { authorizeRoute } from './src/lib/auth/middleware';
import { jwtService } from './src/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Path:', pathname);
  console.log('Method:', request.method);
  console.log('Cookies:', request.cookies.getAll());
  console.log('========================');
  
  console.log('Middleware triggered for path:', pathname);
  
  // Apply security headers to all responses
  const response = NextResponse.next();
  const secureResponse = securityHeadersService.applySecurityHeaders(response);
  
  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    console.log('Protecting admin route:', pathname);
    const authResult = await authorizeRoute(request);
    
    if (!authResult.success) {
      console.log('Authentication failed for admin route');
      // For API routes, return JSON error
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: authResult.error || 'Authentication required' },
          { status: authResult.statusCode || 401 }
        );
      }
      
      // For page routes, redirect to login with error message
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      loginUrl.searchParams.set('message', 'Access Denied: Admins Only');
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if user has admin role (case-insensitive)
    const token = request.cookies.get('token')?.value;
    if (token) {
      try {
        const decoded = jwtService.verifyAccessToken(token);
        if (decoded && (decoded.role === 'admin' || decoded.role === 'super_admin')) {
          // Admin users should be allowed to access admin routes
          console.log('Admin user authenticated, allowing access to admin route');
          return secureResponse;
        } else {
          // Non-admin users trying to access admin routes
          console.log('Non-admin user trying to access admin route');
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('error', 'unauthorized');
          loginUrl.searchParams.set('message', 'Access Denied: Admins Only');
          return NextResponse.redirect(loginUrl);
        }
      } catch (error) {
        // Invalid token, redirect to login
        console.log('Invalid token for admin route');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'invalid_token');
        loginUrl.searchParams.set('message', 'Invalid or expired session');
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // No token, redirect to login
      console.log('No token found, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      loginUrl.searchParams.set('message', 'Access Denied: Admins Only');
      loginUrl.searchParams.set('redirect', pathname); // Add redirect parameter
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Protect user-only routes
  if (pathname.startsWith('/cart') || pathname.startsWith('/wishlist') || 
      pathname.startsWith('/checkout') || pathname.startsWith('/orders') ||
      pathname.startsWith('/profile')) {
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
    
    // Check if user is admin trying to access user-only routes, redirect to admin
    const token = request.cookies.get('token')?.value;
    if (token) {
      try {
        const decoded = jwtService.verifyAccessToken(token);
        if (decoded && (decoded.role === 'admin' || decoded.role === 'super_admin')) {
          // Admin users should be redirected to admin dashboard
          const adminUrl = new URL('/admin/dashboard', request.url);
          return NextResponse.redirect(adminUrl);
        }
        // Non-admin users can continue to user routes
        return secureResponse;
      } catch (error) {
        // Invalid token, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // No token, redirect to login
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
    '/admin(.*)',
    '/api/admin(.*)',
    '/cart',
    '/wishlist',
    '/checkout',
    '/orders',
    '/profile(.*)',
  ],
};