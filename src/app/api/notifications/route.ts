import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';
import { withAuth } from '@/lib/auth/middleware';

export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const whereClause: any = {
      user_id: authContext.user.id,
      ...(unreadOnly && { read_at: null })
    };

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc'
      },
      take: limit,
      skip: offset
    });

    const total = await prisma.notification.count({
      where: whereClause
    });

    return NextResponse.json({
      success: true,
      notifications,
      total,
      hasMore: offset + limit < total
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
});


export const PUT = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    const { notificationIds, read } = body;

    if (!Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'Invalid notification IDs' },
        { status: 400 }
      );
    }

    // Update notifications
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds
        },
        user_id: authContext.user.id
      },
      data: {
        read_at: read ? new Date() : null
      }
    });

    return NextResponse.json({
      success: true,
      message: `Marked ${notificationIds.length} notifications as ${read ? 'read' : 'unread'}`
    });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
});


export const DELETE = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    const { notificationIds } = body;

    if (!Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'Invalid notification IDs' },
        { status: 400 }
      );
    }

    // Delete notifications
    await prisma.notification.deleteMany({
      where: {
        id: {
          in: notificationIds
        },
        user_id: authContext.user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${notificationIds.length} notifications`
    });

  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
});


// Create a new notification
export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    const { title, message, type, referenceId, referenceType } = body;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        user_id: authContext.user.id,
        title,
        message,
        type,
      }
    });

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
});