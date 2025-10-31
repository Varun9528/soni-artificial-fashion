'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function TestPage() {
  const { state: wishlistState, addToWishlist, removeFromWishlist } = useWishlist();
  const { state: cartState, addToCart, removeFromCart } = useCart();
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const runTest = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      // Test adding to wishlist
      await addToWishlist('prod-001');
      setTestResult(prev => prev + '✓ Added to wishlist\n');
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test moving from wishlist to cart
      await addToCart('prod-001', 1);
      setTestResult(prev => prev + '✓ Added to cart\n');
      
      // Test removing from wishlist (simulating move to cart)
      await removeFromWishlist('prod-001');
      setTestResult(prev => prev + '✓ Removed from wishlist\n');
      
      // Test removing from cart
      await removeFromCart('prod-001');
      setTestResult(prev => prev + '✓ Removed from cart\n');
      
      setTestResult(prev => prev + 'All tests passed! ✅');
    } catch (error: any) {
      console.error('Test error:', error);
      setTestResult(prev => prev + `❌ Test failed: ${(error as Error).message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wishlist & Cart Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flipkart-card">
          <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
          <p>Items: {wishlistState.items.length}</p>
          <ul className="mt-2">
            {wishlistState.items.map(item => (
              <li key={item.productId} className="border-b py-1">
                {item.productId}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flipkart-card">
          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          <p>Items: {cartState.itemCount}</p>
          <ul className="mt-2">
            {cartState.items.map(item => (
              <li key={item.productId} className="border-b py-1">
                {item.productId} (Qty: {item.quantity})
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <button 
        onClick={runTest}
        disabled={loading}
        className="flipkart-button px-6 py-3"
      >
        {loading ? 'Testing...' : 'Run Test'}
      </button>
      
      {testResult && (
        <div className="flipkart-card mt-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
}