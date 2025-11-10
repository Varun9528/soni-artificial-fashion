import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection by fetching some data
    const products = await prisma.product.findMany({
      take: 3,
      select: {
        id: true,
        title_en: true,
        price: true
      }
    });
    
    const categories = await prisma.category.findMany({
      take: 3,
      select: {
        id: true,
        name_en: true,
        name_hi: true
      }
    });
    
    const users = await prisma.user.findMany({
      take: 1,
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        products,
        categories,
        users
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}