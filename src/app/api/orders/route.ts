import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      user_id,
      items,
      payment_method,
      shipping_address,
      billing_address,
      subtotal,
      shipping_cost,
      total_amount,
      coupon_code
    } = body;

    // Validate required fields
    if (!user_id || !items || !items.length || !shipping_address || !total_amount) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Validate pincode (Indian format: 6 digits)
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(shipping_address.pincode)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid pincode. Please enter a valid 6-digit Indian pincode.'
      }, { status: 400 });
    }

    // Create address record
    const addressRecord = await prisma.address.create({
      data: {
        userId: user_id,
        name: shipping_address.fullName,
        phone: shipping_address.phone,
        address: `${shipping_address.addressLine1}, ${shipping_address.addressLine2 || ''}`.trim(),
        city: shipping_address.city,
        state: shipping_address.state,
        pincode: shipping_address.pincode,
        type: 'HOME',
        isDefault: false
      }
    });

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user_id,
        addressId: addressRecord.id,
        subtotal: parseFloat(subtotal),
        shippingFee: parseFloat(shipping_cost) || 0,
        tax: 0, // Calculate if needed
        discount: 0, // Apply coupon discount if needed
        totalAmount: parseFloat(total_amount),
        status: 'PENDING',
        paymentStatus: payment_method === 'cod' ? 'PENDING' : 'PENDING',
        paymentMethod: payment_method,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true,
        user: true
      }
    });

    // Create order status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'PENDING',
        note: 'Order placed successfully'
      }
    });

    // Update product stock (reduce inventory)
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.product.id },
        data: {
          stock: {
            decrement: item.quantity
          },
          saleCount: {
            increment: item.quantity
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        estimatedDelivery: order.estimatedDelivery
      },
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create order'
    }, { status: 500 });
  }
}

// Get user orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: userId
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                images: true,
                slug: true
              }
            }
          }
        },
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders'
    }, { status: 500 });
  }
}