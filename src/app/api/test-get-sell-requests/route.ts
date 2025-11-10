import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get sell requests
    const sellRequests = await prisma.sell_requests.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        business_name: true,
        business_type: true,
        products: true,
        message: true,
        created_at: true
      }
    });
    
    return NextResponse.json({
      success: true,
      sellRequests
    });
    
  } catch (error) {
    console.error('Error retrieving sell requests:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}