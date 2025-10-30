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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { state: wishlistState, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // Fetch featured products
        const productResponse = await fetch('/api/products?featured=true&limit=8');
        const productData = await productResponse.json();
        // Extract products array from the response
        setProducts(Array.isArray(productData) ? productData : productData.products || []);
      } catch (error) {
        console.error('Error fetching home page data:', error);
        setProducts([]); // Set empty array on error
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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
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