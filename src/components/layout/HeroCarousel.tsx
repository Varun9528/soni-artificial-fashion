'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const banners = [
  {
    id: 'banner-1',
    title: { en: 'Handmade Bamboo Crafts — Sustainable & Beautiful' },
    subtitle: { en: 'Eco-friendly crafts from Pachmarhi artisans' },
    image: '/images/hero/hero1.jpg',
    link: '/category/home-decor'
  },
  {
    id: 'banner-2',
    title: { en: 'Traditional Gond Paintings — Colors of Pachmarhi' },
    subtitle: { en: 'Authentic tribal art from master painters' },
    image: '/images/hero/hero2.jpg',
    link: '/category/home-decor'
  },
  {
    id: 'banner-3',
    title: { en: 'Authentic Tribal Jewelry — Unique Handcrafted Pieces' },
    subtitle: { en: 'Traditional designs with modern appeal' },
    image: '/images/hero/hero3.jpg',
    link: '/category/jewelry'
  },
  {
    id: 'banner-4',
    title: { en: 'Eco-Friendly Cane Products — Style Meets Nature' },
    subtitle: { en: 'Sustainable living with natural materials' },
    image: '/images/hero/hero4.jpg',
    link: '/category/accessories'
  },
  {
    id: 'banner-5',
    title: { en: 'Handloom Sarees — Weaves from Local Artisans' },
    subtitle: { en: 'Premium handwoven textiles for every occasion' },
    image: '/images/hero/hero5.jpg',
    link: '/category/handloom-textiles'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>(new Array(banners.length).fill(false));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          {!imageErrors[index] ? (
            <Image
              src={banner.image}
              alt={banner.title.en}
              fill
              className="object-cover"
              onError={() => handleImageError(index)}
              priority={index === 0}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary-100 to-accent-100" />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {banner.title.en}
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                {banner.subtitle.en}
              </p>
              <div className="flex gap-4">
                <Link
                  href={banner.link}
                  className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                >
                  Shop Now
                </Link>
                <Link
                  href="/artisans"
                  className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold"
                >
                  Meet Artisans
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary-800 p-2 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary-800 p-2 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary-600' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}