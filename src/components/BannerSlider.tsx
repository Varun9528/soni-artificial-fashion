'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const banners = ["/images/banner/banner1.png", "/images/banner/banner2.png", "/images/banner/banner3.png"];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {banners.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`banner-${i}`}
          fill
          className={`object-cover transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          priority={i === 0}
        />
      ))}
    </div>
  );
}