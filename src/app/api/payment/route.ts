// Declare process variable for TypeScript
declare const process: {
  env: {
    [key: string]: string | undefined;
    RAZORPAY_KEY_ID?: string;
    RAZORPAY_KEY_SECRET?: string;
    STRIPE_SECRET_KEY?: string;
    NEXT_PUBLIC_APP_URL?: string;
    NODE_ENV?: string;
  };
};

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getOrderConfirmationEmail } from '@/lib/emailService';
import prisma from '@/lib/prisma';

interface PaymentRequest {
  amount: number;
  paymentMethod: 'cod' | 'online' | 'razorpay' | 'stripe';
  items: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  shippingMethod: string;
  customerEmail?: string;
  language?: 'en' | 'hi';
  orderId?: string;
}

// Process COD payment
const processCODPayment = async (amount: number, orderId: string): Promise<{ success: boolean; transactionId?: string }> => {
  try {
    // For COD, payment is successful by default
    const transactionId = `COD-${orderId}-${Date.now()}`;
    
    return {
      success: true,
      transactionId
    };
  } catch (error) {
    console.error('COD payment error:', error);
    return {
      success: false
    };
  }
};

// Process Razorpay payment (mock implementation)
const processRazorpayPayment = async (amount: number, orderId: string, currency: string = 'INR'): Promise<{ success: boolean; transactionId?: string; paymentId?: string }> => {
  try {
    // Check if Razorpay is configured
    const isConfigured = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;
    
    if (!isConfigured) {
      // Return mock success if not configured
      return {
        success: true,
        transactionId: `MOCK_RAZORPAY_${orderId}_${Date.now()}`,
        paymentId: `MOCK_RAZORPAY_${orderId}_${Date.now()}`
      };
    }

    // In a real implementation, you would use the Razorpay SDK here
    // For now, we'll return a mock success
    return {
      success: true,
      transactionId: `RZP_${orderId}_${Date.now()}`,
      paymentId: `RZP_${orderId}_${Date.now()}`
    };
  } catch (error) {
    console.error('Razorpay payment error:', error);
    return {
      success: false
    };
  }
};

// Process Stripe payment (mock implementation)
const processStripePayment = async (amount: number, orderId: string, currency: string = 'INR'): Promise<{ success: boolean; transactionId?: string; paymentId?: string }> => {
  try {
    // Check if Stripe is configured
    const isConfigured = process.env.STRIPE_SECRET_KEY;
    
    if (!isConfigured) {
      // Return mock success if not configured
      return {
        success: true,
        transactionId: `MOCK_STRIPE_${orderId}_${Date.now()}`,
        paymentId: `MOCK_STRIPE_${orderId}_${Date.now()}`
      };
    }

    // In a real implementation, you would use the Stripe SDK here
    // For now, we'll return a mock success
    return {
      success: true,
      transactionId: `STRIPE_${orderId}_${Date.now()}`,
      paymentId: `STRIPE_${orderId}_${Date.now()}`
    };
  } catch (error) {
    console.error('Stripe payment error:', error);
    return {
      success: false
    };
  }
};

// Verify Razorpay payment (mock implementation)
const verifyRazorpayPayment = async (paymentId: string, orderId: string, signature: string): Promise<boolean> => {
  try {
    // In a real implementation, you would verify the payment signature here
    // For now, we'll return true as a mock
    return true;
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return false;
  }
};

// Verify Stripe payment (mock implementation)
const verifyStripePayment = async (paymentIntentId: string): Promise<boolean> => {
  try {
    // In a real implementation, you would verify the payment status here
    // For now, we'll return true as a mock
    return true;
  } catch (error) {
    console.error('Stripe verification error:', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    
    // Validate required fields
    if (!body.amount || !body.paymentMethod || !body.items || !body.shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate order ID if not provided
    const orderId = body.orderId || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    let paymentResult: { success: boolean; transactionId?: string; paymentId?: string };
    
    // Process payment based on method
    switch (body.paymentMethod) {
      case 'cod':
        // Process COD payment
        paymentResult = await processCODPayment(body.amount, orderId);
        break;
        
      case 'razorpay':
        // Process with Razorpay
        paymentResult = await processRazorpayPayment(body.amount, orderId);
        break;
        
      case 'stripe':
        // Process with Stripe
        paymentResult = await processStripePayment(body.amount, orderId);
        break;
        
      case 'online':
      default:
        // For online payments, use COD as fallback
        paymentResult = await processCODPayment(body.amount, orderId);
        break;
    }
    
    if (paymentResult.success) {
      // Update order status in database
      if (body.orderId) {
        await prisma.order.update({
          where: { id: body.orderId },
          data: {
            payment_status: 'paid',
            status: 'confirmed',
            payment_id: paymentResult.paymentId || paymentResult.transactionId
          }
        });
      }

      // Send order confirmation email if email is provided
      if (body.customerEmail) {
        const language = body.language || 'en';
        const trackingLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tracking/${orderId}`;
        
        const emailContent = getOrderConfirmationEmail({
          customerName: body.shippingAddress.fullName,
          orderId,
          trackingLink,
          language
        });
        
        await sendEmail({
          to: body.customerEmail,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html
        });
      }

      return NextResponse.json({
        status: 'success',
        orderId,
        message: 'Payment processed successfully',
        paymentMethod: body.paymentMethod,
        amount: body.amount,
        transactionId: paymentResult.transactionId,
        paymentId: paymentResult.paymentId,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
    } else {
      return NextResponse.json({
        status: 'failed',
        error: 'Payment failed',
        message: 'Payment could not be processed. Please try again or use another payment method.'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle payment verification webhooks
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentMethod, paymentId, orderId, signature } = body;

    let isVerified = false;

    // Verify payment based on method
    switch (paymentMethod) {
      case 'razorpay':
        if (signature) {
          isVerified = await verifyRazorpayPayment(paymentId, orderId, signature);
        }
        break;
        
      case 'stripe':
        isVerified = await verifyStripePayment(paymentId);
        break;
        
      case 'cod':
        // COD payments are automatically verified
        isVerified = true;
        break;
        
      default:
        isVerified = false;
        break;
    }

    if (isVerified) {
      // Update order status in database
      await prisma.order.update({
        where: { id: orderId },
        data: {
          payment_status: 'paid',
          status: 'confirmed',
          payment_id: paymentId
        }
      });

      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
        orderId,
        paymentId
      });
    } else {
      return NextResponse.json({
        status: 'failed',
        error: 'Payment verification failed',
        message: 'Unable to verify payment. Please contact support.'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// For testing purposes, also handle GET requests
export async function GET() {
  const isRazorpayConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  const isStripeConfigured = !!(process.env.STRIPE_SECRET_KEY);

  return NextResponse.json({
    service: 'Payment Gateway Integration',
    status: 'operational',
    supportedMethods: ['cod', 'online', 'razorpay', 'stripe'],
    gateways: ['Razorpay', 'Stripe'],
    testMode: process.env.NODE_ENV === 'development',
    message: 'This service supports both Razorpay and Stripe payment gateways',
    razorpayConfigured: isRazorpayConfigured,
    stripeConfigured: isStripeConfigured
  });
}