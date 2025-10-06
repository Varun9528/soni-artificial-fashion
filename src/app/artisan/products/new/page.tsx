'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewArtisanProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
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
    setLoading(true);
    
    try {
      // In a real implementation, submit to API
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Product created successfully!');
      router.push('/artisan/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Add New Product",
        backToProducts: "Back to Products",
        productTitleEn: "Product Title (English) *",
        productTitleHi: "Product Title (Hindi)",
        descriptionEn: "Description (English) *",
        descriptionHi: "Description (Hindi)",
        shortDescEn: "Short Description (English)",
        shortDescHi: "Short Description (Hindi)",
        price: "Price (₹) *",
        originalPrice: "Original Price (₹)",
        stock: "Stock Quantity *",
        sku: "SKU",
        weight: "Weight (grams)",
        tags: "Tags (comma separated)",
        materials: "Materials (comma separated)",
        colors: "Colors (comma separated)",
        productImages: "Product Images",
        imagePlaceholder: "Image URL",
        addImage: "Add Image",
        remove: "Remove",
        metaTitle: "Meta Title",
        metaDesc: "Meta Description",
        productStatus: "Product Status",
        featured: "Featured",
        bestSeller: "Best Seller",
        newArrival: "New Arrival",
        trending: "Trending",
        cancel: "Cancel",
        createProduct: "Create Product"
      },
      hi: {
        title: "नया उत्पाद जोड़ें",
        backToProducts: "उत्पादों पर वापस जाएं",
        productTitleEn: "उत्पाद शीर्षक (अंग्रेज़ी) *",
        productTitleHi: "उत्पाद शीर्षक (हिंदी)",
        descriptionEn: "विवरण (अंग्रेज़ी) *",
        descriptionHi: "विवरण (हिंदी)",
        shortDescEn: "संक्षिप्त विवरण (अंग्रेज़ी)",
        shortDescHi: "संक्षिप्त विवरण (हिंदी)",
        price: "मूल्य (₹) *",
        originalPrice: "मूल मूल्य (₹)",
        stock: "स्टॉक मात्रा *",
        sku: "SKU",
        weight: "वजन (ग्राम)",
        tags: "टैग (अल्पविराम से अलग)",
        materials: "सामग्री (अल्पविराम से अलग)",
        colors: "रंग (अल्पविराम से अलग)",
        productImages: "उत्पाद छवियाँ",
        imagePlaceholder: "छवि URL",
        addImage: "छवि जोड़ें",
        remove: "हटाएं",
        metaTitle: "मेटा शीर्षक",
        metaDesc: "मेटा विवरण",
        productStatus: "उत्पाद की स्थिति",
        featured: "विशेष रुप से प्रदर्शित",
        bestSeller: "सर्वश्रेष्ठ विक्रेता",
        newArrival: "नई पहुंच",
        trending: "प्रचलित",
        cancel: "रद्द करें",
        createProduct: "उत्पाद बनाएं"
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/artisan/products" className="text-amber-600 hover:text-amber-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToProducts')}
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Title */}
              <div className="md:col-span-2">
                <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700">
                  {t('productTitleEn')}
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
                  {t('productTitleHi')}
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
                  {t('descriptionEn')}
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
                  {t('descriptionHi')}
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
                    {t('shortDescEn')}
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
                    {t('shortDescHi')}
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
                    {t('price')}
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
                    {t('originalPrice')}
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
                    {t('stock')}
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
                    {t('sku')}
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
                  {t('weight')}
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

              {/* Tags, Materials, Colors */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    {t('tags')}
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
                    {t('materials')}
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
                    {t('colors')}
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
                  {t('productImages')}
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={t('imagePlaceholder')}
                      className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="ml-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        {t('remove')}
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  + {t('addImage')}
                </button>
              </div>

              {/* SEO */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                    {t('metaTitle')}
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
                    {t('metaDesc')}
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
                  {t('productStatus')}
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
                      {t('featured')}
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
                      {t('bestSeller')}
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
                      {t('newArrival')}
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
                      {t('trending')}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <Link
                href="/artisan/products"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                {t('cancel')}
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : t('createProduct')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}