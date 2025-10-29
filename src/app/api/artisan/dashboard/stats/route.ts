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
        artisan_id: artisanId
      }
    });

    // Get total orders
    // For mock implementation, return a fixed value
    const totalOrders = 0;

    // Get total revenue
    // For mock implementation, return a fixed value
    const totalRevenue = 0;

    // Get pending orders
    // For mock implementation, return a fixed value
    const pendingOrders = 0;

    // Get low stock products (stock < 5)
    const lowStockProducts = await prisma.product.count({
      where: {
        artisan_id: artisanId,
        stock: {
          lt: 5
        },
        is_active: true
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