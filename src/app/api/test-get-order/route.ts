import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }
    
    // Get order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          include: {
            products: {
              select: {
                title_en: true,
                price: true
              }
            }
          }
        }
      }
    });
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        createdAt: order.created_at,
        items: order.order_items.map(item => ({
          id: item.id,
          productName: item.product_name,
          price: item.price,
          quantity: item.quantity,
          total: item.total
        }))
      }
    });
    
  } catch (error) {
    console.error('Error retrieving order:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}