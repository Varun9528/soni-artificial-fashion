'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);

  // Get order data from localStorage (passed from checkout)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedOrderData = localStorage.getItem('orderData');
      if (storedOrderData) {
        setOrderData(JSON.parse(storedOrderData));
        // Clear the data after retrieving it
        localStorage.removeItem('orderData');
      }
    }
  }, []);

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: 'Order Placed Successfully!',
        message: 'Thank you for your order. Your order has been placed successfully and is being processed.',
        orderNumber: 'Order Number',
        orderTotal: 'Order Total',
        continueShopping: 'Continue Shopping',
        viewOrders: 'View My Orders'
      },
      hi: {
        title: 'आदेश सफलतापूर्वक दिया गया!',
        message: 'आपके आदेश के लिए धन्यवाद। आपका आदेश सफलतापूर्वक दिया गया है और संसाधित किया जा रहा है।',
        orderNumber: 'आदेश संख्या',
        orderTotal: 'आदेश कुल',
        continueShopping: 'खरीदारी जारी रखें',
        viewOrders: 'मेरे आदेश देखें'
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('title')}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('message')}
        </p>
        
        {orderData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('orderNumber')}</p>
                <p className="font-medium">#{orderData.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('orderTotal')}</p>
                <p className="font-medium">₹{orderData.totalAmount?.toLocaleString('en-IN') || '0'}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products" 
            className="flipkart-button px-6 py-3 inline-block text-center"
          >
            {t('continueShopping')}
          </Link>
          <Link 
            href="/profile/orders" 
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 inline-block text-center"
          >
            {t('viewOrders')}
          </Link>
        </div>
      </div>
    </div>
  );
}