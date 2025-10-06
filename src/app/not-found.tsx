'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'Page Not Found',
      message: 'Oops! The page you\'re looking for doesn\'t exist.',
      button: 'Go Back Home'
    },
    hi: {
      title: 'पृष्ठ नहीं मिला',
      message: 'ऊप्स! जिस पृष्ठ की आप तलाश कर रहे हैं वह मौजूद नहीं है।',
      button: 'घर वापस जाएं'
    }
  };

  const t = translations[language as 'en' | 'hi'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t.message}
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          {t.button}
        </Link>
      </div>
    </div>
  );
}