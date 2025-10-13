'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Upload } from 'lucide-react';

export default function AddProduct() {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: { en: '', hi: '' },
    slug: '',
    description: { en: '', hi: '' },
    shortDesc: { en: '', hi: '' },
    price: '',
    originalPrice: '',
    stock: '',
    sku: '',
    categoryId: '',
    artisanId: '',
    featured: false,
    bestSeller: false,
    newArrival: false,
    trending: false,
    isActive: true,
    metaTitle: '',
    metaDesc: '',
    materials: [] as string[],
    colors: [] as string[],
  });

  const [newMaterial, setNewMaterial] = useState('');
  const [newColor, setNewColor] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [categoriesRes, artisansRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/artisans')
        ]);

        const categoriesData = await categoriesRes.json();
        const artisansData = await artisansRes.json();

        if (categoriesData.success) {
          setCategories(categoriesData.categories);
        }

        if (artisansData.success) {
          setArtisans(artisansData.artisans);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      // Handle nested properties like title.en
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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

  const handleAddMaterial = () => {
    if (newMaterial.trim() && !formData.materials.includes(newMaterial.trim())) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m !== material)
    }));
  };

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }));
      setNewColor('');
    }
  };

  const handleRemoveColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const uploadImages = async () => {
    if (uploadedImages.length === 0) return [];

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of uploadedImages) {
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
        } else {
          throw new Error(data.error || 'Failed to upload image');
        }
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
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
      let imageUrls = [];
      if (uploadedImages.length > 0) {
        imageUrls = await uploadImages();
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          stock: parseInt(formData.stock)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Product added successfully!');
        router.push('/admin/products');
      } else {
        alert('Error adding product: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="text-amber-600 hover:text-amber-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Product</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Product Information</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name (English) *
                    </label>
                    <input
                      type="text"
                      name="title.en"
                      value={formData.title.en}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name (Hindi)
                    </label>
                    <input
                      type="text"
                      name="title.hi"
                      value={formData.title.hi}
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
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
                      Description (English) *
                    </label>
                    <textarea
                      name="description.en"
                      value={formData.description.en}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Hindi)
                    </label>
                    <textarea
                      name="description.hi"
                      value={formData.description.hi}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description (English)
                    </label>
                    <textarea
                      name="shortDesc.en"
                      value={formData.shortDesc.en}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description (Hindi)
                    </label>
                    <textarea
                      name="shortDesc.hi"
                      value={formData.shortDesc.hi}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing and Inventory */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Pricing & Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name?.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Artisan */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Artisan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artisan *
                    </label>
                    <select
                      name="artisanId"
                      value={formData.artisanId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select Artisan</option>
                      {artisans.map((artisan: any) => (
                        <option key={artisan.id} value={artisan.id}>
                          {artisan.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Materials</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.materials.map((material) => (
                    <span
                      key={material}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                    >
                      {material}
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(material)}
                        className="ml-1 text-amber-600 hover:text-amber-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    placeholder="Add material"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="px-4 py-2 bg-amber-600 text-white rounded-r-lg hover:bg-amber-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Colors</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.colors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="ml-1 text-amber-600 hover:text-amber-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add color"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2 bg-amber-600 text-white rounded-r-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="w-24 h-24 border rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate w-24">
                        {file.name}
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
                  >
                    Select Images
                  </button>
                </div>
              </div>
              
              {/* Form actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push('/admin/products')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Product'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}