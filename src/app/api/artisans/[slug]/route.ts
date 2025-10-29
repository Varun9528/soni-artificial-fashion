import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database
enableRealDatabase();

// GET /api/artisans/[slug] - Get a single artisan by slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const artisans = await db.getAllArtisans();
    const artisan = artisans.find((a: any) => a.slug === params.slug || a.id === params.slug);
    
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