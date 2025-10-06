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
      
      return NextResponse.json({
        success: true,
        coupon
      });
    }
    
    // Get all active coupons
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: new Date()
        },
        endDate: {
          gte: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
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
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        userLimit: userLimit ? parseInt(userLimit) : 1,
        isActive: Boolean(isActive),
        startDate: new Date(startDate),
        endDate: new Date(endDate)
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