'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { artisans } from '@/data/artisans';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/product/ProductCard';

interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', content: '' });
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const slug = params.slug as string;
    const foundProduct = products.find(p => p.slug === slug);
    
    if (!foundProduct) {
      router.push('/404');
      return;
    }

    setProduct(foundProduct);
    
    // Get related products from same category
    const related = products
      .filter(p => p.categoryId === foundProduct.categoryId && p.id !== foundProduct.id)
      .slice(0, 4);
    setRelatedProducts(related);
    
    // Mock reviews data
    const mockReviews: Review[] = [
      {
        id: '1',
        userName: 'John Doe',
        rating: 5,
        title: 'Beautiful craftsmanship!',
        content: 'The quality of this tribal art piece is exceptional. The details are intricate and the colors are vibrant. Highly recommended!',
        date: '2024-01-15'
      },
      {
        id: '2',
        userName: 'Jane Smith',
        rating: 4,
        title: 'Great product',
        content: 'I love this artwork. It adds a unique touch to my living room. Shipping was fast and packaging was secure.',
        date: '2024-01-10'
      }
    ];
    setReviews(mockReviews);
    
    setLoading(false);
  }, [params.slug, router]);

  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        customerReviews: "Customer Reviews",
        reviewFormTitle: "Write a Review",
        rating: "Rating",
        reviewTitle: "Review Title",
        reviewDescription: "Review Description",
        submitReview: "Submit Review",
        noReviews: "No reviews yet. Be the first to review this product!",
        emptyReviewTitle: "Review title is required",
        emptyReviewContent: "Review content is required",
        productDescription: "Handcrafted by skilled Pachmarhi artisans, this [product type] reflects centuries of tradition and artistry.",
        productDescription2: "Perfect for gifting or decorating your home with authentic tribal charm.",
        material: "Material",
        dimensions: "Dimensions",
        weight: "Weight",
        colorOptions: "Color Options",
        addToCart: "Add to Cart",
        addToWishlist: "Add to Wishlist"
      }
    };
    
    return translations[language][key] || key;
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      alert(`${product.title.en} added to cart!`);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product.id);
      }
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.title.trim()) {
      alert(t('emptyReviewTitle'));
      return;
    }
    
    if (!newReview.content.trim()) {
      alert(t('emptyReviewContent'));
      return;
    }
    
    const review: Review = {
      id: `${reviews.length + 1}`,
      userName: 'You',
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, title: '', content: '' });
  };

  const getCategory = () => {
    return categories.find(c => c.id === product?.categoryId);
  };

  const getArtisan = () => {
    return artisans.find(a => a.id === product?.artisanId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const category = getCategory();
  const artisan = getArtisan();
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-amber-600">Categories</Link>
            <span>/</span>
            {category && (
              <>
                <Link href={`/category/${category.slug}`} className="hover:text-amber-600">
                  {category.name.en}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-800 dark:text-gray-200">{product.title.en}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square relative overflow-hidden rounded-lg bg-white shadow-lg">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title.en}
                  fill
                  className="object-cover"
                  onError={(e: any) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/products/placeholder.jpg';
                  }}
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index 
                          ? 'border-amber-500' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title.en} ${index + 1}`}
                        fill
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

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.title.en}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-none stroke-current'}`}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                  {artisan && (
                    <span className="text-sm text-amber-600">
                      by <Link href={`/artisan/${artisan.slug}`} className="hover:underline font-medium">
                        {artisan.name}
                      </Link>
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-amber-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Inclusive of all taxes • FREE shipping on orders over ₹500
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('productDescription').replace('[product type]', product.title.en.toLowerCase())}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
                  {t('productDescription2')}
                </p>
              </div>

              {/* Materials & Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Specifications / Details</h3>
                <div className="space-y-2">
                  {product.material && (
                    <div className="flex">
                      <span className="font-medium text-gray-700 dark:text-gray-300 w-24">{t('material')}:</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.material}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex">
                      <span className="font-medium text-gray-700 dark:text-gray-300 w-24">{t('dimensions')}:</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.dimensions}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex">
                      <span className="font-medium text-gray-700 dark:text-gray-300 w-24">{t('weight')}:</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.weight}g</span>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex">
                      <span className="font-medium text-gray-700 dark:text-gray-300 w-24">{t('colorOptions')}:</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.colors.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-gray-900 dark:text-white font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('addToCart')}
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                      isInWishlist(product.id)
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Buy */}
              <Link
                href="/checkout"
                className="block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Buy Now
              </Link>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Authentic Handmade</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">7-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Secure Packaging</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {t('customerReviews')}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Review Form */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('reviewFormTitle')}
                  </h3>
                  
                  <form onSubmit={handleReviewSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('rating')}
                        </label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="text-2xl focus:outline-none"
                            >
                              <span className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('reviewTitle')}
                        </label>
                        <input
                          type="text"
                          value={newReview.title}
                          onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Give your review a title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('reviewDescription')}
                        </label>
                        <textarea
                          rows={4}
                          value={newReview.content}
                          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Share your experience with this product"
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                      >
                        {t('submitReview')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Reviews List */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {review.title}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {review.date}
                            </span>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'fill-current' : 'fill-none'}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              by {review.userName}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400">
                            {review.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t('noReviews')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}