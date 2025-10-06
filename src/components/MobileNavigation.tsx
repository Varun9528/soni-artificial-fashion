'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const MobileNavigation = () => {
  const pathname = usePathname();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const navItems = [
    {
      href: '/',
      label: { en: 'Home', hi: 'होम' },
      icon: '🏠'
    },
    {
      href: '/categories',
      label: { en: 'Categories', hi: 'श्रेणियाँ' },
      icon: '🏷️'
    },
    {
      href: '/wishlist',
      label: { en: 'Wishlist', hi: 'पसंदीदा' },
      icon: '❤️'
    },
    {
      href: '/cart',
      label: { en: 'Cart', hi: 'कार्ट' },
      icon: '🛒'
    },
    {
      href: '/profile/orders',
      label: { en: 'Orders', hi: 'ऑर्डर' },
      icon: '📦'
    },
    {
      href: '/profile',
      label: { en: 'Profile', hi: 'प्रोफ़ाइल' },
      icon: '👤'
    },
    {
      href: '/logout',
      label: { en: 'Logout', hi: 'लॉगआउट' },
      icon: '🚪'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700 md:hidden z-50">
      <div className="grid grid-cols-7">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 text-xs ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span>{language === 'hi' ? item.label.hi : item.label.en}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;