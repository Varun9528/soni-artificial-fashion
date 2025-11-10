import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name,
      email,
      phone,
      productName,
      productDescription,
      productCategory
    } = body;
    
    // Validate required fields
    if (!name || !email || !productName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Create sell request
    const sellRequest = await prisma.sell_requests.create({
      data: {
        id: `sell-${Date.now()}`,
        name,
        email,
        phone: phone || null,
        business_name: productName,
        business_type: productCategory || 'other',
        products: productDescription || '',
        message: productDescription || '',
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      sellRequest: {
        id: sellRequest.id,
        name: sellRequest.name,
        email: sellRequest.email,
        business_name: sellRequest.business_name,
        created_at: sellRequest.created_at
      }
    });
    
  } catch (error) {
    console.error('Error creating sell request:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}