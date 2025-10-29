import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

// GET /api/admin/analytics/recent-orders - Get recent orders data
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const recentOrders = await db.getRecentOrders(10);
    return NextResponse.json({ 
      success: true, 
      data: recentOrders
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent orders' },
      { status: 500 }
    );
  }
});