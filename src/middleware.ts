import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const publicPaths = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
  '/api/products',
  '/api/categories',
  '/api/artisans',
  '/api/artisans/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/products',
  '/product/',
  '/categories',
  '/category/',
  '/artisans',
  '/artisan/',
  '/about',
  '/contact',
  '/faq',
  '/privacy-policy',
  '/terms-conditions',
  '/refund-policy',
  '/shipping-policy',
  '/manifest.webmanifest', // Add manifest to public paths
  '/favicon.ico',
  '/images/',
  '/_next/',
  '/locales/',
];

// Define paths that require authentication
const protectedPaths = [
  '/admin',
  '/profile',
  '/cart',
  '/checkout',
  '/wishlist',
  '/orders',
  '/api/admin',
  '/api/cart',
  '/api/checkout',
  '/api/wishlist',
  '/api/orders',
  '/api/profile',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to public paths including manifest.webmanifest
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // For protected paths, we'll let the API routes handle authentication
  // This middleware is mainly for redirecting unauthenticated users from protected pages
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    // For API routes, let them handle authentication themselves
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    
    // For page routes, we could redirect to login if needed
    // But for now, let the page components handle this
    return NextResponse.next();
  }
  
  // Allow all other paths
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};