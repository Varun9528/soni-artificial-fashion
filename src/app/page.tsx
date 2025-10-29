'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { collections } from '@/data/collections';
import { Star, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Sparkles, Award, Shield, Leaf } from 'lucide-react';
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Home() {
  const { language } = useLanguage(); // Get language from context
  
  const [categoryImageErrors, setCategoryImageErrors] = useState<Record<string, boolean>>({});
  const [artisanImageErrors, setArtisanImageErrors] = useState<Record<string, boolean>>({});
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collectionsWithCounts, setCollectionsWithCounts] = useState<any[]>(collections);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        // Fetch featured products
        const featuredResponse = await fetch('/api/products?featured=true&limit=8');
        const featuredData = await featuredResponse.json();
        
        // Fetch best sellers
        const bestSellersResponse = await fetch('/api/products?bestSeller=true&limit=8');
        const bestSellersData = await bestSellersResponse.json();
        
        // Fetch new arrivals
        const newArrivalsResponse = await fetch('/api/products?newArrival=true&limit=8');
        const newArrivalsData = await newArrivalsResponse.json();
        
        // Fetch product counts for collections
        const menCollectionResponse = await fetch('/api/products?category=cat-006');
        const menCollectionData = await menCollectionResponse.json();
        
        const womenCollectionResponse = await fetch('/api/products?category=cat-007');
        const womenCollectionData = await womenCollectionResponse.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.categories);
        }
        
        if (featuredData.success) {
          setFeaturedProducts(featuredData.products);
        }
        
        if (bestSellersData.success) {
          setBestSellers(bestSellersData.products);
        }
        
        if (newArrivalsData.success) {
          setNewArrivals(newArrivalsData.products);
        }
        
        // Update collections with actual product counts
        const updatedCollections = collections.map(collection => {
          if (collection.id === 'cat-006') {
            return {
              ...collection,
              productCount: menCollectionData.pagination?.totalProducts || 0
            };
          } else if (collection.id === 'cat-007') {
            return {
              ...collection,
              productCount: womenCollectionData.pagination?.totalProducts || 0
            };
          }
          return collection;
        });
        
        setCollectionsWithCounts(updatedCollections);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Use mock data when API fails
        setCategories([]);
        setFeaturedProducts([]);
        setBestSellers([]);
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Mock data for artisans
  const artisans = [
    {
      id: 'soni-designer',
      slug: 'soni-designer',
      name: 'Soni Designer',
      village: 'Delhi',
      rating: 4.9,
      totalProducts: 35,
      photo: '/images/artisans/soni-designer.jpg'
    },
    {
      id: 'priya-crafts',
      slug: 'priya-crafts',
      name: 'Priya Crafts',
      village: 'Mumbai',
      rating: 4.7,
      totalProducts: 28,
      photo: '/images/artisans/priya-crafts.jpg'
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
      name: "Priya Sharma",
      location: "Delhi, India",
      rating: 5,
      comment: language === 'en' 
        ? "Absolutely stunning jewelry collection! The craftsmanship is exceptional and the gold plating looks so luxurious." 
        : "पूरी तरह से शानदार आभूषण संग्रह! कारीगरी अद्वितीय है और सोने की प्लेटिंग इतनी भव्य लगती है।"
    },
    {
      id: 2,
      name: "Raj Kumar",
      location: "Mumbai, India",
      rating: 5,
      comment: language === 'en' 
        ? "The quality of artificial jewelry is impressive. Looks just like real gold but at a fraction of the cost!" 
        : "कृत्रिम आभूषण की गुणवत्ता प्रभावशाली है। असली सोने की तरह लगता है लेकिन लागत का केवल एक अंश है!"
    },
    {
      id: 3,
      name: "Anita Desai",
      location: "Bangalore, India",
      rating: 4,
      comment: language === 'en' 
        ? "Beautiful designs and fast delivery. My go-to store for all jewelry needs." 
        : "सुंदर डिज़ाइन और तेज़ डिलीवरी। मेरी सभी आभूषण आवश्यकताओं के लिए मेरी पसंदीदा दुकान।"
    }
  ];

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        heroHeadline: "Exquisite Artificial Jewelry Collection",
        heroSubtext: "Discover premium gold-plated accessories crafted with precision and elegance for every occasion.",
        shopNow: "Shop Collection",
        meetArtisans: "Our Master Craftsmen",
        featuredCategories: "Jewelry Categories",
        featuredArtisans: "Master Craftsmen",
        whyChooseUs: "Why Choose Soni Fashion",
        authentic: "Premium Quality Materials",
        supportArtisans: "Expert Craftsmanship",
        securePayments: "Secure Shopping Experience",
        ecoFriendly: "Trendy & Fashionable Designs",
        loading: "Loading...",
        noProducts: "No products available",
        bestSellers: "Bestsellers",
        newArrivals: "New Arrivals",
        viewAll: "View All",
        customerTestimonials: "Customer Testimonials",
        newsletterTitle: "Stay Updated",
        newsletterSubtitle: "Subscribe to our newsletter for the latest collections and exclusive offers",
        newsletterPlaceholder: "Enter your email",
        subscribe: "Subscribe",
        footerAbout: "About Soni Fashion",
        footerAboutText: "Soni Fashion brings you exquisite artificial jewelry crafted with precision and elegance. Our premium gold-plated accessories are designed to complement your style for every occasion.",
        footerQuickLinks: "Quick Links",
        footerCustomerService: "Customer Service",
        footerPolicies: "Policies & Info",
        footerContact: "Contact Us",
        footerEmail: "support@sonifashion.com",
        footerPhone: "+91 9876543210",
        footerAddress: "Delhi, India",
        footerRights: "All rights reserved."
      },
      hi: {
        heroHeadline: "शानदार कृत्रिम आभूषण संग्रह",
        heroSubtext: "प्रत्येक अवसर के लिए परिशुद्धता और सौंदर्य के साथ निर्मित प्रीमियम सोने की प्लेटेड सहायक उत्पादों की खोज करें।",
        shopNow: "संग्रह खरीदें",
        meetArtisans: "हमारे मास्टर कारीगर",
        featuredCategories: "आभूषण श्रेणियाँ",
        featuredArtisans: "मास्टर कारीगर",
        whyChooseUs: "सोनी फैशन क्यों चुनें?",
        authentic: "प्रीमियम गुणवत्ता सामग्री",
        supportArtisans: "विशेषज्ञ कारीगरी",
        securePayments: "सुरक्षित खरीदारी अनुभव",
        ecoFriendly: "ट्रेंडी और फैशनेबल डिज़ाइन",
        loading: "लोड हो रहा है...",
        noProducts: "कोई उत्पाद उपलब्ध नहीं है",
        bestSellers: "सर्वश्रेष्ठ विक्रेता",
        newArrivals: "नए आगमन",
        viewAll: "सभी देखें",
        customerTestimonials: "ग्राहक प्रशंसापत्र",
        newsletterTitle: "अपडेट रहें",
        newsletterSubtitle: "नवीनतम संग्रह और विशेष प्रस्तावों के लिए हमारे न्यूज़लेटर की सदस्यता लें",
        newsletterPlaceholder: "अपना ईमेल दर्ज करें",
        subscribe: "सदस्यता लें",
        footerAbout: "सोनी फैशन के बारे में",
        footerAboutText: "सोनी फैशन आपको परिशुद्धता और सौंदर्य के साथ निर्मित शानदार कृत्रिम आभूषण प्रदान करता है। हमारे प्रीमियम सोने की प्लेटेड सहायक उत्पाद आपकी शैली को पूरा करने के लिए डिज़ाइन किए गए हैं।",
        footerQuickLinks: "त्वरित लिंक",
        footerCustomerService: "ग्राहक सेवा",
        footerPolicies: "नीतियाँ और जानकारी",
        footerContact: "संपर्क करें",
        footerEmail: "support@sonifashion.com",
        footerPhone: "+91 9876543210",
        footerAddress: "दिल्ली, भारत",
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

  // Category Card Component
  const CategoryCard = ({ category }: { category: any }) => {
    // Removed SVG check to prevent optimization issues
    
    return (
      <Link
        href={`/category/${category.slug}`}
        className="group block"
      >
        <div className="jewelry-category-card overflow-hidden">
          <div className="aspect-square relative overflow-hidden">
            {!categoryImageErrors[category.id] ? (
              <Image
                src={category.image}
                alt={category.name[language]}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleCategoryImageError(category.id)}
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

  // Collection Card Component
  const CollectionCard = ({ collection }: { collection: any }) => {
    const [imageError, setImageError] = useState(false);
    
    // Map the collection slugs to the correct paths
    const getCorrectPath = (originalSlug: string) => {
      if (originalSlug === 'men-collection') return '/api/products?category=cat-006';
      if (originalSlug === 'women-collection') return '/api/products?category=cat-007';
      return `/category/${originalSlug}`;
    };
    
    return (
      <Link
        href={getCorrectPath(collection.slug)}
        className="group block"
      >
        <div className="jewelry-category-card overflow-hidden">
          <div className="aspect-square relative overflow-hidden">
            {!imageError ? (
              <Image
                src={collection.image}
                alt={collection.name[language]}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#5C4033] to-[#FFD54F] flex items-center justify-center">
                <span className="text-white text-sm text-center px-4">
                  {collection.name[language]}<br />
                  <span className="text-xs opacity-75">Collection Image</span>
                </span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[#5C4033] mb-1 group-hover:text-[#4a342d] transition-colors">
              {collection.name[language]}
            </h3>
            <p className="text-gray-600 text-sm">{collection.productCount || 0} items</p>
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
        <div className="jewelry-category-card overflow-hidden">
          <div className="aspect-square relative overflow-hidden">
            {!artisanImageErrors[artisan.id] ? (
              <Image
                src={artisan.photo || `/images/artisans/arti-${artisan.slug.replace(' ', '-')}.jpg`}
                alt={artisan.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleArtisanImageError(artisan.id)}
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

  // Collection Gallery Component for Men's Collection
  const MenCollectionGallery = () => {
    const menCollectionImages = [
      '/images/men collection/Gold_Figaro_Bracelet_Studio_Shot.png',
      '/images/men collection/Indian_Man_Gold_Chain.png',
      '/images/men collection/Indian_Man_Gold_Jewelry_Portrait.png',
      '/images/men collection/Indian_Man_Gold_Pendant_Portrait.png',
      '/images/men collection/Indian_Man_Ring_Macro.png'
    ];
    
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    
    const handleImageError = (imageSrc: string) => {
      setImageErrors(prev => ({ ...prev, [imageSrc]: true }));
    };
    
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#5C4033] mb-12 relative">
          {language === 'en' ? 'Men\'s Collection Gallery' : 'पुरुष संग्रह गैलरी'}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {menCollectionImages.map((imageSrc, index) => (
            <Link 
              key={index} 
              href="/category/cat-006"
              className="group block aspect-square relative overflow-hidden rounded-lg"
            >
              {!imageErrors[imageSrc] ? (
                <Image
                  src={imageSrc}
                  alt={language === 'en' ? `Men's Collection Image ${index + 1}` : `पुरुष संग्रह छवि ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(imageSrc)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#5C4033] to-[#FFD54F] flex items-center justify-center">
                  <span className="text-white text-sm text-center px-2">
                    {language === 'en' ? 'Collection Image' : 'संग्रह छवि'}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Collection Gallery Component for Women's Collection
  const WomenCollectionGallery = () => {
    const womenCollectionImages = [
      '/images/women collection/Golden_Bangles_Radiant_Arm_Macro.png',
      '/images/women collection/Golden_Glamour_Wrist.png',
      '/images/women collection/Golden_Radiance_Portrait.png',
      '/images/women collection/Golden_Ring_South_Asian_Hand.png',
      '/images/women collection/Radiant_South_Asian_Elegance.png',
      '/images/women collection/South_Asian_Luxury_Bracelet_Close-up.png'
    ];
    
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    
    const handleImageError = (imageSrc: string) => {
      setImageErrors(prev => ({ ...prev, [imageSrc]: true }));
    };
    
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#5C4033] mb-12 relative">
          {language === 'en' ? 'Women\'s Collection Gallery' : 'महिला संग्रह गैलरी'}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {womenCollectionImages.map((imageSrc, index) => (
            <Link 
              key={index} 
              href="/category/cat-007"
              className="group block aspect-square relative overflow-hidden rounded-lg"
            >
              {!imageErrors[imageSrc] ? (
                <Image
                  src={imageSrc}
                  alt={language === 'en' ? `Women's Collection Image ${index + 1}` : `महिला संग्रह छवि ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(imageSrc)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#5C4033] to-[#FFD54F] flex items-center justify-center">
                  <span className="text-white text-sm text-center px-2">
                    {language === 'en' ? 'Collection Image' : 'संग्रह छवि'}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Banner Slider */}
      <BannerSlider />
      
      {/* Hero Section - Premium Gold Accessories Style */}
      <div className="relative bg-gradient-to-r from-amber-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-4">
                {t('heroHeadline')}
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                {t('heroSubtext')}
              </p>
              <Link 
                href="/products" 
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
              >
                <Sparkles className="mr-2" />
                {t('shopNow')}
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="jewelry-hero-banner w-80 h-80 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full flex items-center justify-center shadow-2xl">
                  <Image 
                    src="/images/hero/premium-jewelry.png" 
                    alt="Premium Jewelry Collection" 
                    width={250} 
                    height={250} 
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/products/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                  <Award className="text-amber-600" size={24} />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
                  <Shield className="text-amber-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#5C4033] mb-12 relative">
          {t('featuredCategories')}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
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

      {/* Men & Women Collections */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#5C4033] mb-12 relative">
          {language === 'en' ? 'Our Collections' : 'हमारे संग्रह'}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {collectionsWithCounts.map((collection) => (
            <CollectionCard 
              key={collection.id}
              collection={collection}
            />
          ))}
        </div>
      </div>

      {/* Men's Collection Gallery */}
      <MenCollectionGallery />

      {/* Women's Collection Gallery */}
      <WomenCollectionGallery />

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#5C4033]">
            {t('featuredProducts')}
          </h2>
          <Link 
            href="/products?featured=true" 
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
          >
            {t('viewAll')}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('noProducts')}</p>
          </div>
        )}
      </div>

      {/* Bestsellers */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#5C4033]">
            {t('bestSellers')}
          </h2>
          <Link 
            href="/products?bestSeller=true" 
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
          >
            {t('viewAll')}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        ) : bestSellers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('noProducts')}</p>
          </div>
        )}
      </div>

      {/* New Arrivals */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#5C4033]">
            {t('newArrivals')}
          </h2>
          <Link 
            href="/products?newArrival=true" 
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
          >
            {t('viewAll')}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('noProducts')}</p>
          </div>
        )}
      </div>

      {/* Customer Testimonials */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#5C4033] mb-12 relative">
          {t('customerTestimonials')}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-shadow">
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 mb-6 italic">{`"${testimonial.comment}"`}</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-amber-600">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Artisans */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#5C4033] mb-4 relative">
          {t('featuredArtisans')}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          {language === 'en' 
            ? 'Discover the talented artisans who create these beautiful jewelry pieces' 
            : 'उन प्रतिभाशाली कारीगरों की खोज करें जो ये सुंदर आभूषण बनाते हैं'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
            className="flipkart-button px-6 py-3 inline-block"
          >
            {language === 'en' ? 'Meet Our Artisans' : 'हमारे कारीगरों से मिलें'}
          </Link>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('newsletterTitle')}
            </h2>
            <p className="text-amber-100 mb-8">
              {t('newsletterSubtitle')}
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-[#5C4033] hover:bg-[#4a342d] text-white font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#5C4033] mb-12 relative">
          {t('whyChooseUs')}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#5C4033]">{t('authentic')}</h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'High-quality materials and premium gold plating for a luxurious look' 
                : 'उच्च गुणवत्ता वाली सामग्री और प्रीमियम सोने की प्लेटिंग एक भव्य दृश्य के लिए'}
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#5C4033]">{t('supportArtisans')}</h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Expert craftsmanship with over 15 years of experience in jewelry making' 
                : 'आभूषण निर्माण में 15 से अधिक वर्षों के अनुभव के साथ विशेषज्ञ कारीगरी'}
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#5C4033]">{t('securePayments')}</h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Safe and secure payment options with hassle-free returns' 
                : 'सुरक्षित भुगतान विकल्प और परेशानी मुक्त वापसी के साथ'}
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#5C4033]">{t('ecoFriendly')}</h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Trendy designs that keep you fashionable for every occasion' 
                : 'हर अवसर के लिए आपको फैशनेबल रखने वाले ट्रेंडी डिज़ाइन'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#5C4033] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* About Us */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">{t('footerAbout')}</h3>
              <p className="text-amber-100 mb-4">
                {t('footerAboutText')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-amber-200 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-amber-200 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-amber-200 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-amber-200 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('footerQuickLinks')}</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-amber-100 hover:text-white transition-colors">{language === 'en' ? 'About Us' : 'हमारे बारे में'}</Link></li>
                <li><Link href="/products" className="text-amber-100 hover:text-white transition-colors">{language === 'en' ? 'Products' : 'उत्पाद'}</Link></li>
                <li><Link href="/categories" className="text-amber-100 hover:text-white transition-colors">{language === 'en' ? 'Categories' : 'श्रेणियाँ'}</Link></li>
                <li><Link href="/contact" className="text-amber-100 hover:text-white transition-colors">{language === 'en' ? 'Contact Us' : 'संपर्क करें'}</Link></li>
              </ul>
            </div>
            
            {/* Customer Service */}
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('footerCustomerService')}</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-amber-100 hover:text-white transition-colors">{language === 'en' ? 'FAQ' : 'सामान्य प्रश्न'}</Link></li>
                <li><Link href="/shipping-policy" className="text-amber-100 hover:text-white transition-colors">{language === 'en' ? 'Shipping Policy' : 'शिपिंग नीति'}</Link></li>
                <li><Link href="/refund-policy" className="text-amber-100 hover:text-white transition-colors">{language === 'en' ? 'Returns & Refunds' : 'वापसी और धनवापसी'}</Link></li>
                <li><Link href="/support" className="text-amber-100 hover:text-white transition-colors">{language === 'en' ? 'Support' : 'समर्थन'}</Link></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('footerContact')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Mail className="w-5 h-5 text-amber-200 mr-3 mt-0.5" />
                  <span className="text-amber-100">{t('footerEmail')}</span>
                </li>
                <li className="flex items-start">
                  <Phone className="w-5 h-5 text-amber-200 mr-3 mt-0.5" />
                  <span className="text-amber-100">{t('footerPhone')}</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-amber-200 mr-3 mt-0.5" />
                  <span className="text-amber-100">{t('footerAddress')}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-200">
            <p>&copy; {new Date().getFullYear()} Soni Artificial Fashion. {t('footerRights')}</p>
          </div>
        </div>
      </footer>
    </>
  );
}