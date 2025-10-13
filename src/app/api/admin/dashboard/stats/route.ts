import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Get total products
    const totalProducts = await prisma.product.count();

    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get total users (excluding admins)
    const totalUsers = await prisma.user.count({
      where: {
        role: {
          not: {
            in: ['admin', 'super_admin']
          }
        }
      }
    });

    // Get total artisans
    const totalArtisans = await prisma.artisan.count();

    // Calculate total revenue from delivered orders
    const deliveredOrders = await prisma.order.findMany({
      where: {
        status: 'delivered'
      },
      select: {
        total_amount: true
      }
    });

    const totalRevenue = deliveredOrders.reduce((sum, order) => {
      return sum + parseFloat(order.total_amount.toString());
    }, 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalArtisans,
        totalRevenue
      }
    });

  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
});