import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from '@/lib/auth/jwt';
import { securityDb } from '@/lib/database/security';
import { validateRouteAccess, createAuthContext, Permission } from '@/lib/auth/rbac';
import { UserRole } from '@/types/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  authContext?: ReturnType<typeof createAuthContext>;
}

// Authentication middleware
export async function authenticateRequest(
  request: NextRequest
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    let token: string | null = '';
    
    // Get token from Authorization header first
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      token = jwtService.extractTokenFromHeader(authHeader);
    }
    
    // If no token in header, check cookies
    if (!token) {
      token = request.cookies.get('token')?.value || '';
    }
    
    if (!token) {
      return { success: false, error: 'No access token provided' };
    }

    // Verify JWT token
    const payload = jwtService.verifyAccessToken(token);
    if (!payload) {
      return { success: false, error: 'Invalid or expired access token' };
      
    }

    // Check if token is blacklisted
    const isBlacklisted = await jwtService.isTokenBlacklisted(payload.jti);
    if (isBlacklisted) {
      return { success: false, error: 'Token has been revoked' };
    }

    // Get user from database
    const user = await securityDb.getUserById(payload.sub);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if user account is active
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return { success: false, error: 'Account is locked' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    return { success: false, error: 'Authentication failed' };
  }
}

// Authorization middleware
export async function authorizeRequest(
  request: NextRequest,
  requiredPermissions: Permission[] = []
): Promise<{ success: boolean; authContext?: any; error?: string }> {
  // First authenticate
  const authResult = await authenticateRequest(request);
  if (!authResult.success || !authResult.user) {
    return { success: false, error: authResult.error };
  }

  // Create auth context
  const authContext = createAuthContext(authResult.user);

  // If no specific permissions required, allow access
  if (requiredPermissions.length === 0) {
    return { success: true, authContext };
  }

  // Check permissions
  const hasRequiredPermissions = authContext.hasAllPermissions(requiredPermissions);
  if (!hasRequiredPermissions) {
    return { success: false, error: 'Insufficient permissions' };
  }

  return { success: true, authContext };
}

// Route-based authorization middleware
export async function authorizeRoute(
  request: NextRequest
): Promise<{ success: boolean; authContext?: any; error?: string; statusCode?: number }> {
  const method = request.method;
  const pathname = new URL(request.url).pathname;

  // Skip auth for public routes
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/request-password-reset',
    '/api/auth/reset-password',
    '/api/products', // Public product listing
    '/api/recommendations',
  ];

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return { success: true };
  }

  // Authenticate user
  const authResult = await authenticateRequest(request);
  if (!authResult.success || !authResult.user) {
    return { 
      success: false, 
      error: authResult.error || 'Authentication required', 
      statusCode: 401 
    };
  }

  // Check route permissions
  const routeAccess = validateRouteAccess(authResult.user.role, method, pathname);
  if (!routeAccess.allowed) {
    // Log unauthorized access attempt
    await securityDb.createSecurityEvent({
      user_id: authResult.user.id,
      event_type: 'suspicious_activity',
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      details: {
        type: 'unauthorized_access',
        method,
        pathname,
        missing_permissions: routeAccess.missingPermissions,
      },
      timestamp: new Date().toISOString(),
    });

    return { 
      success: false, 
      error: 'Access denied', 
      statusCode: 403 
    };
  }

  // Create auth context
  const authContext = createAuthContext(authResult.user);

  return { success: true, authContext };
}

// Middleware factory for protecting API routes
export function withAuth(
  handler: (request: NextRequest, authContext: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authorizeRoute(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 }
      );
    }

    // Add auth context to request and call handler
    return handler(request, authResult.authContext);
  };
}

// Middleware factory for protecting routes with specific permissions
export function withPermissions(
  permissions: Permission[],
  handler: (request: NextRequest, authContext: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authorizeRequest(request, permissions);
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 403 }
      );
    }

    return handler(request, authResult.authContext);
  };
}

// Middleware factory for admin-only routes
export function withAdminAuth(
  handler: (request: NextRequest, authContext: any) => Promise<NextResponse>
) {
  return withPermissions(['admin:read'], handler);
}

// Middleware factory for role-based access
export function withRole(
  allowedRoles: UserRole[],
  handler: (request: NextRequest, authContext: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authenticateRequest(request);
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(authResult.user.role)) {
      // Log unauthorized access attempt
      await securityDb.createSecurityEvent({
        user_id: authResult.user.id,
        event_type: 'suspicious_activity',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        details: {
          type: 'role_access_denied',
          required_roles: allowedRoles,
          user_role: authResult.user.role,
        },
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: 'Access denied for your role' },
        { status: 403 }
      );
    }

    const authContext = createAuthContext(authResult.user);
    return handler(request, authContext);
  };
}

// Utility function to extract user from request in API routes
export async function getCurrentUser(request: NextRequest): Promise<any | null> {
  const authResult = await authenticateRequest(request);
  return authResult.success ? authResult.user : null;
}

// Rate limiting per user
export async function checkUserRateLimit(
  userId: string,
  action: string,
  windowMinutes: number = 15,
  maxAttempts: number = 10
): Promise<{ allowed: boolean; remaining: number }> {
  // This is a simplified implementation
  // In production, use Redis or similar for distributed rate limiting
  
  const key = `rate_limit:${userId}:${action}`;
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
  
  // Get recent attempts (this is a mock implementation)
  // In production, store this in Redis with expiry
  const attempts = 0; // Would query actual attempts from storage
  
  const remaining = Math.max(0, maxAttempts - attempts);
  
  return {
    allowed: attempts < maxAttempts,
    remaining,
  };
}