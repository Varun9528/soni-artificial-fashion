import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Enable real database
enableRealDatabase();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('Received login request for:', email);
    
    // Find user in database
    console.log('Attempting to find user in database...');
    const user = await db.findUserByEmail(email);
    console.log('User found:', user);
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Verifying password...');
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

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
      // Removed iss and aud to avoid conflicts
    };

    // Generate access token (15 minutes)
    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '15m'
    });

    // Return user info (without password) and token
    const { password_hash: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      token: accessToken,
      user: userWithoutPassword,
      message: 'Login successful'
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}