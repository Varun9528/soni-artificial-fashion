import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderId,
      status,
      paymentStatus
    } = body;
    
    // Validate inputs
    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }
    
    // Prepare update data
    const updateData: any = {
      updated_at: new Date()
    };
    
    if (status) {
      updateData.status = status;
    }
    
    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }
    
    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.order_number,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.payment_status,
        updatedAt: updatedOrder.updated_at
      }
    });
    
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}