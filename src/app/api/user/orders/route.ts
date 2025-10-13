import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth/middleware';

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Fetch user orders from database
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.order.count({
        where: { user_id: userId }
      })
    ]);

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const items = await prisma.orderItem.findMany({
        where: { order_id: order.id }
      });
      
      return {
        ...order,
        items
      };
    }));

    return NextResponse.json({
      success: true,
      orders: ordersWithItems.map(order => ({
        id: order.id,
        order_number: order.order_number,
        user_id: order.user_id,
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        tax_amount: order.tax_amount,
        discount_amount: order.discount_amount,
        total_amount: order.total_amount,
        currency: order.currency,
        shipping_address: order.shipping_address,
        billing_address: order.billing_address,
        shipping_method: order.shipping_method,
        tracking_number: order.tracking_number,
        estimated_delivery: order.estimated_delivery,
        delivered_at: order.delivered_at,
        notes: order.notes,
        admin_notes: order.admin_notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.items.map((item: any) => ({
          id: item.id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price,
          quantity: item.quantity,
          total: item.total
        }))
      })),
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