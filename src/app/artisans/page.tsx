'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await fetch('/api/artisans');
        const data = await response.json();
        
        if (data.success) {
          setArtisans(data.artisans);
        } else {
          setError(data.error || 'Failed to fetch artisans');
        }
      } catch (err) {
        setError('Failed to fetch artisans');
        console.error('Error fetching artisans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Artisans</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the talented craftspeople behind our authentic tribal art products.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="animate-pulse h-64 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Artisans</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        {artisans.map((artisan) => {
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
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {(artisan.skills || []).slice(0, 2).map((skill: string, index: number) => (
                      <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {artisan.skills && artisan.skills.length > 2 && (
                      <span className="text-xs text-gray-500">+{artisan.skills.length - 2} more</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    href={`/artisan/${artisanSlug}`}
                    className="flex-1 bg-amber-600 text-white px-4 py-2 rounded text-center text-sm hover:bg-amber-700 transition-colors"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/products?artisan=${artisanSlug}`}
                    className="flex-1 border border-amber-600 text-amber-600 px-4 py-2 rounded text-center text-sm hover:bg-amber-50 transition-colors"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}