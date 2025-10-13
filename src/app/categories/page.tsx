'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories as staticCategories } from '@/data/categories';
import Image from 'next/image';

interface Product {
  id: string;
  title: { en: string; hi: string };
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
}

interface CategoryOption {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const savedLanguage = (localStorage.getItem('language') as 'en' | 'hi') || 'en';
    setLanguage(savedLanguage);
    
    // Mock products data (in production, fetch from API)
    const mockProducts: Product[] = [
      {
        id: '1',
        title: { en: 'Turmeric Herbal Powder', hi: 'हल्दी हर्बल पाउडर' },
        price: 299,
        images: ['/images/categories/Gheevi_Turmeric_Pouch_Product_Shot.png'],
        category: 'herbal-powders',
        inStock: true
      },
      {
        id: '2',
        title: { en: 'Organic Forest Honey', hi: 'जैविक वन शहद' },
        price: 899,
        images: ['/images/categories/Gheevi_Organic_Forest_Honey_Jar.png'],
        category: 'organic-honey',
        inStock: true
      },
      {
        id: '3',
        title: { en: 'Ayurvedic Digestive Blend', hi: 'आयुर्वेदिक पाचन मिश्रण' },
        price: 399,
        images: ['/images/categories/Geevi_Ayurvedic_Product_Showcase.png'],
        category: 'ayurvedic-products',
        inStock: false
      },
      {
        id: '4',
        title: { en: 'Lavender Handmade Soap', hi: 'लैवेंडर हस्तनिर्मित साबुन' },
        price: 150,
        images: ['/images/categories/Geevi_Soap_Marble_Display.png'],
        category: 'handmade-soap',
        inStock: true
      },
      {
        id: '5',
        title: { en: 'Organic Candy Assortment', hi: 'जैविक कैंडी मिश्रण' },
        price: 250,
        images: ['/images/categories/Geevi_Candy_Jar_Product_Shot.png'],
        category: 'organic-candy',
        inStock: true
      },
      {
        id: '6',
        title: { en: 'Triphala Herbal Powder', hi: 'त्रिफला हर्बल पाउडर' },
        price: 349,
        images: ['/images/categories/Gheevi_Triphala_Jar_Product_Shot.png'],
        category: 'herbal-powders',
        inStock: true
      }
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price range
    result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
    
    // Sort products
    switch (sortBy) {
      case 'popularity':
        // In a real app, you would sort by popularity metrics
        break;
      case 'latest':
        // In a real app, you would sort by creation date
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, sortBy]);

  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Shop by Category",
        description: "Discover our authentic Ayurvedic and organic wellness products.",
        sortBy: "Sort By",
        priceRange: "Price Range",
        category: "Category",
        all: "All Categories",
        'herbal-powders': "Herbal Powders",
        'organic-honey': "Organic Honey",
        'ayurvedic-products': "Ayurvedic Products",
        'handmade-soap': "Handmade Soap",
        'organic-candy': "Organic Candy",
        popularity: "Popularity",
        latest: "Latest",
        priceLowToHigh: "Price (Low to High)",
        priceHighToLow: "Price (High to Low)",
        low: "Low",
        high: "High",
        emptyMessage: "No products found in this category. Please adjust your filters.",
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        items: "items"
      },
      hi: {
        title: "श्रेणी के अनुसार खरीदारी करें",
        description: "हमारे प्रामाणिक आयुर्वेदिक और जैविक स्वास्थ्य उत्पादों की खोज करें।",
        sortBy: "क्रमबद्ध करें",
        priceRange: "मूल्य सीमा",
        category: "श्रेणी",
        all: "सभी श्रेणियाँ",
        'herbal-powders': "हर्बल पाउडर",
        'organic-honey': "जैविक शहद",
        'ayurvedic-products': "आयुर्वेदिक उत्पाद",
        'handmade-soap': "हस्तनिर्मित साबुन",
        'organic-candy': "जैविक कैंडी",
        popularity: "लोकप्रियता",
        latest: "नवीनतम",
        priceLowToHigh: "मूल्य (कम से अधिक)",
        priceHighToLow: "मूल्य (अधिक से कम)",
        low: "कम",
        high: "अधिक",
        emptyMessage: "इस श्रेणी में कोई उत्पाद नहीं मिला। कृपया अपने फ़िल्टर समायोजित करें।",
        inStock: "स्टॉक में",
        outOfStock: "स्टॉक ख़त्म",
        items: "आइटम"
      }
    };
    
    return translations[language][key] || key;
  };

  // Create categories list from our static categories data
  const categories: CategoryOption[] = [
    { id: 'all', name: t('all') },
    ...staticCategories.map(category => ({
      id: category.id,
      name: language === 'en' ? category.name.en : category.name.hi
    }))
  ];

  const sortOptions = [
    { id: 'popularity', name: t('popularity') },
    { id: 'latest', name: t('latest') },
    { id: 'price-low', name: t('priceLowToHigh') },
    { id: 'price-high', name: t('priceHighToLow') }
  ];

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Filters
                </h2>

                {/* Sort By */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('sortBy')}
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('priceRange')}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('low')}: ₹{priceRange[0]}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('high')}: ₹{priceRange[1]}</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('category')}
                  </h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                      <div className="relative">
                        <img
                          src={product.images[0]}
                          alt={language === 'en' ? product.title.en : product.title.hi}
                          className="w-full h-48 object-cover"
                          onError={(e: any) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/products/placeholder.jpg';
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            product.inStock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? t('inStock') : t('outOfStock')}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {language === 'en' ? product.title.en : product.title.hi}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {categories.find(cat => cat.id === product.category)?.name || product.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-amber-600">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <Link
                            href={`/product/${product.id}`}
                            className="px-3 py-1 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                  <div className="mb-4">
                    <span className="text-6xl">🔍</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('emptyMessage')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}