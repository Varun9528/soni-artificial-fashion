'use client';

import * as React from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

  const translations = {
    en: {
      // Header translations
      'header.home': 'Home',
      'header.shop': 'Shop',
      'header.categories': 'Categories',
      'header.artisans': 'Sellers',
      'header.bestSellers': 'Best Sellers',
      'header.newArrivals': 'New Arrivals',
      'header.offers': 'Offers',
      'header.help': 'Help',
      'header.cart': 'Cart',
      'header.wishlist': 'Wishlist',
      'header.account': 'Account',
      
      // Footer translations
      'footer.quickLinks': 'Quick Links',
      'footer.customerService': 'Customer Service',
      'footer.policiesInfo': 'Policies & Info',
      'footer.stayConnected': 'Stay Connected',
      'footer.newsletterPlaceholder': 'Enter your email',
      'footer.subscribe': 'Subscribe',
      'footer.contactInfo': 'Contact Info',
      
      // Common translations
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.success': 'Success',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.add': 'Add',
      'common.remove': 'Remove',
      'common.continue': 'Continue',
      'common.back': 'Back',
      
      // Product translations
      'product.addToCart': 'Add to Cart',
      'product.buyNow': 'Buy Now',
      'product.addToWishlist': 'Add to Wishlist',
      'product.compare': 'Compare',
      'product.viewDetails': 'View Details',
      'product.outOfStock': 'Out of Stock',
      'product.inStock': 'In Stock',
      'product.price': 'Price',
      'product.description': 'Description',
      'product.specifications': 'Specifications',
      'product.reviews': 'Reviews',
      
      // Cart translations
      'cart.title': 'Shopping Cart',
      'cart.empty': 'Your cart is empty',
      'cart.subtotal': 'Subtotal',
      'cart.shipping': 'Shipping',
      'cart.total': 'Total',
      'cart.checkout': 'Proceed to Checkout',
      'cart.continueShopping': 'Continue Shopping',
      
      // Wishlist translations
      'wishlist.title': 'Wishlist',
      'wishlist.empty': 'No items in your wishlist',
      'wishlist.moveToCart': 'Move to Cart',
      
      // Checkout translations
      'checkout.title': 'Checkout',
      'checkout.billingAddress': 'Billing Address',
      'checkout.shippingAddress': 'Shipping Address',
      'checkout.paymentMethod': 'Payment Method',
      'checkout.orderSummary': 'Order Summary',
      'checkout.placeOrder': 'Place Order',
      
      // Profile translations
      'profile.title': 'My Account',
      'profile.personalInfo': 'Personal Information',
      'profile.addresses': 'Addresses',
      'profile.orders': 'My Orders',
      'profile.wishlist': 'Wishlist',
      'profile.notifications': 'Notifications',
      'profile.settings': 'Settings',
      
      // Auth translations
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.logout': 'Logout',
      'auth.forgotPassword': 'Forgot Password?',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.name': 'Name',
      'auth.rememberMe': 'Remember Me',
      
      // Admin translations
      'admin.dashboard': 'Dashboard',
      'admin.products': 'Products',
      'admin.categories': 'Categories',
      'admin.artisans': 'Sellers',
      'admin.orders': 'Orders',
      'admin.analytics': 'Analytics',
      'admin.settings': 'Settings',
      
      // Homepage translations
      'home.hero.headline': 'Welcome to Lettex Marketplace',
      'home.hero.subtext': 'Shop groceries, dairy, refined oils, and local products with trusted quality — all from your neighborhood store.',
      'home.hero.shopNow': 'Shop Now',
      'home.hero.meetArtisans': 'Explore Categories',
      'home.featuredCategories': 'Shop by Category',
      'home.featuredArtisans': 'Top Picks for You',
      'home.whyChooseUs': 'Why Choose Lettex',
      'home.whyChooseUs.authentic': 'Fresh groceries and household products delivered from local sellers.',
      'home.whyChooseUs.support': 'Trusted dairy and refined oil brands.',
      'home.whyChooseUs.secure': 'Our own Lettex products — pure, reliable, and affordable.',
      'home.whyChooseUs.eco': 'Fresh Deals of the Week',
      
      // Product page translations
      'product.title': '[Name of the product]',
      'product.description1': 'Handcrafted with care for your everyday needs.',
      'product.description2': 'Perfect for your daily essentials and special occasions.',
      'product.material': 'Category',
      'product.dimensions': 'Specifications',
      'product.weight': 'Weight',
      'product.colorOptions': 'Color Options',
      
      // Wishlist page translations
      'wishlist.header': 'Your Saved Favorites',
      
      // Cart page translations
      'cart.header': 'Your Shopping Cart',
      
      // Checkout page translations
      'checkout.header': 'Checkout',
      'checkout.deliveryAddress': 'Delivery Address',
      'checkout.pincode': 'Pincode (6 digits)',
      'checkout.orderConfirmation': '✅ Your order has been successfully placed! Thank you for supporting Lettex.',
      'checkout.orderId': 'Order ID: [auto-generated]',
      'checkout.error.fillAllFields': 'Please fill all fields.',
      'checkout.error.invalidPincode': 'Invalid pincode format. Please enter 6 digits.',
      
      // Admin panel translations
      'admin.product.add': 'Add Product',
      'admin.product.update': 'Update Product',
      'admin.product.delete': 'Delete Product',
      'admin.product.addSuccess': 'Product added successfully!',
      'admin.product.updateSuccess': 'Product updated successfully!',
      'admin.artisan.add': 'Add Seller',
      'admin.artisan.update': 'Update Seller',
      'admin.artisan.delete': 'Delete Seller',
      'admin.artisan.addSuccess': 'Seller added successfully!',
      
      // Multilingual content
      'multilingual.shopNow': 'Shop Now',
      'multilingual.addToCart': 'Add to Cart',
      'multilingual.addToWishlist': 'Add to Wishlist',
      'multilingual.cart': 'Your Shopping Cart',
      'multilingual.checkout': 'Checkout',
      'multilingual.placeOrder': 'Place Order',
      'multilingual.orderSuccess': 'Order placed successfully!',
      'multilingual.wishlistEmpty': 'Your wishlist is empty',
      'multilingual.cartEmpty': 'Your cart is empty',
      
      // Footer content
      'footer.about': 'About',
      'footer.aboutText': 'Lettex Marketplace brings your neighborhood grocery and dairy shop to your screen — offering refined oils, milk products, fresh groceries, and our own Lettex-branded essentials with unbeatable freshness and quality.',
      'footer.categories': 'Categories',
      'footer.socialMedia': 'Social Media',
      'footer.legal': 'Legal',
      'footer.terms': 'Terms & Conditions',
      'footer.privacy': 'Privacy Policy',
      'footer.refund': 'Refund Policy',
      
      // Miscellaneous
      'misc.noProducts': 'No products found.',
      'misc.loadError': 'Failed to load products. Please try again later.',
      'misc.cartUpdateError': 'Cart update failed. Please try again.',
      'misc.wishlistUpdateError': 'Wishlist update failed. Please try again.',
      'misc.addedToCart': 'Added to cart ✅',
      'misc.removedFromWishlist': 'Removed from wishlist ✅',
      'misc.quantityUpdated': 'Quantity updated ✅',
    },
    hi: {
      // Header translations
      'header.home': 'होम',
      'header.shop': 'दुकान',
      'header.categories': 'श्रेणियाँ',
      'header.artisans': 'विक्रेता',
      'header.bestSellers': 'सर्वश्रेष्ठ विक्रेता',
      'header.newArrivals': 'नए आगमन',
      'header.offers': 'ऑफर',
      'header.help': 'सहायता',
      'header.cart': 'कार्ट',
      'header.wishlist': 'इच्छा-सूची',
      'header.account': 'खाता',
      
      // Footer translations
      'footer.quickLinks': 'त्वरित लिंक',
      'footer.customerService': 'ग्राहक सेवा',
      'footer.policiesInfo': 'नीतियाँ और जानकारी',
      'footer.stayConnected': 'जुड़े रहें',
      'footer.newsletterPlaceholder': 'अपना ईमेल दर्ज करें',
      'footer.subscribe': 'सदस्यता लें',
      'footer.contactInfo': 'संपर्क जानकारी',
      
      // Common translations
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'एक त्रुटि हुई',
      'common.success': 'सफलता',
      'common.save': 'सहेजें',
      'common.cancel': 'रद्द करें',
      'common.delete': 'हटाएँ',
      'common.edit': 'संपादित करें',
      'common.view': 'देखें',
      'common.add': 'जोड़ें',
      'common.remove': 'हटाएँ',
      'common.continue': 'जारी रखें',
      'common.back': 'वापस',
      
      // Product translations
      'product.addToCart': 'कार्ट में डालें',
      'product.buyNow': 'अभी खरीदें',
      'product.addToWishlist': 'पसंद में जोड़ें',
      'product.compare': 'तुलना करें',
      'product.viewDetails': 'विवरण देखें',
      'product.outOfStock': 'स्टॉक समाप्त',
      'product.inStock': 'स्टॉक में',
      'product.price': 'मूल्य',
      'product.description': 'विवरण',
      'product.specifications': 'विनिर्देश',
      'product.reviews': 'समीक्षाएँ',
      
      // Cart translations
      'cart.title': 'खरीदारी कार्ट',
      'cart.empty': 'आपका कार्ट खाली है',
      'cart.subtotal': 'उप-योग',
      'cart.shipping': 'शिपिंग',
      'cart.total': 'कुल',
      'cart.checkout': 'चेकआउट पर जाएं',
      'cart.continueShopping': 'खरीदारी जारी रखें',
      
      // Wishlist translations
      'wishlist.title': 'इच्छा-सूची',
      'wishlist.empty': 'आपकी इच्छा-सूची में कोई आइटम नहीं है',
      'wishlist.moveToCart': 'कार्ट में ले जाएँ',
      
      // Checkout translations
      'checkout.title': 'चेकआउट',
      'checkout.billingAddress': 'बिलिंग पता',
      'checkout.shippingAddress': 'शिपिंग पता',
      'checkout.paymentMethod': 'भुगतान का तरीका',
      'checkout.orderSummary': 'आदेश सारांश',
      'checkout.placeOrder': 'आदेश दें',
      
      // Profile translations
      'profile.title': 'मेरा खाता',
      'profile.personalInfo': 'व्यक्तिगत जानकारी',
      'profile.addresses': 'पते',
      'profile.orders': 'मेरे आदेश',
      'profile.wishlist': 'इच्छा-सूची',
      'profile.notifications': 'अधिसूचनाएँ',
      'profile.settings': 'सेटिंग्स',
      
      // Auth translations
      'auth.login': 'लॉग इन करें',
      'auth.register': 'रजिस्टर करें',
      'auth.logout': 'लॉग आउट',
      'auth.forgotPassword': 'पासवर्ड भूल गए?',
      'auth.email': 'ईमेल',
      'auth.password': 'पासवर्ड',
      'auth.name': 'नाम',
      'auth.rememberMe': 'मुझे याद रखें',
      
      // Admin translations
      'admin.dashboard': 'डैशबोर्ड',
      'admin.products': 'उत्पाद',
      'admin.categories': 'श्रेणियाँ',
      'admin.artisans': 'विक्रेता',
      'admin.orders': 'आदेश',
      'admin.analytics': 'विश्लेषिकी',
      'admin.settings': 'सेटिंग्स',
      
      // Homepage translations
      'home.hero.headline': 'लेटेक्स मार्केटप्लेस में आपका स्वागत है',
      'home.hero.subtext': 'विश्वसनीय गुणवत्ता के साथ किराने की वस्तुएं, डेयरी, शोधित तेल और स्थानीय उत्पाद खरीदें — आपके पड़ोस की दुकान से।',
      'home.hero.shopNow': 'अभी खरीदें',
      'home.hero.meetArtisans': 'श्रेणियाँ देखें',
      'home.featuredCategories': 'श्रेणी के अनुसार खरीदारी करें',
      'home.featuredArtisans': 'आपके लिए शीर्ष चयन',
      'home.whyChooseUs': 'लेटेक्स क्यों चुनें?',
      'home.whyChooseUs.authentic': 'स्थानीय विक्रेताओं से ताजा किराने की वस्तुएं और गृह उत्पाद वितरित किए जाते हैं।',
      'home.whyChooseUs.support': 'विश्वसनीय डेयरी और शोधित तेल ब्रांड।',
      'home.whyChooseUs.secure': 'हमारे स्वयं के लेटेक्स उत्पाद — शुद्ध, विश्वसनीय और सस्ते।',
      'home.whyChooseUs.eco': 'सप्ताह के ताजा सौदे',
      
      // Product page translations
      'product.title': '[उत्पाद का नाम]',
      'product.description1': 'आपकी दैनिक आवश्यकताओं के लिए सावधानीपूर्वक बनाया गया।',
      'product.description2': 'आपकी दैनिक आवश्यकताओं और विशेष अवसरों के लिए उपयुक्त।',
      'product.material': 'श्रेणी',
      'product.dimensions': 'विनिर्देश',
      'product.weight': 'वजन',
      'product.colorOptions': 'रंग विकल्प',
      
      // Wishlist page translations
      'wishlist.header': 'आपकी सहेजी गई पसंदें',
      
      // Cart page translations
      'cart.header': 'आपका शॉपिंग कार्ट',
      
      // Checkout page translations
      'checkout.header': 'चेकआउट',
      'checkout.deliveryAddress': 'डिलीवरी का पता',
      'checkout.pincode': 'पिनकोड (6 अंक)',
      'checkout.orderConfirmation': '✅ आपका ऑर्डर सफलतापूर्वक place किया गया! लेटेक्स का समर्थन करने के लिए धन्यवाद।',
      'checkout.orderId': 'ऑर्डर आईडी: [auto-generated]',
      'checkout.error.fillAllFields': 'कृपया सभी फ़ील्ड भरें।',
      'checkout.error.invalidPincode': 'अमान्य पिनकोड प्रारूप। कृपया 6 अंक दर्ज करें।',
      
      // Admin panel translations
      'admin.product.add': 'उत्पाद जोड़ें',
      'admin.product.update': 'उत्पाद अपडेट करें',
      'admin.product.delete': 'उत्पाद हटाएँ',
      'admin.product.addSuccess': 'उत्पाद सफलतापूर्वक जोड़ा गया!',
      'admin.product.updateSuccess': 'उत्पाद सफलतापूर्वक अपडेट किया गया!',
      'admin.artisan.add': 'विक्रेता जोड़ें',
      'admin.artisan.update': 'विक्रेता अपडेट करें',
      'admin.artisan.delete': 'विक्रेता हटाएँ',
      'admin.artisan.addSuccess': 'विक्रेता सफलतापूर्वक जोड़ा गया!',
      
      // Multilingual content
      'multilingual.shopNow': 'अभी खरीदें',
      'multilingual.addToCart': 'कार्ट में डालें',
      'multilingual.addToWishlist': 'पसंद में जोड़ें',
      'multilingual.cart': 'आपका शॉपिंग कार्ट',
      'multilingual.checkout': 'चेकआउट',
      'multilingual.placeOrder': 'ऑर्डर करें',
      'multilingual.orderSuccess': 'ऑर्डर सफलतापूर्वक place किया गया!',
      'multilingual.wishlistEmpty': 'आपकी इच्छा-सूची खाली है',
      'multilingual.cartEmpty': 'आपका कार्ट खाली है',
      
      // Footer content
      'footer.about': 'बारे में',
      'footer.aboutText': 'लेटेक्स मार्केटप्लेस आपके स्क्रीन पर आपकी पड़ोस की किराना और डेयरी की दुकान लाता है — शोधित तेल, दूध के उत्पाद, ताजा किराने की वस्तुएं और हमारे स्वयं के लेटेक्स-ब्रांडेड आवश्यक वस्तुएं प्रदान करता है जिनकी ताजगी और गुणवत्ता अतुलनीय है।',
      'footer.categories': 'श्रेणियाँ',
      'footer.socialMedia': 'सोशल मीडिया',
      'footer.legal': 'कानूनी',
      'footer.terms': 'नियम और शर्तें',
      'footer.privacy': 'गोपनीयता नीति',
      'footer.refund': 'धनवापसी नीति',
      
      // Miscellaneous
      'misc.noProducts': 'कोई उत्पाद नहीं मिला।',
      'misc.loadError': 'उत्पादों को लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।',
      'misc.cartUpdateError': 'कार्ट अपडेट विफल। कृपया पुनः प्रयास करें।',
      'misc.wishlistUpdateError': 'इच्छा-सूची अपडेट विफल। कृपया पुनः प्रयास करें।',
      'misc.addedToCart': 'कार्ट में जोड़ा गया ✅',
      'misc.removedFromWishlist': 'इच्छा-सूची से हटा दिया गया ✅',
      'misc.quantityUpdated': 'मात्रा अपडेट की गई ✅',
    }
  };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>('en');

  React.useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage);
    } else {
      // Default to English
      setLanguage('en');
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('language', language);
    // Update document language
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const langTranslations = translations[language];
    return (langTranslations as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}