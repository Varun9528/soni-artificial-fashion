import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { handleApiError } from '@/lib/errorHandler';
import { FormValidator } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      items, 
      shippingAddress, 
      paymentMethod, 
      subtotal, 
      shipping, 
      tax, 
      total 
    } = body;
    
    // Validate required fields using FormValidator
    const validator = new FormValidator();
    validator
      .addRequired('userId', userId, 'User ID')
      .addRequired('items', items, 'Items')
      .addRequired('shippingAddress', shippingAddress, 'Shipping address')
      .addRequired('paymentMethod', paymentMethod, 'Payment method')
      .addArray('items', items, 1, undefined, 'Items')
      .addObject('shippingAddress', shippingAddress, 'Shipping address');
    
    // Validate shipping address fields
    if (shippingAddress) {
      validator
        .addRequired('fullName', shippingAddress.fullName, 'Full name')
        .addRequired('phone', shippingAddress.phone, 'Phone')
        .addRequired('address', shippingAddress.address, 'Address')
        .addRequired('city', shippingAddress.city, 'City')
        .addRequired('state', shippingAddress.state, 'State')
        .addRequired('pincode', shippingAddress.pincode, 'Pincode')
        .addPincode('pincode', shippingAddress.pincode, 'Pincode')
        .addPhone('phone', shippingAddress.phone, 'Phone');
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
      address: shippingAddress,
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
        total: order.totalAmount
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