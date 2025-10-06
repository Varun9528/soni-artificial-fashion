import { UserRole } from '@/types/auth';

// Permission definitions
export type Permission = 
  // Product permissions
  | 'products:read' | 'products:create' | 'products:update' | 'products:delete'
  // Order permissions
  | 'orders:read' | 'orders:update' | 'orders:delete'
  // User permissions
  | 'users:read' | 'users:create' | 'users:update' | 'users:delete'
  // Admin permissions
  | 'admin:read' | 'admin:write' | 'admin:delete'
  // Artisan permissions
  | 'artisans:read' | 'artisans:create' | 'artisans:update' | 'artisans:delete'
  // Analytics permissions
  | 'analytics:read' | 'analytics:export'
  // System permissions
  | 'system:backup' | 'system:config' | 'system:audit'
  // Financial permissions
  | 'financial:read' | 'financial:write'
  // Content permissions
  | 'content:read' | 'content:write' | 'content:delete';

// Role-based permission matrix
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // Full access to everything
    'products:read', 'products:create', 'products:update', 'products:delete',
    'orders:read', 'orders:update', 'orders:delete',
    'users:read', 'users:create', 'users:update', 'users:delete',
    'admin:read', 'admin:write', 'admin:delete',
    'artisans:read', 'artisans:create', 'artisans:update', 'artisans:delete',
    'analytics:read', 'analytics:export',
    'system:backup', 'system:config', 'system:audit',
    'financial:read', 'financial:write',
    'content:read', 'content:write', 'content:delete',
  ],
  admin: [
    // Product management
    'products:read', 'products:create', 'products:update', 'products:delete',
    // Order management
    'orders:read', 'orders:update',
    // Limited user management
    'users:read', 'users:update',
    // Admin panel access
    'admin:read', 'admin:write',
    // Artisan management
    'artisans:read', 'artisans:create', 'artisans:update',
    // Analytics
    'analytics:read',
    // Content management
    'content:read', 'content:write', 'content:delete',
  ],
  manager: [
    // Product viewing and limited editing
    'products:read', 'products:update',
    // Order management
    'orders:read', 'orders:update',
    // User viewing
    'users:read',
    // Limited admin access
    'admin:read',
    // Artisan viewing
    'artisans:read',
    // Analytics viewing
    'analytics:read',
    // Content management
    'content:read', 'content:write',
  ],
  support: [
    // Read-only access for support
    'products:read',
    'orders:read', 'orders:update', // Can update order status for customer service
    'users:read',
    'artisans:read',
    'content:read',
  ],
  artisan: [
    // Limited to own products
    'products:read', 'products:create', 'products:update',
    // Can view own orders
    'orders:read',
    // Can view own profile
    'users:read',
    // Analytics for own products
    'analytics:read',
  ],
  customer: [
    // Basic customer permissions
    'products:read',
    'orders:read', // Own orders only
    'users:read', // Own profile only
    'artisans:read',
    'content:read',
  ],
};

// Resource ownership rules
export interface ResourceOwnership {
  userId: string;
  resourceType: string;
  resourceId: string;
  ownerField?: string; // Field name that contains the owner ID
}

// Check if user has permission
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.includes(permission);
}

// Check multiple permissions (user must have ALL)
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

// Check multiple permissions (user must have ANY)
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Check resource ownership
export function canAccessResource(
  userRole: UserRole,
  userId: string,
  resource: any,
  permission: Permission,
  ownership?: ResourceOwnership
): boolean {
  // Super admin can access everything
  if (userRole === 'super_admin') {
    return true;
  }

  // Check basic permission
  if (!hasPermission(userRole, permission)) {
    return false;
  }

  // If no ownership rules, allow access
  if (!ownership) {
    return true;
  }

  // Check ownership based on role
  switch (userRole) {
    case 'customer':
      // Customers can only access their own resources
      return resource[ownership.ownerField || 'user_id'] === userId;
    
    case 'artisan':
      // Artisans can access their own resources or products they created
      if (ownership.resourceType === 'product') {
        return resource.artisan_id === userId || resource[ownership.ownerField || 'user_id'] === userId;
      }
      return resource[ownership.ownerField || 'user_id'] === userId;
    
    case 'support':
    case 'manager':
    case 'admin':
      // These roles can access most resources based on their permissions
      return true;
    
    default:
      return false;
  }
}

// Route-based permission mapping
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  // Product routes
  'GET /api/products': ['products:read'],
  'POST /api/products': ['products:create'],
  'PUT /api/products': ['products:update'],
  'DELETE /api/products': ['products:delete'],
  
  // Order routes
  'GET /api/orders': ['orders:read'],
  'PUT /api/orders': ['orders:update'],
  'DELETE /api/orders': ['orders:delete'],
  
  // User routes
  'GET /api/users': ['users:read'],
  'POST /api/users': ['users:create'],
  'PUT /api/users': ['users:update'],
  'DELETE /api/users': ['users:delete'],
  
  // Admin routes
  'GET /api/admin': ['admin:read'],
  'POST /api/admin': ['admin:write'],
  'PUT /api/admin': ['admin:write'],
  'DELETE /api/admin': ['admin:delete'],
  
  // Analytics routes
  'GET /api/analytics': ['analytics:read'],
  'GET /api/analytics/export': ['analytics:export'],
  
  // System routes
  'POST /api/system/backup': ['system:backup'],
  'GET /api/system/config': ['system:config'],
  'PUT /api/system/config': ['system:config'],
  'GET /api/system/audit': ['system:audit'],
};

// Get required permissions for a route
export function getRoutePermissions(method: string, pathname: string): Permission[] {
  const routeKey = `${method.toUpperCase()} ${pathname}`;
  
  // Check exact match first
  if (ROUTE_PERMISSIONS[routeKey]) {
    return ROUTE_PERMISSIONS[routeKey];
  }
  
  // Check pattern matches (e.g., /api/products/123 matches /api/products)
  for (const route in ROUTE_PERMISSIONS) {
    const [routeMethod, routePath] = route.split(' ');
    if (routeMethod === method.toUpperCase() && pathname.startsWith(routePath)) {
      return ROUTE_PERMISSIONS[route];
    }
  }
  
  return [];
}

// Validate access to API route
export function validateRouteAccess(
  userRole: UserRole,
  method: string,
  pathname: string
): { allowed: boolean; missingPermissions: Permission[] } {
  const requiredPermissions = getRoutePermissions(method, pathname);
  
  if (requiredPermissions.length === 0) {
    // No specific permissions required, allow access
    return { allowed: true, missingPermissions: [] };
  }
  
  const missingPermissions = requiredPermissions.filter(
    permission => !hasPermission(userRole, permission)
  );
  
  return {
    allowed: missingPermissions.length === 0,
    missingPermissions,
  };
}

// Create authorization context for templates
export interface AuthContext {
  user: {
    id: string;
    role: UserRole;
    email: string;
    name: string;
  };
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  canAccessResource: (resource: any, permission: Permission, ownership?: ResourceOwnership) => boolean;
}

export function createAuthContext(user: { id: string; role: UserRole; email: string; name: string }): AuthContext {
  const permissions = ROLE_PERMISSIONS[user.role];
  
  return {
    user,
    permissions,
    hasPermission: (permission: Permission) => hasPermission(user.role, permission),
    hasAllPermissions: (perms: Permission[]) => hasAllPermissions(user.role, perms),
    hasAnyPermission: (perms: Permission[]) => hasAnyPermission(user.role, perms),
    canAccessResource: (resource: any, permission: Permission, ownership?: ResourceOwnership) =>
      canAccessResource(user.role, user.id, resource, permission, ownership),
  };
}