'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  id: string;
  slug: string;
  title: { en: string; hi: string };
  price: number;
  original_price?: number;
  productImages: { url: string }[];
  images: string[];
  category: {
    id: string;
    name: { en: string; hi: string };
    slug: string;
  };
  inStock: boolean;
  stock: number;
}

interface CategoryOption {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const savedLanguage = (localStorage.getItem('language') as 'en' | 'hi') || 'en';
    setLanguage(savedLanguage);
    
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match our Product interface
          const transformedProducts = data.products.map((product: any) => ({
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            original_price: product.original_price,
            productImages: product.productImages || [],
            images: product.images || [],
            category: product.category,
            inStock: product.stock > 0,
            stock: product.stock || 0
          }));
          
          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [setLanguage]);

  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category?.id === selectedCategory);
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

  // Create categories list from jewelry categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'cat-002', name: 'Necklaces' },
    { id: 'cat-003', name: 'Earrings' },
    { id: 'cat-004', name: 'Bracelets' },
    { id: 'cat-005', name: 'Rings' },
    { id: 'cat-007', name: 'Women\'s Collection' },
    { id: 'cat-006', name: 'Men\'s Collection' }
  ];

  const sortOptions = [
    { id: 'popularity', name: 'Popularity' },
    { id: 'latest', name: 'Latest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Shop Our Collection
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover our beautiful collection of handcrafted artificial jewelry
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sort By</h3>
                <div className="space-y-3">
                  {sortOptions.map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`sort-${option.id}`}
                        name="sort"
                        type="radio"
                        checked={sortBy === option.id}
                        onChange={() => setSortBy(option.id)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                      />
                      <label htmlFor={`sort-${option.id}`} className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                        {option.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Price Range</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Low: ₹{priceRange[0]}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">High: ₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Category</h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        id={`category-${category.id}`}
                        name="category"
                        type="radio"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                Showing {filteredProducts.length} products
              </div>
            </div>

            <div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                      <div className="relative">
                        <Image
                          src={product.productImages[0]?.url || product.images[0] || '/images/products/placeholder.jpg'}
                          alt={language === 'en' ? product.title.en : product.title.hi}
                          width={400}
                          height={192}
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
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {language === 'en' ? product.title.en : product.title.hi}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {product.category ? (language === 'en' ? product.category.name.en : product.category.name.hi) : ''}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-amber-600">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <Link
                            href={`/product/${product.slug}`}
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
                    No products found matching your criteria
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