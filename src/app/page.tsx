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
  const { language, t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<any[]>([]);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [menProducts, setMenProducts] = useState<any[]>([]);
  const [womenProducts, setWomenProducts] = useState<any[]>([]);
  const [menCollectionImages, setMenCollectionImages] = useState<string[]>([]);
  const [womenCollectionImages, setWomenCollectionImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { state: wishlistState, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // Fetch featured products
        const featuredResponse = await fetch('/api/products?featured=true&limit=12');
        const featuredData = await featuredResponse.json();
        
        // Fetch new arrival products
        const newArrivalResponse = await fetch('/api/products?newArrival=true&limit=12');
        const newArrivalData = await newArrivalResponse.json();
        
        // Fetch artisans
        const artisansResponse = await fetch('/api/artisans');
        const artisansData = await artisansResponse.json();
        
        // Fetch men's products
        const menResponse = await fetch('/api/products?category=cat-006&limit=12');
        const menData = await menResponse.json();
        
        // Fetch women's products
        const womenResponse = await fetch('/api/products?category=cat-007&limit=12');
        const womenData = await womenResponse.json();
        
        // Extract products array from the responses
        setFeaturedProducts(Array.isArray(featuredData) ? featuredData : featuredData.products || []);
        setNewArrivalProducts(Array.isArray(newArrivalData) ? newArrivalData : newArrivalData.products || []);
        setArtisans(Array.isArray(artisansData) ? artisansData : artisansData.artisans || []);
        setMenProducts(Array.isArray(menData) ? menData : menData.products || []);
        setWomenProducts(Array.isArray(womenData) ? womenData : womenData.products || []);
        
        // Set collection images
        setMenCollectionImages([
          '/images/men collection/Gold_Figaro_Bracelet_Studio_Shot.png',
          '/images/men collection/Indian_Man_Gold_Chain.png',
          '/images/men collection/Indian_Man_Gold_Jewelry_Portrait.png',
          '/images/men collection/Indian_Man_Gold_Pendant_Portrait.png',
          '/images/men collection/Indian_Man_Ring_Macro.png'
        ]);
        
        setWomenCollectionImages([
          '/images/women collection/Golden_Bangles_Radiant_Arm_Macro.png',
          '/images/women collection/Golden_Glamour_Wrist.png',
          '/images/women collection/Golden_Radiance_Portrait.png',
          '/images/women collection/Golden_Ring_South_Asian_Hand.png',
          '/images/women collection/Radiant_South_Asian_Elegance.png',
          '/images/women collection/South_Asian_Luxury_Bracelet_Close-up.png'
        ]);
      } catch (error) {
        console.error('Error fetching home page data:', error);
        setFeaturedProducts([]);
        setNewArrivalProducts([]);
        setArtisans([]);
        setMenProducts([]);
        setWomenProducts([]);
        setMenCollectionImages([]);
        setWomenCollectionImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel - moved down with margin */}
      <section className="relative">
        <BannerSlider />
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('featuredProducts')}
          </h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {language === 'en' ? 'No featured products available' : 'कोई विशेष उत्पाद उपलब्ध नहीं है'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Men's Collection Images */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">
              {language === 'en' ? "Men's Collection" : "पुरुष संग्रह"}
            </h2>
            <Link 
              href="/men-collection" 
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
            >
              {language === 'en' ? 'View All' : 'सभी देखें'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {menCollectionImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {menCollectionImages.map((image, index) => (
                <Link 
                  key={index} 
                  href="/men-collection"
                  className="relative h-48 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`${language === 'en' ? "Men's Collection" : "पुरुष संग्रह"} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {language === 'en' ? 'No collection images available' : 'कोई संग्रह चित्र उपलब्ध नहीं है'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Men's Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">
              {language === 'en' ? "Men's Products" : "पुरुष उत्पाद"}
            </h2>
            <Link 
              href="/men-collection" 
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
            >
              {language === 'en' ? 'View All' : 'सभी देखें'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {menProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {menProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {language === 'en' ? 'No products available in Men\'s Collection' : 'पुरुष संग्रह में कोई उत्पाद उपलब्ध नहीं है'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Women's Collection Images */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">
              {language === 'en' ? "Women's Collection" : "महिला संग्रह"}
            </h2>
            <Link 
              href="/women-collection" 
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
            >
              {language === 'en' ? 'View All' : 'सभी देखें'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {womenCollectionImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {womenCollectionImages.map((image, index) => (
                <Link 
                  key={index} 
                  href="/women-collection"
                  className="relative h-48 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`${language === 'en' ? "Women's Collection" : "महिला संग्रह"} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {language === 'en' ? 'No collection images available' : 'कोई संग्रह चित्र उपलब्ध नहीं है'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Women's Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">
              {language === 'en' ? "Women's Products" : "महिला उत्पाद"}
            </h2>
            <Link 
              href="/women-collection" 
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
            >
              {language === 'en' ? 'View All' : 'सभी देखें'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {womenProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {womenProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {language === 'en' ? 'No products available in Women\'s Collection' : 'महिला संग्रह में कोई उत्पाद उपलब्ध नहीं है'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('newArrivals')}
          </h2>
          {newArrivalProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivalProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {language === 'en' ? 'No new arrivals available' : 'कोई नई वस्तुएं उपलब्ध नहीं हैं'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Artisans */}
      {artisans.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t('meetOurArtisans')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {artisans.slice(0, 4).map((artisan) => {
                // Ensure we have a proper slug or use id as fallback
                const artisanSlug = artisan.slug || artisan.id;
                
                return (
                  <div key={artisan.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-64">
                      <Image
                        src={artisan.photo || '/images/artisans/placeholder.jpg'}
                        alt={artisan.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/artisans/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{artisan.name}</h3>
                      <p className="text-gray-600 mb-3">{artisan.village}, {artisan.district}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">{artisan.experience} years experience</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">{artisan.rating}</span>
                        </div>
                      </div>
                      
                      <Link
                        href={`/artisan/${artisanSlug}`}
                        className="block w-full bg-amber-600 text-white px-4 py-2 rounded text-center text-sm hover:bg-amber-700 transition-colors"
                      >
                        {t('viewProfile')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/artisans" 
                className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
              >
                {t('viewAllArtisans')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Collections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('shopByCategory')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/category/${collection.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.name[language]}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold">{collection.name[language]}</h3>
                    <p className="mt-2 text-sm opacity-90">{collection.description[language]}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('qualityCraftsmanship')}</h3>
              <p className="text-gray-600">{t('qualityCraftsmanshipDesc')}</p>
            </div>
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('certifiedArtisans')}</h3>
              <p className="text-gray-600">{t('certifiedArtisansDesc')}</p>
            </div>
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('secureShopping')}</h3>
              <p className="text-gray-600">{t('secureShoppingDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}