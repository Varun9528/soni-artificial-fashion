import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Log environment variables for debugging
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_PORT:', process.env.DB_PORT);
  
  return NextResponse.json({ 
    success: true,
    env: {
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      DB_PORT: process.env.DB_PORT
    }
  });
}