'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

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
  const { addToCart } = useCart();
  const { state: wishlistState, addToWishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products
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
          
          // Collect all unique product images
          const allImages: string[] = [];
          transformedProducts.forEach((product: any) => {
            if (product.productImages && product.productImages.length > 0) {
              product.productImages.forEach((img: any) => {
                if (!allImages.includes(img.url)) {
                  allImages.push(img.url);
                }
              });
            } else if (product.images && product.images.length > 0) {
              product.images.forEach((img: string) => {
                if (!allImages.includes(img)) {
                  allImages.push(img);
                }
              });
            }
          });
          
          setProductImages(allImages);
        }
      } catch (error) {
        console.error('Error fetching women\'s products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const isInWishlist = (productId: string) => {
    return wishlistState.items.some(item => item.productId === productId);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product.id, 1);
  };

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

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

        {/* Collection Images */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'en' ? 'Collection Gallery' : 'संग्रह गैलरी'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              '/images/women collection/Golden_Bangles_Radiant_Arm_Macro.png',
              '/images/women collection/Golden_Glamour_Wrist.png',
              '/images/women collection/Golden_Radiance_Portrait.png',
              '/images/women collection/Golden_Ring_South_Asian_Hand.png',
              '/images/women collection/Radiant_South_Asian_Elegance.png',
              '/images/women collection/South_Asian_Luxury_Bracelet_Close-up.png'
            ].map((image, index) => (
              <div key={index} className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={image}
                  alt={`${language === 'en' ? "Women's Collection" : "महिला संग्रह"} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* All Product Images with Action Buttons */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'en' ? 'All Women\'s Products' : 'सभी महिला उत्पाद'}
          </h2>
          {productImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {productImages.map((image, index) => {
                // Find the product that has this image
                const product = products.find(p => 
                  p.productImages.some(img => img.url === image) || 
                  p.images.includes(image)
                );
                
                return (
                  <div key={index} className="relative group">
                    <div className="relative h-48 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <Image
                        src={image}
                        alt={`${language === 'en' ? "Product" : "उत्पाद"} ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e: any) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/products/placeholder.jpg';
                        }}
                      />
                      
                      {/* Overlay with action buttons */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {product && (
                            <>
                              <button
                                onClick={() => handleToggleWishlist(product)}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-colors"
                                aria-label={language === 'en' ? 'Add to wishlist' : 'इच्छा सूची में जोड़ें'}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
                                />
                              </button>
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-colors"
                                aria-label={language === 'en' ? 'Add to cart' : 'कार्ट में जोड़ें'}
                              >
                                <ShoppingCart className="w-4 h-4 text-gray-700" />
                              </button>
                              <Link 
                                href={product ? `/product/${product.slug}` : '#'}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-colors"
                                aria-label={language === 'en' ? 'View details' : 'विवरण देखें'}
                              >
                                <Eye className="w-4 h-4 text-gray-700" />
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <div className="mb-4">
                <span className="text-6xl">🔍</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'en' 
                  ? 'No product images found' 
                  : 'कोई उत्पाद चित्र नहीं मिला'}
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'en' ? 'Product Details' : 'उत्पाद विवरण'}
          </h2>
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
                    <button
                      onClick={() => handleToggleWishlist(product)}
                      className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition-colors"
                      aria-label={language === 'en' ? 'Add to wishlist' : 'इच्छा सूची में जोड़ें'}
                    >
                      <Heart 
                        className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
                      />
                    </button>
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
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-amber-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-amber-700 transition-colors flex items-center justify-center"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {language === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें'}
                      </button>
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-sm hover:bg-gray-300 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {language === 'en' ? 'Buy Now' : 'अभी खरीदें'}
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