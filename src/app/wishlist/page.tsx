'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Heart, X, ShoppingCart, Star } from 'lucide-react';

export default function WishlistPage() {
  const { state: wishlistState, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

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
        items: 'items',
        loading: 'Loading...',
        inStock: 'In Stock',
        outOfStock: 'Out of Stock'
      },
      hi: {
        wishlistTitle: 'इच्छा-सूची',
        emptyWishlist: 'आपकी इच्छा-सूची खाली है',
        continueShopping: 'खरीदारी जारी रखें',
        moveToCart: 'कार्ट में ले जाएँ',
        removeFromWishlist: 'इच्छा-सूची से हटाएं',
        wishlistEmptyMessage: 'आपकी इच्छा-सूची खाली है। जो उत्पाद आप पसंद करते हैं उन्हें जोड़ना शुरू करें!',
        items: 'आइटम',
        loading: 'लोड हो रहा है...',
        inStock: 'स्टॉक में',
        outOfStock: 'स्टॉक समाप्त'
      }
    };
    
    return translations[language][key] || key;
  };

  // Fetch product details for wishlist items
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistState.items.length > 0) {
        try {
          // Fetch all products
          const response = await fetch('/api/products');
          const data = await response.json();
          
          if (data.success) {
            // Filter products that are in the wishlist
            const wishlistProductIds = wishlistState.items.map(item => item.productId);
            const wishlistProducts = data.products.filter((product: any) => 
              wishlistProductIds.includes(product.id)
            );
            setProducts(wishlistProducts);
          }
        } catch (error) {
          console.error('Error fetching wishlist products:', error);
        }
      } else {
        setProducts([]);
      }
    };

    fetchWishlistProducts();
  }, [wishlistState.items]);

  if (wishlistState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-24 text-gray-400" />
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
        {products.map((product) => (
          <WishlistItem 
            key={product.id} 
            product={product} 
            onRemove={removeFromWishlist}
            onMoveToCart={addToCart}
            language={language}
            t={t} // Pass the t function as a prop
          />
        ))}
      </div>
    </div>
  );
}

function WishlistItem({ product, onRemove, onMoveToCart, language, t }: { 
  product: any; 
  onRemove: (productId: string) => void;
  onMoveToCart: (productId: string, quantity?: number) => Promise<void>;
  language: string;
  t: (key: string) => string; // Add t function type
}) {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const discountPercentage = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  
  const handleRemove = () => {
    onRemove(product.id);
  };
  
  const handleMoveToCart = async () => {
    setLoading(true);
    try {
      // Add to cart using the CartContext function
      await onMoveToCart(product.id, 1);
      
      // Then remove from wishlist
      onRemove(product.id);
      
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
            src={product.productImages?.find((img: any) => img.isPrimary)?.url || product.images?.[0] || '/images/products/placeholder.jpg'}
            alt={product.title?.[language] || product.title?.en || product.name || 'Product'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {language === 'en' ? 'No image' : 'कोई छवि नहीं'}
            </span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
            {discountPercentage}% {language === 'en' ? 'OFF' : 'छूट'}
          </div>
        )}
        
        {/* Stock status */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? t('inStock') : t('outOfStock')}
          </span>
        </div>
        
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
          {product.title?.[language] || product.title?.en || product.name || 'Product'}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'fill-none stroke-current'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            ({product.review_count || product.reviewCount || 0})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center mt-2">
          <span className="flipkart-product-price">₹{product.price?.toLocaleString() || 0}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
              ₹{product.original_price?.toLocaleString() || 0}
            </span>
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
              <>
                <ShoppingCart className="w-4 h-4 mr-1 inline" />
                {language === 'en' ? t('moveToCart') : 'कार्ट में ले जाएँ'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}