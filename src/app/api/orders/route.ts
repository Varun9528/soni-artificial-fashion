import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, withAdminAuth } from '@/lib/auth/middleware';
import { sendEmail, getOrderConfirmationEmail } from '@/lib/emailService';
import { enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    
    const {
      items,
      payment_method,
      shipping_address,
      billing_address,
      subtotal,
      shipping_cost,
      total_amount,
      coupon_code
    } = body;

    const user_id = authContext.user.id;

    // Validate required fields
    if (!items || !items.length || !shipping_address || !total_amount) {
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
    const addressRecord = await prisma.user_addresses.create({
      data: {
        user_id: user_id,
        full_name: shipping_address.fullName,
        phone: shipping_address.phone,
        address_line1: shipping_address.addressLine1,
        address_line2: shipping_address.addressLine2 || '',
        city: shipping_address.city,
        state: shipping_address.state,
        pincode: shipping_address.pincode,
        address_type: 'home',
        is_default: false
      }
    });

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        order_number: orderNumber,
        user_id: user_id,
        status: 'pending',
        payment_status: payment_method === 'cod' ? 'pending' : 'pending',
        payment_method: payment_method,
        subtotal: parseFloat(subtotal),
        shipping_cost: parseFloat(shipping_cost) || 0,
        tax_amount: 0, // Calculate if needed
        discount_amount: 0, // Apply coupon discount if needed
        total_amount: parseFloat(total_amount),
        shipping_address: `${shipping_address.addressLine1}, ${shipping_address.addressLine2 || ''}, ${shipping_address.city}, ${shipping_address.state} - ${shipping_address.pincode}`,
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

    // Create order items
    const orderItems = [];
    for (const item of items) {
      const orderItem = await prisma.orderItem.create({
        data: {
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.title.en,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        }
      });
      orderItems.push(orderItem);
    }

    // Update product stock (reduce inventory)
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.product.id },
        data: {
          stock: {
            decrement: item.quantity
          },
          sales_count: {
            increment: item.quantity
          }
        }
      });
    }

    // Send order confirmation email to customer
    try {
      const user = await prisma.user.findUnique({
        where: { id: user_id }
      });

      if (user) {
        const trackingLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders/${order.id}`;
        const emailData = getOrderConfirmationEmail({
          customerName: user.name,
          orderId: order.order_number,
          trackingLink,
          language: 'en' // In a real implementation, you would get the customer's preferred language
        });

        await sendEmail({
          to: user.email,
          subject: emailData.subject,
          text: emailData.text,
          html: emailData.html
        });
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email sending fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: order.total_amount,
        estimatedDelivery: order.estimated_delivery
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
});

// Get all orders (admin only) or a single order by ID
export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const orderId = searchParams.get('id');
    
    // If orderId is provided, get a single order
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });
      
      if (!order) {
        return NextResponse.json({
          success: false,
          error: 'Order not found'
        }, { status: 404 });
      }
      
      // Check if user has permission to view this order
      if (authContext.user.role !== 'admin' && authContext.user.role !== 'super_admin' && order.user_id !== authContext.user.id) {
        return NextResponse.json({
          success: false,
          error: 'Unauthorized'
        }, { status: 403 });
      }
      
      // Get order items
      const items = await prisma.orderItem.findMany({
        where: {
          order_id: order.id
        }
      });
      
      const orderWithItems = {
        ...order,
        items
      };
      
      return NextResponse.json({
        success: true,
        order: orderWithItems
      });
    }
    
    // Otherwise, get orders for the current user
    // Admins and super admins can get all orders
    if (authContext.user.role === 'admin' || authContext.user.role === 'super_admin') {
      const orders = await prisma.order.findMany({
        orderBy: {
          created_at: 'desc'
        }
      });

      // Since there's no direct relation between order and items in the schema,
      // we need to fetch order items separately
      const ordersWithDetails = await Promise.all(orders.map(async (order) => {
        const items = await prisma.orderItem.findMany({
          where: {
            order_id: order.id
          }
        });
        
        return {
          ...order,
          items
        };
      }));

      return NextResponse.json({
        success: true,
        orders: ordersWithDetails
      });
    } else {
      // Regular users can only get their own orders
      const orders = await prisma.order.findMany({
        where: {
          user_id: authContext.user.id
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      // Since there's no direct relation between order and items in the schema,
      // we need to fetch order items separately
      const ordersWithDetails = await Promise.all(orders.map(async (order) => {
        const items = await prisma.orderItem.findMany({
          where: {
            order_id: order.id
          }
        });
        
        return {
          ...order,
          items
        };
      }));

      return NextResponse.json({
        success: true,
        orders: ordersWithDetails
      });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders'
    }, { status: 500 });
  }
});

// Update order status
export const PUT = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    const { orderId, status, paymentStatus } = body;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }

    // Update order status
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.payment_status = paymentStatus;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update order'
    }, { status: 500 });
  }
});
