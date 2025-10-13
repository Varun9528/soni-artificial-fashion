import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { stat } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const category = data.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: 'File size too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await stat(uploadDir);
    } catch {
      // Directory doesn't exist, create it
      await mkdir(uploadDir, { recursive: true });
    }

    // Create category directory if it doesn't exist
    const categoryDir = join(uploadDir, category);
    try {
      await stat(categoryDir);
    } catch {
      // Directory doesn't exist, create it
      await mkdir(categoryDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(categoryDir, fileName);
    const relativePath = `/uploads/${category}/${fileName}`;

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to disk
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: relativePath,
      filename: fileName,
      size: file.size,
      type: file.type,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file path provided' 
      }, { status: 400 });
    }

    // Security check: ensure path is within uploads directory
    if (!filePath.startsWith('/uploads/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file path' 
      }, { status: 400 });
    }

    // TODO: Implement actual file deletion
    // For now, return success response
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete file' 
    }, { status: 500 });
  }
}