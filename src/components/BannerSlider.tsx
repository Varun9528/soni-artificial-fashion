'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface Banner {
  id: string;
  title: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  image_desktop: string;
  image?: string; // For backward compatibility
  link_url: string;
  is_active: number;
  display_order: number;
}

export default function BannerSlider() {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Filter active banners and sort by display order
            // Fix: Ensure is_active is properly checked as a number
            const activeBanners = data.banners
              .filter((banner: Banner) => Number(banner.is_active) === 1)
              .sort((a: Banner, b: Banner) => a.display_order - b.display_order);
            setBanners(activeBanners);
          }
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Fallback to default banners if API fails
        setBanners([
          {
            id: '1',
            title: {
              en: "Premium Gold Collection",
              hi: "प्रीमियम सोने का संग्रह"
            },
            subtitle: {
              en: "Elegant Gold Plated Jewelry for Every Occasion",
              hi: "प्रत्येक अवसर के लिए सुरुचिपूर्ण सोने की प्लेटेड आभूषण"
            },
            image_desktop: "/images/banner/banner1.png",
            link_url: "/products",
            is_active: 1,
            display_order: 1
          },
          {
            id: '2',
            title: {
              en: "Exclusive Earring Collection",
              hi: "विशेष कान के आभूषण संग्रह"
            },
            subtitle: {
              en: "Statement Pieces to Elevate Your Style",
              hi: "आपकी शैली को बढ़ाने के लिए वक्तव्य टुकड़े"
            },
            image_desktop: "/images/banner/banner2.png",
            link_url: "/products",
            is_active: 1,
            display_order: 2
          },
          {
            id: '3',
            title: {
              en: "Limited Time Offers",
              hi: "सीमित समय के प्रस्ताव"
            },
            subtitle: {
              en: "Special Discounts on Selected Collections",
              hi: "चयनित संग्रह पर विशेष छूट"
            },
            image_desktop: "/images/banner/banner3.png",
            link_url: "/products",
            is_active: 1,
            display_order: 3
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);
  
  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);
  
  if (loading) {
    return (
      <div className="relative w-full h-96 overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-96 overflow-hidden">
      {banners.map((banner, i) => (
        <div key={banner.id} className="absolute inset-0">
          <Image
            src={banner.image_desktop || banner.image || '/images/banner/banner1.png'}
            alt={`banner-${i}`}
            fill
            className={`object-cover transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            priority={i === 0}
            onError={(e) => {
              console.error(`Error loading banner image: ${banner.image_desktop || banner.image}`, e);
            }}
          />
          {/* Overlay with text */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center bg-gradient-to-r from-black/70 to-black/50 p-6 md:p-8 rounded-xl max-w-2xl backdrop-blur-sm mx-4">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">{banner.title[language]}</h2>
              <p className="text-lg md:text-xl text-amber-300 mb-6 drop-shadow-md">{banner.subtitle[language]}</p>
              <Link href={banner.link_url || "/products"} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-base md:text-lg inline-block">
                {language === 'en' ? 'Shop Now' : 'अभी खरीदें'}
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* Banner indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              i === index ? 'bg-amber-400 w-10' : 'bg-white bg-opacity-70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}