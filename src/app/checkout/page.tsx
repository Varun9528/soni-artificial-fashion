'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { CreditCard, MapPin, Truck, Shield } from 'lucide-react';

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart();
  const { language } = useLanguage();
  const { user, isLoggedIn } = useAuth(); // Get user and isLoggedIn from auth context
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    // Wait for auth context to be initialized
    if (isLoggedIn) {
      setIsInitialized(true);
    } else if (typeof window !== 'undefined') {
      // Only redirect if we're sure the user is not logged in
      // and we're on the client side
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      } else {
        // Token exists but user context not set, wait a bit
        setTimeout(() => {
          if (!isLoggedIn) {
            router.push('/login');
          } else {
            setIsInitialized(true);
          }
        }, 100);
      }
    }
  }, [isLoggedIn, router]);

  // Fetch product data for items in cart
  useEffect(() => {
    const fetchProductData = async () => {
      // Create an object to store product data
      const productDataMap: Record<string, any> = {};
      
      // Fetch data for each product in the cart
      for (const item of cartState.items) {
        try {
          // Extract product ID - it's in the main productId
          const productId = item.productId;
          
          // Try to fetch product data from API using ID
          const response = await fetch(`/api/products/${productId}`);
          if (response.ok) {
            const product = await response.json();
            productDataMap[item.productId] = {
              id: product.id,
              name: product.title?.[language] || product.title?.en || product.name || `Product ${product.id}`,
              price: product.price || 0,
              image: product.productImages?.find((img: any) => img.isPrimary)?.url || product.images?.[0] || '/images/products/placeholder.jpg'
            };
          } else {
            // Fallback to cart item data
            productDataMap[item.productId] = {
              id: item.productId,
              name: `Product ${item.productId}`,
              price: 0,
              image: '/images/products/placeholder.jpg'
            };
          }

        } catch (error) {
          console.error('Error fetching product data:', error);
          // Fallback to cart item data
          productDataMap[item.productId] = {
            id: item.productId,
            name: `Product ${item.productId}`,
            price: 0,
            image: '/images/products/placeholder.jpg'
          };
        }
      }
      
      setProductData(productDataMap);
    };

    if (cartState.items.length > 0) {
      fetchProductData();
    } else {
      setIsInitialized(true); // Allow rendering even if cart is empty
    }
  }, [cartState.items, language]);

  // Calculate totals
  const subtotal = cartState.items.reduce((total, item) => {
    const product = productData[item.productId];
    const price = product ? product.price : 0;
    return total + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form data
      if (!formData.fullName || !formData.phone || !formData.address || 
          !formData.city || !formData.state || !formData.pincode) {
        alert(language === 'en' ? 'Please fill all fields.' : 'कृपया सभी फ़ील्ड भरें।');
        setLoading(false);
        return;
      }
      
      // Validate pincode format (6 digits)
      if (!/^\d{6}$/.test(formData.pincode)) {
        alert(language === 'en' ? 'Invalid pincode format. Please enter 6 digits.' : 'अमान्य पिनकोड प्रारूप। कृपया 6 अंक दर्ज करें।');
        setLoading(false);
        return;
      }
      
      // Submit order to API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartState.items.map(item => ({
            ...item,
            productData: productData[item.productId] // Include product data
          })),
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            addressLine1: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          },
          paymentMethod: formData.paymentMethod,
          subtotal,
          shipping,
          tax,
          total
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store order data in localStorage to pass to success page
        if (typeof window !== 'undefined') {
          localStorage.setItem('orderData', JSON.stringify(data.order));
        }
        
        // Clear cart and wait for it to complete
        try {
          await clearCart();
          console.log('Cart cleared successfully after order');
        } catch (clearError) {
          console.error('Error clearing cart after order:', clearError);
        }
        
        // Redirect to order success page
        router.push('/order-success');
      } else {
        alert(language === 'en' ? `Error: ${data.error}` : `त्रुटि: ${data.error}`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(language === 'en' ? 'Error placing order. Please try again.' : 'आदेश देने में त्रुटि। कृपया पुनः प्रयास करें।');
      setLoading(false);
    }
  };

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        checkoutTitle: 'Checkout',
        deliveryAddress: 'Delivery Address',
        fullName: 'Full Name',
        phone: 'Phone Number',
        address: 'Address',
        city: 'City',
        state: 'State',
        pincode: 'Pincode (6 digits)',
        paymentMethod: 'Payment Method',
        cashOnDelivery: 'Cash on Delivery',
        creditDebitCard: 'Credit/Debit Card',
        upi: 'UPI',
        orderSummary: 'Order Summary',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        tax: 'Tax',
        total: 'Total',
        placeOrder: 'Place Order',
        free: 'Free',
        items: 'items',
        backToCart: 'Back to Cart'
      },
      hi: {
        checkoutTitle: 'चेकआउट',
        deliveryAddress: 'डिलीवरी का पता',
        fullName: 'पूरा नाम',
        phone: 'फ़ोन नंबर',
        address: 'पता',
        city: 'शहर',
        state: 'राज्य',
        pincode: 'पिनकोड (6 अंक)',
        paymentMethod: 'भुगतान का तरीका',
        cashOnDelivery: 'डिलीवरी पर नकदी',
        creditDebitCard: 'क्रेडिट/डेबिट कार्ड',
        upi: 'UPI',
        orderSummary: 'आदेश सारांश',
        subtotal: 'उप-योग',
        shipping: 'शिपिंग',
        tax: 'कर',
        total: 'कुल',
        placeOrder: 'आदेश दें',
        free: 'मुफ्त',
        items: 'आइटम',
        backToCart: 'कार्ट पर वापस जाएं'
      }
    };
    
    return translations[language][key] || key;
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('checkoutTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to cart if no items
  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('checkoutTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {language === 'en' ? 'Your cart is empty. Add products to checkout.' : 'आपका कार्ट खाली है। चेकआउट करने के लिए उत्पाद जोड़ें।'}
          </p>
          <button
            onClick={() => router.push('/products')}
            className="flipkart-button px-6 py-3 inline-block"
          >
            {t('backToCart')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('checkoutTitle')}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing Information */}
          <div className="lg:col-span-2">
            <div className="flipkart-card p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {t('deliveryAddress')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('address')} *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('city')} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('state')} *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('pincode')} *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    required
                    pattern="\d{6}"
                    title={language === 'en' ? '6 digit pincode' : '6 अंकों का पिनकोड'}
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Options Section - Improved visibility */}
            <div className="flipkart-card p-6 mt-6 overflow-visible">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{t('paymentMethod')}</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    id="payment-cod"
                  />
                  <label htmlFor="payment-cod" className="ml-4 flex items-center cursor-pointer flex-grow">
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-base">{t('cashOnDelivery')}</span>
                  </label>
                </div>
                
                <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    id="payment-card"
                  />
                  <label htmlFor="payment-card" className="ml-4 flex items-center cursor-pointer flex-grow">
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-base">{t('creditDebitCard')}</span>
                  </label>
                </div>
                
                <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    id="payment-upi"
                  />
                  <label htmlFor="payment-upi" className="ml-4 flex items-center cursor-pointer flex-grow">
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-base">{t('upi')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="flipkart-card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                {t('orderSummary')}
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => {
                  const product = productData[item.productId] || {
                    name: `Product ${item.productId}`,
                    price: 0,
                    image: '/images/products/placeholder.jpg'
                  };
                  
                  return (
                    <div key={`${item.productId}-${JSON.stringify(item.variant)}`} className="flex items-center">
                      <div className="aspect-square w-16 flex-shrink-0 relative">
                        <Image
                          src={product.image || '/images/products/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover rounded-sm"
                          onError={(e: any) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/products/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-4 mb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('shipping')}</span>
                  <span className="font-medium">{shipping === 0 ? t('free') : `₹${shipping.toLocaleString('en-IN')}`}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('tax')}</span>
                  <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold">
                  <span>{t('total')}</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="flipkart-button w-full py-3 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'en' ? 'Processing...' : 'प्रसंस्करण...'}
                  </span>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    {t('placeOrder')}
                  </>
                )}
              </button>
              
              <button
                onClick={() => router.push('/cart')}
                className="block text-center mt-4 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                ← {t('backToCart')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}