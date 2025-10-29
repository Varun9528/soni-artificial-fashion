import { NextRequest, NextResponse } from 'next/server';
import { securityDb } from '@/lib/database/security';
import { jwtService } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (refreshToken) {
      // Since we're using a mock database, we'll simplify the logout process
      // In a real implementation with a database, we would search for and revoke the token
      try {
        // For mock implementation, we'll just log the logout action
        console.log('User logged out with refresh token:', refreshToken.substring(0, 10) + '...');
      } catch (tokenError) {
        // Token verification failed, but we still want to clear the cookie
        console.warn('Failed to verify refresh token during logout:', tokenError);
      }
    }

    // Clear refresh token cookie
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}