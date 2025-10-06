import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

// Get wishlist item count
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const wishlistItemCount = await prisma.wishlistItem.count({
      where: {
        userId: session.user.id
      }
    });

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
}