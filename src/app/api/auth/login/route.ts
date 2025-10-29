import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();
    
    console.log('Login attempt for email:', email);

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user in database
    console.log('Attempting to find user in database...');
    const user = await db.findUserByEmail(email);
    console.log('User found in database:', user);
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Verifying password for user:', user.email);
    console.log('Password from request:', password);
    console.log('Hashed password from database:', user.password_hash);
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Use default secrets if environment variables are not set
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

    const tokenPayload = {
      sub: user.id, // Use 'sub' as per JWT standard and JWTPayload interface
      email: user.email,
      role: user.role,
      name: user.name,
      iss: 'lettex-marketplace',
      aud: 'lettex-users'
    };

    // Generate access token (15 minutes)
    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '15m'
    });

    // Generate refresh token (7 days)
    const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });

    // Return user info (without password) and token
    const { password_hash, ...userWithoutPassword } = user;
    
    const response = NextResponse.json({
      success: true,
      token: accessToken,
      user: userWithoutPassword,
      message: 'Login successful'
    });

    // Set cookie with token - ensure it works for both localhost and production
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      path: '/',
      sameSite: 'lax'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}