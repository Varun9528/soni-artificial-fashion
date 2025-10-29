'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { useLanguage } from '@/context/LanguageContext';

export default function RingsPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products for rings category
        const response = await fetch('/api/products?category=cat-005');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching rings:', error);
        setProducts([]);
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
            {language === 'en' ? 'Loading rings...' : 'अंगूठियाँ लोड हो रही हैं...'}
          </p>
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
              {language === 'en' ? 'Rings & Bands' : 'अंगूठियाँ'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'en' 
                ? 'Explore our elegant collection of rings and bands.' 
                : 'हमारे सुरुचिपूर्ण अंगूठियों और बैंड के संग्रह का अन्वेषण करें।'}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4">
                <span className="text-6xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {language === 'en' ? 'No rings found' : 'कोई अंगूठियाँ नहीं मिलीं'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'en' 
                  ? 'We couldn\'t find any rings at the moment. Please check back later.' 
                  : 'हमें इस समय कोई अंगूठियाँ नहीं मिल सकीं। कृपया बाद में देखें।'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}