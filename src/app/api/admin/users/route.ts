import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

// GET /api/admin/users - Get all users (admin only)
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // For now, we'll return a mock count since we don't have a getAllUsers method
    // In a real implementation, you would implement getAllUsers in the database layer
    const users = await db.getTotalUsers();
    return NextResponse.json({ 
      success: true, 
      count: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
});