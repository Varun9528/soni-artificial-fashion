'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditCategory() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    nameEn: '',
    nameHi: '',
    slug: '',
    descriptionEn: '',
    descriptionHi: '',
    image: '',
    featured: false,
    isActive: true
  });

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }

    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${id}`);
        const data = await response.json();
        
        if (!data.success) {
          router.push('/admin/categories');
          return;
        }
        
        setCategory(data.category);
        
        // Set form data with category values
        setFormData({
          nameEn: data.category.name?.en || '',
          nameHi: data.category.name?.hi || '',
          slug: data.category.slug || '',
          descriptionEn: data.category.description?.en || '',
          descriptionHi: data.category.description?.hi || '',
          image: data.category.image || '',
          featured: data.category.featured || false,
          isActive: data.category.isActive !== undefined ? data.category.isActive : true
        });
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [user, router, id]);

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
        name: { 
          en: formData.nameEn, 
          hi: formData.nameHi 
        },
        slug: formData.slug,
        description: { 
          en: formData.descriptionEn, 
          hi: formData.descriptionHi 
        },
        image: formData.image,
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
        alert('Error updating category: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading category data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin/categories"
            className="text-amber-600 hover:text-amber-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Categories
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Category</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Category Information</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name (English) *
                    </label>
                    <input
                      type="text"
                      name="nameEn"
                      value={formData.nameEn}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name (Hindi)
                    </label>
                    <input
                      type="text"
                      name="nameHi"
                      value={formData.nameHi}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Description</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (English)
                    </label>
                    <textarea
                      name="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Hindi)
                    </label>
                    <textarea
                      name="descriptionHi"
                      value={formData.descriptionHi}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Image</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Flags */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Category Flags</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Link
                href="/admin/categories"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}