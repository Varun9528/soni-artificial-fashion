'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditCategoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState(null);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCategory(data.category);
          
          setFormData({
            nameEn: data.category.name_en || '',
            nameHi: data.category.name_hi || '',
            descriptionEn: data.category.description_en || '',
            descriptionHi: data.category.description_hi || '',
            image: data.category.image || '',
            slug: data.category.slug || '',
            featured: data.category.featured === 1,
            isActive: data.category.is_active === 1
          });
        }
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (id) {
      fetchCategory();
    }
  }, [user, router, id, fetchCategory]);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameHi: '',
    descriptionEn: '',
    descriptionHi: '',
    image: '',
    slug: '',
    featured: false,
    isActive: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const categoryData = {
        name: { en: formData.nameEn, hi: formData.nameHi },
        description: { en: formData.descriptionEn, hi: formData.descriptionHi },
        image: formData.image,
        slug: formData.slug,
        featured: formData.featured,
        isActive: formData.isActive
      };

      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Category updated successfully!');
        router.push('/admin/categories');
      } else {
        alert('Failed to update category: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error updating category:', error);
      alert('Failed to update category: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/admin/categories" className="text-amber-600 hover:text-amber-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Categories
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            <p className="mt-1 text-sm text-gray-600">Update category information</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Name */}
              <div className="md:col-span-2">
                <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  id="nameEn"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Hindi Name */}
              <div className="md:col-span-2">
                <label htmlFor="nameHi" className="block text-sm font-medium text-gray-700">
                  Category Name (Hindi)
                </label>
                <input
                  type="text"
                  id="nameHi"
                  name="nameHi"
                  value={formData.nameHi}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Slug */}
              <div className="md:col-span-2">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* English Description */}
              <div className="md:col-span-2">
                <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                  Description (English) *
                </label>
                <textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Hindi Description */}
              <div className="md:col-span-2">
                <label htmlFor="descriptionHi" className="block text-sm font-medium text-gray-700">
                  Description (Hindi)
                </label>
                <textarea
                  id="descriptionHi"
                  name="descriptionHi"
                  rows={3}
                  value={formData.descriptionHi}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Status Flags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Status
                </label>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Featured Category
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <Link
                href="/admin/categories"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Update Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}