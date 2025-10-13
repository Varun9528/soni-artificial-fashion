import { NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

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

    // Generate a unique ID for the artisan
    const artisanId = 'artisan-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    // Create artisan in database
    const query = `INSERT INTO artisans (id, name, bio_en, bio_hi, specialization, location, phone, email, avatar, experience_years, rating, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const values = [
      artisanId,
      body.name,
      body.bio_en || body.bio.en || body.bio,
      body.bio_hi || body.bio.hi || body.bio,
      body.specialization || '',
      body.location || '',
      body.phone || '',
      body.email || '',
      body.avatar || '',
      body.experience_years || 0,
      body.rating || 0,
      body.is_verified || false
    ];
    
    await db.execute(query, values);
    
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