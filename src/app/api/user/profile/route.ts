import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Fetch user data from real database
    const user = await db.findUserById(userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Return user data without password hash
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user profile'
    }, { status: 500 });
  }
});

export const PUT = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json({
        success: false,
        error: 'Name and email are required'
      }, { status: 400 });
    }

    // Update user data in real database
    const updatedUser = await db.updateUser(userId, {
      name: body.name,
      email: body.email,
      phone: body.phone
    });

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update user profile'
      }, { status: 500 });
    }

    // Return updated user data without password hash
    const { password_hash, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update user profile'
    }, { status: 500 });
  }
});