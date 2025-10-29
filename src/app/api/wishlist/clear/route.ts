import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database
enableRealDatabase();

export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;

    // Clear all wishlist items for user
    // Using mock database implementation
    const wishlistItems = await db.getWishlistItems(userId);
    for (const item of wishlistItems) {
      await db.removeFromWishlist(userId, item.product_id);
    }

    return NextResponse.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear wishlist'
    }, { status: 500 });
  }
});