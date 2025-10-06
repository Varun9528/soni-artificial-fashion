import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { sessionManager } from '@/lib/security/session';

// Get user sessions
export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    const sessions = await sessionManager.getUserSessions(userId);
    
    // Mark current session (simplified logic)
    const currentUserAgent = request.headers.get('user-agent') || '';
    const currentIP = request.headers.get('x-forwarded-for') || 'unknown';
    
    const enrichedSessions = sessions.map(session => ({
      ...session,
      current: session.deviceInfo.userAgent === currentUserAgent && 
               session.deviceInfo.ipAddress === currentIP,
    }));
    
    return NextResponse.json({ sessions: enrichedSessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Revoke specific session
export const DELETE = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    await sessionManager.revokeSession(
      sessionId,
      authContext.user.id,
      'user_revoked'
    );
    
    return NextResponse.json({ message: 'Session revoked successfully' });
  } catch (error) {
    console.error('Revoke session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Revoke all other sessions
export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Get current session ID (in production, this would be extracted from the refresh token)
    const currentSessionId = 'current-session-id'; // Simplified for demo
    
    const revokedCount = await sessionManager.revokeAllOtherSessions(
      authContext.user.id,
      currentSessionId,
      ipAddress,
      userAgent
    );
    
    return NextResponse.json({
      message: 'All other sessions revoked successfully',
      revokedCount,
    });
  } catch (error) {
    console.error('Revoke all sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});