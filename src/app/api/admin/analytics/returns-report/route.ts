import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

// GET /api/admin/analytics/returns-report - Get returns report data
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const returnsReport = await db.getReturnsReport();
    return NextResponse.json({ 
      success: true, 
      data: returnsReport
    });
  } catch (error) {
    console.error('Error fetching returns report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch returns report' },
      { status: 500 }
    );
  }
});