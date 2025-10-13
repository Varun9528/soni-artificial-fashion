import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/auth/middleware';

// GET a single product by ID
export const GET = withAdminAuth(async (request: NextRequest, authContext: any, params: { id: string }) => {
  try {
    const { id } = params;
    
    const product = await prisma.product.findUnique({
      where: { id },
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
        },
        productMaterials: {
          select: {
            material: true
          }
        },
        productColors: {
          select: {
            color: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product'
    }, { status: 500 });
  }
});

// UPDATE a product by ID
export const PUT = withAdminAuth(async (request: NextRequest, authContext: any, params: { id: string }) => {
  try {
    const { id } = params;
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
      metaDesc,
      isActive
    } = body;

    // Validate required fields
    if (!title?.en || !slug || !description?.en || !price || !categoryId || !artisanId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Check if slug already exists (excluding current product)
    const existingSlug = await prisma.product.findFirst({
      where: { 
        slug,
        NOT: { id }
      }
    });

    if (existingSlug) {
      return NextResponse.json({
        success: false,
        error: 'Product with this slug already exists'
      }, { status: 400 });
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id },
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
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        categoryId,
        artisanId,
        metaTitle,
        metaDesc,
        // Delete existing images and create new ones
        productImages: {
          deleteMany: {},
          create: images?.map((url: string, index: number) => ({
            url,
            isPrimary: index === 0,
            sortOrder: index
          })) || []
        },
        // Delete existing materials and create new ones
        productMaterials: {
          deleteMany: {},
          create: materials?.map((material: string) => ({
            material
          })) || []
        },
        // Delete existing colors and create new ones
        productColors: {
          deleteMany: {},
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
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
});

// DELETE a product by ID
export const DELETE = withAdminAuth(async (request: NextRequest, authContext: any, params: { id: string }) => {
  try {
    const { id } = params;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Delete the product (cascade will handle related records)
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 });
  }
});