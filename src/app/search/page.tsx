'use client';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from '@/components/product/ProductCard';
import { useLanguage } from '@/context/LanguageContext';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const query = searchParams.get("query");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        searchResults: 'Search Results for',
        noResults: 'No matching products found. Try a different keyword.',
        searchPlaceholder: 'Search groceries, oils, dairy...',
        loading: 'Loading products, please wait...'
      },
      hi: {
        searchResults: 'के लिए खोज परिणाम',
        noResults: 'कोई मेल खाते उत्पाद नहीं मिले। कोई भिन्न कीवर्ड आज़माएँ।',
        searchPlaceholder: 'किराने की वस्तुएं, तेल, डेयरी खोजें...',
        loading: 'उत्पाद लोड हो रहे हैं, कृपया प्रतीक्षा करें...'
      }
    };
    
    return translations[language][key] || key;
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          setLoading(true);
          const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
          const data = await response.json();
          setResults(data.products || []);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        {t('searchResults')} "{query}"
      </h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">
            {t('noResults')}
          </p>
        </div>
      )}
    </div>
  );
}