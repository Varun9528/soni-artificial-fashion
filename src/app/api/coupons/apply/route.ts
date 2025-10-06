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
        isActive: true,
        startDate: {
          lte: new Date()
        },
        endDate: {
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
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({
        success: false,
        error: 'Coupon usage limit reached'
      });
    }
    
    // Check if user has already used this coupon (if user limit is 1)
    if (coupon.userLimit === 1) {
      const userCoupon = await prisma.userCoupon.findFirst({
        where: {
          userId: session.user.id,
          couponId: coupon.id
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
    if (coupon.minOrderValue && parseFloat(orderTotal) < coupon.minOrderValue) {
      return NextResponse.json({
        success: false,
        error: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
      });
    }
    
    // Calculate discount
    let discount = 0;
    
    switch (coupon.type) {
      case 'PERCENTAGE':
        discount = (parseFloat(orderTotal) * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
        break;
      case 'FIXED':
        discount = coupon.value;
        break;
      case 'FREE_SHIPPING':
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