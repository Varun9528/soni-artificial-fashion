import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/auth/middleware';

// GET all categories
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        sortOrder: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 });
  }
});

// CREATE a new category
export const POST = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    
    const {
      name,
      slug,
      description,
      image,
      featured,
      isActive
    } = body;

    // Validate required fields
    if (!name?.en || !slug) {
      return NextResponse.json({
        success: false,
        error: 'Name and slug are required'
      }, { status: 400 });
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category with this slug already exists'
      }, { status: 400 });
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || { en: '', hi: '' },
        image: image || '',
        featured: Boolean(featured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        productCount: 0,
        sortOrder: 0
      }
    });

    return NextResponse.json({
      success: true,
      category,
      message: 'Category created successfully'
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create category'
    }, { status: 500 });
  }
});