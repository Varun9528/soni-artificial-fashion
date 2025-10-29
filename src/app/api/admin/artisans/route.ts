import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database
enableRealDatabase();

// GET /api/admin/artisans - Get all artisans (admin only)
export async function GET(request: NextRequest) {
  try {
    const artisans = await db.getAllArtisans();
    return NextResponse.json({ 
      success: true, 
      artisans,
      count: artisans.length
    });
  } catch (error) {
    console.error('Error fetching artisans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artisans' },
      { status: 500 }
    );
  }
}

// POST /api/admin/artisans - Create a new artisan (admin only)
export const POST = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.bio) {
      return NextResponse.json(
        { success: false, error: 'Name and bio are required' },
        { status: 400 }
      );
    }

    // Validate that photo is not a base64 data URL if provided
    if (body.photo && body.photo.startsWith('data:')) {
      return NextResponse.json(
        { success: false, error: 'Invalid photo format. Please upload an image file.' },
        { status: 400 }
      );
    }

    // Create the artisan in the database
    const artisan = await db.createArtisan(body);
    
    return NextResponse.json({
      success: true,
      message: 'Artisan created successfully',
      artisan: artisan
    });
  } catch (error: any) {
    console.error('Error creating artisan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create artisan: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
});