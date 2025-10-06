import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { securityDb } from '@/lib/database/security';
import { sessionManager } from '@/lib/security/session';

// Get current user profile
export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Get user details
    const user = await securityDb.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user sessions
    const sessions = await sessionManager.getUserSessions(userId);
    
    // Get MFA status
    const mfaEnabled = user.mfa_enabled;
    
    // Remove sensitive data
    const { password_hash, mfa_secret, ...safeUserData } = user;
    
    return NextResponse.json({
      user: safeUserData,
      sessions: sessions.length,
      mfaEnabled,
      lastLoginAt: user.last_login_at,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Update user profile
export const PUT = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    const body = await request.json();
    
    // Validate and sanitize input
    const allowedFields = ['name', 'phone'];
    const updates: any = {};
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Update user
    const updatedUser = await securityDb.updateUser(userId, updates);
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove sensitive data
    const { password_hash, mfa_secret, ...safeUserData } = updatedUser;
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: safeUserData,
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});