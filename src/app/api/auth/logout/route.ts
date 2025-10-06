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
      // Find and revoke refresh token
      const allTokens = await securityDb['refreshTokens'];
      for (const [id, token] of allTokens.entries()) {
        if (jwtService.verifyRefreshTokenHash(refreshToken, token.token_hash)) {
          await securityDb.revokeRefreshToken(token.jti);
          
          // Get user for audit logging
          const user = await securityDb.getUserById(token.user_id);
          if (user) {
            // Log audit event
            await securityDb.createAuditLog({
              actor_id: user.id,
              actor_type: 'user',
              action: 'user_logout',
              target_type: 'session',
              ip_address: ipAddress,
              user_agent: userAgent,
              timestamp: new Date().toISOString(),
              severity: 'low',
            });

            // Revoke session
            const sessions = await securityDb.getUserSessions(user.id);
            for (const session of sessions) {
              if (session.refresh_token_id === token.jti) {
                await securityDb.revokeSession(session.id);
                break;
              }
            }
          }
          break;
        }
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