'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/types';

export default function WishlistPage() {
  const { state: wishlistState, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [language, setLanguage] = useState('en');
  const [products, setProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Fetch product data for wishlist items
  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistState.items.length === 0) return;
      
      try {
        // In a real application, you would fetch products from an API
        // For now, we'll use mock data or fetch from local storage
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          const productsMap: Record<string, Product> = {};
          // Fix: data is an object with a products array, not the array itself
          if (data.success && Array.isArray(data.products)) {
            data.products.forEach((product: Product) => {
              productsMap[product.id] = product;
            });
          }
          setProducts(productsMap);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data
        const mockProducts: Record<string, Product> = {};
        wishlistState.items.forEach(item => {
          mockProducts[item.productId] = {
            id: item.productId,
            slug: 'placeholder-product',
            title: {
              en: 'Placeholder Product',
              hi: 'प्लेसहोल्डर उत्पाद'
            },
            description: {
              en: 'Product description',
              hi: 'उत्पाद विवरण'
            },
            price: 999,
            stock: 10,
            rating: 4.5,
            reviewCount: 5,
            categoryId: '1',
            artisanId: '1',
            images: ['/images/products/placeholder.jpg'],
            material: 'Wood',
            dimensions: '10x10x10 cm',
            tags: ['handmade'],
            featured: false,
            bestSeller: false,
            trending: false,
            newArrival: false,
            createdAt: new Date().toISOString()
          };
        });
        setProducts(mockProducts);
      }
    };

    fetchProducts();
  }, [wishlistState.items]);

  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Your Saved Favorites",
        description: "Save your favorite Pachmarhi tribal art pieces and come back anytime to purchase them.",
        emptyMessage: "Your wishlist is empty. Start exploring to add products you love!",
        productImage: "Product Image",
        productName: "Product Name",
        price: "Price",
        availability: "Availability",
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        moveToCart: "Move to Cart",
        remove: "Remove"
      }
    };
    
    return translations[language][key] || key;
  };

  const handleMoveToCart = (productId: string) => {
    // Fix: Pass the product ID to addToCart, not the product object
    addToCart(productId, 1); // Add 1 quantity of the product
    removeFromWishlist(productId);
    // Show notification
    if (typeof window !== 'undefined' && (window as any).showNotification) {
      (window as any).showNotification(
        language === 'en' ? 'Moved to cart ✅' : 'कार्ट में ले जाया गया ✅',
        'success'
      );
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    // Show notification
    if (typeof window !== 'undefined' && (window as any).showNotification) {
      (window as any).showNotification(
        language === 'en' ? 'Removed from wishlist ✅' : 'इच्छा-सूची से हटा दिया गया ✅',
        'success'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          {wishlistState.items.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <div className="col-span-3">{t('productImage')}</div>
                <div className="col-span-3">{t('productName')}</div>
                <div className="col-span-2">{t('price')}</div>
                <div className="col-span-2">{t('availability')}</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {wishlistState.items.map((item) => {
                  const product = products[item.productId];
                  if (!product) return null;
                  
                  return (
                    <div key={item.productId} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center">
                      <div className="md:col-span-3 flex items-center">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg'}
                          alt={product.title.en}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                          onError={(e: any) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/products/placeholder.jpg';
                          }}
                        />
                        <div className="md:hidden ml-4">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {product.title.en}
                          </h3>
                          <p className="text-amber-600 font-semibold">
                            ₹{product.price.toLocaleString()}
                          </p>
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {t('inStock')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-3 hidden md:block">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {product.title.en}
                        </h3>
                      </div>
                      
                      <div className="md:col-span-2 hidden md:block">
                        <p className="text-amber-600 font-semibold">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="md:col-span-2 hidden md:block">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {product.stock > 0 ? t('inStock') : t('outOfStock')}
                        </span>
                      </div>
                      
                      <div className="md:col-span-2 flex justify-end space-x-2">
                        <button
                          onClick={() => handleMoveToCart(item.productId)}
                          className="px-3 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          {t('moveToCart')}
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                          className="px-3 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          {t('remove')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <div className="mb-4">
                <span className="text-6xl">💖</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {t('emptyMessage')}
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}