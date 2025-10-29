import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { code, orderTotal } = body;
    
    if (!code || !orderTotal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate coupon
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase(),
        is_active: true,
        valid_from: {
          lte: new Date()
        },
        valid_until: {
          gte: new Date()
        }
      }
    });
    
    if (!coupon) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired coupon code'
      });
    }
    
    // Check if coupon has reached usage limit
    if (coupon.usage_limit && coupon.usage_count && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({
        success: false,
        error: 'Coupon usage limit reached'
      });
    }
    
    // Check if user has already used this coupon (if user limit is 1)
    if (coupon.user_usage_limit === 1) {
      const userCoupon = await prisma.coupon_usage.findFirst({
        where: {
          user_id: session.user.id,
          coupon_id: coupon.id
        }
      });
      
      if (userCoupon) {
        return NextResponse.json({
          success: false,
          error: 'You have already used this coupon'
        });
      }
    }
    
    // Check minimum order value
    if (coupon.minimum_order_amount && parseFloat(orderTotal) < parseFloat(coupon.minimum_order_amount.toString())) {
      return NextResponse.json({
        success: false,
        error: `Minimum order value of ₹${coupon.minimum_order_amount} required for this coupon`
      });
    }
    
    // Calculate discount
    let discount = 0;
    
    switch (coupon.type) {
      case 'percentage':
        discount = (parseFloat(orderTotal) * parseFloat(coupon.value.toString())) / 100;
        if (coupon.maximum_discount_amount && discount > parseFloat(coupon.maximum_discount_amount.toString())) {
          discount = parseFloat(coupon.maximum_discount_amount.toString());
        }
        break;
      case 'fixed':
        discount = parseFloat(coupon.value.toString());
        break;
      case 'free_shipping':
        // This will be handled in the checkout process
        discount = 0;
        break;
    }
    
    return NextResponse.json({
      success: true,
      coupon,
      discount: parseFloat(discount.toFixed(2)),
      message: 'Coupon applied successfully'
    });
    
  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json(
      { error: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}