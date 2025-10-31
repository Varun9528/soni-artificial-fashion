import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database
enableRealDatabase();

// GET /api/artisans/[slug] - Get a single artisan by slug or ID
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    
    // Get all artisans and find the matching one
    const artisans = await db.getAllArtisans();
    
    // Find artisan by slug or ID
    const artisan = artisans.find((a: any) => {
      // Check if slug matches directly
      if (a.slug === slug) return true;
      
      // Check if ID matches
      if (a.id.toString() === slug) return true;
      
      // Check if name matches (for cases where slug is derived from name)
      const nameSlug = a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (nameSlug === slug) return true;
      
      return false;
    });
    
    if (!artisan) {
      return NextResponse.json(
        { success: false, error: 'Artisan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      artisan
    });
  } catch (error) {
    console.error('Error fetching artisan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artisan' },
      { status: 500 }
    );
  }
}