'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  title: { en: string };
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
}

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    
    // Mock products data (in production, fetch from API)
    const mockProducts: Product[] = [
      {
        id: '1',
        title: { en: 'Bamboo Wall Art' },
        price: 1500,
        images: ['/images/products/prod-bamboo-wall-art.jpg'],
        category: 'Paintings',
        inStock: true
      },
      {
        id: '2',
        title: { en: 'Tribal Necklace Set' },
        price: 800,
        images: ['/images/products/prod-tribal-necklace.jpg'],
        category: 'Jewelry',
        inStock: true
      },
      {
        id: '3',
        title: { en: 'Handwoven Basket' },
        price: 600,
        images: ['/images/products/prod-handwoven-basket.jpg'],
        category: 'Handicrafts',
        inStock: false
      },
      {
        id: '4',
        title: { en: 'Clay Pot Collection' },
        price: 1200,
        images: ['/images/products/prod-clay-pot.jpg'],
        category: 'Sculptures',
        inStock: true
      },
      {
        id: '5',
        title: { en: 'Tribal Textile Art' },
        price: 2500,
        images: ['/images/products/prod-tribal-textile.jpg'],
        category: 'Textiles',
        inStock: true
      },
      {
        id: '6',
        title: { en: 'Wooden Sculpture' },
        price: 3500,
        images: ['/images/products/prod-wooden-sculpture.jpg'],
        category: 'Sculptures',
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
        title: "Explore Tribal Art Categories",
        description: "Discover authentic tribal paintings, crafts, and handmade decor from Pachmarhi.",
        sortBy: "Sort By",
        priceRange: "Price Range",
        category: "Category",
        all: "All",
        paintings: "Paintings",
        sculptures: "Sculptures",
        handicrafts: "Handicrafts",
        jewelry: "Jewelry",
        textiles: "Textiles",
        popularity: "Popularity",
        latest: "Latest",
        priceLowToHigh: "Price (Low to High)",
        priceHighToLow: "Price (High to Low)",
        low: "Low",
        high: "High",
        emptyMessage: "No products found in this category. Please adjust your filters.",
        inStock: "In Stock",
        outOfStock: "Out of Stock"
      }
    };
    
    return translations[language][key] || key;
  };

  const categories = [
    { id: 'all', name: t('all') },
    { id: 'Paintings', name: t('paintings') },
    { id: 'Sculptures', name: t('sculptures') },
    { id: 'Handicrafts', name: t('handicrafts') },
    { id: 'Jewelry', name: t('jewelry') },
    { id: 'Textiles', name: t('textiles') }
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
                          alt={product.title.en}
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
                          {product.title.en}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {product.category}
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