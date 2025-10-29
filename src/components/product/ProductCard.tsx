'use client';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, CreditCard, Star } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, state: wishlistState } = useWishlist();
  const { language } = useLanguage();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  
  // Handle both static data and API data formats
  const productId = product.id;
  // Use product.slug for routing and actions
  const productSlug = product.slug || product.id;
  // Use safe access pattern for product title
  const productTitle = 
    product.title?.[language] || 
    product.title?.en ||
    product.title_en || 
    product.name || 
    'Product';
  const productPrice = product.price || 0;
  const productOriginalPrice = product.original_price || product.originalPrice || product.price;
  
  // Process images to use absolute URLs
  let productImages = product.images || (product.productImages || []).map((img: any) => img.url) || [product.image_path];
  
  // Convert relative URLs to absolute URLs with proper handling
  productImages = productImages.map((img: any) => {
    // Handle both string URLs and objects with url property
    const imgUrl = typeof img === 'string' ? img : (img?.url || '');
    
    if (!imgUrl) return '/images/products/placeholder.jpg';
    
    // If it's already an absolute path, return as is
    if (imgUrl.startsWith('http') || imgUrl.startsWith('/images/') || imgUrl.startsWith('/uploads/')) {
      return imgUrl;
    }
    
    // If it's a relative path, make it absolute
    return `/images/products/${imgUrl}`;
  });
  
  const productRating = product.rating || 0;
  const productReviewCount = product.review_count || product.reviewCount || 0;
  const productStock = product.stock || product.inStock || 0;
  const categoryName = product.category?.name?.[language] || product.category?.name?.en || product.categoryName || 'Category';
  
  // Check if the first image is an SVG
  const firstImage = productImages && productImages.length > 0 ? productImages[0] : null;
  
  const discountPercentage = productOriginalPrice && productOriginalPrice > productPrice
    ? Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100)
    : 0;

  // Check if product is in wishlist
  const inWishlist = wishlistState.items.some((item: any) => item.productId === productId);

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        addToWishlist: 'Add to Wishlist',
        removeFromWishlist: 'Remove from Wishlist',
        outOfStock: 'Out of Stock',
        onlyLeft: 'Only {{count}} left in stock!'
      },
      hi: {
        addToCart: 'कार्ट में डालें',
        buyNow: 'अभी खरीदें',
        addToWishlist: 'पसंद में जोड़ें',
        removeFromWishlist: 'पसंद से हटाएं',
        outOfStock: 'स्टॉक समाप्त',
        onlyLeft: 'केवल {{count}} स्टॉक में बचे हैं!'
      }
    };
    
    return translations[language][key] || key;
  };

  // Create event handlers as arrow functions to ensure proper binding
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Capture product data directly in the function scope
    const currentProductId = product.id;
    const currentProductSlug = product.slug || product.id;
    const currentProductTitle = product.title?.[language] || product.title?.en || product.title_en || product.name || 'Product';
    const currentProductPrice = product.price || 0;
    
    // Use the specific product data for this card
    addToCart(currentProductId, 1, { 
      slug: currentProductSlug, 
      title: currentProductTitle, 
      price: currentProductPrice 
    });
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
    e.stopPropagation();
    // Capture product data directly in the function scope
    const currentProductId = product.id;
    
    if (inWishlist) {
      removeFromWishlist(currentProductId);
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(
          language === 'en' ? 'Removed from wishlist ✅' : 'इच्छा-सूची से हटा दिया गया ✅',
          'success'
        );
      }
    } else {
      // Use the specific product data for this card
      addToWishlist(currentProductId);
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
    e.stopPropagation();
    // Capture product data directly in the function scope
    const currentProductId = product.id;
    const currentProductSlug = product.slug || product.id;
    const currentProductTitle = product.title?.[language] || product.title?.en || product.title_en || product.name || 'Product';
    const currentProductPrice = product.price || 0;
    
    // Use the specific product data for this card
    addToCart(currentProductId, 1, { 
      slug: currentProductSlug, 
      title: currentProductTitle, 
      price: currentProductPrice 
    });
    // Redirect to checkout with product slug
    router.push(`/checkout?slug=${currentProductSlug}`);
  };

  const handleProductClick = () => {
    router.push(`/product/${productSlug}`);
  };

  return (
    <div className="flipkart-card group hover:scale-105 transition-transform shadow-lg h-full flex flex-col">
      <button onClick={handleProductClick} className="block flex-1 w-full text-left">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {!imageError && (firstImage || (productImages && productImages.length > 0)) ? (
            <Image
              src={firstImage || productImages[0] || '/images/products/placeholder.jpg'}
              alt={productTitle}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                setImageError(true);
                const target = e.target as HTMLImageElement;
                target.src = '/images/products/placeholder.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#5C4033] to-[#FFD54F] dark:from-[#5C4033] dark:to-[#FFD54F] flex items-center justify-center">
              <span className="text-white dark:text-white text-sm text-center px-4">
                {productTitle}<br />
                <span className="text-xs opacity-75">
                  {language === 'en' ? 'Product Image' : 'उत्पाद छवि'}
                </span>
              </span>
            </div>
          )}
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 flipkart-badge">
              {discountPercentage}% {language === 'en' ? 'OFF' : 'छूट'}
            </div>
          )}

          {/* Badge for featured/new/trending */}
          {(product.featured || product.best_seller || product.bestSeller) && (
            <div className="absolute top-2 right-2 bg-[#FFD54F] text-[#5C4033] px-2 py-1 rounded text-xs font-semibold">
              {language === 'en' ? 'FEATURED' : 'विशेष'}
            </div>
          )}
          {(product.new_arrival || product.newArrival) && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              {language === 'en' ? 'NEW' : 'नया'}
            </div>
          )}
          {product.trending && !(product.featured || product.best_seller || product.bestSeller) && !(product.new_arrival || product.newArrival) && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
              {language === 'en' ? 'TRENDING' : 'ट्रेंडिंग'}
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="absolute top-2 left-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleWishlistToggle}
              className={`${inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-red-500 dark:bg-gray-700/90 dark:hover:bg-gray-700 dark:text-red-400'} p-2 rounded-full shadow-md transition-colors`}
              title={inWishlist ? (language === 'en' ? 'Remove from wishlist' : 'इच्छा-सूची से हटाएं') : (language === 'en' ? 'Add to wishlist' : 'इच्छा-सूची में जोड़ें')}
            >
              <Heart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Stock status */}
          {productStock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {t('outOfStock')}
              </span>
            </div>
          )}
        </div>
      </button>

      <div className="p-3 flex-1 flex flex-col">
        <div className="mb-1">
          <h3 className="flipkart-product-title text-sm">
            <button onClick={handleProductClick} className="text-inherit hover:text-amber-600 dark:hover:text-amber-400">
              {productTitle}
            </button>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {categoryName}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(productRating) ? 'fill-current' : 'fill-none stroke-current'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({productReviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center mb-2">
          <span className="flipkart-product-price text-base">
            ₹{productPrice.toLocaleString()}
          </span>
          {productOriginalPrice && productOriginalPrice > productPrice && (
            <>
              <span className="flipkart-product-original-price text-sm ml-2">
                ₹{productOriginalPrice.toLocaleString()}
              </span>
              <span className="flipkart-product-discount text-xs ml-2">
                {discountPercentage}% off
              </span>
            </>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex space-x-1 mt-2 flex-1 items-end">
          <button 
            onClick={handleAddToCart}
            disabled={productStock <= 0}
            className="flipkart-button flex-1 flex items-center justify-center px-2 py-1 text-xs"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            {t('addToCart')}
          </button>
          <button 
            onClick={handleBuyNow}
            disabled={productStock <= 0}
            className="flipkart-button-secondary flex-1 flex items-center justify-center px-2 py-1 text-xs"
          >
            <CreditCard className="w-3 h-3 mr-1" />
            {t('buyNow')}
          </button>
          <button 
            onClick={handleWishlistToggle}
            className={`${inWishlist ? 'bg-pink-600 hover:scale-105' : 'bg-gray-300 hover:scale-105'} transition text-white font-semibold px-2 py-1 rounded-md`}
            title={inWishlist ? (language === 'en' ? t('removeFromWishlist') : 'पसंद से हटाएं') : (language === 'en' ? t('addToWishlist') : 'पसंद में जोड़ें')}
          >
            <Heart className="w-3 h-3" fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Stock indicator */}
        {productStock > 0 && productStock <= 5 && (
          <div className="mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
            {t('onlyLeft').replace('{{count}}', productStock.toString())}
          </div>
        )}
      </div>
    </div>
  );
}