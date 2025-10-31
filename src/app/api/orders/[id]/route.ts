import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

// GET /api/orders/[id] - Get a single order by ID (public access for tracking)
export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }
    
    // Get order by ID directly from database
    const order = await db.getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order'
    }, { status: 500 });
  }
};