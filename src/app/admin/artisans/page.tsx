'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
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
  const { user } = useAuth();
  const router = useRouter();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/login');
      return;
    }

    loadArtisans();
  }, [user, router]);

  // Refresh artisans when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if we're not already loading
      if (!loading) {
        setLoading(true);
        loadArtisans();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loading]);

  const loadArtisans = async () => {
    try {
      const response = await fetch('/api/admin/artisans');
      if (response.ok) {
        const data = await response.json();
        setArtisans(data.artisans || []);
      }
    } catch (error) {
      console.error('Error loading artisans:', error);
    }
    setLoading(false);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/artisans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the artisan in the local state
        setArtisans(prev => prev.map(artisan => 
          artisan.id === id ? { ...artisan, isActive } : artisan
        ));
        alert('Artisan updated successfully!');
      } else {
        alert('Failed to update artisan: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error updating artisan:', error);
      alert('Failed to update artisan: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artisan? This will also delete all associated products.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/artisans/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove the artisan from the local state
        setArtisans(prev => prev.filter(artisan => artisan.id !== id));
        alert('Artisan deleted successfully!');
      } else {
        alert('Failed to delete artisan: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error deleting artisan:', error);
      alert('Failed to delete artisan: ' + (error.message || 'Unknown error'));
    }
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Artisan Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage marketplace artisans
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLoading(true);
                  loadArtisans();
                }}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
              >
                Refresh
              </button>
              <Link
                href="/admin/artisans/new"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-center"
              >
                + Add New Artisan
              </Link>
            </div>
          </div>

          {/* Artisans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artisans.map((artisan) => (
              <div key={artisan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
                      {(artisan.skills || []).slice(0,3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {artisan.skills && artisan.skills.length > 3 && (
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
                      className="flex-1 text-center px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleToggleActive(artisan.id, !artisan.isActive)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      {artisan.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleDelete(artisan.id)}
                      className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                    >
                      Delete
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