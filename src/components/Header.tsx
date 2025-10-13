'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, ShoppingCart, Heart, User, Sun, Moon, Menu, X, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const { language, setLanguage } = useLanguage();
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

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className={`flipkart-header transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      {/* Top bar with language and theme toggle */}
      <div className="bg-primary text-white py-1 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className="hover:underline"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/support" className="hover:underline hidden md:inline">
              {language === 'en' ? 'Customer Care' : 'ग्राहक सेवा'}
            </Link>
            <Link href="/track-order" className="hover:underline hidden md:inline">
              {language === 'en' ? 'Track Order' : 'ऑर्डर ट्रैक करें'}
            </Link>
            <Link href="/sell" className="hover:underline hidden md:inline">
              {language === 'en' ? 'Sell on Lettex' : 'लेटेक्स पर बेचें'}
            </Link>
            <button 
              onClick={toggleTheme}
              className="p-1 rounded-full hover:bg-[#4a342d]"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto">
        <div className="flipkart-navbar">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <img 
                src="/images/logo/lettex-logo.png" 
                alt="Lettex Logo" 
                className="h-10 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/products/placeholder.jpg';
                }}
              />
            </div>
            <span className="hidden md:inline text-xs ml-1 text-gray-500 dark:text-gray-300"></span>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="flipkart-search-bar hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'en' ? 'Search groceries, oils, dairy...' : 'किराने की वस्तुएं, तेल, डेयरी खोजें...'}
                className="flipkart-search-input"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-sm hover:bg-[#4a342d]"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Navigation icons */}
          <div className="flex items-center space-x-4">
            {/* Location */}
            <div className="hidden md:flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPin size={16} className="mr-1" />
              <span>Deliver to</span>
              <span className="font-medium ml-1">India</span>
            </div>

            {/* User icon */}
            <Link href="/login" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <User size={20} />
            </Link>

            {/* Wishlist icon */}
            <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Heart size={20} />
              {wishlistState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistState.items.length}
                </span>
              )}
            </Link>

            {/* Cart icon */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#5C4033] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'en' ? 'Search groceries, oils, dairy...' : 'किराने की वस्तुएं, तेल, डेयरी खोजें...'}
              className="flipkart-search-input"
            />
            <button 
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-sm hover:bg-[#4a342d]"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation menu - mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="py-2 hover:text-[#5C4033] dark:hover:text-[#FFD54F]" onClick={() => setIsMenuOpen(false)}>
                {language === 'en' ? 'Home' : 'होम'}
              </Link>
              <Link href="/products" className="py-2 hover:text-[#5C4033] dark:hover:text-[#FFD54F]" onClick={() => setIsMenuOpen(false)}>
                {language === 'en' ? 'Products' : 'उत्पाद'}
              </Link>
              <Link href="/categories" className="py-2 hover:text-[#5C4033] dark:hover:text-[#FFD54F]" onClick={() => setIsMenuOpen(false)}>
                {language === 'en' ? 'Categories' : 'श्रेणियाँ'}
              </Link>
              <Link href="/about" className="py-2 hover:text-[#5C4033] dark:hover:text-[#FFD54F]" onClick={() => setIsMenuOpen(false)}>
                {language === 'en' ? 'About' : 'बारे में'}
              </Link>
              <Link href="/contact" className="py-2 hover:text-[#5C4033] dark:hover:text-[#FFD54F]" onClick={() => setIsMenuOpen(false)}>
                {language === 'en' ? 'Contact' : 'संपर्क'}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop navigation */}
      <div className="hidden md:block bg-[#f5f0eb] dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-6 py-3">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-[#5C4033] dark:hover:text-[#FFD54F] font-medium">
              {language === 'en' ? 'Home' : 'होम'}
            </Link>
            <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-[#5C4033] dark:hover:text-[#FFD54F] font-medium">
              {language === 'en' ? 'Products' : 'उत्पाद'}
            </Link>
            <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-[#5C4033] dark:hover:text-[#FFD54F] font-medium">
              {language === 'en' ? 'Categories' : 'श्रेणियाँ'}
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-[#5C4033] dark:hover:text-[#FFD54F] font-medium">
              {language === 'en' ? 'About' : 'बारे में'}
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-[#5C4033] dark:hover:text-[#FFD54F] font-medium">
              {language === 'en' ? 'Contact' : 'संपर्क'}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}