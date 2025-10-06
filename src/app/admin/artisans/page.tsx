'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Artisan {
  id: string;
  name: string;
  slug: string;
  bio: { en: string; hi: string };
  village: string;
  district: string;
  state: string;
  photo: string;
  skills: string[];
  experience: number;
  rating: number;
  totalProducts: number;
  isActive: boolean;
}

export default function AdminArtisansPage() {
  const router = useRouter();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin auth
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        router.push('/');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }

    loadArtisans();
  }, [router]);

  const loadArtisans = async () => {
    try {
      const response = await fetch('/api/artisans');
      if (response.ok) {
        const data = await response.json();
        setArtisans(data.artisans || []);
      }
    } catch (error) {
      console.error('Error loading artisans:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading artisans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Artisan Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage marketplace artisans
              </p>
            </div>
            <Link
              href="/admin/artisans/new"
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              + Add New Artisan
            </Link>
          </div>

          {/* Artisans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map((artisan) => (
              <div key={artisan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={artisan.photo}
                    alt={artisan.name}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = '/images/products/placeholder.jpg';
                    }}
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
                    artisan.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {artisan.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {artisan.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {artisan.village}, {artisan.district}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {artisan.bio.en}
                  </p>
                  
                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {artisan.skills.slice(0,3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {artisan.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{artisan.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {artisan.experience}
                      </div>
                      <div className="text-xs text-gray-500">Years</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {artisan.rating}
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {artisan.totalProducts}
                      </div>
                      <div className="text-xs text-gray-500">Products</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/artisans/${artisan.id}/edit`}
                      className="flex-1 text-center px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {artisan.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {artisans.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 dark:text-gray-400">
                <p className="text-lg mb-2">No artisans found</p>
                <p className="text-sm">Add your first artisan to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}