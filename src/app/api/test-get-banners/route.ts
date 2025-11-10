import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get active banners ordered by display order
    const banners = await prisma.banner.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' },
      select: {
        id: true,
        title_en: true,
        title_hi: true,
        subtitle_en: true,
        subtitle_hi: true,
        image_desktop: true,
        image_mobile: true,
        link_url: true,
        link_text_en: true,
        link_text_hi: true,
        display_order: true
      }
    });
    
    return NextResponse.json({
      success: true,
      banners
    });
    
  } catch (error) {
    console.error('Error retrieving banners:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}