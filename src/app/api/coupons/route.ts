import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    // If code is provided, validate the coupon
    if (code) {
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
      
      return NextResponse.json({
        success: true,
        coupon
      });
    }
    
    // Get all active coupons
    const coupons = await prisma.coupon.findMany({
      where: {
        is_active: true,
        valid_from: {
          lte: new Date()
        },
        valid_until: {
          gte: new Date()
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      coupons
    });
    
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      code,
      title,
      description,
      type,
      value,
      minOrderValue,
      maxDiscount,
      usageLimit,
      userLimit,
      isActive,
      startDate,
      endDate
    } = body;
    
    // Validate required fields
    if (!code || !title || !type || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        title,
        description,
        type,
        value: parseFloat(value),
        minimum_order_amount: minOrderValue ? parseFloat(minOrderValue) : null,
        maximum_discount_amount: maxDiscount ? parseFloat(maxDiscount) : null,
        usage_limit: usageLimit ? parseInt(usageLimit) : null,
        user_usage_limit: userLimit ? parseInt(userLimit) : 1,
        is_active: Boolean(isActive),
        valid_from: new Date(startDate),
        valid_until: new Date(endDate)
      }
    });
    
    return NextResponse.json({
      success: true,
      coupon,
      message: 'Coupon created successfully'
    });
    
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}