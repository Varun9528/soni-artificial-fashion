import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { handleApiError } from '@/lib/errorHandler';
import { withAuth } from '@/lib/auth/middleware';

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Get wishlist items from database
    const wishlistItems = await db.getWishlistItems(userId);
    
    return NextResponse.json({
      success: true,
      items: wishlistItems
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
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
    const { productId } = body;
    
    const userId = authContext.user.id;
    
    // Validate input
    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }
    
    // Add item to wishlist in database
    const wishlistItem = await db.addToWishlist(userId, productId);
    
    // Get updated wishlist items
    const wishlistItems = await db.getWishlistItems(userId);
    
    return NextResponse.json({
      success: true,
      items: wishlistItems
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
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
    const { productId } = body;
    
    const userId = authContext.user.id;
    
    // Validate input
    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }
    
    // Remove item from wishlist in database
    await db.removeFromWishlist(userId, productId);
    
    // Get updated wishlist items
    const wishlistItems = await db.getWishlistItems(userId);
    
    return NextResponse.json({
      success: true,
      items: wishlistItems
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({
      success: false,
      error: message
    }, { status: statusCode || 500 });
  }
});