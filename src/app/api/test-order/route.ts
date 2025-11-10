import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId,
      productId,
      quantity,
      shippingAddress
    } = body;
    
    // Validate inputs
    if (!userId || !productId || !quantity || !shippingAddress) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { price: true, title_en: true }
    });
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }
    
    // Calculate order details
    const subtotal = parseFloat(product.price.toString()) * quantity;
    const shipping = 50;
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + shipping + tax;
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create order
    const order = await prisma.order.create({
      data: {
        order_number: orderNumber,
        user_id: userId,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'cod',
        subtotal: subtotal,
        shipping_cost: shipping,
        tax_amount: tax,
        total_amount: total,
        shipping_address: JSON.stringify(shippingAddress),
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    // Create order item
    await prisma.orderItem.create({
      data: {
        order_id: order.id,
        product_id: productId,
        product_name: product.title_en,
        price: parseFloat(product.price.toString()),
        quantity: quantity,
        total: parseFloat(product.price.toString()) * quantity,
        created_at: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        status: order.status
      }
    });
    
  } catch (error) {
    console.error('Error creating test order:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}