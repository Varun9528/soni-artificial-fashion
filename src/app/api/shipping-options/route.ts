import { NextRequest, NextResponse } from 'next/server';
// Use the database abstraction layer instead of direct Prisma access
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database
enableRealDatabase();

// Mock shipping options data
const mockShippingOptions = [
  {
    id: 'standard',
    name: {
      en: 'Standard Shipping',
      hi: 'मानक शिपिंग'
    },
    description: {
      en: 'Delivery within 5-7 business days',
      hi: '5-7 व्यावसायिक दिनों के भीतर डिलीवरी'
    },
    cost: 50,
    minOrderValue: 0,
    estimatedDays: 5,
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'express',
    name: {
      en: 'Express Shipping',
      hi: 'एक्सप्रेस शिपिंग'
    },
    description: {
      en: 'Delivery within 2-3 business days',
      hi: '2-3 व्यावसायिक दिनों के भीतर डिलीवरी'
    },
    cost: 100,
    minOrderValue: 0,
    estimatedDays: 2,
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'free',
    name: {
      en: 'Free Shipping',
      hi: 'मुफ्त शिपिंग'
    },
    description: {
      en: 'Free shipping on orders above ₹500',
      hi: '₹500 से अधिक के आदेशों पर मुफ्त शिपिंग'
    },
    cost: 0,
    minOrderValue: 500,
    estimatedDays: 7,
    isActive: true,
    sortOrder: 3
  }
];

export async function GET(request: NextRequest) {
  try {
    // Filter active shipping options
    const shippingOptions = mockShippingOptions.filter(option => option.isActive);

    return NextResponse.json({
      success: true,
      shippingOptions
    });

  } catch (error) {
    console.error('Error fetching shipping options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping options' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a mock implementation, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: 'Shipping option created successfully (mock implementation)'
    });

  } catch (error) {
    console.error('Error creating shipping option:', error);
    return NextResponse.json(
      { error: 'Failed to create shipping option' },
      { status: 500 }
    );
  }
}