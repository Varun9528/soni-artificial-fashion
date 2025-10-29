import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { FormValidator } from '@/lib/validation';

// Enable real database for API routes
enableRealDatabase();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validation using FormValidator
    const validator = new FormValidator();
    validator
      .addRequired('name', name, 'Name')
      .addRequired('email', email, 'Email')
      .addRequired('password', password, 'Password')
      .addEmail('email', email, 'Email')
      .addPassword('password', password, 'Password');
    
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

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
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