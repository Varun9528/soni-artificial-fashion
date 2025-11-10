import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title_en,
      title_hi,
      subtitle_en,
      subtitle_hi,
      description_en,
      description_hi,
      image_desktop,
      image_mobile,
      link_url,
      link_text_en,
      link_text_hi,
      display_order,
      is_active
    } = body;
    
    // Validate required fields
    if (!title_en || !image_desktop) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Create banner
    const banner = await prisma.banner.create({
      data: {
        title_en,
        title_hi: title_hi || title_en,
        subtitle_en: subtitle_en || null,
        subtitle_hi: subtitle_hi || null,
        description_en: description_en || null,
        description_hi: description_hi || null,
        image_desktop,
        image_mobile: image_mobile || null,
        link_url: link_url || null,
        link_text_en: link_text_en || null,
        link_text_hi: link_text_hi || null,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      banner: {
        id: banner.id,
        title_en: banner.title_en,
        image_desktop: banner.image_desktop,
        is_active: banner.is_active
      }
    });
    
  } catch (error) {
    console.error('Error adding banner:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}