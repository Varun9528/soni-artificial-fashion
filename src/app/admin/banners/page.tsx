'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Banner {
  id: string;
  title: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  image?: string;
  image_desktop?: string;
  link: string;
  buttonText: { en: string; hi: string };
  type: string;
  isActive: boolean;
  sortOrder: number;
  startDate?: string;
  endDate?: string;
}

export default function BannersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'ADMIN' && user.role !== 'super_admin' && user.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }

    loadBanners();
  }, [user, router]);

  // Refresh banners when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if we're not already loading
      if (!loading) {
        setLoading(true);
        loadBanners();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loading]);

  const loadBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    }
    setLoading(false);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
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
        // Update the banner in the local state
        setBanners(prev => prev.map(banner => 
          banner.id === id ? { ...banner, isActive } : banner
        ));
        alert('Banner updated successfully!');
      } else {
        alert('Failed to update banner: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error updating banner:', error);
      alert('Failed to update banner: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove the banner from the local state
        setBanners(prev => prev.filter(banner => banner.id !== id));
        alert('Banner deleted successfully!');
      } else {
        alert('Failed to delete banner: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner: ' + (error.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading banners...</p>
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
                Banners Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage homepage and promotional banners
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLoading(true);
                  loadBanners();
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Refresh
              </button>
              <Link
                href="/admin/banners/new"
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                + Add New Banner
              </Link>
            </div>
          </div>

          {/* Banners Grid */}
          <div className="space-y-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="aspect-video relative">
                      <Image
                        src={banner.image_desktop || banner.image || '/images/products/placeholder.jpg'}
                        alt={banner.title.en}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = '/images/products/placeholder.jpg';
                        }}
                      />
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
                        banner.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {banner.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {banner.title.en}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {banner.subtitle.en}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {banner.type}
                          </span>
                          <span>Order: {banner.sortOrder}</span>
                          {banner.link && (
                            <a 
                              href={banner.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-amber-600 hover:text-amber-700"
                            >
                              View Link →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    {(banner.startDate || banner.endDate) && (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="font-medium mb-1">Schedule</div>
                          {banner.startDate && (
                            <div>Start: {new Date(banner.startDate).toLocaleDateString()}</div>
                          )}
                          {banner.endDate && (
                            <div>End: {new Date(banner.endDate).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Button Text */}
                    {banner.buttonText && (
                      <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-amber-600 text-white rounded text-sm">
                          {banner.buttonText.en}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/banners/${banner.id}/edit`}
                        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleToggleActive(banner.id, !banner.isActive)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {banner.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {banners.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 dark:text-gray-400">
                <p className="text-lg mb-2">No banners found</p>
                <p className="text-sm">Create your first banner to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}