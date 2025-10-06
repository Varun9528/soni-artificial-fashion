import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

// Get cart item count
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const cartItemCount = await prisma.cartItem.count({
      where: {
        userId: session.user.id
      }
    });

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
}