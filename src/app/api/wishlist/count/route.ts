import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database
enableRealDatabase();

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    const wishlistItems = await db.getWishlistItems(userId);
    const wishlistItemCount = wishlistItems.length;

    return NextResponse.json({
      success: true,
      count: wishlistItemCount
    });

  } catch (error) {
    console.error('Error fetching wishlist count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist count' },
      { status: 500 }
    );
  }
});