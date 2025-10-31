'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface Slide {
  id: number;
  title: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  image: string;
  link: string;
}

export default function HeroCarousel() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides: Slide[] = [
    {
      id: 1,
      title: { en: 'Traditional Gond Paintings - Colors of Soni Fashion', hi: 'पारंपरिक गोंड चित्रकला - सोनी फैशन के रंग' },
      subtitle: { en: 'Eco-friendly crafts from Soni artisans', hi: 'सोनी के शिल्पकारों से पर्यावरण-अनुकूल शिल्पकला' },
      image: '/images/hero/hero1.jpg',
      link: '/products'
    },
    {
      id: 2,
      title: { en: 'Authentic Tribal Art & Handicrafts', hi: 'प्रामाणिक जनजातीय कला एवं हस्तशिल्प' },
      subtitle: { en: 'Handcrafted with love by local artisans', hi: 'स्थानीय शिल्पकारों द्वारा प्रेम से निर्मित' },
      image: '/images/hero/hero2.jpg',
      link: '/artisans'
    },
    {
      id: 3,
      title: { en: 'Premium Artificial Jewelry Collection', hi: 'प्रीमियम कृत्रिम आभूषण संग्रह' },
      subtitle: { en: 'Elegant designs for every occasion', hi: 'प्रत्येक अवसर के लिए सुरुचिपूर्ण डिज़ाइन' },
      image: '/images/hero/hero3.jpg',
      link: '/categories'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[60vh] overflow-hidden rounded-b-3xl shadow-2xl">
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.image}
            alt={language === 'en' ? slide.title.en : slide.title.hi}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                {language === 'en' ? slide.title.en : slide.title.hi}
              </h1>
              <p className="text-lg md:text-xl mb-8 drop-shadow-md">
                {language === 'en' ? slide.subtitle.en : slide.subtitle.hi}
              </p>
              <Link 
                href={slide.link}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-block"
              >
                {language === 'en' ? 'Explore Collection' : 'संग्रह का अन्वेषण करें'}
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-amber-400 w-10' : 'bg-white bg-opacity-70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}