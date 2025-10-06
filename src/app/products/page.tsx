'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { products } from '@/data/products';
import { artisans } from '@/data/artisans';
import ProductCard from '@/components/product/ProductCard';

interface Product {
  id: string;
  slug: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  categoryId: string;
  artisanId: string;
  materials?: string[];
  tags?: string[];
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const artisanSlug = searchParams.get('artisan');
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState('featured');
  const [language, setLanguage] = useState('en');

  // Get artisan info if filtering by artisan
  const artisan = artisanSlug ? artisans.find(a => a.slug === artisanSlug) : null;

  useEffect(() => {
    // Filter products based on artisan if specified
    let result = [...products];
    
    if (artisan) {
      result = result.filter(product => product.artisanId === artisan.id);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.title.en.toLowerCase().includes(term) || 
        product.title.hi.toLowerCase().includes(term) ||
        product.description.en.toLowerCase().includes(term) ||
        product.description.hi.toLowerCase().includes(term) ||
        product.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.categoryId === selectedCategory);
    }
    
    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming products have a date field, for now we'll sort by ID
        break;
      default:
        // Default sorting (featured)
        break;
    }
    
    setFilteredProducts(result);
    setLoading(false);
  }, [artisan, searchTerm, selectedCategory, priceRange, sortBy]);

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.categoryId)));
  
  // Get max price for price range slider
  const maxPrice = Math.max(...products.map(p => p.price), 5000);

  const t = (key: string) => {
    const translations: any = {
      en: {
        title: artisan ? `${artisan.name}'s Products` : "All Products",
        productsFound: (count: number) => `${count} products found`,
        searchPlaceholder: "Search products...",
        allCategories: "All Categories",
        priceRange: "Price Range",
        sortBy: "Sort By",
        featured: "Featured",
        priceLowToHigh: "Price: Low to High",
        priceHighToLow: "Price: High to Low",
        rating: "Top Rated",
        newest: "Newest First",
        noProducts: "No products found matching your criteria.",
        backToArtisans: "Back to Artisans",
        backToAllProducts: "Back to All Products"
      },
      hi: {
        title: artisan ? `${artisan.name} के उत्पाद` : "सभी उत्पाद",
        productsFound: (count: number) => `${count} उत्पाद मिले`,
        searchPlaceholder: "उत्पाद खोजें...",
        allCategories: "सभी श्रेणियाँ",
        priceRange: "मूल्य सीमा",
        sortBy: "क्रमबद्ध करें",
        featured: "विशेष रुप से प्रदर्शित",
        priceLowToHigh: "मूल्य: कम से अधिक",
        priceHighToLow: "मूल्य: अधिक से कम",
        rating: "शीर्ष रेटेड",
        newest: "नवीनतम पहले",
        noProducts: "आपके मापदंडों से मेल खाने वाला कोई उत्पाद नहीं मिला।",
        backToArtisans: "कारीगरों पर वापस जाएं",
        backToAllProducts: "सभी उत्पादों पर वापस जाएं"
      }
    };
    
    return translations[language][key] || key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {t('productsFound')(filteredProducts.length)}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {artisan ? (
                <Link
                  href="/artisans"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100"
                >
                  {t('backToArtisans')}
                </Link>
              ) : (
                <button
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {language === 'en' ? 'हिंदी' : 'English'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">{t('allCategories')}</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="featured">{t('featured')}</option>
                <option value="price-low">{t('priceLowToHigh')}</option>
                <option value="price-high">{t('priceHighToLow')}</option>
                <option value="rating">{t('rating')}</option>
                <option value="newest">{t('newest')}</option>
              </select>
            </div>
            
            {!artisan && (
              <div className="flex justify-end">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {language === 'en' ? 'हिंदी' : 'English'}
                </button>
              </div>
            )}
          </div>
          
          {/* Price Range */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('priceRange')}: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} language={language} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noProducts')}</h3>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
              >
                {t('backToAllProducts')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}