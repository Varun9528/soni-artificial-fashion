import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    
    if (!session || session.user.role !== 'artisan') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get artisan ID from session
    const artisanId = session.user.id;

    // Get orders for products created by this artisan
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              artisanId: artisanId
            }
          }
        }
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        items: {
          where: {
            product: {
              artisanId: artisanId
            }
          },
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error fetching artisan orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}