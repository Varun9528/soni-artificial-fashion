import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
import { enableRealDatabase } from '@/lib/database/connection';
enableRealDatabase();

// GET all categories
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const categories = await db.getAllCategories();

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

    // Create the category in the database
    const categoryData: any = {
      name,
      slug,
      description: description || { en: '', hi: '' },
      image: image || '',
      featured: Boolean(featured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      displayOrder: 0
    };

    // Since we don't have specific methods in the db abstraction layer for category creation,
    // we'll use the serverDb directly
    const { serverDb } = await import('@/lib/database/server-db');
    
    const category = await serverDb.createCategory(categoryData);

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