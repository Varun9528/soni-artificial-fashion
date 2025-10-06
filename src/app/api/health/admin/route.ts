import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if admin routes are accessible
    const authConfigured = process.env.JWT_SECRET && process.env.NEXTAUTH_SECRET;
    
    return NextResponse.json({
      status: authConfigured ? 'success' : 'warning',
      authenticated: false, // Will be true when JWT verification is implemented
      auth_configured: !!authConfigured,
      message: authConfigured ? 'Auth system configured' : 'Auth system needs configuration',
      setup_required: !authConfigured,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      authenticated: false,
      message: 'Auth check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}