'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { translateToHindi } from '@/lib/translation/service';

export default function NewProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleHi: '',
    descriptionEn: '',
    descriptionHi: '',
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
    colors: ''
  });

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/login');
      return;
    }

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
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // Auto-translate English to Hindi
      if (name === 'titleEn' && !prev.titleHi) {
        newData.titleHi = translateToHindi(value);
      } else if (name === 'descriptionEn' && !prev.descriptionHi) {
        newData.descriptionHi = translateToHindi(value);
      }
      
      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (uploadedImages.length === 0) return { urls: [], filenames: [] };

    setUploading(true);
    setUploadErrors([]);
    const uploadedUrls = [];
    const uploadedFilenames = [];

    try {
      for (const file of uploadedImages) {
        // Check file size again before upload
        if (file.size > 5 * 1024 * 1024) { // 5MB
          throw new Error(`File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is 5MB.`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'products');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          uploadedUrls.push(data.url);
          uploadedFilenames.push(data.filename); // Save filename for database storage
        } else {
          throw new Error(data.error || 'Failed to upload image');
        }
      }

      return { urls: uploadedUrls, filenames: uploadedFilenames };
    } catch (error: any) {
      console.error('Error uploading images:', error);
      setUploadErrors([error.message || 'Failed to upload images']);
      throw error;
    } finally {
      setUploading(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Upload images first
      let imageResult: { urls: string[]; filenames: string[] } = { urls: [], filenames: [] };
      if (uploadedImages.length > 0) {
        const result = await uploadImages();
        imageResult = {
          urls: result.urls as string[],
          filenames: result.filenames as string[]
        };
      }

      const productData = {
        id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: { en: formData.titleEn, hi: formData.titleHi },
        slug: formData.titleEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: { en: formData.descriptionEn, hi: formData.descriptionHi },
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        images: imageResult.urls,
        imageFilenames: imageResult.filenames, // Pass filenames to database
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
        metaDesc: formData.metaDesc,
        rating: 0,
        reviewCount: 0,
        isActive: true
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
        alert('Failed to create product: ' + (result.error || 'Unknown error'));
        console.error('Product creation failed:', result);
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert('Failed to create product: ' + (error.message || error.toString() || 'Unknown error'));
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
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
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
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, titleHi: translateToHindi(prev.titleEn) }))}
                    className="px-3 py-2 bg-amber-100 text-amber-800 rounded-md text-sm hover:bg-amber-200 transition-colors"
                    title="Auto-translate to Hindi"
                  >
                    Translate
                  </button>
                </div>
              </div>

              {/* Hindi Title */}
              <div className="md:col-span-2">
                <label htmlFor="titleHi" className="block text-sm font-medium text-gray-700">
                  Product Title (Hindi)
                </label>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      id="titleHi"
                      name="titleHi"
                      value={formData.titleHi}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, titleHi: '' }))}
                    className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    title="Clear Hindi title"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* English Description */}
              <div className="md:col-span-2">
                <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                  Description (English) *
                </label>
                <div className="flex flex-col space-y-2">
                  <textarea
                    id="descriptionEn"
                    name="descriptionEn"
                    rows={4}
                    value={formData.descriptionEn}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, descriptionHi: translateToHindi(prev.descriptionEn) }))}
                    className="self-start px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-sm hover:bg-amber-200 transition-colors"
                    title="Auto-translate to Hindi"
                  >
                    Translate to Hindi
                  </button>
                </div>
              </div>

              {/* Hindi Description */}
              <div className="md:col-span-2">
                <label htmlFor="descriptionHi" className="block text-sm font-medium text-gray-700">
                  Description (Hindi)
                </label>
                <div className="flex flex-col space-y-2">
                  <textarea
                    id="descriptionHi"
                    name="descriptionHi"
                    rows={4}
                    value={formData.descriptionHi}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, descriptionHi: '' }))}
                    className="self-start px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    title="Clear Hindi description"
                  >
                    Clear
                  </button>
                </div>
              </div>



              {/* Pricing */}
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

              {/* SKU and Stock */}
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

              {/* Category and Artisan */}
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
                  <option value="">Select Category</option>
                  {categories.map((category) => (
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
                  <option value="">Select Artisan</option>
                  {artisans.map((artisan) => (
                    <option key={artisan.id} value={artisan.id}>
                      {artisan.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags, Materials, Colors */}
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
                  placeholder="e.g., handmade, traditional, eco-friendly"
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
                  placeholder="e.g., wood, metal, fabric"
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
                  placeholder="e.g., red, blue, green"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                
                {uploadErrors.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <ul className="text-sm text-red-700">
                      {uploadErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Maximum file size: 5MB per image. Supported formats: JPEG, PNG, WebP.</p>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="w-24 h-24 border rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Image</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate w-24">
                        {file.name} ({(file.size / 1024).toFixed(1)}KB)
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Select Images'}
                  </button>
                </div>
              </div>

              {/* Product Flags */}
              <div className="md:col-span-2">
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
                    Featured Product
                  </label>
                </div>
                
                <div className="flex items-center mt-2">
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
                
                <div className="flex items-center mt-2">
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
                
                <div className="flex items-center mt-2">
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

              {/* SEO */}
              <div className="md:col-span-2">
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

              <div className="md:col-span-2">
                <label htmlFor="metaDesc" className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  id="metaDesc"
                  name="metaDesc"
                  rows={2}
                  value={formData.metaDesc}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}