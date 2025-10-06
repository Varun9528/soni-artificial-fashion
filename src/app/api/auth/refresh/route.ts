import { NextRequest, NextResponse } from 'next/server';
import { securityDb } from '@/lib/database/security';
import { jwtService } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Find refresh token in database
    let storedToken = null;
    const allTokens = await securityDb['refreshTokens'];
    for (const [id, token] of allTokens.entries()) {
      if (jwtService.verifyRefreshTokenHash(refreshToken, token.token_hash) && !token.revoked_at) {
        storedToken = token;
        break;
      }
    }

    if (!storedToken) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (new Date(storedToken.expires_at) < new Date()) {
      await securityDb.revokeRefreshToken(storedToken.jti);
      return NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      );
    }

    // Get user
    const user = await securityDb.getUserById(storedToken.user_id);
    if (!user) {
      await securityDb.revokeRefreshToken(storedToken.jti);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Revoke old refresh token
    await securityDb.revokeRefreshToken(storedToken.jti);

    // Generate new tokens
    const accessToken = jwtService.generateAccessToken({
      sub: user.id,
      iss: 'pachmarhi-marketplace',
      aud: 'pachmarhi-users',
      role: user.role,
      permissions: [], // Add based on role
    });

    const { token: newRefreshToken, jti: newJti } = jwtService.generateRefreshToken();
    const newRefreshTokenHash = jwtService.hashRefreshToken(newRefreshToken);

    // Store new refresh token
    await securityDb.createRefreshToken({
      jti: newJti,
      user_id: user.id,
      token_hash: newRefreshTokenHash,
      device_info: userAgent,
      ip_address: ipAddress,
      user_agent: userAgent,
      issued_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
    });

    // Update session activity
    const sessions = await securityDb.getUserSessions(user.id);
    for (const session of sessions) {
      if (session.refresh_token_id === storedToken.jti) {
        await securityDb.updateSessionActivity(session.id);
        break;
      }
    }

    // Log audit event
    await securityDb.createAuditLog({
      actor_id: user.id,
      actor_type: 'user',
      action: 'token_refreshed',
      target_type: 'token',
      ip_address: ipAddress,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
      severity: 'low',
    });

    // Set new refresh token cookie and return access token
    const response = NextResponse.json(
      {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 14 * 24 * 60 * 60, // 14 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}