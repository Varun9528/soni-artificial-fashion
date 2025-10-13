import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';

export async function GET() {
  try {
    // For now, check if environment variables are set
    const dbConfigured = process.env.DATABASE_URL || 
                        (process.env.DB_HOST && process.env.DB_NAME);
    
    if (!dbConfigured) {
      return NextResponse.json({
        status: 'warning',
        connected: false,
        message: 'Database not configured',
        fallback: 'Using mock data',
        setup_required: true
      });
    }

    // Test actual database connection
    const connected = await testConnection();
    
    if (connected) {
      return NextResponse.json({
        status: 'success',
        connected: true,
        message: 'MySQL Database connected successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        status: 'warning',
        connected: false,
        message: 'Database configured but connection failed',
        fallback: 'Using mock data',
        setup_required: true
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      connected: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'Using mock data'
    }, { status: 500 });
  }
}