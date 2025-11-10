import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get contact requests
    const contactRequests = await prisma.contact_requests.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        created_at: true
      }
    });
    
    return NextResponse.json({
      success: true,
      contactRequests
    });
    
  } catch (error) {
    console.error('Error retrieving contact requests:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}