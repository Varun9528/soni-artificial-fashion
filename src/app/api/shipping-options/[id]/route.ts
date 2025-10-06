import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shippingOption = await prisma.shippingOption.findUnique({
      where: {
        id: params.id
      }
    });

    if (!shippingOption) {
      return NextResponse.json(
        { error: 'Shipping option not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      shippingOption
    });

  } catch (error) {
    console.error('Error fetching shipping option:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping option' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      cost,
      minOrderValue,
      estimatedDays,
      isActive,
      sortOrder
    } = body;

    const shippingOption = await prisma.shippingOption.update({
      where: {
        id: params.id
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(cost !== undefined && { cost: parseFloat(cost) }),
        ...(minOrderValue !== undefined && { minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null }),
        ...(estimatedDays !== undefined && { estimatedDays: parseInt(estimatedDays) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) })
      }
    });

    return NextResponse.json({
      success: true,
      shippingOption,
      message: 'Shipping option updated successfully'
    });

  } catch (error) {
    console.error('Error updating shipping option:', error);
    return NextResponse.json(
      { error: 'Failed to update shipping option' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.shippingOption.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Shipping option deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting shipping option:', error);
    return NextResponse.json(
      { error: 'Failed to delete shipping option' },
      { status: 500 }
    );
  }
}