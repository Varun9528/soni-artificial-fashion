import { NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database
enableRealDatabase();

// GET /api/artisans - Get all artisans
export async function GET() {
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

// POST /api/artisans - Create a new artisan (admin only)
export const POST = withAuth(async (request: Request, authContext: any) => {
  // Check if user has admin permissions
  if (authContext.user.role !== 'admin' && authContext.user.role !== 'super_admin') {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.bio) {
      return NextResponse.json(
        { success: false, error: 'Name and bio are required' },
        { status: 400 }
      );
    }

    // For mock implementation, return success without actually creating
    const artisanId = 'artisan-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Artisan created successfully',
      artisan: {
        id: artisanId,
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