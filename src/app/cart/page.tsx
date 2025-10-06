'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/data/types';
import { products } from '@/data/products';

interface CartItemWithProduct extends CartItem {
  product: any;
}

export default function CartPage() {
  const { state: cartState, updateQuantity: updateQuantityFunc, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [language, setLanguage] = useState('en');
  const [cartItemsWithProducts, setCartItemsWithProducts] = useState<CartItemWithProduct[]>([]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    
    // Map cart items with product details
    const itemsWithProducts = cartState.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    }).filter(item => item.product !== null) as CartItemWithProduct[];
    
    setCartItemsWithProducts(itemsWithProducts);
  }, [cartState.items]);

  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Your Shopping Cart",
        description: "Review the items you've selected before placing your order.",
        productImage: "Product Image",
        productName: "Product Name",
        unitPrice: "Unit Price",
        quantity: "Quantity",
        subtotal: "Subtotal",
        remove: "Remove",
        cartSummary: "Cart Summary",
        subtotalLabel: "Subtotal",
        taxesShipping: "Taxes & Shipping",
        couponCode: "Coupon Code",
        applyCoupon: "Apply Coupon",
        total: "Total",
        proceedToCheckout: "Proceed to Checkout",
        emptyMessage: "Your cart is empty. Add products you want to buy here.",
        calculatedAtCheckout: "calculated at checkout"
      }
    };
    
    return translations[language][key] || key;
  };

  const updateQuantity = (productId: string, quantity: number, variant?: any) => {
    if (quantity < 1) return;
    updateQuantityFunc(productId, quantity, variant);
    // Show notification
    if (typeof window !== 'undefined' && (window as any).showNotification) {
      (window as any).showNotification(
        language === 'en' ? 'Quantity updated ✅' : 'मात्रा अपडेट की गई ✅',
        'success'
      );
    }
  };

  const removeItem = (productId: string, variant?: any) => {
    removeFromCart(productId, variant);
    // Show notification
    if (typeof window !== 'undefined' && (window as any).showNotification) {
      (window as any).showNotification(
        language === 'en' ? 'Removed from cart ✅' : 'कार्ट से हटा दिया गया ✅',
        'success'
      );
    }
  };

  const calculateSubtotal = () => {
    return cartItemsWithProducts.reduce((total: number, item: CartItemWithProduct) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal(); // In a real app, you would add taxes and shipping
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          {cartItemsWithProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <div className="col-span-3">{t('productImage')}</div>
                    <div className="col-span-3">{t('productName')}</div>
                    <div className="col-span-2">{t('unitPrice')}</div>
                    <div className="col-span-2">{t('quantity')}</div>
                    <div className="col-span-2 text-right">{t('subtotal')}</div>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cartItemsWithProducts.map((item: CartItemWithProduct) => (
                      <div key={`${item.productId}-${JSON.stringify(item.variant || {})}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center">
                        <div className="md:col-span-3 flex items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title.en}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                            onError={(e: any) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/products/placeholder.jpg';
                            }}
                          />
                          <div className="md:hidden ml-4">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {item.product.title.en}
                            </h3>
                            <p className="text-amber-600 font-semibold">
                              ₹{item.product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 hidden md:block">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.product.title.en}
                          </h3>
                        </div>
                        
                        <div className="md:col-span-2 hidden md:block">
                          <p className="text-amber-600 font-semibold">
                            ₹{item.product.price.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                              className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                              className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 flex justify-between md:justify-end items-center">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                          <button
                            onClick={() => removeItem(item.productId, item.variant)}
                            className="ml-4 text-red-600 hover:text-red-800 md:hidden"
                          >
                            {t('remove')}
                          </button>
                        </div>
                        
                        <div className="md:col-span-12 flex justify-end md:hidden">
                          <button
                            onClick={() => removeItem(item.productId, item.variant)}
                            className="text-red-600 hover:text-red-800"
                          >
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('cartSummary')}
                  </h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('subtotalLabel')}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₹{calculateSubtotal().toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('taxesShipping')}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {t('calculatedAtCheckout')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('couponCode')}</span>
                      <div className="flex">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-lg text-sm dark:bg-gray-700 dark:text-white"
                          placeholder="Enter code"
                        />
                        <button className="px-3 py-1 bg-amber-600 text-white text-sm rounded-r-lg hover:bg-amber-700">
                          {t('applyCoupon')}
                        </button>
                      </div>
                    </div>
                    
                    <hr className="border-gray-200 dark:border-gray-700 my-2" />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900 dark:text-white">{t('total')}</span>
                      <span className="text-amber-600">
                        ₹{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    href="/checkout"
                    className="block w-full text-center px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    {t('proceedToCheckout')}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <div className="mb-4">
                <span className="text-6xl">🛒</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {t('emptyMessage')}
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}