'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: { en: string; hi: string };
    slug: string;
  };
  artisan: {
    id: string;
    name: string;
    village: string;
  };
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  trending: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.query) params.append('q', filters.query);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (filters.query) params.append('q', filters.query);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    
    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const t = (key: string) => {
    const translations: any = {
      en: {
        searchResults: "Search Results",
        noResults: "No products found matching your criteria.",
        tryDifferent: "Try different search terms or adjust your filters.",
        sortBy: "Sort by",
        relevance: "Relevance",
        priceLowHigh: "Price: Low to High",
        priceHighLow: "Price: High to Low",
        rating: "Rating",
        newest: "Newest",
        popularity: "Popularity",
        name: "Name",
        filter: "Filter",
        category: "Category",
        priceRange: "Price Range",
        min: "Min",
        max: "Max",
        applyFilters: "Apply Filters",
        clearFilters: "Clear Filters",
        showing: "Showing",
        of: "of",
        results: "results"
      },
      hi: {
        searchResults: "खोज परिणाम",
        noResults: "आपके मापदंडों से मेल खाने वाला कोई उत्पाद नहीं मिला।",
        tryDifferent: "अलग खोज शब्द आज़माएँ या अपने फ़िल्टर समायोजित करें।",
        sortBy: "क्रमबद्ध करें",
        relevance: "प्रासंगिकता",
        priceLowHigh: "मूल्य: कम से अधिक",
        priceHighLow: "मूल्य: अधिक से कम",
        rating: "रेटिंग",
        newest: "नवीनतम",
        popularity: "लोकप्रियता",
        name: "नाम",
        filter: "फ़िल्टर",
        category: "श्रेणी",
        priceRange: "मूल्य सीमा",
        min: "न्यूनतम",
        max: "अधिकतम",
        applyFilters: "फ़िल्टर लागू करें",
        clearFilters: "फ़िल्टर साफ़ करें",
        showing: "दिखा रहे हैं",
        of: "का",
        results: "परिणाम"
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('searchResults')}</h1>
          {filters.query && (
            <p className="mt-1 text-sm text-gray-600">
              {t('showing')} {pagination?.totalProducts || 0} {t('results')} "{filters.query}"
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">{t('filter')}</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden text-amber-600 hover:text-amber-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSearch} className={`${showFilters ? 'block' : 'hidden md:block'}`}>
                {/* Search Input */}
                <div className="mb-4">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('searchResults')}
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={filters.query}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    placeholder="Search products..."
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('category')}
                  </label>
                  <select
                    id="category"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="home-decor">Home Decor</option>
                    <option value="clothing">Clothing</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('priceRange')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="minPrice" className="block text-xs text-gray-500 mb-1">
                        {t('min')}
                      </label>
                      <input
                        type="number"
                        id="minPrice"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="maxPrice" className="block text-xs text-gray-500 mb-1">
                        {t('max')}
                      </label>
                      <input
                        type="number"
                        id="maxPrice"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        placeholder="10000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('sortBy')}
                  </label>
                  <select
                    id="sortBy"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  >
                    <option value="relevance">{t('relevance')}</option>
                    <option value="price_low_high">{t('priceLowHigh')}</option>
                    <option value="price_high_low">{t('priceHighLow')}</option>
                    <option value="rating">{t('rating')}</option>
                    <option value="newest">{t('newest')}</option>
                    <option value="popularity">{t('popularity')}</option>
                    <option value="name">{t('name')}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    {t('applyFilters')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({
                        query: '',
                        category: 'all',
                        minPrice: '',
                        maxPrice: '',
                        sortBy: 'relevance'
                      });
                      router.push('/search');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    {t('clearFilters')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                    <div className="flex flex-1 justify-between sm:hidden">
                      {pagination.hasPrevPage && (
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('page', (pagination.currentPage - 1).toString());
                            router.push(`/search?${params.toString()}`);
                          }}
                          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Previous
                        </button>
                      )}
                      {pagination.hasNextPage && (
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('page', (pagination.currentPage + 1).toString());
                            router.push(`/search?${params.toString()}`);
                          }}
                          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Next
                        </button>
                      )}
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          {t('showing')} <span className="font-medium">{(pagination.currentPage - 1) * 12 + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(pagination.currentPage * 12, pagination.totalProducts)}
                          </span>{' '}
                          of <span className="font-medium">{pagination.totalProducts}</span> {t('results')}
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          {pagination.hasPrevPage && (
                            <button
                              onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('page', (pagination.currentPage - 1).toString());
                                router.push(`/search?${params.toString()}`);
                              }}
                              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            >
                              <span className="sr-only">Previous</span>
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}

                          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('page', page.toString());
                                router.push(`/search?${params.toString()}`);
                              }}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                page === pagination.currentPage
                                  ? 'z-10 bg-amber-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          {pagination.hasNextPage && (
                            <button
                              onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('page', (pagination.currentPage + 1).toString());
                                router.push(`/search?${params.toString()}`);
                              }}
                              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            >
                              <span className="sr-only">Next</span>
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noResults')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('tryDifferent')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}