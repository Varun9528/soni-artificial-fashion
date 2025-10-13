import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth/middleware';

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    
    // Fetch user addresses from database
    const addresses = await prisma.user_addresses.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({
      success: true,
      addresses: addresses.map(address => ({
        id: address.id,
        user_id: address.user_id,
        full_name: address.full_name,
        phone: address.phone,
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        address_type: address.address_type,
        is_default: address.is_default,
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

    // If this is set as default, unset other default addresses
    if (is_default) {
      await prisma.user_addresses.updateMany({
        where: { 
          user_id: userId,
          is_default: true
        },
        data: { is_default: false }
      });
    }

    // Create the address
    const address = await prisma.user_addresses.create({
      data: {
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
      }
    });

    return NextResponse.json({
      success: true,
      address: {
        id: address.id,
        user_id: address.user_id,
        full_name: address.full_name,
        phone: address.phone,
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        address_type: address.address_type,
        is_default: address.is_default,
        created_at: address.created_at,
        updated_at: address.updated_at
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