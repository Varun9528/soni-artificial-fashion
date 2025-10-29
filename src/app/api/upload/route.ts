import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Ensure upload directory exists
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = await ensureUploadDir();
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${fileExtension}`;
    const filepath = path.join(uploadDir, filename);
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file to disk
    await writeFile(filepath, buffer);
    
    // Return URL to the uploaded file
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url,
      message: 'File uploaded successfully' 
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

// Disable body parsing for this route since we're handling FormData
export const dynamic = 'force-dynamic';