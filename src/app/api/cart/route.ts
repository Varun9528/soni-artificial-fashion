import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { handleApiError } from '@/lib/errorHandler';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Get cart items from database
    const cartItems = await db.getCartItems(userId);
    console.log('Cart items from database:', cartItems);
    
    return NextResponse.json({
      success: true,
      items: cartItems
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({
      success: false,
      error: message
    }, { status: statusCode || 500 });
  }
});


export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    const { productId, quantity, variant } = body;
    
    const userId = authContext.user.id;
    
    // Validate input
    if (!productId || !quantity) {
      return NextResponse.json({
        success: false,
        error: 'Product ID and quantity are required'
      }, { status: 400 });
    }
    
    // Add item to cart in database
    const cartItem = await db.addToCart(userId, productId, quantity);
    
    // Get updated cart items
    const cartItems = await db.getCartItems(userId);
    
    return NextResponse.json({
      success: true,
      items: cartItems
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({
      success: false,
      error: message
    }, { status: statusCode || 500 });
  }
});

export const PUT = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    const { productId, quantity, variant } = body;
    
    const userId = authContext.user.id;
    
    // Validate input
    if (!productId || quantity === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Product ID and quantity are required'
      }, { status: 400 });
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await db.removeFromCart(userId, productId);
    } else {
      // Update quantity in database
      await db.updateCartItemQuantity(userId, productId, quantity);
    }
    
    // Get updated cart items
    const cartItems = await db.getCartItems(userId);
    
    return NextResponse.json({
      success: true,
      items: cartItems
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({
      success: false,
      error: message
    }, { status: statusCode || 500 });
  }
});

export const DELETE = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    console.log('DELETE request received');
    
    // Get productId from URL parameters
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    
    // Variant is not used in current implementation but kept for consistency
    const variant = undefined;
    
    const userId = authContext.user.id;
    
    console.log('DELETE cart request:', { userId, productId, variant });
    
    // Validate input
    if (!productId) {
      console.log('Product ID is missing in DELETE request');
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }
    
    // Remove item from cart in database
    const result = await db.removeFromCart(userId, productId, variant);
    console.log('Remove from cart result:', result);
    
    // Get updated cart items
    const cartItems = await db.getCartItems(userId);
    console.log('Updated cart items:', cartItems);
    
    return NextResponse.json({
      success: true,
      items: cartItems
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({
      success: false,
      error: message
    }, { status: statusCode || 500 });
  }
});
