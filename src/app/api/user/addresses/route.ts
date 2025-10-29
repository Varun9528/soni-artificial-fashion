import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
enableRealDatabase();

// Add a method to get user addresses from the database
async function getUserAddresses(userId: string) {
  try {
    return await db.getUserAddresses(userId);
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return [];
  }
}

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Fetch addresses from real database
    const addresses = await getUserAddresses(userId);

    return NextResponse.json({
      success: true,
      addresses: addresses.map((address: any) => ({
        id: address.id,
        user_id: address.user_id,
        name: address.full_name,
        phone: address.phone,
        address: address.address_line1 + (address.address_line2 ? `, ${address.address_line2}` : ''),
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        address_type: address.address_type,
        isDefault: address.is_default,
        created_at: address.created_at,
        updated_at: address.updated_at
      }))
    });

  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user addresses'
    }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    const body = await request.json();
    
    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      address_type,
      is_default
    } = body;

    // Validate required fields
    if (!full_name || !phone || !address_line1 || !city || !state || !pincode) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Insert into the database
    const newAddress = await db.createUserAddress({
      user_id: userId,
      full_name,
      phone,
      address_line1,
      address_line2: address_line2 || null,
      city,
      state,
      pincode,
      country: country || 'India',
      address_type: address_type || 'home',
      is_default: is_default || false
    });

    return NextResponse.json({
      success: true,
      address: {
        id: newAddress.id,
        user_id: newAddress.user_id,
        name: newAddress.full_name,
        phone: newAddress.phone,
        address: newAddress.address_line1 + (newAddress.address_line2 ? `, ${newAddress.address_line2}` : ''),
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        country: newAddress.country,
        address_type: newAddress.address_type,
        isDefault: newAddress.is_default,
        created_at: newAddress.created_at,
        updated_at: newAddress.updated_at
      },
      message: 'Address created successfully'
    });

  } catch (error) {
    console.error('Error creating user address:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create user address'
    }, { status: 500 });
  }
});