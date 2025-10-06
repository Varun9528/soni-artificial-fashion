import { NextRequest } from 'next/server';
import { jwtService } from '@/lib/auth/jwt';
import { securityDb } from '@/lib/database/security';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ServerSession {
  user: SessionUser;
  token: string;
}

// Get server session from request
export async function getServerSession(request?: NextRequest): Promise<ServerSession | null> {
  try {
    // If request is provided, get token from Authorization header
    let token: string | null = null;
    
    if (request) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
      
      // Also check for cookie-based auth
      if (!token) {
        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
          const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
          const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
          if (tokenCookie) {
            token = tokenCookie.substring(6); // Remove 'token=' prefix
          }
        }
      }
    }
    
    // If no token found, check environment for testing
    if (!token && process.env.TEST_USER_ID) {
      return {
        user: {
          id: process.env.TEST_USER_ID,
          email: 'test@example.com',
          name: 'Test User',
          role: 'artisan'
        },
        token: 'test-token'
      };
    }
    
    if (!token) {
      return null;
    }

    // Verify JWT token
    const payload = jwtService.verifyAccessToken(token);
    if (!payload) {
      return null;
    }

    // Check if token is blacklisted
    const isBlacklisted = await jwtService.isTokenBlacklisted(payload.jti);
    if (isBlacklisted) {
      return null;
    }

    // Get user from database
    const user = await securityDb.getUserById(payload.sub);
    if (!user) {
      return null;
    }

    // Check if user account is active
    if (!user.isActive) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token
    };
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

// Get current user from session
export async function getCurrentUser(request?: NextRequest): Promise<SessionUser | null> {
  const session = await getServerSession(request);
  return session ? session.user : null;
}