import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Clear the user's cart using the database abstraction
    const success = await db.clearCart(userId);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Cart cleared successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to clear cart'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear cart'
    }, { status: 500 });
  }
});