'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  
  // Handle both static data and API data formats
  const productId = product.id;
  const productSlug = product.slug;
  const productTitle = product.title?.[language] || product.name || 'Product';
  const productPrice = product.price || 0;
  const productOriginalPrice = product.originalPrice || product.price;
  const productImages = product.images || (product.productImages || []).map((img: any) => img.url);
  const productRating = product.rating || 0;
  const productReviewCount = product.reviewCount || 0;
  const productStock = product.stock || 0;
  const artisanName = product.artisan?.name || product.artisanName || 'Artisan';
  
  const discountPercentage = productOriginalPrice && productOriginalPrice > productPrice
    ? Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(productId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(productId, 1);
    // Show toast notification
    if (typeof window !== 'undefined' && (window as any).showNotification) {
      (window as any).showNotification(
        language === 'en' ? 'Added to cart ✅' : 'कार्ट में जोड़ा गया ✅',
        'success'
      );
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(productId);
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(
          language === 'en' ? 'Removed from wishlist ✅' : 'इच्छा-सूची से हटा दिया गया ✅',
          'success'
        );
      }
    } else {
      addToWishlist(productId);
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(
          language === 'en' ? 'Added to wishlist ❤️' : 'इच्छा-सूची में जोड़ा गया ❤️',
          'success'
        );
      }
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(productId, 1);
    // Redirect to checkout
    window.location.href = '/checkout';
  };

  return (
    <div className="bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-300 overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        {!imageError && (productImages && productImages.length > 0) ? (
          <Image
            src={productImages[0]}
            alt={productTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <span className="text-primary-600 text-sm text-center px-4">
              {productTitle}<br />
              <span className="text-xs opacity-75">Product Image</span>
            </span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Badge for featured/new/trending */}
        {(product.featured || product.bestSeller) && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
            FEATURED
          </div>
        )}
        {product.newArrival && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            NEW
          </div>
        )}
        {product.trending && !(product.featured || product.bestSeller) && !product.newArrival && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
            TRENDING
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="absolute top-2 left-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleWishlistToggle}
            className={`${inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-red-500'} p-2 rounded-full shadow-md transition-colors`}
            title={inWishlist ? (language === 'en' ? 'Remove from wishlist' : 'इच्छा-सूची से हटाएं') : (language === 'en' ? 'Add to wishlist' : 'इच्छा-सूची में जोड़ें')}
          >
            <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Stock status */}
        {productStock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">{language === 'en' ? 'Out of Stock' : 'स्टॉक ख़त्म'}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors">
            <Link href={`/product/${productSlug || productId}`}>
              {productTitle}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'en' ? 'By' : ''} {artisanName}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(productRating) ? 'fill-current' : 'fill-none stroke-current'}`}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">({productReviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600">₹{productPrice.toLocaleString()}</span>
            {productOriginalPrice && productOriginalPrice > productPrice && (
              <span className="text-sm text-gray-500 line-through">₹{productOriginalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex space-x-2 mt-3">
          <button 
            onClick={handleAddToCart}
            disabled={productStock <= 0}
            className="flex-1 flex items-center justify-center bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            <span className="mr-1">🛒</span>
            {language === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें'}
          </button>
          <button 
            onClick={handleBuyNow}
            disabled={productStock <= 0}
            className="flex-1 flex items-center justify-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            <span className="mr-1">💳</span>
            {language === 'en' ? 'Buy Now' : 'अभी खरीदें'}
          </button>
          <button 
            onClick={handleWishlistToggle}
            className={`${inWishlist ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-red-500'} p-2 rounded-lg transition-colors`}
            title={inWishlist ? (language === 'en' ? 'Remove from wishlist' : 'इच्छा-सूची से हटाएं') : (language === 'en' ? 'Add to wishlist' : 'इच्छा-सूची में जोड़ें')}
          >
            <span>❤️</span>
          </button>
        </div>

        {/* Stock indicator */}
        {productStock > 0 && productStock <= 5 && (
          <div className="mt-2 text-xs text-orange-600 font-medium">
            {language === 'en' ? `Only ${productStock} left in stock!` : `केवल ${productStock} स्टॉक में बचे हैं!`}
          </div>
        )}
      </div>
    </div>
  );
}