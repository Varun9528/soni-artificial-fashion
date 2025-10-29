import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Fetch orders from real database for this user
    const userOrders = await db.getOrdersByUserId(userId);
    
    // Paginate results
    const paginatedOrders = userOrders.slice(offset, offset + limit);
    const total = userOrders.length;

    return NextResponse.json({
      success: true,
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user orders'
    }, { status: 500 });
  }
});