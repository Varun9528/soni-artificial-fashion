'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Heart, X } from 'lucide-react';

export default function WishlistPage() {
  const { state: wishlistState, removeFromWishlist } = useWishlist();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        wishlistTitle: 'Wishlist',
        emptyWishlist: 'Your wishlist is empty',
        continueShopping: 'Continue Shopping',
        moveToCart: 'Move to Cart',
        removeFromWishlist: 'Remove from wishlist',
        wishlistEmptyMessage: 'Your wishlist is empty. Start exploring to add products you love!',
        items: 'items'
      },
      hi: {
        wishlistTitle: 'इच्छा-सूची',
        emptyWishlist: 'आपकी इच्छा-सूची खाली है',
        continueShopping: 'खरीदारी जारी रखें',
        moveToCart: 'कार्ट में ले जाएँ',
        removeFromWishlist: 'इच्छा-सूची से हटाएं',
        wishlistEmptyMessage: 'आपकी इच्छा-सूची खाली है। जो उत्पाद आप पसंद करते हैं उन्हें जोड़ना शुरू करें!',
        items: 'आइटम'
      }
    };
    
    return translations[language][key] || key;
  };

  if (wishlistState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('wishlistTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{t('wishlistEmptyMessage')}</p>
          <Link 
            href="/products" 
            className="flipkart-button px-6 py-3 inline-block"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('wishlistTitle')}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistState.items.map((item) => (
          <WishlistItem 
            key={item.productId} 
            item={item} 
            onRemove={removeFromWishlist}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}

function WishlistItem({ item, onRemove, language }: { 
  item: any; 
  onRemove: (productId: string) => void;
  language: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Placeholder product data - in a real app, you would fetch this from your API
  const product = {
    id: item.productId,
    name: `Product ${item.productId}`,
    price: 1000,
    originalPrice: 1200,
    image: '/images/products/placeholder.jpg',
    rating: 4.5,
    reviewCount: 25
  };
  
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  const handleRemove = () => {
    onRemove(item.productId);
  };
  
  const handleMoveToCart = async () => {
    setLoading(true);
    try {
      // In a real app, you would add to cart here
      // For now, we'll just remove from wishlist
      onRemove(item.productId);
      
      // Show notification
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(
          language === 'en' ? 'Moved to cart ✅' : 'कार्ट में ले जाया गया ✅',
          'success'
        );
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flipkart-card group">
      <div className="relative aspect-square overflow-hidden">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">No image</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
            {discountPercentage}% {language === 'en' ? 'OFF' : 'छूट'}
          </div>
        )}
        
        {/* Remove button */}
        <button 
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 dark:bg-gray-700/90 dark:hover:bg-gray-700 dark:text-red-400 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          title={language === 'en' ? 'Remove from wishlist' : 'इच्छा-सूची से हटाएं'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="flipkart-product-title line-clamp-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-none stroke-current'}`}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({product.reviewCount})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center mt-2">
          <span className="flipkart-product-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2 mt-4">
          <button 
            onClick={handleMoveToCart}
            disabled={loading}
            className="flex-1 flipkart-button py-2 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {language === 'en' ? 'Adding...' : 'जोड़ा जा रहा है...'}
              </span>
            ) : (
              language === 'en' ? 'Move to Cart' : 'कार्ट में ले जाएँ'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}