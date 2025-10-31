'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Initialize category filter from searchParams
  useEffect(() => {
    // Access searchParams using the hook in Next.js 15
    const category = searchParams?.get('category');
    if (category) {
      setFilters(prev => ({
        ...prev,
        category: category
      }));
    }
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        
        // Fetch products from API
        const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log('Fetching products from:', url); // Debug log
        const response = await fetch(url);
        const data = await response.json();
        console.log('Products data:', data); // Debug log
        
        if (data.success) {
          setProducts(data.products);
        } else {
          // Fallback to mock data if API fails
          console.error('API failed, using mock data:', data.error);
          const mockProducts = [
            {
              id: '1',
              slug: 'bamboo-wall-art',
              title: {
                en: 'Bamboo Wall Art',
                hi: 'बांस की दीवार कला'
              },
              price: 2499,
              originalPrice: 3499,
              discount: 29,
              rating: 4.5,
              reviewCount: 23,
              images: ['/images/products/bamboo-wall-art/img1.jpg'],
              category: {
                id: 'home-decor',
                name: {
                  en: 'Home Decor',
                  hi: 'घर की सजावट'
                }
              },
              artisan: {
                id: 'sarla-bai',
                name: 'Sarla Bai',
                village: 'Madhya Pradesh',
                photo: '/images/artisans/arti-sarla.jpg',
                rating: 4.8
              },
              featured: true,
              bestSeller: false,
              newArrival: false,
              trending: true
            },
            {
              id: '2',
              slug: 'handloom-sari',
              title: {
                en: 'Handloom Sari',
                hi: 'हैंडलूम साड़ी'
              },
              price: 4999,
              originalPrice: 6999,
              discount: 29,
              rating: 4.8,
              reviewCount: 45,
              images: ['/images/products/handloom-sari/img1.jpg'],
              category: {
                id: 'handloom-textiles',
                name: {
                  en: 'Handloom Textiles',
                  hi: 'हैंडलूम वस्त्र'
                }
              },
              artisan: {
                id: 'meera-gond',
                name: 'Meera Gond',
                village: 'Madhya Pradesh',
                photo: '/images/artisans/arti-meera.jpg',
                rating: 4.9
              },
              featured: true,
              bestSeller: true,
              newArrival: false,
              trending: false
            },
            {
              id: '3',
              slug: 'terracotta-necklace',
              title: {
                en: 'Terracotta Necklace',
                hi: 'टेराकोटा हार'
              },
              price: 899,
              originalPrice: 1299,
              discount: 31,
              rating: 4.3,
              reviewCount: 18,
              images: ['/images/products/terracotta-necklace/img1.jpg'],
              category: {
                id: 'jewelry',
                name: {
                  en: 'Jewelry',
                  hi: 'आभूषण'
                }
              },
              artisan: {
                id: 'ramesh-uikey',
                name: 'Ramesh Uikey',
                village: 'Madhya Pradesh',
                photo: '/images/artisans/arti-ramesh.jpg',
                rating: 4.7
              },
              featured: false,
              bestSeller: true,
              newArrival: false,
              trending: true
            },
            {
              id: '4',
              slug: 'dokra-figurine',
              title: {
                en: 'Dokra Figurine',
                hi: 'डोकरा मूर्ति'
              },
              price: 1899,
              originalPrice: 2499,
              discount: 24,
              rating: 4.6,
              reviewCount: 31,
              images: ['/images/products/dokra-figurine/img1.jpg'],
              category: {
                id: 'home-decor',
                name: {
                  en: 'Home Decor',
                  hi: 'घर की सजावट'
                }
              },
              artisan: {
                id: 'ramesh-uikey',
                name: 'Ramesh Uikey',
                village: 'Madhya Pradesh',
                photo: '/images/artisans/arti-ramesh.jpg',
                rating: 4.7
              },
              featured: false,
              bestSeller: false,
              newArrival: true,
              trending: true
            }
          ];
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data on error
        const mockProducts = [
          {
            id: '1',
            slug: 'bamboo-wall-art',
            title: {
              en: 'Bamboo Wall Art',
              hi: 'बांस की दीवार कला'
            },
            price: 2499,
            originalPrice: 3499,
            discount: 29,
            rating: 4.5,
            reviewCount: 23,
            images: ['/images/products/bamboo-wall-art/img1.jpg'],
            category: {
              id: 'home-decor',
              name: {
                en: 'Home Decor',
                hi: 'घर की सजावट'
              }
            },
            artisan: {
              id: 'sarla-bai',
              name: 'Sarla Bai',
              village: 'Madhya Pradesh',
              photo: '/images/artisans/arti-sarla.jpg',
              rating: 4.8
            },
            featured: true,
            bestSeller: false,
            newArrival: false,
            trending: true
          },
          {
            id: '2',
            slug: 'handloom-sari',
            title: {
              en: 'Handloom Sari',
              hi: 'हैंडलूम साड़ी'
            },
            price: 4999,
            originalPrice: 6999,
            discount: 29,
            rating: 4.8,
            reviewCount: 45,
            images: ['/images/products/handloom-sari/img1.jpg'],
            category: {
              id: 'handloom-textiles',
              name: {
                en: 'Handloom Textiles',
                hi: 'हैंडलूम वस्त्र'
              }
            },
            artisan: {
              id: 'meera-gond',
              name: 'Meera Gond',
              village: 'Madhya Pradesh',
              photo: '/images/artisans/arti-meera.jpg',
              rating: 4.9
            },
            featured: true,
            bestSeller: true,
            newArrival: false,
            trending: false
          },
          {
            id: '3',
            slug: 'terracotta-necklace',
            title: {
              en: 'Terracotta Necklace',
              hi: 'टेराकोटा हार'
            },
            price: 899,
            originalPrice: 1299,
            discount: 31,
            rating: 4.3,
            reviewCount: 18,
            images: ['/images/products/terracotta-necklace/img1.jpg'],
            category: {
              id: 'jewelry',
              name: {
                en: 'Jewelry',
                hi: 'आभूषण'
              }
            },
            artisan: {
              id: 'ramesh-uikey',
              name: 'Ramesh Uikey',
              village: 'Madhya Pradesh',
              photo: '/images/artisans/arti-ramesh.jpg',
              rating: 4.7
            },
            featured: false,
            bestSeller: true,
            newArrival: false,
            trending: true
          },
          {
            id: '4',
            slug: 'dokra-figurine',
            title: {
              en: 'Dokra Figurine',
              hi: 'डोकरा मूर्ति'
            },
            price: 1899,
            originalPrice: 2499,
            discount: 24,
            rating: 4.6,
            reviewCount: 31,
            images: ['/images/products/dokra-figurine/img1.jpg'],
            category: {
              id: 'home-decor',
              name: {
                en: 'Home Decor',
                hi: 'घर की सजावट'
              }
            },
            artisan: {
              id: 'ramesh-uikey',
              name: 'Ramesh Uikey',
              village: 'Madhya Pradesh',
              photo: '/images/artisans/arti-ramesh.jpg',
              rating: 4.7
            },
            featured: false,
            bestSeller: false,
            newArrival: true,
            trending: true
          }
        ];
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (page: number) => {
    // Handle pagination
    console.log('Page changed to:', page);
  };

  const t = (key: string) => {
    // Simple translation function
    const translations: any = {
      en: {
        productsTitle: 'Products',
        featured: 'Featured',
        priceLowToHigh: 'Price: Low to High',
        priceHighToLow: 'Price: High to Low',
        newArrivals: 'New Arrivals',
        bestSellers: 'Best Sellers',
        filter: 'Filter',
        clearFilters: 'Clear Filters',
        sortBy: 'Sort By',
        categories: 'Categories',
        priceRange: 'Price Range',
        min: 'Min',
        max: 'Max',
        applyFilters: 'Apply Filters'
      },
      hi: {
        productsTitle: 'उत्पाद',
        featured: 'विशेष रुप से प्रदर्शित',
        priceLowToHigh: 'मूल्य: कम से अधिक',
        priceHighToLow: 'मूल्य: अधिक से कम',
        newArrivals: 'नए आगमन',
        bestSellers: 'सर्वश्रेष्ठ विक्रेता',
        filter: 'फ़िल्टर',
        clearFilters: 'फ़िल्टर साफ़ करें',
        sortBy: 'इसके अनुसार क्रमबद्ध करें',
        categories: 'श्रेणियाँ',
        priceRange: 'मूल्य सीमा',
        min: 'न्यूनतम',
        max: 'अधिकतम',
        applyFilters: 'फ़िल्टर लागू करें'
      }
    };
    
    return translations[language]?.[key] || key;
  };

  const categories = [
    { id: 'home-decor', name: { en: 'Home Decor', hi: 'घर की सजावट' } },
    { id: 'handloom-textiles', name: { en: 'Handloom Textiles', hi: 'हैंडलूम वस्त्र' } },
    { id: 'jewelry', name: { en: 'Jewelry', hi: 'आभूषण' } },
    { id: 'tribal-shirts', name: { en: 'Tribal Shirts', hi: 'जनजातीय शर्ट' } },
    { id: 'accessories', name: { en: 'Accessories', hi: 'सहायक उपकरण' } },
    { id: 'art-paintings', name: { en: 'Art & Paintings', hi: 'कला और चित्रकारी' } }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          {t('productsTitle')}
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm py-2 pl-3 pr-10 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="featured">{t('featured')}</option>
              <option value="price-asc">{t('priceLowToHigh')}</option>
              <option value="price-desc">{t('priceHighToLow')}</option>
              <option value="newest">{t('newArrivals')}</option>
              <option value="best-selling">{t('bestSellers')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {/* Mock pagination data */}
      {products.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              1
            </button>
            <button className="px-3 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              2
            </button>
            <button className="px-3 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              3
            </button>
            <span className="px-3 py-1 text-gray-500 dark:text-gray-400">...</span>
            <button className="px-3 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              10
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}