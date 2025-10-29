import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

// GET /api/admin/analytics/customer-growth - Get customer growth data
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const customerGrowth = await db.getCustomerGrowth();
    return NextResponse.json({ 
      success: true, 
      data: customerGrowth
    });
  } catch (error) {
    console.error('Error fetching customer growth:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer growth' },
      { status: 500 }
    );
  }
});