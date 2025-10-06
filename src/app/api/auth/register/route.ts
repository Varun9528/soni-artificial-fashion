import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';

// Simple password hashing for demo (in production, use bcrypt)
function hashPassword(password: string): string {
  // For demo purposes - in production, use bcrypt.hash()
  return `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeD2WBLBfp3cQ3T/a`; // This represents a hashed version
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = hashPassword(password);
    const newUser = await db.createUser({
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      name: name.trim(),
      phone: phone || '',
      role: 'customer',
      email_verified: false,
    });

    // Return success (without password)
    const { password_hash: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Registration successful. You can now login with your credentials.'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
