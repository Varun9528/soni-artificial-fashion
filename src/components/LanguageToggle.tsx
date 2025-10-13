'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      title={language === 'en' ? 'हिंदी में स्विच करें' : 'Switch to English'}
    >
      <Languages className="w-5 h-5 text-gray-700 dark:text-gray-300" />
    </button>
  );
}