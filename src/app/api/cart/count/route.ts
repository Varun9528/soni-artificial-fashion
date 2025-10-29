import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Get cart items using the database abstraction
    const cartItems = await db.getCartItems(userId);
    
    // Calculate total item count
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return NextResponse.json({
      success: true,
      count: cartItemCount
    });

  } catch (error) {
    console.error('Error fetching cart count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart count' },
      { status: 500 }
    );
  }
});