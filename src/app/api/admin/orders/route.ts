import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

// GET /api/admin/orders - Get all orders (admin only)
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const orders = await db.getAllOrders();
    return NextResponse.json({ 
      success: true, 
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
});

// POST /api/admin/orders - Create a new order (admin only)
export const POST = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { success: false, error: 'User ID and items are required' },
        { status: 400 }
      );
    }

    // In a real implementation, we would create the order in the database
    // For now, we'll return a success response
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: 'new-order-id',
        ...body
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
});