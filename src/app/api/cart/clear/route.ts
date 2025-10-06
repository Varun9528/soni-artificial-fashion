import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

// Clear cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete all cart items for user
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}