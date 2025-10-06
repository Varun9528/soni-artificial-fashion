import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'artisan') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get artisan ID from session
    const artisanId = session.user.id;

    // Get total products
    const totalProducts = await prisma.product.count({
      where: {
        artisanId: artisanId
      }
    });

    // Get total orders
    const totalOrders = await prisma.order.count({
      where: {
        items: {
          some: {
            product: {
              artisanId: artisanId
            }
          }
        }
      }
    });

    // Get total revenue
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              artisanId: artisanId
            }
          }
        },
        status: 'delivered'
      },
      include: {
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
      }
    });

    const totalRevenue = orders.reduce((sum, order) => {
      const orderRevenue = order.items.reduce((itemSum, item) => {
        return itemSum + (item.price * item.quantity);
      }, 0);
      return sum + orderRevenue;
    }, 0);

    // Get pending orders
    const pendingOrders = await prisma.order.count({
      where: {
        items: {
          some: {
            product: {
              artisanId: artisanId
            }
          }
        },
        status: {
          in: ['pending', 'processing']
        }
      }
    });

    // Get low stock products (stock < 5)
    const lowStockProducts = await prisma.product.count({
      where: {
        artisanId: artisanId,
        stock: {
          lt: 5
        },
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        lowStockProducts
      }
    });

  } catch (error) {
    console.error('Error fetching artisan dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}