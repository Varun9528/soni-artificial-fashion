import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

// GET /api/admin/analytics/top-categories - Get top categories data
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const topCategories = await db.getTopCategories();
    return NextResponse.json({ 
      success: true, 
      data: topCategories
    });
  } catch (error) {
    console.error('Error fetching top categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top categories' },
      { status: 500 }
    );
  }
});