import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';

export async function GET(request: NextRequest) {
  try {
    // Get all categories from the database
    const categories = await db.getAllCategories();
    
    // Format categories for frontend
    const formattedCategories = categories.map((category: any) => ({
      id: category.id,
      slug: category.id, // Using ID as slug since categories don't have a slug field
      name: category.name,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      createdAt: category.createdAt
    }));
    
    return NextResponse.json({
      success: true,
      categories: formattedCategories,
      count: formattedCategories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        categories: []
      },
      { status: 500 }
    );
  }
}