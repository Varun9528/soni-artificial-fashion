import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Simple test
    const hash = await bcrypt.hash('test', 12);
    const isValid = await bcrypt.compare('test', hash);
    
    const token = jwt.sign({ email: 'test@test.com' }, 'secret', { expiresIn: '1h' });
    
    return NextResponse.json({
      success: true,
      email,
      password,
      hash,
      isValid,
      token
    });
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}