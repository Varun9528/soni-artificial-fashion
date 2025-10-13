'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { db } from '@/lib/database/connection';
import { useLanguage } from '@/context/LanguageContext';

interface FilterState {
  priceRange: [number, number];
  materials: string[];
  artisans: string[];
  inStock: boolean;
  sortBy: string;
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    materials: [],
    artisans: [],
    inStock: false,
    sortBy: 'featured'
  });

  // Fetch category and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = params.slug as string;
        
        // Fetch category
        const categories = await db.getAllCategories();
        const foundCategory = categories.find((c: any) => c.slug === slug);
        
        if (!foundCategory) {
          router.push('/404');
          return;
        }

        setCategory(foundCategory);
        
        // Fetch products for this category
        const searchResult = await db.searchProducts({
          category: foundCategory.id,
          limit: 100
        });
        
        setProducts(searchResult.products || []);
        setFilteredProducts(searchResult.products || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug, router]);

  useEffect(() => {
    if (!category || products.length === 0) return;

    let filtered = [...products];

    // Apply filters
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      filtered = filtered.filter(p => 
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    if (filters.materials.length > 0) {
      filtered = filtered.filter(p => 
        filters.materials.includes(p.material)
      );
    }

    if (filters.artisans.length > 0) {
      filtered = filtered.filter(p => filters.artisans.includes(p.artisanId));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'featured':
      default:
        filtered = filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }

    setFilteredProducts(filtered);
  }, [category, products, filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleMaterialToggle = (material: string) => {
    setFilters(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const handleArtisanToggle = (artisan: string) => {
    setFilters(prev => ({
      ...prev,
      artisans: prev.artisans.includes(artisan)
        ? prev.artisans.filter(a => a !== artisan)
        : [...prev.artisans, artisan]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      materials: [],
      artisans: [],
      inStock: false,
      sortBy: 'featured'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Loading category...' : 'श्रेणी लोड हो रही है...'}
          </p>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  // Get unique materials and artisans for filters
  const allMaterials = Array.from(new Set(products.map(p => p.material).filter(Boolean))) as string[];
  const allArtisans = Array.from(new Set(products.map(p => p.artisan?.name).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-amber-600">
              {language === 'en' ? 'Home' : 'होम'}
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-amber-600">
              {language === 'en' ? 'Categories' : 'श्रेणियाँ'}
            </Link>
            <span>/</span>
            <span className="text-gray-800 dark:text-gray-200">
              {category.name?.[language] || category.name?.en || category.name}
            </span>
          </nav>

          {/* Category Header */}
          <div className="mb-8">
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <Image
                src={category.image || `/images/categories/${category.slug}.png`}
                alt={category.name?.[language] || category.name?.en || category.name}
                fill
                className="object-cover"
                onError={(e: any) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/products/placeholder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl font-bold mb-2">
                    {category.name?.[language] || category.name?.en || category.name}
                  </h1>
                  <p className="text-lg opacity-90">
                    {category.description?.[language] || category.description?.en || category.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {language === 'en' ? 'Filters' : 'फ़िल्टर'}
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    {language === 'en' ? 'Clear All' : 'सभी साफ़ करें'}
                  </button>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Sort By' : 'क्रमबद्ध करें'}
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="featured">
                      {language === 'en' ? 'Featured' : 'विशेष'}
                    </option>
                    <option value="price-low">
                      {language === 'en' ? 'Price: Low to High' : 'मूल्य: कम से अधिक'}
                    </option>
                    <option value="price-high">
                      {language === 'en' ? 'Price: High to Low' : 'मूल्य: अधिक से कम'}
                    </option>
                    <option value="rating">
                      {language === 'en' ? 'Customer Rating' : 'ग्राहक रेटिंग'}
                    </option>
                    <option value="newest">
                      {language === 'en' ? 'Newest First' : 'नवीनतम पहले'}
                    </option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Price Range' : 'मूल्य सीमा'}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>₹{filters.priceRange[0]}</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* In Stock Only */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {language === 'en' ? 'In Stock Only' : 'केवल स्टॉक में'}
                    </span>
                  </label>
                </div>

                {/* Materials */}
                {allMaterials.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'en' ? 'Materials' : 'सामग्री'}
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {allMaterials.map((material) => (
                        <label key={material} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.materials.includes(material)}
                            onChange={() => handleMaterialToggle(material)}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {material}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'en' 
                    ? `Showing ${filteredProducts.length} products` 
                    : `${filteredProducts.length} उत्पाद दिखा रहे हैं`}
                </p>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg"
                >
                  <span>{language === 'en' ? 'Filters' : 'फ़िल्टर'}</span>
                  <span className="text-xs">
                    ({Object.values(filters).filter(Boolean).length})
                  </span>
                </button>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="mb-4">
                    <span className="text-6xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {language === 'en' ? 'No products found' : 'कोई उत्पाद नहीं मिला'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {language === 'en' 
                      ? 'Try adjusting your filters or search criteria' 
                      : 'अपने फ़िल्टर या खोज मानदंड समायोजित करने का प्रयास करें'}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {language === 'en' ? 'Clear Filters' : 'फ़िल्टर साफ़ करें'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}