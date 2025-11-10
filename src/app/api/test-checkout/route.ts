import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { handleApiError } from '@/lib/errorHandler';
import { FormValidator } from '@/lib/validation';

// Enable real database
enableRealDatabase();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      subtotal, 
      shipping, 
      tax, 
      total,
      userId
    } = body;
    
    // Validate required fields using FormValidator
    const validator = new FormValidator();
    validator
      .addRequired('userId', userId, 'User ID')
      .addRequired('items', items, 'Items')
      .addRequired('shippingAddress', shippingAddress, 'Shipping address')
      .addRequired('paymentMethod', paymentMethod, 'Payment method');
    
    // Validate shipping address fields
    if (shippingAddress) {
      validator
        .addRequired('fullName', shippingAddress.fullName, 'Full name')
        .addRequired('phone', shippingAddress.phone, 'Phone')
        .addRequired('addressLine1', shippingAddress.addressLine1, 'Address')
        .addRequired('city', shippingAddress.city, 'City')
        .addRequired('state', shippingAddress.state, 'State')
        .addRequired('pincode', shippingAddress.pincode, 'Pincode')
        .addPincode('pincode', shippingAddress.pincode, 'Pincode');
        
      // Only validate phone if it's provided
      if (shippingAddress.phone) {
        validator.addPhone('phone', shippingAddress.phone, 'Phone');
      }
    }
    
    // Validate that we have items in the cart
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: false,
        errors: [{ field: 'items', message: 'Cart is empty' }],
        error: 'Validation failed'
      }, { status: 400 });
    }
    
    if (!validator.isValid()) {
      return NextResponse.json({
        success: false,
        errors: validator.getErrors(),
        error: 'Validation failed'
      }, { status: 400 });
    }
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create order in database
    const order = await db.createOrder({
      orderNumber,
      userId,
      address: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode
      },
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod
    });
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create order'
      }, { status: 500 });
    }
    
    // Clear cart after successful order
    await db.clearCart(userId);
    
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount
      }
    });
    
  } catch (error) {
    console.error('Error processing checkout:', error);
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({
      success: false,
      error: message
    }, { status: statusCode || 500 });
  }
}