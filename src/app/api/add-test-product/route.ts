import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database
enableRealDatabase();

export async function POST(request: NextRequest) {
  try {
    // Create a test product
    const productData = {
      title: {
        en: 'Test Product',
        hi: 'परीक्षण उत्पाद'
      },
      slug: 'test-product-' + Date.now(),
      description: {
        en: 'This is a test product for debugging purposes.',
        hi: 'यह डिबगिंग उद्देश्यों के लिए एक परीक्षण उत्पाद है।'
      },
      price: 100,
      originalPrice: 120,
      stock: 10,
      sku: 'TEST-' + Date.now(),
      featured: false,
      bestSeller: false,
      newArrival: true,
      trending: false,
      categoryId: 'grocery-products',
      artisanId: 'local-farmers',
      images: ['/uploads/products/test-image.jpg'],
      materials: [],
      colors: [],
      tags: ['test', 'debug']
    };

    const product = await db.createProduct(productData);
    
    return NextResponse.json({
      success: true,
      product: product,
      message: 'Test product created successfully'
    });
  } catch (error) {
    console.error('Error creating test product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create test product'
    }, { status: 500 });
  }
}