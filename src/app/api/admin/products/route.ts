import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/auth/middleware';

export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        artisan: {
          select: {
            id: true,
            name: true,
            village: true
          }
        },
        productImages: {
          select: {
            url: true,
            isPrimary: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      products: products
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
});

export const POST = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    
    const {
      title,
      slug,
      description,
      shortDesc,
      price,
      originalPrice,
      images,
      sku,
      stock,
      materials,
      colors,
      tags,
      featured,
      bestSeller,
      newArrival,
      trending,
      categoryId,
      artisanId,
      metaTitle,
      metaDesc
    } = body;

    // Validate required fields
    if (!title?.en || !slug || !description?.en || !price || !categoryId || !artisanId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product with this slug already exists'
      }, { status: 400 });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        shortDesc: shortDesc || description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        sku: sku || slug.toUpperCase(),
        stock: parseInt(stock) || 0,
        tags: tags || null,
        inStock: parseInt(stock) > 0,
        featured: Boolean(featured),
        bestSeller: Boolean(bestSeller),
        newArrival: Boolean(newArrival),
        trending: Boolean(trending),
        isActive: true,
        rating: 0,
        reviewCount: 0,
        viewCount: 0,
        saleCount: 0,
        categoryId,
        artisanId,
        metaTitle,
        metaDesc,
        productImages: {
          create: images?.map((url: string, index: number) => ({
            url,
            isPrimary: index === 0,
            sortOrder: index
          })) || []
        },
        productMaterials: {
          create: materials?.map((material: string) => ({
            material
          })) || []
        },
        productColors: {
          create: colors?.map((color: string) => ({
            color
          })) || []
        }
      },
      include: {
        category: true,
        artisan: true,
        productImages: true,
        productMaterials: true,
        productColors: true
      }
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create product'
    }, { status: 500 });
  }
});