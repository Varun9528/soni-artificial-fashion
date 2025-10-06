'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { products } from '@/data/products';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  isDefault: boolean;
}

interface ShippingOption {
  id: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  cost: number;
  minOrderValue: number | null;
  estimatedDays: number;
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: string;
  value: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
}

// Mock localization function
const t = (key: string, lang: string = 'en') => {
  const translations: any = {
    en: {
      checkout: "Checkout",
      deliveryAddress: "Delivery Address",
      pincode: "Pincode (6 digits)",
      placeOrder: "Place Order",
      orderConfirmation: "✅ Your order has been successfully placed! Thank you for supporting Pachmarhi artisans.",
      orderId: "Order ID: [auto-generated]",
      fillAllFields: "Please fill all fields.",
      invalidPincode: "Invalid pincode format. Please enter 6 digits."
    },
    hi: {
      checkout: "चेकआउट",
      deliveryAddress: "डिलीवरी का पता",
      pincode: "पिनकोड (6 अंक)",
      placeOrder: "ऑर्डर करें",
      orderConfirmation: "✅ आपका ऑर्डर सफलतापूर्वक place किया गया! पचमढ़ी के कारीगरों का समर्थन करने के लिए धन्यवाद।",
      orderId: "ऑर्डर आईडी: [auto-generated]",
      fillAllFields: "कृपया सभी फ़ील्ड भरें।",
      invalidPincode: "अमान्य पिनकोड प्रारूप। कृपया 6 अंक दर्ज करें।"
    }
  };
  
  return translations[lang][key] || key;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { state: cartState, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [step, setStep] = useState(1); // 1: Address, 2: Shipping, 3: Payment
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<string>('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Set language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    
    // Check if user is logged in
    if (!isLoggedIn) {
      router.push('/login?redirect=/checkout');
      return;
    }
    
    // Fetch user addresses, shipping options, and coupons
    fetchData();
  }, [isLoggedIn, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch addresses
      const addressesResponse = await fetch('/api/user/addresses');
      const addressesData = await addressesResponse.json();
      
      if (addressesData.success) {
        setAddresses(addressesData.addresses);
        // Select default address if available
        const defaultAddress = addressesData.addresses.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        } else if (addressesData.addresses.length > 0) {
          setSelectedAddress(addressesData.addresses[0].id);
        }
      }
      
      // Fetch shipping options
      const shippingResponse = await fetch('/api/shipping-options');
      const shippingData = await shippingResponse.json();
      
      if (shippingData.success) {
        setShippingOptions(shippingData.shippingOptions);
        // Select first shipping option by default
        if (shippingData.shippingOptions.length > 0) {
          setSelectedShippingOption(shippingData.shippingOptions[0].id);
        }
      }
      
      // Fetch available coupons
      const couponsResponse = await fetch('/api/coupons');
      const couponsData = await couponsResponse.json();
      
      if (couponsData.success) {
        setCoupons(couponsData.coupons);
      }
    } catch (err) {
      setError('Failed to load checkout data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    try {
      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          orderTotal: cartState.total
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discount);
      } else {
        setError(data.error || 'Failed to apply coupon');
      }
    } catch (err) {
      setError('Failed to apply coupon');
      console.error(err);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
  };

  const handlePlaceOrder = async () => {
    // Validate form fields
    const fullName = (document.getElementById('fullName') as HTMLInputElement)?.value;
    const address = (document.getElementById('address') as HTMLInputElement)?.value;
    const pincode = (document.getElementById('pincode') as HTMLInputElement)?.value;
    const phone = (document.getElementById('phone') as HTMLInputElement)?.value;
    
    if (!fullName || !address || !pincode || !phone) {
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(
          language === 'en' ? 'Please fill all fields.' : 'कृपया सभी फ़ील्ड भरें।',
          'error'
        );
      }
      return;
    }
    
    // Validate pincode (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(
          language === 'en' ? 'Invalid pincode. Please enter 6 digits.' : 'अमान्य पिनकोड। कृपया 6 अंक दर्ज करें।',
          'error'
        );
      }
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressId: selectedAddress,
          shippingOptionId: selectedShippingOption,
          couponId: appliedCoupon?.id,
          items: cartState.items.map((item: any) => {
            const product = products.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product?.price || 0
            };
          })
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Clear cart and redirect to order confirmation
        clearCart();
        router.push(`/order-success?orderId=${data.order.id}&status=success`);
        // Show success notification
        if (typeof window !== 'undefined' && (window as any).showNotification) {
          (window as any).showNotification(
            language === 'en' ? 'Order placed successfully! ✅' : 'आदेश सफलतापूर्वक place किया गया! ✅',
            'success'
          );
        }
      } else {
        setError(data.error || 'Failed to place order');
        if (typeof window !== 'undefined' && (window as any).showNotification) {
          (window as any).showNotification(
            data.error || 'Failed to place order',
            'error'
          );
        }
      }
    } catch (err) {
      setError('Failed to place order');
      console.error(err);
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(
          'Failed to place order',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getSelectedAddress = () => {
    return addresses.find(addr => addr.id === selectedAddress);
  };

  const getSelectedShippingOption = () => {
    return shippingOptions.find(option => option.id === selectedShippingOption);
  };

  const calculateShippingCost = () => {
    const selectedOption = getSelectedShippingOption();
    if (!selectedOption) return 0;
    
    // Free shipping if order total meets minimum or coupon provides free shipping
    if (selectedOption.minOrderValue && cartState.total >= selectedOption.minOrderValue) {
      return 0;
    }
    
    // Check if applied coupon provides free shipping
    if (appliedCoupon?.type === 'FREE_SHIPPING') {
      return 0;
    }
    
    return selectedOption.cost;
  };

  const calculateTotal = () => {
    // Calculate based on cart items with product prices
    const subtotal = cartState.items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
    const shippingCost = calculateShippingCost();
    const total = subtotal + shippingCost - couponDiscount;
    return Math.max(0, total); // Ensure total is not negative
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'hi' ? 'त्रुटि' : 'Error'}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/cart')}
              className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
            >
              {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedAddr = getSelectedAddress();
  const selectedOption = getSelectedShippingOption();
  const shippingCost = calculateShippingCost();
  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link href="/cart" className="text-amber-600 hover:text-amber-800">
            ← {language === 'hi' ? 'वापस जाएं' : 'Back to Cart'}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">
            {t('checkout', language)}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between mb-8">
                <div className={`flex-1 text-center ${step >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="text-sm font-medium">
                    {language === 'hi' ? 'पता' : 'Address'}
                  </span>
                </div>
                <div className={`flex-1 text-center ${step >= 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="text-sm font-medium">
                    {language === 'hi' ? 'शिपिंग' : 'Shipping'}
                  </span>
                </div>
                <div className={`flex-1 text-center ${step >= 3 ? 'text-amber-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 3 ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className="text-sm font-medium">
                    {language === 'hi' ? 'भुगतान' : 'Payment'}
                  </span>
                </div>
              </div>

              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {language === 'hi' ? 'डिलीवरी का पता चुनें' : 'Select Delivery Address'}
                  </h2>
                  
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer ${
                          selectedAddress === address.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                            className="mt-1 mr-3"
                          />
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-gray-900">{address.name}</h3>
                              {address.isDefault && (
                                <span className="ml-2 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded">
                                  {language === 'hi' ? 'डिफ़ॉल्ट' : 'Default'}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{address.phone}</p>
                            <p className="text-gray-600 text-sm mt-1">
                              {address.address}, {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {address.type === 'HOME' 
                                ? (language === 'hi' ? 'घर' : 'Home') 
                                : address.type === 'OFFICE' 
                                  ? (language === 'hi' ? 'ऑफिस' : 'Office') 
                                  : (language === 'hi' ? 'अन्य' : 'Other')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/profile/addresses')}
                      className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      {language === 'hi' ? '+ नया पता जोड़ें' : '+ Add New Address'}
                    </button>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedAddress}
                      className={`py-2 px-6 rounded-md ${
                        selectedAddress
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {language === 'hi' ? 'जारी रखें' : 'Continue'}
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {language === 'hi' ? 'शिपिंग विकल्प चुनें' : 'Select Shipping Options'}
                  </h2>
                  
                  <div className="space-y-4">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-4 cursor-pointer ${
                          selectedShippingOption === option.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedShippingOption(option.id)}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShippingOption === option.id}
                            onChange={() => setSelectedShippingOption(option.id)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-gray-900">
                                {language === 'hi' ? option.name.hi : option.name.en}
                              </h3>
                              <p className="font-medium text-gray-900">
                                {option.minOrderValue && cartState.total >= option.minOrderValue
                                  ? (language === 'hi' ? 'मुफ्त' : 'Free')
                                  : `₹${option.cost}`}
                              </p>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                              {language === 'hi' ? option.description.hi : option.description.en}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {language === 'hi' 
                                ? `डिलीवरी: ${option.estimatedDays} दिन` 
                                : `Delivery: ${option.estimatedDays} days`}
                            </p>
                            {option.minOrderValue && cartState.total < option.minOrderValue && (
                              <p className="text-amber-600 text-xs mt-1">
                                {language === 'hi' 
                                  ? `मुफ्त शिपिंग के लिए और ₹${(option.minOrderValue - cartState.total).toFixed(2)} की आवश्यकता है` 
                                  : `Add ₹${(option.minOrderValue - cartState.total).toFixed(2)} more for free shipping`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {language === 'hi' ? 'कूपन कोड' : 'Coupon Code'}
                    </h3>
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder={language === 'hi' ? 'कूपन कोड दर्ज करें' : 'Enter coupon code'}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode}
                        className={`px-4 py-2 rounded-r-md ${
                          couponCode
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {language === 'hi' ? 'लागू करें' : 'Apply'}
                      </button>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-green-800">{appliedCoupon.title}</p>
                            <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                          </div>
                          <div className="flex items-center">
                            <p className="font-medium text-green-800">-₹{couponDiscount.toFixed(2)}</p>
                            <button
                              onClick={handleRemoveCoupon}
                              className="ml-4 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="py-2 px-6 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      {language === 'hi' ? 'वापस' : 'Back'}
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="py-2 px-6 rounded-md bg-amber-600 text-white hover:bg-amber-700"
                    >
                      {language === 'hi' ? 'जारी रखें' : 'Continue'}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {language === 'hi' ? 'भुगतान की पुष्टि करें' : 'Confirm Payment'}
                  </h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {language === 'hi' ? 'डिलीवरी का पता' : 'Delivery Address'}
                    </h3>
                    {selectedAddr && (
                      <div className="text-sm text-gray-600">
                        <p>{selectedAddr.name}</p>
                        <p>{selectedAddr.phone}</p>
                        <p>{selectedAddr.address}</p>
                        <p>{selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {language === 'hi' ? 'शिपिंग विकल्प' : 'Shipping Option'}
                    </h3>
                    {selectedOption && (
                      <div className="text-sm text-gray-600">
                        <p>
                          {language === 'hi' ? selectedOption.name.hi : selectedOption.name.en} - 
                          {shippingCost === 0 
                            ? (language === 'hi' ? ' मुफ्त' : ' Free') 
                            : ` ₹${shippingCost}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === 'hi' 
                            ? `डिलीवरी: ${selectedOption.estimatedDays} दिन` 
                            : `Delivery: ${selectedOption.estimatedDays} days`}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {appliedCoupon && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {language === 'hi' ? 'लागू कूपन' : 'Applied Coupon'}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <p>{appliedCoupon.title}</p>
                        <p className="text-green-600">-₹{couponDiscount.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>{language === 'hi' ? 'उपयोग कुल' : 'Subtotal'}</p>
                      <p>₹{cartState.total.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                      <p>{language === 'hi' ? 'शिपिंग' : 'Shipping'}</p>
                      <p>
                        {shippingCost === 0 
                          ? (language === 'hi' ? 'मुफ्त' : 'Free') 
                          : `₹${shippingCost.toFixed(2)}`}
                      </p>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                        <p>{language === 'hi' ? 'कूपन छूट' : 'Coupon Discount'}</p>
                        <p className="text-green-600">-₹{couponDiscount.toFixed(2)}</p>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                      <p>{language === 'hi' ? 'कुल' : 'Total'}</p>
                      <p>₹{totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full py-3 px-4 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {language === 'hi' ? 'आदेश दे रहे हैं...' : 'Placing Order...'}
                        </div>
                      ) : (
                        t('placeOrder', language)
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="py-2 px-6 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      {language === 'hi' ? 'वापस' : 'Back'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'hi' ? 'आदेश का सारांश' : 'Order Summary'}
              </h2>
              
              <div className="flow-root">
                <ul className="-my-4 divide-y divide-gray-200">
                  {cartState.items.map((item: any) => (
                    <li key={item.product.id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                        <img
                          src={item.product.productImages[0]?.url || '/images/products/placeholder.jpg'}
                          alt={language === 'hi' ? item.product.title.hi : item.product.title.en}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              {language === 'hi' ? item.product.title.hi : item.product.title.en}
                            </h3>
                            <p className="ml-4">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {language === 'hi' ? 'मात्रा' : 'Qty'}: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>{language === 'hi' ? 'उपयोग कुल' : 'Subtotal'}</p>
                  <p>₹{cartState.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                  <p>{language === 'hi' ? 'शिपिंग' : 'Shipping'}</p>
                  <p>
                    {shippingCost === 0 
                      ? (language === 'hi' ? 'मुफ्त' : 'Free') 
                      : `₹${shippingCost.toFixed(2)}`}
                  </p>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                    <p>{language === 'hi' ? 'कूपन छूट' : 'Coupon Discount'}</p>
                    <p className="text-green-600">-₹{couponDiscount.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <p>{language === 'hi' ? 'कुल' : 'Total'}</p>
                  <p>₹{totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
