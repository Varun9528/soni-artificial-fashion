// Test script to verify wishlist and cart functionality
import { db, enableRealDatabase } from './src/lib/database/connection.js';

// Enable real database
enableRealDatabase();

async function testWishlistAndCart() {
  try {
    console.log('Testing wishlist and cart functionality...');
    
    // Test user ID (using a mock user ID for testing)
    const userId = '1';
    
    // Test adding item to wishlist
    console.log('Adding item to wishlist...');
    const wishlistItem = await db.addToWishlist(userId, 'prod-001');
    console.log('Added to wishlist:', wishlistItem);
    
    // Test getting wishlist items
    console.log('Getting wishlist items...');
    const wishlistItems = await db.getWishlistItems(userId);
    console.log('Wishlist items:', wishlistItems);
    
    // Test adding item to cart
    console.log('Adding item to cart...');
    const cartItem = await db.addToCart(userId, 'prod-001', 1);
    console.log('Added to cart:', cartItem);
    
    // Test getting cart items
    console.log('Getting cart items...');
    const cartItems = await db.getCartItems(userId);
    console.log('Cart items:', cartItems);
    
    // Test removing item from wishlist
    console.log('Removing item from wishlist...');
    const removeResult = await db.removeFromWishlist(userId, 'prod-001');
    console.log('Remove from wishlist result:', removeResult);
    
    // Test getting wishlist items again
    console.log('Getting wishlist items again...');
    const wishlistItemsAfterRemoval = await db.getWishlistItems(userId);
    console.log('Wishlist items after removal:', wishlistItemsAfterRemoval);
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testWishlistAndCart();