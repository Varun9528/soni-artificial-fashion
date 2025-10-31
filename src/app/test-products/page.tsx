'use client';

import { useState, useEffect } from 'react';

export default function TestProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await fetch('/api/products');
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.error || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error fetching products: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Test Products Page
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Found {products.length} products
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {product.title?.en || product.title_en || 'No title'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    ₹{product.price}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {product.id}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4">
                <span className="text-6xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}