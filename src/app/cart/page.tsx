'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Minus, Plus, X, ShoppingCart as CartIcon } from 'lucide-react';

export default function CartPage() {
  const { state: cartState, removeFromCart, updateQuantity } = useCart();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<Record<string, any>>({});

  // Fetch product data for items in cart
  useEffect(() => {
    const fetchProductData = async () => {
      // Create an object to store product data
      const productDataMap: Record<string, any> = {};
      
      // Fetch data for each product in the cart
      for (const item of cartState.items) {
        try {
          // Extract product ID - it might be in the variant or the main productId
          const productId = item.variant?.slug || item.productId;
          
          // Fetch product data from API
          const response = await fetch(`/api/products/${productId}`);
          if (response.ok) {
            const product = await response.json();
            productDataMap[item.productId] = {
              id: product.id,
              name: product.title?.[language] || product.title?.en || product.name || `Product ${product.id}`,
              price: product.price || 0,
              image: product.images?.[0] || product.productImages?.[0]?.url || '/images/products/placeholder.jpg',
              stock: product.stock || 10
            };
          } else {
            // Fallback to variant data if available
            productDataMap[item.productId] = {
              id: item.productId,
              name: item.variant?.title || `Product ${item.productId}`,
              price: item.variant?.price || 0,
              image: '/images/products/placeholder.jpg',
              stock: item.variant?.stock || 10
            };
          }
        } catch (error) {
          console.error('Error fetching product data:', error);
          // Fallback data
          productDataMap[item.productId] = {
            id: item.productId,
            name: item.variant?.title || `Product ${item.productId}`,
            price: item.variant?.price || 0,
            image: '/images/products/placeholder.jpg',
            stock: item.variant?.stock || 10
          };
        }
      }
      
      setProductData(productDataMap);
    };

    if (cartState.items.length > 0) {
      fetchProductData();
    }
  }, [cartState.items, language]);

  // Calculate totals
  const subtotal = cartState.items.reduce((total, item) => {
    const product = productData[item.productId];
    const price = product ? product.price : (item.variant?.price || 0);
    return total + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Redirect to checkout page
      window.location.href = '/checkout';
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        cartTitle: 'Shopping Cart',
        emptyCart: 'Your cart is empty',
        continueShopping: 'Continue Shopping',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        tax: 'Tax',
        total: 'Total',
        proceedToCheckout: 'Proceed to Checkout',
        removeFromCart: 'Remove from cart',
        quantity: 'Quantity',
        free: 'Free',
        cartEmptyMessage: 'Your cart is empty. Add products you want to buy here.',
        items: 'items',
        left: 'left'
      },
      hi: {
        cartTitle: 'खरीदारी कार्ट',
        emptyCart: 'आपका कार्ट खाली है',
        continueShopping: 'खरीदारी जारी रखें',
        subtotal: 'उप-योग',
        shipping: 'शिपिंग',
        tax: 'कर',
        total: 'कुल',
        proceedToCheckout: 'चेकआउट करें',
        removeFromCart: 'कार्ट से हटाएं',
        quantity: 'मात्रा',
        free: 'मुफ्त',
        cartEmptyMessage: 'आपका कार्ट खाली है। जो उत्पाद आप खरीदना चाहते हैं उन्हें यहां जोड़ें।',
        items: 'आइटम',
        left: 'बचे हैं'
      }
    };
    
    return translations[language][key] || key;
  };

  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CartIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('cartTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{t('cartEmptyMessage')}</p>
          <Link 
            href="/products" 
            className="flipkart-button px-6 py-3 inline-block"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('cartTitle')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {cartState.items.map((item) => (
              <CartItem 
                key={`${item.productId}-${JSON.stringify(item.variant)}`} 
                item={item} 
                product={productData[item.productId]}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                language={language}
              />
            ))}
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="flipkart-card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('shipping')}</span>
                <span className="font-medium">{shipping === 0 ? t('free') : `₹${shipping}`}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('tax')}</span>
                <span className="font-medium">₹{tax.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold">
                <span>{t('total')}</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flipkart-button w-full py-3 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                t('proceedToCheckout')
              )}
            </button>
            
            <Link 
              href="/products" 
              className="block text-center mt-4 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              {t('continueShopping')} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, product, onRemove, onUpdateQuantity, language }: { 
  item: any; 
  product: any;
  onRemove: (productId: string, variant?: any) => void;
  onUpdateQuantity: (productId: string, quantity: number, variant?: any) => void;
  language: string;
}) {
  const [imageError, setImageError] = useState(false);
  
  // Use product data or fallback to defaults
  const productName = product?.name || item.variant?.title || `Product ${item.productId}`;
  const productPrice = product?.price || item.variant?.price || 0;
  const productImage = product?.image || '/images/products/placeholder.jpg';
  const productStock = product?.stock || item.variant?.stock || 10;
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= productStock) {
      onUpdateQuantity(item.productId, newQuantity, item.variant);
    }
  };
  
  const handleRemove = () => {
    onRemove(item.productId, item.variant);
  };

  return (
    <div className="flipkart-card p-4 flex flex-col sm:flex-row gap-4">
      {/* Product image */}
      <div className="aspect-square w-full sm:w-32 flex-shrink-0 relative">
        {!imageError ? (
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover rounded-sm"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-sm flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">No image</span>
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{productName}</h3>
            <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">₹{productPrice.toLocaleString()}</p>
          </div>
          <button 
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            title={language === 'en' ? 'Remove from cart' : 'कार्ट से हटाएं'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Variant info - if available */}
        {item.variant && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {Object.entries(item.variant).map(([key, value]) => (
              <span key={key} className="inline-block mr-2 capitalize">
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
        
        {/* Quantity controls */}
        <div className="flex items-center mt-4">
          <span className="text-gray-600 dark:text-gray-400 mr-3">{language === 'en' ? 'Quantity' : 'मात्रा'}:</span>
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-sm">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-gray-900 dark:text-white">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= productStock}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
            ({productStock} {language === 'en' ? 'left' : 'बचे हैं'})
          </span>
        </div>
        
        {/* Total for this item */}
        <div className="mt-4 font-semibold text-gray-900 dark:text-white">
          Total: ₹{(productPrice * item.quantity).toLocaleString()}
        </div>
      </div>
    </div>
  );
}