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
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { state: wishlistState, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // Fetch featured products
        const featuredResponse = await fetch('/api/products?featured=true&limit=8');
        const featuredData = await featuredResponse.json();
        
        // Fetch new arrival products
        const newArrivalResponse = await fetch('/api/products?newArrival=true&limit=8');
        const newArrivalData = await newArrivalResponse.json();
        
        // Fetch artisans
        const artisansResponse = await fetch('/api/artisans');
        const artisansData = await artisansResponse.json();
        
        // Extract products array from the responses
        setFeaturedProducts(Array.isArray(featuredData) ? featuredData : featuredData.products || []);
        setNewArrivalProducts(Array.isArray(newArrivalData) ? newArrivalData : newArrivalData.products || []);
        setArtisans(Array.isArray(artisansData) ? artisansData : artisansData.artisans || []);
      } catch (error) {
        console.error('Error fetching home page data:', error);
        setFeaturedProducts([]);
        setNewArrivalProducts([]);
        setArtisans([]);
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
      {/* Hero Carousel */}
      <section className="relative">
        <BannerSlider />
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('featuredProducts')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('newArrivals')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
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