'use client';

import { useParams } from 'next/navigation';
import { artisans } from '@/data/artisans';
import Image from 'next/image';
import Link from 'next/link';

export default function ArtisanPage() {
  const params = useParams();
  const slug = params.slug as string;
  const artisan = artisans.find(a => a.slug === slug);
  
  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artisan Not Found</h1>
          <p className="text-gray-600 mb-6">The artisan you're looking for doesn't exist.</p>
          <Link href="/artisans" className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700">
            View All Artisans
          </Link>
        </div>
      </div>
    );
  }
  
  // Removed SVG check to prevent optimization issues

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Image
            src={artisan.photo}
            alt={artisan.name}
            width={500}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
            // Removed unoptimized prop for SVG files
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{artisan.name}</h1>
            <p className="text-lg text-gray-600">{artisan.village}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">Experience</h3>
              <p className="text-amber-600">{artisan.experience} years</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">Rating</h3>
              <p className="text-amber-600">{artisan.rating}/5.0</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Specialization</h3>
            <div className="flex flex-wrap gap-2">
              {artisan.specialization.map((skill, index) => (
                <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-600 leading-relaxed">{artisan.bio.en}</p>
          </div>
          
          <div className="pt-6">
            <Link
              href={`/products?artisan=${artisan.slug}`}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 inline-block"
            >
              View {artisan.name}'s Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}