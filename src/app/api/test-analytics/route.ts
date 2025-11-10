import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get total revenue from completed orders
    const revenueResult = await prisma.order.aggregate({
      where: { status: 'delivered' },
      _sum: {
        total_amount: true
      }
    });
    const totalRevenue = revenueResult._sum.total_amount || 0;
    
    // Get total orders
    const ordersResult = await prisma.order.count({
      where: { status: 'delivered' }
    });
    const totalOrders = ordersResult;
    
    // Get average order value
    const averageOrderValue = totalOrders > 0 ? parseFloat(totalRevenue.toString()) / totalOrders : 0;
    
    // Get top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['product_name'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });
    
    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: parseFloat(totalRevenue.toString()),
        totalOrders,
        averageOrderValue,
        topSellingProducts: topProducts.map(item => ({
          productName: item.product_name,
          quantitySold: item._sum.quantity || 0
        }))
      }
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}