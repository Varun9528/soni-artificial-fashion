'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/login');
      return;
    }

    loadCategories();
  }, [user, router]);

  // Refresh categories when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if we're not already loading
      if (!loading) {
        setLoading(true);
        loadCategories();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loading]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
    setLoading(false);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
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
        // Update the category in the local state
        setCategories(prev => prev.map(category => 
          category.id === id ? { ...category, isActive } : category
        ));
        alert('Category updated successfully!');
      } else {
        alert('Failed to update category: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error updating category:', error);
      alert('Failed to update category: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setCategories(categories.filter(category => category.id !== categoryId));
        alert('Category deleted successfully!');
      } else {
        alert('Failed to delete category: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category: ' + (error.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p>
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
                Category Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage product categories
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLoading(true);
                  loadCategories();
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Refresh
              </button>
              <Link
                href="/admin/categories/new"
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                + Add New Category
              </Link>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={category.image || '/images/products/placeholder.jpg'}
                    alt={category.name.en}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = '/images/products/placeholder.jpg';
                    }}
                  />
                  {category.featured && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      FEATURED
                    </div>
                  )}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${
                    category.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {category.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {category.name.en}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {category.description.en}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{category.productCount || 0} products</span>
                    <span>Slug: {category.slug}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="flex-1 text-center px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleToggleActive(category.id, !category.isActive)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {category.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id, category.name.en)}
                      className="flex-1 px-3 py-2 border border-red-300 text-red-700 dark:text-red-300 rounded hover:bg-red-50 dark:hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 dark:text-gray-400">
                <p className="text-lg mb-2">No categories found</p>
                <p className="text-sm">Create your first category to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}