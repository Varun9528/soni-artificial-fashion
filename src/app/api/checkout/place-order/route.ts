import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth/middleware';
import { v4 as uuidv4 } from 'uuid';

export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    const body = await request.json();
    
    const { 
      shippingAddress, 
      billingAddress, 
      paymentMethod,
      shippingMethod,
      notes
    } = body;

    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({
        success: false,
        error: 'Shipping address and payment method are required'
      }, { status: 400 });
    }

    // Get items from user's cart
    const cartItems = await prisma.carts.findMany({
      where: { user_id: userId }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Cart is empty'
      }, { status: 400 });
    }

    // Get product details for cart items
    const productIds = cartItems.map(item => item.product_id);
    const products = await prisma.product.findMany({
      where: { 
        id: { in: productIds },
        is_active: true
      }
    });

    // Create a map for quick product lookup
    const productMap = new Map(products.map(product => [product.id, product]));

    // Calculate order totals
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const product = productMap.get(item.product_id);
      if (!product) {
        return NextResponse.json({
          success: false,
          error: `Product with ID ${item.product_id} not found`
        }, { status: 400 });
      }
      
      const itemTotal = product.price.toNumber() * item.quantity;
      subtotal += itemTotal;
      
      orderItemsData.push({
        id: uuidv4(),
        product_id: item.product_id,
        product_name: product.title_en,
        product_image: null, // We'll update this later if we have product images
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Calculate shipping cost (simplified)
    const shippingCost = subtotal >= 500 ? 0 : 50;
    
    // Calculate tax (simplified)
    const taxAmount = subtotal * 0.18;
    
    // Calculate total
    const totalAmount = subtotal + shippingCost + taxAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create the order
    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        order_number: orderNumber,
        user_id: userId,
        status: 'pending',
        payment_status: 'pending',
        payment_method: paymentMethod,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        discount_amount: 0,
        total_amount: totalAmount,
        currency: 'INR',
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress,
        shipping_method: shippingMethod || 'standard',
        notes: notes || null
      }
    });

    // Create order items
    for (const itemData of orderItemsData) {
      await prisma.orderItem.create({
        data: {
          ...itemData,
          order_id: order.id
        }
      });
    }

    // Clear the user's cart
    await prisma.carts.deleteMany({
      where: { user_id: userId }
    });

    // Update product stock
    for (const item of cartItems) {
      const product = productMap.get(item.product_id);
      if (product && product.stock !== null) {
        await prisma.product.update({
          where: { id: item.product_id },
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
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        payment_status: order.payment_status,
        total_amount: order.total_amount,
        created_at: order.created_at
      },
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to place order'
    }, { status: 500 });
  }
});