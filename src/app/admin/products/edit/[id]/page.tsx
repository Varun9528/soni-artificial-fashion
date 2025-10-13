'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditProduct() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState(null);
  
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
    images: [] as string[],
    materials: [] as string[],
    colors: [] as string[],
  });

  const [newMaterial, setNewMaterial] = useState('');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch product data
        const productRes = await fetch(`/api/admin/products/${id}`);
        const productData = await productRes.json();
        
        if (!productData.success) {
          router.push('/admin/products');
          return;
        }
        
        setProduct(productData.product);
        
        // Set form data with product values
        setFormData({
          title: productData.product.title || { en: '', hi: '' },
          slug: productData.product.slug || '',
          description: productData.product.description || { en: '', hi: '' },
          shortDesc: productData.product.shortDesc || { en: '', hi: '' },
          price: productData.product.price?.toString() || '',
          originalPrice: productData.product.originalPrice?.toString() || '',
          stock: productData.product.stock?.toString() || '',
          sku: productData.product.sku || '',
          categoryId: productData.product.categoryId || '',
          artisanId: productData.product.artisanId || '',
          featured: productData.product.featured || false,
          bestSeller: productData.product.bestSeller || false,
          newArrival: productData.product.newArrival || false,
          trending: productData.product.trending || false,
          isActive: productData.product.isActive !== undefined ? productData.product.isActive : true,
          metaTitle: productData.product.metaTitle || '',
          metaDesc: productData.product.metaDesc || '',
          images: productData.product.productImages?.map(img => img.url) || [],
          materials: productData.product.productMaterials?.map(m => m.material) || [],
          colors: productData.product.productColors?.map(c => c.color) || [],
        });

        // Fetch categories and artisans
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

    if (id) {
      fetchData();
    }
  }, [user, router, id]);

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

  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          stock: parseInt(formData.stock)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        alert('Error updating product: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
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
        <p>Loading product data...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Product</h1>
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

              {/* Images */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Product Images</h3>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="Image URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Add Image
                  </button>
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
                    className="px-4 py-2 bg-amber-600 text-white rounded-r-lg hover:bg-amber-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Flags */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Product Flags</h3>
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
                      name="bestSeller"
                      checked={formData.bestSeller}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Best Seller</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="newArrival"
                      checked={formData.newArrival}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">New Arrival</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="trending"
                      checked={formData.trending}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Trending</span>
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

              {/* SEO */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">SEO Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDesc"
                      value={formData.metaDesc}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Link
                href="/admin/products"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}