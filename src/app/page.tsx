'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { categories as staticCategories } from '@/data/categories';
// Add missing icon imports
import { Star, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import BannerSlider from '@/components/BannerSlider';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Home() {
  const { language } = useLanguage(); // Get language from context
  
  // Mock products data
  const mockProducts = [
    {
      id: '1',
      slug: 'herbal-powder-turmeric',
      title: {
        en: 'Turmeric Herbal Powder',
        hi: 'हल्दी हर्बल पाउडर'
      },
      price: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4.5,
      reviewCount: 12,
      images: ['/images/products/placeholder.jpg'],
      featured: true,
      bestSeller: false,
      newArrival: true,
      trending: false
    },
    {
      id: '2',
      slug: 'organic-honey-wildforest',
      title: {
        en: 'Wild Forest Organic Honey',
        hi: 'वन्य वन जैविक शहद'
      },
      price: 499,
      originalPrice: 599,
      discount: 17,
      rating: 4.8,
      reviewCount: 8,
      images: ['/images/products/placeholder.jpg'],
      featured: true,
      bestSeller: true,
      newArrival: false,
      trending: true
    },
    {
      id: '3',
      slug: 'handmade-soap-lavender',
      title: {
        en: 'Lavender Handmade Soap',
        hi: 'लैवेंडर हस्तनिर्मित साबुन'
      },
      price: 799,
      originalPrice: 999,
      discount: 20,
      rating: 4.6,
      reviewCount: 15,
      images: ['/images/products/placeholder.jpg'],
      featured: true,
      bestSeller: false,
      newArrival: true,
      trending: false
    },
    {
      id: '4',
      slug: 'ayurvedic-powder-triphal',
      title: {
        en: 'Triphala Ayurvedic Powder',
        hi: 'त्रिफला आयुर्वेदिक पाउडर'
      },
      price: 1299,
      originalPrice: 1499,
      discount: 13,
      rating: 4.9,
      reviewCount: 6,
      images: ['/images/products/placeholder.jpg'],
      featured: true,
      bestSeller: true,
      newArrival: false,
      trending: true
    },
    {
      id: '5',
      slug: 'organic-candy-assorted',
      title: {
        en: 'Assorted Organic Candy',
        hi: 'मिश्रित जैविक कैंडी'
      },
      price: 899,
      originalPrice: 1099,
      discount: 18,
      rating: 4.7,
      reviewCount: 9,
      images: ['/images/products/placeholder.jpg'],
      featured: false,
      bestSeller: true,
      newArrival: false,
      trending: false
    },
    {
      id: '6',
      slug: 'herbal-powder-cumin',
      title: {
        en: 'Cumin Herbal Powder',
        hi: 'जीरा हर्बल पाउडर'
      },
      price: 599,
      originalPrice: 699,
      discount: 14,
      rating: 4.4,
      reviewCount: 11,
      images: ['/images/products/placeholder.jpg'],
      featured: false,
      bestSeller: false,
      newArrival: true,
      trending: true
    },
    {
      id: '7',
      slug: 'handmade-soap-neem',
      title: {
        en: 'Neem Handmade Soap',
        hi: 'नीम हस्तनिर्मित साबुन'
      },
      price: 1199,
      originalPrice: 1399,
      discount: 14,
      rating: 4.8,
      reviewCount: 7,
      images: ['/images/products/placeholder.jpg'],
      featured: false,
      bestSeller: true,
      newArrival: false,
      trending: false
    },
    {
      id: '8',
      slug: 'ayurvedic-blend-digestive',
      title: {
        en: 'Digestive Ayurvedic Blend',
        hi: 'पाचन आयुर्वेदिक मिश्रण'
      },
      price: 1499,
      originalPrice: 1799,
      discount: 17,
      rating: 4.6,
      reviewCount: 13,
      images: ['/images/products/placeholder.jpg'],
      featured: false,
      bestSeller: false,
      newArrival: true,
      trending: true
    }
  ];

  const [categoryImageErrors, setCategoryImageErrors] = useState<Record<string, boolean>>({});
  const [artisanImageErrors, setArtisanImageErrors] = useState<Record<string, boolean>>({});
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products
        const featuredResponse = await fetch('/api/products?featured=true&limit=8');
        const featuredData = await featuredResponse.json();
        
        // Fetch best sellers
        const bestSellersResponse = await fetch('/api/products?bestSeller=true&limit=8');
        const bestSellersData = await bestSellersResponse.json();
        
        // Fetch new arrivals
        const newArrivalsResponse = await fetch('/api/products?newArrival=true&limit=8');
        const newArrivalsData = await newArrivalsResponse.json();
        
        if (featuredData.success) {
          setFeaturedProducts(featuredData.products);
        }
        
        if (bestSellersData.success) {
          setBestSellers(bestSellersData.products);
        }
        
        if (newArrivalsData.success) {
          setNewArrivals(newArrivalsData.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Use mock data when API fails
        setFeaturedProducts(mockProducts.slice(0, 8));
        setBestSellers(mockProducts.slice(8, 16));
        setNewArrivals(mockProducts.slice(16, 24));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryImageError = (categoryId: string) => {
    setCategoryImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  const handleArtisanImageError = (artisanId: string) => {
    setArtisanImageErrors(prev => ({ ...prev, [artisanId]: true }));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    alert(language === 'en' ? 'Thank you for subscribing!' : 'सदस्यता लेने के लिए धन्यवाद!');
    setEmail('');
  };

  // Mock data for categories and artisans
  const categories = staticCategories;

  const artisans = [
    {
      id: 'priya-sharma',
      slug: 'priya-sharma',
      name: 'Priya Sharma',
      village: 'Mumbai',
      rating: 4.8,
      totalProducts: 24,
      photo: '/images/artisans/arti-priya-sharma.jpg'
    },
    {
      id: 'raj-kumar',
      slug: 'raj-kumar',
      name: 'Raj Kumar',
      village: 'Delhi',
      rating: 4.6,
      totalProducts: 18,
      photo: '/images/artisans/arti-raj-kumar.jpg'
    },
    {
      id: 'anita-desai',
      slug: 'anita-desai',
      name: 'Anita Desai',
      village: 'Bangalore',
      rating: 4.7,
      totalProducts: 15,
      photo: '/images/artisans/arti-anita-desai.jpg'
    },
    {
      id: 'suresh-patel',
      slug: 'suresh-patel',
      name: 'Suresh Patel',
      village: 'Ahmedabad',
      rating: 4.5,
      totalProducts: 20,
      photo: '/images/artisans/arti-suresh-patel.jpg'
    }
  ];

  // Get all categories (for now, we'll show all categories)
  const featuredCategories = categories;

  // Get featured artisans
  const featuredArtisans = artisans.slice(0, 4);

  // Testimonials data (moved inside component to access language)
  const testimonials = [
    {
      id: 1,
      name: "Varun Mehta",
      location: "Delhi, India",
      rating: 5,
      comment: language === 'en' 
        ? "The natural products are of exceptional quality! Each item is carefully crafted with traditional knowledge." 
        : "प्राकृतिक उत्पाद अद्वितीय गुणवत्ता के हैं! प्रत्येक वस्तु पारंपरिक ज्ञान के साथ सावधानीपूर्वक बनाई गई है।"
    },
    {
      id: 2,
      name: "Neha Singh",
      location: "Mumbai, India",
      rating: 4,
      comment: language === 'en' 
        ? "Authentic natural wellness products that promote holistic health. Highly recommended!" 
        : "प्रामाणिक प्राकृतिक स्वास्थ्य उत्पाद जो समग्र स्वास्थ्य को बढ़ावा देते हैं। अत्यधिक अनुशंसित!"
    },
    {
      id: 3,
      name: "Amit Patel",
      location: "Bangalore, India",
      rating: 5,
      comment: language === 'en' 
        ? "Supporting wellness while getting natural handmade products. Win-win!" 
        : "प्राकृतिक हस्तनिर्मित उत्पाद प्राप्त करते समय स्वास्थ्य का समर्थन करना। जीत-जीत!"
    }
  ];

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        heroHeadline: "Welcome to Lettex Marketplace",
        heroSubtext: "Shop groceries, dairy, refined oils, and local products with trusted quality — all from your neighborhood store.",
        shopNow: "Shop Now",
        meetArtisans: "Explore Categories",
        featuredCategories: "Shop by Category",
        featuredArtisans: "Top Picks for You",
        whyChooseUs: "Why Choose Lettex",
        authentic: "Fresh groceries and household products delivered from local sellers.",
        supportArtisans: "Trusted dairy and refined oil brands.",
        securePayments: "Our own Lettex products — pure, reliable, and affordable.",
        ecoFriendly: "Fresh Deals of the Week",
        loading: "Loading...",
        noProducts: "No products available",
        bestSellers: "Bestsellers",
        newArrivals: "New Arrivals",
        viewAll: "View All",
        customerTestimonials: "Customer Testimonials",
        newsletterTitle: "Stay Updated",
        newsletterSubtitle: "Subscribe to our newsletter for the latest updates and offers",
        newsletterPlaceholder: "Enter your email",
        subscribe: "Subscribe",
        footerAbout: "About Us",
        footerAboutText: "Lettex Marketplace brings your neighborhood grocery and dairy shop to your screen — offering refined oils, milk products, fresh groceries, and our own Lettex-branded essentials with unbeatable freshness and quality.",
        footerQuickLinks: "Quick Links",
        footerCustomerService: "Customer Service",
        footerPolicies: "Policies & Info",
        footerContact: "Contact Us",
        footerEmail: "support@lettex.com",
        footerPhone: "+91 9876543210",
        footerAddress: "Mumbai, Maharashtra, India",
        footerRights: "All rights reserved."
      },
      hi: {
        heroHeadline: "लेटेक्स मार्केटप्लेस में आपका स्वागत है",
        heroSubtext: "विश्वसनीय गुणवत्ता के साथ किराने की वस्तुएं, डेयरी, शोधित तेल और स्थानीय उत्पाद खरीदें — आपके पड़ोस की दुकान से।",
        shopNow: "अभी खरीदें",
        meetArtisans: "श्रेणियाँ देखें",
        featuredCategories: "श्रेणी के अनुसार खरीदारी करें",
        featuredArtisans: "आपके लिए शीर्ष चयन",
        whyChooseUs: "लेटेक्स क्यों चुनें?",
        authentic: "स्थानीय विक्रेताओं से ताजा किराने की वस्तुएं और गृह उत्पाद वितरित किए जाते हैं।",
        supportArtisans: "विश्वसनीय डेयरी और शोधित तेल ब्रांड।",
        securePayments: "हमारे स्वयं के लेटेक्स उत्पाद — शुद्ध, विश्वसनीय और सस्ते।",
        ecoFriendly: "सप्ताह के ताजा सौदे",
        loading: "लोड हो रहा है...",
        noProducts: "कोई उत्पाद उपलब्ध नहीं है",
        bestSellers: "सर्वश्रेष्ठ विक्रेता",
        newArrivals: "नए आगमन",
        viewAll: "सभी देखें",
        customerTestimonials: "ग्राहक प्रशंसापत्र",
        newsletterTitle: "अपडेट रहें",
        newsletterSubtitle: "नवीनतम अपडेट और ऑफर के लिए हमारे न्यूज़लेटर की सदस्यता लें",
        newsletterPlaceholder: "अपना ईमेल दर्ज करें",
        subscribe: "सदस्यता लें",
        footerAbout: "हमारे बारे में",
        footerAboutText: "लेटेक्स मार्केटप्लेस आपके स्क्रीन पर आपकी पड़ोस की किराना और डेयरी की दुकान लाता है — शोधित तेल, दूध के उत्पाद, ताजा किराने की वस्तुएं और हमारे स्वयं के लेटेक्स-ब्रांडेड आवश्यक वस्तुएं प्रदान करता है जिनकी ताजगी और गुणवत्ता अतुलनीय है।",
        footerQuickLinks: "त्वरित लिंक",
        footerCustomerService: "ग्राहक सेवा",
        footerPolicies: "नीतियाँ और जानकारी",
        footerContact: "संपर्क करें",
        footerEmail: "support@lettex.com",
        footerPhone: "+91 9876543210",
        footerAddress: "मुंबई, महाराष्ट्र, भारत",
        footerRights: "सर्वाधिकार सुरक्षित।"
      }
    };
    
    return translations[language][key] || key;
  };

  // Render star ratings
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Product Card Component with required actions
  const ProductCard = ({ product }: { product: any }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, state: wishlistState } = useWishlist();
    const { language } = useLanguage();
    
    // Check if product is in wishlist
    const inWishlist = wishlistState.items.some((item: any) => item.productId === product.id);
    
    // Handle different product data structures
    const productTitle = product.title?.[language] || 
                         product.title_en || 
                         product.title?.en || 
                         product.name || 
                         'Product';
    
    const productImages = product.images || 
                          (product.productImages || []).map((img: any) => img.url) || 
                          ['/images/products/placeholder.jpg'];
    
    const handleAddToCart = () => {
      addToCart(product.id, 1);
      // Show notification
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(
          language === 'en' ? 'Added to cart ✅' : 'कार्ट में जोड़ा गया ✅',
          'success'
        );
      }
    };

    const handleBuyNow = () => {
      addToCart(product.id, 1);
      // Redirect to checkout
      window.location.href = '/checkout';
    };

    const handleWishlistToggle = () => {
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
    };
    
    return (
      <div className="flipkart-product-card">
        <Link href={`/product/${product.slug || product.id}`}>
          <div className="flipkart-product-image">
            <Image
              src={productImages[0] || '/images/products/placeholder.jpg'}
              alt={productTitle}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/products/placeholder.jpg';
              }}
              unoptimized={false}
            />
          </div>
        </Link>
        <div className="flipkart-product-info">
          <h3 className="flipkart-product-name">
            <Link href={`/product/${product.slug || product.id}`}>
              {productTitle}
            </Link>
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              {product.rating || 0}
            </span>
            <span className="mx-2">•</span>
            <span>{product.reviewCount || product.review_count || 0} reviews</span>
          </div>
          <div className="flipkart-product-price-container">
            <span className="flipkart-product-price-current">
              ₹{product.price || 0}
            </span>
            {product.originalPrice && (
              <>
                <span className="flipkart-product-price-original">
                  ₹{product.originalPrice}
                </span>
                <span className="flipkart-product-discount">
                  {product.discount || 0}% off
                </span>
              </>
            )}
          </div>
          {/* Product actions */}
          <div className="flipkart-product-actions">
            <button 
              className="flipkart-add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button 
              className="flipkart-buy-now-btn"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button 
              className="flipkart-wishlist-btn"
              onClick={handleWishlistToggle}
            >
              {inWishlist ? '♥' : '♡'} Wishlist
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Category Card Component
  const CategoryCard = ({ category }: { category: any }) => {
    // Removed SVG check to prevent optimization issues
    
    return (
      <Link
        href={`/category/${category.slug}`}
        className="group block"
      >
        <div className="flipkart-card overflow-hidden">
          <div className="aspect-square relative overflow-hidden">
            {!categoryImageErrors[category.id] ? (
              <Image
                src={category.image}
                alt={category.name[language]}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleCategoryImageError(category.id)}
                unoptimized={true}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#5C4033] to-[#FFD54F] flex items-center justify-center">
                <span className="text-white text-sm text-center px-4">
                  {category.name[language]}<br />
                  <span className="text-xs opacity-75">Category Image</span>
                </span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[#5C4033] mb-1 group-hover:text-[#4a342d] transition-colors">
              {category.name[language]}
            </h3>
            <p className="text-gray-600 text-sm">{category.productCount || 0} items</p>
          </div>
        </div>
      </Link>
    );
  };

  // Artisan Card Component
  const ArtisanCard = ({ artisan }: { artisan: any }) => {
    // Removed SVG check to prevent optimization issues
    
    return (
      <Link
        href={`/artisan/${artisan.slug}`}
        className="group block"
      >
        <div className="flipkart-card overflow-hidden">
          <div className="aspect-square relative overflow-hidden">
            {!artisanImageErrors[artisan.id] ? (
              <Image
                src={artisan.photo || `/images/artisans/arti-${artisan.slug.replace(' ', '-')}.jpg`}
                alt={artisan.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleArtisanImageError(artisan.id)}
                // Removed unoptimized prop for SVG files
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#5C4033] to-[#FFD54F] flex items-center justify-center">
                <span className="text-white text-sm text-center px-4">
                  {artisan.name}<br />
                  <span className="text-xs opacity-75">Artisan Photo</span>
                </span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[#5C4033] mb-1 group-hover:text-[#4a342d] transition-colors">
              {artisan.name}
            </h3>
            <p className="text-[#FFD54F] text-sm mb-2">{artisan.village || artisan.location}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{artisan.totalProducts || 0} products</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-gray-600 ml-1">{artisan.rating || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Hero Section - Flipkart style with Banner Slider */}
      <div className="relative flipkart-hero">
        <div className="container mx-auto px-4 py-8">
          <BannerSlider />
        </div>
      </div>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="flipkart-section-title">
          {t('featuredCategories')}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {featuredCategories.map((category) => (
            <CategoryCard 
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="flipkart-section-title mb-0">
              {language === 'en' ? 'Featured Products' : 'विशेष उत्पाद'}
            </h2>
            <Link 
              href="/products?featured=true" 
              className="text-[#5C4033] hover:text-[#4a342d] font-medium"
            >
              {t('viewAll')} →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('loading')}
              </p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="flipkart-product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('noProducts')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bestsellers */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="flipkart-section-title mb-0">
            {t('bestSellers')}
          </h2>
          <Link 
            href="/products?bestSeller=true" 
            className="text-[#5C4033] hover:text-[#4a342d] font-medium"
          >
            {t('viewAll')} →
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {t('loading')}
            </p>
          </div>
        ) : bestSellers.length > 0 ? (
          <div className="flipkart-product-grid">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {t('noProducts')}
            </p>
          </div>
        )}
      </div>

      {/* New Arrivals */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="flipkart-section-title mb-0">
              {t('newArrivals')}
            </h2>
            <Link 
              href="/products?newArrival=true" 
              className="text-[#5C4033] hover:text-[#4a342d] font-medium"
            >
            {t('viewAll')} →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('loading')}
              </p>
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="flipkart-product-grid">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('noProducts')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="flipkart-section-title">
          {t('customerTestimonials')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flipkart-card p-6">
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Artisans */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="flipkart-section-title">
          {t('featuredArtisans')}
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl">
          {language === 'en' 
            ? 'Discover the talented wellness experts who create these beautiful natural products' 
            : 'उन प्रतिभाशाली स्वास्थ्य विशेषज्ञों की खोज करें जो ये सुंदर प्राकृतिक उत्पाद बनाते हैं'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtisans.map((artisan) => (
            <ArtisanCard 
              key={artisan.id}
              artisan={artisan}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/about" 
            className="bg-primary hover:bg-[#4a342d] text-white font-semibold py-3 px-6 rounded-sm transition-colors inline-block"
          >
            {language === 'en' ? 'Learn More About Us' : 'हमारे बारे में और जानें'}
          </Link>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-[#f5f0eb] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="flipkart-section-title text-center">
              {t('newsletterTitle')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('newsletterSubtitle')}
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#5C4033] focus:border-[#5C4033]"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-[#4a342d] text-white font-semibold py-3 px-6 rounded-sm transition-colors"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="flipkart-section-title">
          {t('whyChooseUs')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flipkart-card p-6 text-center">
            <div className="w-12 h-12 bg-[#5C4033] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#FFD54F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('authentic')}</h3>
          </div>
          
          <div className="flipkart-card p-6 text-center">
            <div className="w-12 h-12 bg-[#5C4033] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#FFD54F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('supportArtisans')}</h3>
          </div>
          
          <div className="flipkart-card p-6 text-center">
            <div className="w-12 h-12 bg-[#5C4033] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#FFD54F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('securePayments')}</h3>
          </div>
          
          <div className="flipkart-card p-6 text-center">
            <div className="w-12 h-12 bg-[#5C4033] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#FFD54F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('ecoFriendly')}</h3>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flipkart-footer">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* About Us */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">{t('footerAbout')}</h3>
              <p className="text-gray-400 mb-4">
                {t('footerAboutText')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footerQuickLinks')}</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="flipkart-footer-link">{language === 'en' ? 'About Us' : 'हमारे बारे में'}</Link></li>
                <li><Link href="/products" className="flipkart-footer-link">{language === 'en' ? 'Products' : 'उत्पाद'}</Link></li>
                <li><Link href="/categories" className="flipkart-footer-link">{language === 'en' ? 'Categories' : 'श्रेणियाँ'}</Link></li>
                <li><Link href="/contact" className="flipkart-footer-link">{language === 'en' ? 'Contact Us' : 'संपर्क करें'}</Link></li>
              </ul>
            </div>
            
            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footerCustomerService')}</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="flipkart-footer-link">{language === 'en' ? 'FAQ' : 'सामान्य प्रश्न'}</Link></li>
                <li><Link href="/shipping-policy" className="flipkart-footer-link">{language === 'en' ? 'Shipping Policy' : 'शिपिंग नीति'}</Link></li>
                <li><Link href="/refund-policy" className="flipkart-footer-link">{language === 'en' ? 'Returns & Refunds' : 'वापसी और धनवापसी'}</Link></li>
                <li><Link href="/support" className="flipkart-footer-link">{language === 'en' ? 'Support' : 'समर्थन'}</Link></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footerContact')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <span className="text-gray-400">{t('footerEmail')}</span>
                </li>
                <li className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <span className="text-gray-400">{t('footerPhone')}</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <span className="text-gray-400">{t('footerAddress')}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Lettex. {t('footerRights')}</p>
          </div>
        </div>
      </footer>
    </>
  );
}