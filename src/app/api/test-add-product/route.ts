import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title_en,
      title_hi,
      description_en,
      description_hi,
      price,
      original_price,
      stock,
      category_id,
      artisan_id,
      slug
    } = body;
    
    // Validate required fields
    if (!title_en || !price || !category_id || !slug) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Create product
    const product = await prisma.product.create({
      data: {
        slug,
        title_en,
        title_hi: title_hi || title_en,
        description_en: description_en || '',
        description_hi: description_hi || '',
        price: parseFloat(price.toString()),
        original_price: original_price ? parseFloat(original_price.toString()) : parseFloat(price.toString()),
        stock: stock || 0,
        category_id,
        artisan_id: artisan_id || null,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title_en: product.title_en,
        price: product.price,
        slug: product.slug
      }
    });
    
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}