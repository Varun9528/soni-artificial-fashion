'use client';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, ShoppingCart, Heart, User, Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate cart item count
  const cartItemCount = cartState.items.reduce((total: number, item: any) => total + item.quantity, 0);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Handle navigation
  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className={`bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white transition-all duration-300 ${isScrolled ? 'shadow-2xl' : 'shadow-lg'} sticky top-0 z-50`}>
      {/* Top bar with language and theme toggle */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className="hover:underline font-medium"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <button 
              onClick={() => {
                // For demo purposes, we'll show an alert
                // In a real app, this would link to your app store
                alert(language === 'en' ? 'App download link will be available soon!' : 'ऐप डाउनलोड लिंक जल्द उपलब्ध होगा!');
              }}
              className="hover:underline font-medium hidden md:inline"
            >
              {language === 'en' ? 'Download App' : 'ऐप डाउनलोड करें'}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigateTo('/support')} className="hover:underline hidden md:inline">
              {language === 'en' ? 'Customer Care' : 'ग्राहक सेवा'}
            </button>
            <button onClick={() => navigateTo('/track-order')} className="hover:underline hidden md:inline">
              {language === 'en' ? 'Track Order' : 'ऑर्डर ट्रैक करें'}
            </button>
            <button onClick={() => navigateTo('/sell')} className="hover:underline hidden md:inline">
              {language === 'en' ? 'Sell on Soni Fashion' : 'सोनी फैशन पर बेचें'}
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-amber-800 transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigateTo('/')} className="flex items-center mr-4">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-2 mr-3">
                <Image 
                  src="/images/logo/logo-svg.svg" 
                  alt="Soni Fashion Logo" 
                  width={150} 
                  height={150} 
                  className="rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/logo/logo-png.png';
                  }}
                />
              </div>
            </div>
          </button>

          {/* Search bar - hidden on mobile */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'en' ? 'Search for gold jewelry, accessories and more' : 'सोने के आभूषण, सहायक उत्पाद और अधिक के लिए खोजें'}
                className="w-full px-4 py-3 rounded-l-full text-gray-800 focus:outline-none shadow-md"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white px-6 rounded-r-full transition-all duration-300 shadow-md"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Navigation icons */}
          <div className="flex items-center space-x-4">
            {/* User icon */}
            {user ? (
              <div className="relative group hidden md:block">
                <button className="p-2 hover:bg-amber-700 rounded-full transition-colors">
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button 
                    onClick={() => navigateTo(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {user.role === 'admin' || user.role === 'super_admin' ? (language === 'en' ? 'Admin Dashboard' : 'व्यवस्थापक डैशबोर्ड') : (language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल')}
                  </button>
                  <button 
                    onClick={() => {
                      logout();
                      navigateTo('/'); // Redirect to home after logout
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {language === 'en' ? 'Sign out' : 'साइन आउट'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => navigateTo('/login')} className="p-2 hover:bg-amber-700 rounded-full hidden md:flex items-center transition-colors">
                <User size={20} />
                <span className="ml-1 text-sm">{language === 'en' ? 'Login' : 'लॉगिन'}</span>
              </button>
            )}

            {/* Wishlist icon */}
            <button onClick={() => navigateTo('/wishlist')} className="relative p-2 hover:bg-amber-700 rounded-full hidden md:flex items-center transition-colors">
              <Heart size={20} />
              <span className="text-sm ml-1">{language === 'en' ? 'Wishlist' : 'इच्छा-सूची'}</span>
              {wishlistState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistState.items.length}
                </span>
              )}
            </button>

            {/* Cart icon */}
            <button onClick={() => navigateTo('/cart')} className="relative p-2 hover:bg-amber-700 rounded-full flex items-center transition-colors">
              <ShoppingCart size={20} />
              <span className="text-sm ml-1 hidden md:inline">{language === 'en' ? 'Cart' : 'कार्ट'}</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 hover:bg-amber-700 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-4 pt-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'en' ? 'Search for gold jewelry, accessories and more' : 'सोने के आभूषण, सहायक उत्पाद और अधिक के लिए खोजें'}
              className="w-full px-4 py-3 rounded-full text-gray-800 focus:outline-none shadow-md"
            />
            <button 
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-r-full hover:from-amber-800 hover:to-amber-900 transition-all duration-300"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation menu - mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t-2 border-amber-300 dark:border-amber-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <button onClick={() => navigateTo('/')} className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left">
                {language === 'en' ? 'Home' : 'होम'}
              </button>
              <button onClick={() => navigateTo('/products')} className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left">
                {language === 'en' ? 'Products' : 'उत्पाद'}
              </button>
              <button onClick={() => navigateTo('/categories')} className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left">
                {language === 'en' ? 'Categories' : 'श्रेणियाँ'}
              </button>
              <button onClick={() => navigateTo('/about')} className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left">
                {language === 'en' ? 'About' : 'बारे में'}
              </button>
              <button onClick={() => navigateTo('/contact')} className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left">
                {language === 'en' ? 'Contact' : 'संपर्क'}
              </button>
              <button onClick={() => navigateTo('/faq')} className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left">
                {language === 'en' ? 'FAQ' : 'सामान्य प्रश्न'}
              </button>
              <button onClick={() => navigateTo('/support')} className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left">
                {language === 'en' ? 'Customer Care' : 'ग्राहक सेवा'}
              </button>
              <button onClick={() => navigateTo('/track-order')} className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left">
                {language === 'en' ? 'Track Order' : 'ऑर्डर ट्रैक करें'}
              </button>
              <button onClick={() => navigateTo('/sell')} className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left">
                {language === 'en' ? 'Sell on Soni Fashion' : 'सोनी फैशन पर बेचें'}
              </button>
              <button 
                onClick={() => {
                  // For demo purposes, we'll show an alert
                  // In a real app, this would link to your app store
                  alert(language === 'en' ? 'App download link will be available soon!' : 'ऐप डाउनलोड लिंक जल्द उपलब्ध होगा!');
                }}
                className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left"
              >
                {language === 'en' ? 'Download App' : 'ऐप डाउनलोड करें'}
              </button>
              {user && (
                <>
                  <button 
                    onClick={() => navigateTo(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/profile')}
                    className="py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 text-left"
                  >
                    {user.role === 'admin' || user.role === 'super_admin' ? (language === 'en' ? 'Admin Dashboard' : 'व्यवस्थापक डैशबोर्ड') : (language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल')}
                  </button>
                  <button 
                    onClick={() => {
                      logout();
                      navigateTo('/');
                    }}
                    className="text-left py-3 hover:text-amber-700 dark:hover:text-amber-400 font-medium border-b border-gray-100 dark:border-gray-700 w-full"
                  >
                    {language === 'en' ? 'Sign out' : 'साइन आउट'}
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop navigation */}
      <div className="hidden md:block bg-gradient-to-r from-amber-700 to-amber-800 text-white border-t-2 border-amber-500">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between py-3">
            <div className="flex space-x-6">
              <button onClick={() => navigateTo('/')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                <Menu size={16} className="mr-2" />
                {language === 'en' ? 'All Categories' : 'सभी श्रेणियाँ'}
              </button>
              <button onClick={() => navigateTo('/products')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'All Products' : 'सभी उत्पाद'}
              </button>
              <button onClick={() => navigateTo('/categories')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'Collections' : 'संग्रह'}
              </button>
              <button onClick={() => navigateTo('/necklaces')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'Necklaces' : 'हार'}
              </button>
              <button onClick={() => navigateTo('/earrings')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'Earrings' : 'कान के आभूषण'}
              </button>
              <button onClick={() => navigateTo('/bracelets')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'Bracelets' : 'कंगन'}
              </button>
              <button onClick={() => navigateTo('/rings')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'Rings' : 'अंगूठियाँ'}
              </button>
              <button onClick={() => navigateTo('/fashion-accessories')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'Fashion Accessories' : 'फैशन सहायक उत्पाद'}
              </button>
            </div>
            <div className="flex space-x-6">
              <button onClick={() => navigateTo('/about')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'About' : 'बारे में'}
              </button>
              <button onClick={() => navigateTo('/contact')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'Contact' : 'संपर्क'}
              </button>
              <button onClick={() => navigateTo('/faq')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                {language === 'en' ? 'FAQ' : 'सामान्य प्रश्न'}
              </button>
              {user && (
                <button onClick={() => navigateTo(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/profile')} className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors px-3 py-1 rounded-lg hover:bg-amber-600">
                  {user.role === 'admin' || user.role === 'super_admin' ? (language === 'en' ? 'Admin' : 'व्यवस्थापक') : (language === 'en' ? 'Profile' : 'प्रोफ़ाइल')}
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}