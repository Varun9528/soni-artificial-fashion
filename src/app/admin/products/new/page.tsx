'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleHi: '',
    descriptionEn: '',
    descriptionHi: '',
    shortDescEn: '',
    shortDescHi: '',
    price: '',
    originalPrice: '',
    sku: '',
    stock: '',
    weight: '',
    categoryId: '',
    artisanId: '',
    featured: false,
    bestSeller: false,
    newArrival: false,
    trending: false,
    metaTitle: '',
    metaDesc: '',
    tags: '',
    materials: '',
    colors: '',
    images: [''] as string[]
  });

  useEffect(() => {
    // In a real implementation, fetch categories and artisans from API
    // For now, we'll use mock data
    setCategories([
      { id: '1', name: { en: 'Jewelry', hi: 'आभूषण' } },
      { id: '2', name: { en: 'Home Decor', hi: 'घर की सजावट' } },
      { id: '3', name: { en: 'Clothing', hi: 'कपड़े' } },
      { id: '4', name: { en: 'Accessories', hi: 'सामान' } }
    ]);
    
    const mockArtisans = [
      { id: '1', name: 'Ramesh Prajapati', village: 'Madhya Pradesh' },
      { id: '2', name: 'Sunita Devi', village: 'Madhya Pradesh' }
    ];

    setArtisans(mockArtisans);
    
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const productData = {
        title: { en: formData.titleEn, hi: formData.titleHi },
        slug: formData.titleEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: { en: formData.descriptionEn, hi: formData.descriptionHi },
        shortDesc: { en: formData.shortDescEn, hi: formData.shortDescHi },
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        images: formData.images.filter(img => img.trim() !== ''),
        sku: formData.sku || formData.titleEn.toLowerCase().replace(/\s+/g, '-').substring(0, 10).toUpperCase(),
        stock: parseInt(formData.stock) || 0,
        materials: formData.materials.split(',').map(m => m.trim()).filter(m => m),
        colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        featured: formData.featured,
        bestSeller: formData.bestSeller,
        newArrival: formData.newArrival,
        trending: formData.trending,
        categoryId: formData.categoryId,
        artisanId: formData.artisanId,
        metaTitle: formData.metaTitle,
        metaDesc: formData.metaDesc
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Show success notification
        if (typeof window !== 'undefined' && (window as any).showNotification) {
          (window as any).showNotification(
            'Product added successfully!',
            'success'
          );
        }
        router.push('/admin/products');
      } else {
        alert('Failed to create product: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/admin/products" className="text-amber-600 hover:text-amber-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Add / Edit Product</h1>
            <p className="mt-1 text-sm text-gray-600">Create or update a product for your marketplace</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Title */}
              <div className="md:col-span-2">
                <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="titleEn"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Hindi Title */}
              <div className="md:col-span-2">
                <label htmlFor="titleHi" className="block text-sm font-medium text-gray-700">
                  Product Title (Hindi)
                </label>
                <input
                  type="text"
                  id="titleHi"
                  name="titleHi"
                  value={formData.titleHi}
                  onChange={handleChange}
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
                  rows={4}
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
                  rows={4}
                  value={formData.descriptionHi}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="shortDescEn" className="block text-sm font-medium text-gray-700">
                    Short Description (English)
                  </label>
                  <textarea
                    id="shortDescEn"
                    name="shortDescEn"
                    rows={2}
                    value={formData.shortDescEn}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="shortDescHi" className="block text-sm font-medium text-gray-700">
                    Short Description (Hindi)
                  </label>
                  <textarea
                    id="shortDescHi"
                    name="shortDescHi"
                    rows={2}
                    value={formData.shortDescHi}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Stock and SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Category and Artisan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="artisanId" className="block text-sm font-medium text-gray-700">
                    Artisan *
                  </label>
                  <select
                    id="artisanId"
                    name="artisanId"
                    value={formData.artisanId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  >
                    <option value="">Select an artisan</option>
                    {artisans.map(artisan => (
                      <option key={artisan.id} value={artisan.id}>
                        {artisan.name} ({artisan.village})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags, Materials, Colors */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="tag1, tag2, tag3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="materials" className="block text-sm font-medium text-gray-700">
                    Materials (comma separated)
                  </label>
                  <input
                    type="text"
                    id="materials"
                    name="materials"
                    value={formData.materials}
                    onChange={handleChange}
                    placeholder="material1, material2"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="colors" className="block text-sm font-medium text-gray-700">
                    Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    id="colors"
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    placeholder="color1, color2"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="ml-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  + Add Image
                </button>
              </div>

              {/* SEO */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="metaDesc" className="block text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    id="metaDesc"
                    name="metaDesc"
                    value={formData.metaDesc}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Status Flags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Status
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      Featured
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="bestSeller"
                      name="bestSeller"
                      type="checkbox"
                      checked={formData.bestSeller}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="bestSeller" className="ml-2 block text-sm text-gray-900">
                      Best Seller
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="newArrival"
                      name="newArrival"
                      type="checkbox"
                      checked={formData.newArrival}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="newArrival" className="ml-2 block text-sm text-gray-900">
                      New Arrival
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="trending"
                      name="trending"
                      type="checkbox"
                      checked={formData.trending}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="trending" className="ml-2 block text-sm text-gray-900">
                      Trending
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <Link
                href="/admin/products"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}