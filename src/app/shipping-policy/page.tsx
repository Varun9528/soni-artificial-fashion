'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ShippingPolicyPage = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const content = {
    en: {
      title: "Shipping Policy",
      shippedWithin: "Orders are shipped within 2 working days.",
      deliveryTimeline: "Standard delivery timeline: 3-7 working days depending on location.",
      freeShipping: "Free shipping on orders above ₹999.",
      expressDelivery: "Express delivery option available in select pincodes.",
      contact: "For any queries regarding shipping or delivery, please contact our customer support."
    },
    hi: {
      title: "शिपिंग नीति",
      shippedWithin: "ऑर्डर 2 कार्य दिवसों के भीतर भेज दिए जाते हैं।",
      deliveryTimeline: "सामान्य डिलीवरी समय: 3-7 दिन (स्थान पर निर्भर)।",
      freeShipping: "₹999 से अधिक के ऑर्डर पर फ्री शिपिंग।",
      expressDelivery: "कुछ पिनकोड पर एक्सप्रेस डिलीवरी उपलब्ध।",
      contact: "शिपिंग या डिलीवरी के बारे में किसी भी प्रश्न के लिए, कृपया हमारे ग्राहक समर्थन से संपर्क करें।"
    }
  };

  const contactInfo = {
    email: 'support@soniartificialfashion.com',
    phone: '+91 98765 43210',
    hours: 'Monday to Saturday, 9:00 AM to 6:00 PM IST'
  };

  const t = (key: string) => content[language as keyof typeof content][key as keyof typeof content.en];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('title')}
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                    <span>{t('shippedWithin')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                    <span>{t('deliveryTimeline')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                    <span>{t('freeShipping')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                    <span>{t('expressDelivery')}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  {t('contact')}
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <span className="inline-flex items-center text-amber-600 dark:text-amber-400">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +91 98765 43210
                  </span>
                  <span className="inline-flex items-center text-amber-600 dark:text-amber-400">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@soniartificialfashion.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;