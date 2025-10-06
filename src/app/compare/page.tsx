'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';

interface CompareItem {
  id: string;
  addedAt: Date;
}

export default function ComparePage() {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load compare list from localStorage
    const saved = localStorage.getItem('compare');
    if (saved) {
      setCompareItems(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const removeFromCompare = (productId: string) => {
    const updated = compareItems.filter(item => item.id !== productId);
    setCompareItems(updated);
    localStorage.setItem('compare', JSON.stringify(updated));
  };

  const addToCart = (productId: string) => {
    // Mock add to cart functionality
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cartItems.find((item: any) => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ id: productId, quantity: 1, addedAt: new Date() });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert('Added to cart!'); // In real app, use toast notification
  };

  const compareProducts = products.filter(product => 
    compareItems.some(item => item.id === product.id)
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (compareItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No products to compare</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Add products to compare by clicking the compare icon on product pages
          </p>
          <Link 
            href="/" 
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
        <span className="text-gray-600">{compareItems.length} products</span>
      </div>

      {compareProducts.length > 4 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800">
            You can compare up to 4 products at a time. Consider removing some items for better comparison.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Product Images and Basic Info */}
          <div className="grid grid-cols-1 gap-6 mb-8" style={{ gridTemplateColumns: `repeat(${Math.min(compareProducts.length, 4)}, 1fr)` }}>
            {compareProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <div className="relative h-48">
                    <Image
                      src={product.images[0]}
                      alt={product.title.en}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-amber-600 line-clamp-2">
                      {product.title.en}
                    </h3>
                  </Link>
                  
                  <div className="text-lg font-bold text-amber-600 mb-2">
                    ₹{(product.originalPrice || product.price) - ((product.originalPrice || product.price) * (product.discount || 0) / 100)}
                  </div>
                  
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-50">Price</td>
                  {compareProducts.slice(0, 4).map((product) => (
                    <td key={product.id} className="px-4 py-3 text-center">
                      <div className="text-lg font-bold text-amber-600">
                        ₹{(product.originalPrice || product.price) - ((product.originalPrice || product.price) * (product.discount || 0) / 100)}
                      </div>
                      {(product.discount || 0) > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-50">Rating</td>
                  {compareProducts.slice(0, 4).map((product) => (
                    <td key={product.id} className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{product.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">{product.reviewCount} reviews</div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-50">Material</td>
                  {compareProducts.slice(0, 4).map((product) => (
                    <td key={product.id} className="px-4 py-3 text-center text-gray-600">
                      {product.material}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-50">Dimensions</td>
                  {compareProducts.slice(0, 4).map((product) => (
                    <td key={product.id} className="px-4 py-3 text-center text-gray-600">
                      {product.dimensions}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-50">Artisan</td>
                  {compareProducts.slice(0, 4).map((product) => (
                    <td key={product.id} className="px-4 py-3 text-center">
                      <Link href={`/artisan/${product.artisanId}`} className="text-amber-600 hover:text-amber-700">
                        View Artisan
                      </Link>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-50">Availability</td>
                  {compareProducts.slice(0, 4).map((product) => (
                    <td key={product.id} className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-50">Category</td>
                  {compareProducts.slice(0, 4).map((product) => (
                    <td key={product.id} className="px-4 py-3 text-center">
                      <Link href={`/category/${product.categoryId}`} className="text-amber-600 hover:text-amber-700">
                        {product.categoryId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Link>
                    </td>
                  ))}
                </tr>

                {compareProducts.some(p => p.featured) && (
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-50">Featured</td>
                    {compareProducts.slice(0, 4).map((product) => (
                      <td key={product.id} className="px-4 py-3 text-center">
                        {product.featured ? (
                          <span className="text-amber-600">✓ Featured</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}