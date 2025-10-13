'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  const { language } = useLanguage();

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        pageTitle: 'Page Not Found',
        heading: 'Oops! Page Not Found',
        message: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
        errorCode: 'Error Code: 404',
        goToHomepage: 'Go to Homepage',
        contactSupport: 'Contact Support'
      },
      hi: {
        pageTitle: 'पृष्ठ नहीं मिला',
        heading: 'ऊप्स! पृष्ठ नहीं मिला',
        message: 'जो पृष्ठ आप खोज रहे हैं उसे हटा दिया गया हो सकता है, उसका नाम बदल दिया गया हो सकता है, या अस्थायी रूप से अनुपलब्ध हो सकता है।',
        errorCode: 'त्रुटि कोड: 404',
        goToHomepage: 'होमपेज पर जाएं',
        contactSupport: 'समर्थन से संपर्क करें'
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-12 h-12 text-gray-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('heading')}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {t('message')}
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {t('errorCode')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="flipkart-button px-6 py-3 text-center"
          >
            {t('goToHomepage')}
          </Link>
          
          <Link 
            href="/contact" 
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-semibold rounded-sm transition-colors text-center"
          >
            {t('contactSupport')}
          </Link>
        </div>
      </div>
    </div>
  );
}