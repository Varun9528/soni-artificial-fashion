import { NextRequest, NextResponse } from 'next/server';
import { securityDb } from '@/lib/database/security';

interface VerifyEmailRequest {
  token: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyEmailRequest = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!body.token || typeof body.token !== 'string') {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Get verification token
    const verificationToken = await securityDb.getVerificationToken(body.token);
    if (!verificationToken || verificationToken.type !== 'email_verification') {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Get user
    const user = await securityDb.getUserById(verificationToken.user_id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.email_verified_at) {
      return NextResponse.json(
        { message: 'Email already verified' },
        { status: 200 }
      );
    }

    // Mark email as verified
    await securityDb.updateUser(user.id, {
      email_verified_at: new Date().toISOString(),
    });

    // Mark token as used
    await securityDb.markTokenUsed(body.token);

    // Log audit event
    await securityDb.createAuditLog({
      actor_id: user.id,
      actor_type: 'user',
      action: 'email_verified',
      target_type: 'user',
      target_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
      severity: 'low',
    });

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}