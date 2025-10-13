import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/database/connection';
import { jwtService } from '@/lib/auth/jwt';
import { FormValidator } from '@/lib/validation';
import { UserRole } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();
    
    console.log('Login attempt for email:', email);

    // Validation using FormValidator
    const validator = new FormValidator();
    validator
      .addRequired('email', email, 'Email')
      .addRequired('password', password, 'Password');
    
    if (!validator.isValid()) {
      return NextResponse.json(
        { 
          success: false,
          errors: validator.getErrors(),
          error: 'Validation failed'
        },
        { status: 400 }
      );
    }
    
    validator.addEmail('email', email, 'Email');
    
    if (!validator.isValid()) {
      return NextResponse.json(
        { 
          success: false,
          errors: validator.getErrors(),
          error: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Find user in database
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

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iss: 'lettex-marketplace',
      aud: 'lettex-users'
    };

    // Generate access token (15 minutes)
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '15m',
      issuer: 'lettex-marketplace',
      audience: 'lettex-users'
    });

    // Generate refresh token (7 days)
    const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
      issuer: 'lettex-marketplace',
      audience: 'lettex-users'
    });

    // Return user info (without password) and token
    const { password_hash: _, ...userWithoutPassword } = user;
    
    const response = NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Login successful'
    });

    // Set cookie with token - ensure it works for both localhost and production
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      path: '/',
      sameSite: 'lax'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}