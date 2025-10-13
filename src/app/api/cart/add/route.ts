import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth/middleware';
import { v4 as uuidv4 } from 'uuid';

export const POST = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    const body = await request.json();
    
    const { productId, quantity = 1 } = body;

    // Validate required fields
    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
        is_active: true
      }
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found or not available'
      }, { status: 404 });
    }

    // Check if product is in stock (handle null stock)
    if (product.stock !== null && product.stock < quantity) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient stock'
      }, { status: 400 });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.carts.findFirst({
      where: {
        user_id: userId,
        product_id: productId
      }
    });

    let cartItem;
    if (existingCartItem) {
      // Update existing cart item
      cartItem = await prisma.carts.update({
        where: {
          id: existingCartItem.id
        },
        data: {
          quantity: existingCartItem.quantity + quantity
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.carts.create({
        data: {
          id: uuidv4(),
          user_id: userId,
          product_id: productId,
          quantity: quantity
        }
      });
    }

    return NextResponse.json({
      success: true,
      cartItem: {
        id: cartItem.id,
        user_id: cartItem.user_id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        created_at: cartItem.created_at,
        updated_at: cartItem.updated_at
      },
      message: 'Product added to cart successfully'
    });

  } catch (error) {
    console.error('Error adding product to cart:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add product to cart'
    }, { status: 500 });
  }
});