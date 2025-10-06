'use client';

import React from 'react';

interface MultilingualTextProps {
  en: string;
  hi: string;
  className?: string;
}

export default function MultilingualText({ en, hi, className }: MultilingualTextProps) {
  const [language, setLanguage] = React.useState<'en' | 'hi'>('en');

  React.useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('language') as 'en' | 'hi';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const text = language === 'en' ? en : hi;

  return <span className={className}>{text}</span>;
}