import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

// GET /api/admin/analytics/top-products - Get top products data
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const topProducts = await db.getTopProducts();
    return NextResponse.json({ 
      success: true, 
      data: topProducts
    });
  } catch (error) {
    console.error('Error fetching top products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top products' },
      { status: 500 }
    );
  }
});