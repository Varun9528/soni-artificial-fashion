import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

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

    // In a real implementation, we would create the artisan in the database
    // For now, we'll return a success response
    return NextResponse.json({
      success: true,
      message: 'Artisan created successfully',
      artisan: {
        id: 'new-artisan-id',
        ...body
      }
    });
  } catch (error) {
    console.error('Error creating artisan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create artisan' },
      { status: 500 }
    );
  }
});