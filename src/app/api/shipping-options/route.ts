import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const shippingOptions = await prisma.shippingOption.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      shippingOptions
    });

  } catch (error) {
    console.error('Error fetching shipping options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping options' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      cost,
      minOrderValue,
      estimatedDays,
      isActive = true,
      sortOrder = 0
    } = body;

    // Validate required fields
    if (!name || !description || cost === undefined || estimatedDays === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const shippingOption = await prisma.shippingOption.create({
      data: {
        name,
        description,
        cost: parseFloat(cost),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        estimatedDays: parseInt(estimatedDays),
        isActive: Boolean(isActive),
        sortOrder: parseInt(sortOrder)
      }
    });

    return NextResponse.json({
      success: true,
      shippingOption,
      message: 'Shipping option created successfully'
    });

  } catch (error) {
    console.error('Error creating shipping option:', error);
    return NextResponse.json(
      { error: 'Failed to create shipping option' },
      { status: 500 }
    );
  }
}