'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  id: string;
  slug: string;
  title: { en: string; hi: string };
  price: number;
  original_price?: number;
  productImages: { url: string }[];
  images: string[];
  category: {
    id: string;
    name: { en: string; hi: string };
  };
  inStock: boolean;
  stock: number;
}

export default function WomenCollectionPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=cat-007');
        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match our Product interface
          const transformedProducts = data.products.map((product: any) => ({
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            original_price: product.original_price,
            productImages: product.productImages || [],
            images: product.images || [],
            category: product.category,
            inStock: product.stock > 0,
            stock: product.stock || 0
          }));
          
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching women\'s products:', error);
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading women&#39;s collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {language === 'en' ? 'Women\'s Collection' : 'महिला संग्रह'}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Discover our exquisite collection of artificial jewelry designed exclusively for women' 
              : 'महिलाओं के लिए विशेष रूप से डिज़ाइन किए गए हमारे कृत्रिम आभूषणों के उत्कृष्ट संग्रह की खोज करें'}
          </p>
        </div>

        {/* Products Grid */}
        <div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <Image
                      src={product.productImages[0]?.url || product.images[0] || '/images/products/placeholder.jpg'}
                      alt={language === 'en' ? product.title.en : product.title.hi}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                      onError={(e: any) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/products/placeholder.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock 
                          ? (language === 'en' ? 'In Stock' : 'स्टॉक में') 
                          : (language === 'en' ? 'Out of Stock' : 'स्टॉक ख़त्म')}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {language === 'en' ? product.title.en : product.title.hi}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {product.category ? (language === 'en' ? product.category.name.en : product.category.name.hi) : ''}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold text-amber-600">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                            ₹{product.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="px-3 py-1 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        {language === 'en' ? 'View Details' : 'विवरण देखें'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <div className="mb-4">
                <span className="text-6xl">🔍</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'en' 
                  ? 'No products found in women&#39;s collection' 
                  : 'महिला संग्रह में कोई उत्पाद नहीं मिला'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}