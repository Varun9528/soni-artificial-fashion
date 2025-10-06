'use client';

import Image from "next/image";
import HeroCarousel from '@/components/layout/HeroCarousel';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { artisans } from '@/data/artisans';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import CssTest from '@/components/CssTest';

export default function Home() {
  const { language } = useLanguage();
  const [categoryImageErrors, setCategoryImageErrors] = useState<Record<string, boolean>>({});
  const [artisanImageErrors, setArtisanImageErrors] = useState<Record<string, boolean>>({});

  const handleCategoryImageError = (categoryId: string) => {
    setCategoryImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  const handleArtisanImageError = (artisanId: string) => {
    setArtisanImageErrors(prev => ({ ...prev, [artisanId]: true }));
  };

  // Get featured products
  const featuredProducts = products.filter(product => product.featured);

  // Get all categories (for now, we'll show all categories)
  const featuredCategories = categories;

  // Get featured artisans
  const featuredArtisans = artisans.slice(0, 4);

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        heroHeadline: "Experience the Rich Tribal Art of Pachmarhi",
        heroSubtext: "Buy authentic handicrafts directly from local artisans. Handpicked, handmade, and full of heritage.",
        shopNow: "Shop Now",
        meetArtisans: "Meet Our Artisans",
        featuredCategories: "Featured Categories",
        featuredArtisans: "Meet the skilled artisans behind each masterpiece",
        whyChooseUs: "Why Choose Us",
        authentic: "100% Authentic Handmade Products",
        supportArtisans: "Support Local Artisans and Communities",
        securePayments: "Secure Payments and Easy Returns",
        ecoFriendly: "Eco-Friendly Materials"
      },
      hi: {
        heroHeadline: "पचमढ़ी की समृद्ध जनजातीय कला का अनुभव करें",
        heroSubtext: "स्थानीय कारीगरों से सीधे प्रामाणिक हस्तशिल्प खरीदें। हाथ से चुने गए, हस्तनिर्मित और विरासत से भरे।",
        shopNow: "अभी खरीदें",
        meetArtisans: "हमारे कारीगरों से मिलें",
        featuredCategories: "विशेष श्रेणियाँ",
        featuredArtisans: "प्रत्येक कृति के पीछे कौशलवान कारीगरों से मिलें",
        whyChooseUs: "हमें क्यों चुनें",
        authentic: "100% प्रामाणिक हस्तनिर्मित उत्पाद",
        supportArtisans: "स्थानीय कारीगरों और समुदायों का समर्थन करें",
        securePayments: "सुरक्षित भुगतान और आसान वापसी",
        ecoFriendly: "पर्यावरण-अनुकूल सामग्री"
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <div className="min-h-screen">
      {/* CSS Test Component - Remove this in production */}
      <CssTest />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('heroHeadline')}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {t('heroSubtext')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/products" 
                className="px-8 py-4 bg-white text-amber-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center"
              >
                {t('shopNow')}
              </Link>
              <Link 
                href="/artisans" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center"
              >
                {t('meetArtisans')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Featured Products' : 'विशेष उत्पाद'}
          </h2>
          <Link 
            href="/products" 
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            {language === 'en' ? 'View All' : 'सभी देखें'} →
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {language === 'en' ? 'No products available' : 'कोई उत्पाद उपलब्ध नहीं है'}
            </p>
          </div>
        )}
      </div>

      {/* Featured Categories */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('featuredCategories')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <CategoryCard 
                key={category.id}
                category={category}
                imageError={categoryImageErrors[category.id] || false}
                onImageError={() => handleCategoryImageError(category.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Featured Artisans */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {t('featuredArtisans')}
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          {language === 'en' 
            ? 'Discover the talented artisans who create these beautiful handmade products' 
            : 'उन प्रतिभाशाली कारीगरों की खोज करें जो ये सुंदर हस्तनिर्मित उत्पाद बनाते हैं'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtisans.map((artisan) => (
            <ArtisanCard 
              key={artisan.id}
              artisan={artisan}
              imageError={artisanImageErrors[artisan.id] || false}
              onImageError={() => handleArtisanImageError(artisan.id)}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/artisans" 
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            {language === 'en' ? 'View All Artisans' : 'सभी कारीगर देखें'}
          </Link>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('whyChooseUs')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('authentic')}</h3>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('supportArtisans')}</h3>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('securePayments')}</h3>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('ecoFriendly')}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category, imageError, onImageError }: { 
  category: any; 
  imageError: boolean; 
  onImageError: () => void; 
}) {
  const { language } = useLanguage();
  
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block"
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-300">
        <div className="aspect-square relative overflow-hidden">
          {!imageError ? (
            <Image
              src={category.image || `/images/categories/cat-${category.slug}.jpg`}
              alt={category.name[language]}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={onImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
              <span className="text-primary-600 text-sm text-center px-4">
                {category.name[language]}<br />
                <span className="text-xs opacity-75">Category Image</span>
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-primary-800 mb-2 group-hover:text-primary-600 transition-colors">
            {category.name[language]}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{category.description[language]}</p>
          <p className="text-primary-600 font-medium">{category.productCount || 0} items</p>
        </div>
      </div>
    </Link>
  );
}

function ArtisanCard({ artisan, imageError, onImageError }: { 
  artisan: any; 
  imageError: boolean; 
  onImageError: () => void; 
}) {
  const { language } = useLanguage();
  
  return (
    <Link
      href={`/artisan/${artisan.slug}`}
      className="group block"
    >
      <div className="bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-300 overflow-hidden">
        <div className="aspect-square relative overflow-hidden">
          {!imageError ? (
            <Image
              src={artisan.photo || `/images/artisans/arti-${artisan.slug.replace(' ', '-')}.jpg`}
              alt={artisan.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={onImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-earth-100 to-earth-200 flex items-center justify-center">
              <span className="text-earth-600 text-sm text-center px-4">
                {artisan.name}<br />
                <span className="text-xs opacity-75">Artisan Photo</span>
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-primary-800 mb-2 group-hover:text-primary-600 transition-colors">
            {artisan.name}
          </h3>
          <p className="text-primary-600 text-sm mb-2">{artisan.village || artisan.location}</p>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{artisan.bio[language]}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{artisan.totalProducts || 0} products</span>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-gray-600 ml-1">{artisan.rating || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
