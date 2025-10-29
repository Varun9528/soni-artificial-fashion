import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/orders/[id] - Get a single order by order number (public access for tracking)
export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const orderNumber = pathname.split('/').pop(); // Extract order number from path
    
    if (!orderNumber) {
      return NextResponse.json({
        success: false,
        error: 'Order number is required'
      }, { status: 400 });
    }
    
    // Search by order_number instead of id
    const order = await prisma.order.findUnique({
      where: { order_number: orderNumber }
    });
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }
    
    // Get order items
    const items = await prisma.orderItem.findMany({
      where: {
        order_id: order.id
      }
    });
    
    const orderWithItems = {
      ...order,
      items
    };
    
    return NextResponse.json({
      success: true,
      order: orderWithItems
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order'
    }, { status: 500 });
  }
};