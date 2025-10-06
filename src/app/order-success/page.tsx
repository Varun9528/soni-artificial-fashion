'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { pushNotificationService } from '@/lib/pushNotificationService';

// Mock localization function (in production, use a proper i18n library)
const t = (key: string, lang: string = 'en') => {
  const translations: any = {
    en: {
      orderSuccessTitle: "Order Placed Successfully!",
      orderSuccessMessage: "✅ Your order has been successfully placed! Thank you for supporting Pachmarhi artisans.",
      orderDetails: "Order Details",
      orderNumber: "Order ID: [auto-generated]",
      paymentMethod: "Payment Method:",
      orderStatus: "Order Status:",
      estimatedDelivery: "Estimated Delivery:",
      itemsOrdered: "Items Ordered",
      shippingAddress: "Shipping Address",
      whatNext: "What's Next?",
      emailConfirmation: "You'll receive a confirmation email shortly with your order details.",
      shipmentNotification: "We'll notify you when your order is packed and shipped.",
      trackOrder: "Track your order status in the 'My Orders' section.",
      contactSupport: "Contact us if you have any questions about your order.",
      trackYourOrder: "Track Your Order",
      continueShopping: "Continue Shopping",
      needHelp: "Need Help?",
      immediateAssistance: "Need immediate assistance?",
      callUs: "+91 9876543210",
      emailUs: "support@pachmarhi.com",
      liveChat: "Live Chat",
      paymentSuccess: "✅ Payment successful – Your order is confirmed!",
      paymentFailed: "❌ Payment failed – Please try again or use another method.",
      paymentPending: "⏳ Payment pending – Waiting for bank confirmation."
    },
    hi: {
      orderSuccessTitle: "ऑर्डर सफलतापूर्वक दिया गया!",
      orderSuccessMessage: "✅ आपका ऑर्डर सफलतापूर्वक place किया गया! पचमढ़ी के कारीगरों का समर्थन करने के लिए धन्यवाद।",
      orderDetails: "ऑर्डर विवरण",
      orderNumber: "ऑर्डर आईडी: [auto-generated]",
      paymentMethod: "भुगतान विधि:",
      orderStatus: "ऑर्डर स्थिति:",
      estimatedDelivery: "अनुमानित डिलीवरी:",
      itemsOrdered: "आदेश दिए गए आइटम",
      shippingAddress: "शिपिंग पता",
      whatNext: "आगे क्या है?",
      emailConfirmation: "आपको अपने ऑर्डर विवरण के साथ जल्द ही एक पुष्टि ईमेल प्राप्त होगा।",
      shipmentNotification: "जब आपका ऑर्डर पैक और भेजा जाएगा तो हम आपको सूचित करेंगे।",
      trackOrder: "मेरे ऑर्डर अनुभाग में अपने ऑर्डर की स्थिति को ट्रैक करें।",
      contactSupport: "यदि आपके ऑर्डर के बारे में कोई प्रश्न हैं तो हमसे संपर्क करें।",
      trackYourOrder: "अपने ऑर्डर को ट्रैक करें",
      continueShopping: "खरीददारी जारी रखें",
      needHelp: "सहायता की आवश्यकता है?",
      immediateAssistance: "तत्काल सहायता की आवश्यकता है?",
      callUs: "+91 9876543210",
      emailUs: "support@pachmarhi.com",
      liveChat: "लाइव चैट",
      paymentSuccess: "✅ भुगतान सफल – आपका ऑर्डर पुष्टि हो गया है!",
      paymentFailed: "❌ भुगतान असफल – कृपया पुनः प्रयास करें या अन्य विधि का उपयोग करें।",
      paymentPending: "⏳ भुगतान लंबित – बैंक पुष्टि की प्रतीक्षा में।"
    }
  };
  
  return translations[lang][key] || key;
};

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en'); // Default to English
  const [paymentStatus, setPaymentStatus] = useState('success'); // Default to success

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    const statusParam = searchParams.get('status') || 'success';
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setLanguage(savedLanguage);
    setPaymentStatus(statusParam);
    
    if (!orderIdParam) {
      router.push('/');
      return;
    }

    setOrderId(orderIdParam);
    
    // Mock order details (in production, fetch from API)
    const mockOrderDetails = {
      id: orderIdParam,
      orderNumber: orderIdParam,
      status: 'confirmed',
      totalAmount: 2300,
      items: [
        {
          product: {
            title: { en: 'Bamboo Wall Art', hi: 'बांस की दीवार कला' },
            price: 1500,
            images: ['/images/products/prod-bamboo-wall-art.jpg']
          },
          quantity: 1
        },
        {
          product: {
            title: { en: 'Handwoven Basket', hi: 'हाथ से बुनी टोकरी' },
            price: 800,
            images: ['/images/products/prod-handwoven-basket.jpg']
          },
          quantity: 1
        }
      ],
      paymentMethod: 'Online Payment',
      estimatedDelivery: '5-7 business days',
      shippingAddress: {
        name: 'John Doe',
        phone: '+91 9876543210',
        address: '123 Gandhi Nagar, Near Market',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462001'
      }
    };
    
    setOrderDetails(mockOrderDetails);
    setLoading(false);
    
    // Show success notification
    if (statusParam === 'success' && typeof window !== 'undefined' && (window as any).showNotification) {
      (window as any).showNotification(
        savedLanguage === 'en' ? 'Order placed successfully! ✅' : 'आदेश सफलतापूर्वक place किया गया! ✅',
        'success'
      );
    }
    
    // Request notification permission and send order confirmation notification
    const sendNotifications = async () => {
      await pushNotificationService.requestPermission();
      pushNotificationService.setLanguage(savedLanguage);
      
      // Send order confirmation notification
      if (statusParam === 'success') {
        await pushNotificationService.sendNotification({
          title: "Order Confirmed",
          body: `Your order #${orderIdParam} has been confirmed!`,
          tag: `order-confirmed-${orderIdParam}`
        });
      }
    };
    
    sendNotifications();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Payment Status Message */}
          <div className="text-center mb-6">
            {paymentStatus === 'success' && (
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                <span className="mr-2">✅</span>
                <span>{t('paymentSuccess', language)}</span>
              </div>
            )}
            {paymentStatus === 'failed' && (
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full">
                <span className="mr-2">❌</span>
                <span>{t('paymentFailed', language)}</span>
              </div>
            )}
            {paymentStatus === 'pending' && (
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                <span className="mr-2">⏳</span>
                <span>{t('paymentPending', language)}</span>
              </div>
            )}
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('orderSuccessTitle', language)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('orderSuccessMessage', language)}
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('orderDetails', language)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('orderNumber', language)}</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{orderDetails?.orderNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('paymentMethod', language)}</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{orderDetails?.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('orderStatus', language)}</span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Confirmed
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('estimatedDelivery', language)}</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{orderDetails?.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{t('itemsOrdered', language)}</h3>
              <div className="space-y-3">
                {orderDetails?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img
                      src={item.product.images[0]}
                      alt={language === 'hi' && item.product.title.hi ? item.product.title.hi : item.product.title.en}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {language === 'hi' && item.product.title.hi ? item.product.title.hi : item.product.title.en}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900 dark:text-white">Total Amount:</span>
                <span className="text-xl font-bold text-amber-600">
                  ₹{orderDetails?.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              {t('shippingAddress', language)}
            </h3>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-white">{orderDetails?.shippingAddress?.name}</p>
              <p>{orderDetails?.shippingAddress?.address}</p>
              <p>{orderDetails?.shippingAddress?.city}, {orderDetails?.shippingAddress?.state} - {orderDetails?.shippingAddress?.pincode}</p>
              <p>Phone: {orderDetails?.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-amber-800 dark:text-amber-200 mb-3">
              {t('whatNext', language)}
            </h3>
            <ul className="space-y-2 text-amber-700 dark:text-amber-300">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>{t('emailConfirmation', language)}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📦</span>
                <span>{t('shipmentNotification', language)}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🚛</span>
                <span>{t('trackOrder', language)}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💬</span>
                <span>{t('contactSupport', language)}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile/orders"
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-center font-medium"
            >
              {t('trackYourOrder', language)}
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center font-medium"
            >
              {t('continueShopping', language)}
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center font-medium"
            >
              {t('needHelp', language)}
            </Link>
          </div>

          {/* Customer Support */}
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t('immediateAssistance', language)}
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <span className="flex items-center">
                <span className="mr-1">📞</span>
                {t('callUs', language)}
              </span>
              <span className="flex items-center">
                <span className="mr-1">📧</span>
                {t('emailUs', language)}
              </span>
              <span className="flex items-center">
                <span className="mr-1">💬</span>
                {t('liveChat', language)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}