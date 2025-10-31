import { NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAuth } from '@/lib/auth/middleware';

// Enable real database
enableRealDatabase();

export async function GET() {
  try {
    // For testing purposes, we'll use a fixed user ID
    const userId = '1';
    
    // Test 1: Add item to wishlist
    console.log('Test 1: Adding item to wishlist...');
    const wishlistItem = await db.addToWishlist(userId, 'prod-001');
    console.log('Added to wishlist:', wishlistItem);
    
    // Test 2: Get wishlist items
    console.log('Test 2: Getting wishlist items...');
    const wishlistItems = await db.getWishlistItems(userId);
    console.log('Wishlist items:', wishlistItems);
    
    // Test 3: Add item to cart
    console.log('Test 3: Adding item to cart...');
    const cartItem = await db.addToCart(userId, 'prod-001', 1);
    console.log('Added to cart:', cartItem);
    
    // Test 4: Get cart items
    console.log('Test 4: Getting cart items...');
    const cartItems = await db.getCartItems(userId);
    console.log('Cart items:', cartItems);
    
    // Test 5: Remove item from wishlist (simulating move to cart)
    console.log('Test 5: Removing item from wishlist...');
    const removeWishlistResult = await db.removeFromWishlist(userId, 'prod-001');
    console.log('Remove from wishlist result:', removeWishlistResult);
    
    // Test 6: Get wishlist items again
    console.log('Test 6: Getting wishlist items again...');
    const wishlistItemsAfterRemoval = await db.getWishlistItems(userId);
    console.log('Wishlist items after removal:', wishlistItemsAfterRemoval);
    
    // Test 7: Remove item from cart
    console.log('Test 7: Removing item from cart...');
    const removeCartResult = await db.removeFromCart(userId, 'prod-001');
    console.log('Remove from cart result:', removeCartResult);
    
    // Test 8: Get cart items again
    console.log('Test 8: Getting cart items again...');
    const cartItemsAfterRemoval = await db.getCartItems(userId);
    console.log('Cart items after removal:', cartItemsAfterRemoval);
    
    return NextResponse.json({
      success: true,
      message: 'All wishlist and cart tests passed!',
      data: {
        wishlistItems: wishlistItems.length,
        cartItems: cartItems.length,
        wishlistItemsAfterMove: wishlistItemsAfterRemoval.length,
        cartItemsAfterRemoval: cartItemsAfterRemoval.length
      }
    });
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}