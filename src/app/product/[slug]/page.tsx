'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, state: wishlistState } = useWishlist();
  const { language } = useLanguage();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);

  // Resolve params for Next.js 15.5.4
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!resolvedParams?.slug) return;
      
      try {
        setLoading(true);
        // Use the correct API endpoint structure
        const response = await fetch(`/api/products/${resolvedParams.slug}`);
        const data = await response.json();
        
        if (data.error) {
          console.error('Product not found:', data.error);
          setProduct(null);
        } else {
          setProduct(data);
          setSelectedVariant({
            size: data.variants?.size?.[0] || '',
            color: data.variants?.color?.[0] || ''
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams?.slug) {
      fetchProduct();
    }
  }, [resolvedParams?.slug]);

  // Check if product is in wishlist
  const inWishlist = wishlistState.items.some((item: any) => item.productId === product?.id);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity, { 
        slug: product.slug,
        title: product.title?.[language] || product.title?.en || product.name || 'Product',
        price: product.price
      });
      
      // Show notification
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(
          language === 'en' ? 'Added to cart ✅' : 'कार्ट में जोड़ा गया ✅',
          'success'
        );
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product.id, quantity, { 
        slug: product.slug,
        title: product.title?.[language] || product.title?.en || product.name || 'Product',
        price: product.price
      });
      // Redirect to checkout with product slug
      router.push(`/checkout?slug=${product.slug || resolvedParams?.slug}`);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      const productData = {
        id: product.id,
        slug: product.slug,
        title: product.title?.[language] || product.title?.en || product.name || 'Product',
        price: product.price,
        image: product.images?.[0] || '/images/products/placeholder.jpg'
      };
      
      if (inWishlist) {
        removeFromWishlist(product.id);
        if (typeof window !== 'undefined' && (window as any).showNotification) {
          (window as any).showNotification(
            language === 'en' ? 'Removed from wishlist ✅' : 'इच्छा-सूची से हटा दिया गया ✅',
            'success'
          );
        }
      } else {
        addToWishlist(product.id);
        if (typeof window !== 'undefined' && (window as any).showNotification) {
          (window as any).showNotification(
            language === 'en' ? 'Added to wishlist ❤️' : 'इच्छा-सूची में जोड़ा गया ❤️',
            'success'
          );
        }
      }
    }
  };

  const handleShare = async () => {
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';
    const productName = product?.title?.[language] || product?.title?.en || product?.name || 'Product';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out this product: ${productName}`,
          url: productUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to copy URL
        handleCopyUrl();
      }
    } else {
      // Fallback to copy URL
      handleCopyUrl();
    }
  };

  const handleCopyUrl = () => {
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(productUrl).then(() => {
        if ((window as any).showNotification) {
          (window as any).showNotification(
            language === 'en' ? 'Link copied to clipboard! ✅' : 'लिंक क्लिपबोर्ड पर कॉपी किया गया! ✅',
            'success'
          );
        }
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        loading: 'Loading...',
        productNotFound: 'Sorry, this product is unavailable or may have been removed.',
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        addToWishlist: 'Add to Wishlist',
        removeFromWishlist: 'Remove from Wishlist',
        share: 'Share',
        material: 'Category',
        dimensions: 'Specifications',
        inStock: 'In Stock',
        outOfStock: 'Out of Stock',
        onlyLeft: 'Only {{count}} left',
        size: 'Size',
        color: 'Color',
        quantity: 'Quantity',
        productDetails: 'Product Description',
        description: 'Product Description',
        artisan: 'Seller',
        moreFromArtisan: 'More from this seller',
        customerReviews: 'Reviews',
        writeReview: 'Write a Review',
        relatedProducts: 'Related Products',
        freeDelivery: 'Delivery: Within 24–48 hours',
        daysReturn: 'Returns: Easy 2-day replacement on damaged items',
        warranty: '100% Satisfaction Guarantee',
        soldBy: 'Sold by',
        ingredients: 'Ingredients: 100% Natural and Fresh',
        storage: 'Storage: Store in a cool, dry place'
      },
      hi: {
        loading: 'लोड हो रहा है...',
        productNotFound: 'क्षमा करें, यह उत्पाद अनुपलब्ध है या हटा दिया गया हो सकता है।',
        addToCart: 'कार्ट में डालें',
        buyNow: 'अभी खरीदें',
        addToWishlist: 'पसंद में जोड़ें',
        removeFromWishlist: 'पसंद से हटाएं',
        share: 'साझा करें',
        material: 'श्रेणी',
        dimensions: 'विनिर्देश',
        inStock: 'स्टॉक में',
        outOfStock: 'स्टॉक समाप्त',
        onlyLeft: 'केवल {{count}} बचे हैं',
        size: 'आकार',
        color: 'रंग',
        quantity: 'मात्रा',
        productDetails: 'उत्पाद विवरण',
        description: 'उत्पाद विवरण',
        artisan: 'विक्रेता',
        moreFromArtisan: 'इस विक्रेता से अधिक',
        customerReviews: 'समीक्षाएँ',
        writeReview: 'समीक्षा लिखें',
        relatedProducts: 'संबंधित उत्पाद',
        freeDelivery: 'डिलीवरी: 24-48 घंटों के भीतर',
        daysReturn: 'वापसी: क्षतिग्रस्त वस्तुओं पर 2-दिन की आसान प्रतिस्थापन',
        warranty: '100% संतुष्टि गारंटी',
        soldBy: 'द्वारा बेचा गया',
        ingredients: 'सामग्री: 100% प्राकृतिक और ताजा',
        storage: 'भंडारण: एक ठंडे, सूखे स्थान पर संग्रहित करें'
      }
    };
    
    return translations[language][key] || key;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-xl font-semibold">{t('productNotFound')}</p>
          <Link href="/products" className="flipkart-button mt-4 inline-block px-6 py-3">
            {language === 'en' ? 'Back to Products' : 'उत्पादों पर वापस जाएं'}
          </Link>
        </div>
      </div>
    );
  }

  // Fix for undefined images - use productImages from API or fallback to empty array
  // Process images to use absolute URLs
  let productImages = product.productImages || product.images || [];
  
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
  
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          {language === 'en' ? 'Home' : 'होम'}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/products" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          {language === 'en' ? 'Products' : 'उत्पाद'}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600 dark:text-gray-400">
          {product.title?.[language] || product.title_en || product.title?.en || product.name || 'Product'}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-square relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {!imageError && productImages[selectedImage] ? (
              <Image
                src={productImages[selectedImage]}
                alt={product.title?.[language] || product.title_en || product.title?.en || product.name || 'Product'}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  {language === 'en' ? 'Product Image' : 'उत्पाद छवि'}
                </span>
              </div>
            )}
          </div>
          
          {/* Thumbnail images */}
          {productImages.length > 1 && (
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {productImages.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 aspect-square w-20 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <Image
                    src={image}
                    alt={`${product.title?.[language] || product.title_en || product.title?.en || product.name || 'Product'} ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover"
                    onError={(e: any) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/products/placeholder.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {product.title?.[language] || product.title_en || product.title?.en || product.name}
            </h1>
            
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-none stroke-current'}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {product.rating} ({product.reviewCount} {language === 'en' ? 'reviews' : 'समीक्षाएँ'})
              </span>
            </div>
            
            <div className="mt-4 flex items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="ml-2 text-lg text-gray-500 dark:text-gray-400 line-through">
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    {discountPercentage}% {language === 'en' ? 'OFF' : 'छूट'}
                  </span>
                </>
              )}
            </div>
            
            {product.stock > 0 ? (
              <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {t('inStock')}
                </span>
                {product.stock <= 5 && (
                  <span className="ml-4 text-orange-600 dark:text-orange-400">
                    {t('onlyLeft').replace('{{count}}', product.stock.toString())}
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-2 flex items-center text-red-600 dark:text-red-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {t('outOfStock')}
                </span>
              </div>
            )}
          </div>
          
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                <span className="text-sm">{t('freeDelivery')}</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                <span className="text-sm">{t('daysReturn')}</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                <span className="text-sm">{t('warranty')}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t('description')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {product.description?.[language] || product.description_en || product.description}
            </p>
          </div>
          
          {/* Variants */}
          {product.variants && (
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.variants.size && product.variants.size.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('size')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.size.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                          className={`px-4 py-2 text-sm border rounded-md ${
                            selectedVariant?.size === size
                              ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.variants.color && product.variants.color.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('color')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.color.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                          className={`px-4 py-2 text-sm border rounded-md ${
                            selectedVariant?.color === color
                              ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Quantity and Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center">
              <label className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('quantity')}
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-3 py-2 text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.stock || 10)}
                  className="px-3 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flipkart-button flex items-center px-6 py-2 disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('addToCart')}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flipkart-button-secondary flex items-center px-6 py-2 disabled:opacity-50"
              >
                {t('buyNow')}
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full ${
                  inWishlist
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
              >
                <Heart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                title={t('share')}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <div className="flipkart-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('productDetails')}
            </h2>
            
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {product.description?.[language] || product.description_en || product.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {t('material')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">{product.category?.name?.[language] || product.category?.name?.en}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {t('dimensions')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">{product.dimensions || 'N/A'}</p>
                </div>
                
                {product.artisan && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {t('soldBy')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{product.artisan.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Artisan Info */}
        {product.artisan && (
          <div>
            <div className="flipkart-card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('artisan')}
              </h2>
              
              <div className="flex items-center">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-gray-700 dark:text-gray-300 font-bold">
                    {product.artisan.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {product.artisan.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {product.artisan.location || product.artisan.village}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.artisan?.rating || 0) ? 'fill-current' : 'fill-none stroke-current'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                      {product.artisan.rating || 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {product.artisan.totalProducts || 0} {language === 'en' ? 'products' : 'उत्पाद'}
                  </p>
                </div>
              </div>
              
              <Link 
                href={`/artisan/${product.artisan.id}`} 
                className="flipkart-button w-full mt-4 py-2 text-center text-sm"
              >
                {language === 'en' ? 'View Details' : 'विवरण देखें'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}