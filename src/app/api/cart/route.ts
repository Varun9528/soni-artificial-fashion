import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { handleApiError } from '@/lib/errorHandler';
import { withAuth } from '@/lib/auth/middleware';

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Get cart items from database
    const cartItems = await db.getCartItems(userId);
    
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
    const body = await request.json();
    const { productId, variant } = body;
    
    const userId = authContext.user.id;
    
    // Validate input
    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }
    
    // Remove item from cart in database
    await db.removeFromCart(userId, productId);
    
    // Get updated cart items
    const cartItems = await db.getCartItems(userId);
    
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