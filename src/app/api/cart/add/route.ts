import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    const body = await request.json();
    
    const { productId, quantity = 1 } = body;

    // Validate required fields
    if (!productId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    // Add item to cart in database
    const cartItem = await db.addToCart(userId, productId, quantity);
    
    // Get updated cart items
    const cartItems = await db.getCartItems(userId);

    return NextResponse.json({
      success: true,
      cartItem: cartItem,
      items: cartItems,
      message: 'Product added to cart successfully'
    });

  } catch (error: any) {
    console.error('Error adding product to cart:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add product to cart: ' + (error.message || error.toString() || 'Unknown error')
    }, { status: 500 });
  }
});