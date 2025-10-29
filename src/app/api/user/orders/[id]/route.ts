import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Extract order number from URL
    const url = new URL(request.url);
    const orderNumber = url.pathname.split('/').pop();
    
    // Get all orders for this user
    const userOrders = await db.getOrdersByUserId(userId);
    
    // Find the specific order by order_number
    const order = userOrders.find((o: any) => o.order_number === orderNumber);
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    // Enhance order items with product images
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        // If this is a mock database order, we need to fetch product details
        if (item.product_id && !item.product_image) {
          try {
            // Try to get product details to fetch image
            const product = await db.getProductBySlug(item.product_id);
            if (product && product.productImages && product.productImages.length > 0) {
              item.product_image = product.productImages[0].url;
            }
          } catch (error) {
            console.log('Could not fetch product image for item:', item);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order details'
    }, { status: 500 });
  }
});