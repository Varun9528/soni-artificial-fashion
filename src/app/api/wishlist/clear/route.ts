import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

// Clear wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete all wishlist items for user
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear wishlist' },
      { status: 500 }
    );
  }
}