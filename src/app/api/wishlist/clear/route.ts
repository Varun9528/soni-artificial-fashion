import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;

    // Clear all wishlist items for user
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: userId
      }
    });

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