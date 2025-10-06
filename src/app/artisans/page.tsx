'use client';

import { artisans } from '@/data/artisans';
import Image from 'next/image';
import Link from 'next/link';

export default function ArtisansPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Artisans</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the talented craftspeople behind our authentic tribal art products. 
          Each artisan brings generations of traditional knowledge and skill to create unique, handcrafted pieces.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artisans.map((artisan) => (
          <div key={artisan.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-64">
              <Image
                src={artisan.photo}
                alt={artisan.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{artisan.name}</h3>
              <p className="text-gray-600 mb-3">{artisan.village}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{artisan.experience} years experience</span>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">{artisan.rating}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {artisan.specialization.slice(0, 2).map((skill, index) => (
                    <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {artisan.specialization.length > 2 && (
                    <span className="text-xs text-gray-500">+{artisan.specialization.length - 2} more</span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/artisan/${artisan.slug}`}
                  className="flex-1 bg-amber-600 text-white px-4 py-2 rounded text-center text-sm hover:bg-amber-700 transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  href={`/products?artisan=${artisan.slug}`}
                  className="flex-1 border border-amber-600 text-amber-600 px-4 py-2 rounded text-center text-sm hover:bg-amber-50 transition-colors"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}