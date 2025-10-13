'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/admin/NotificationBell';
import { jwtService } from '@/lib/auth/jwt';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is logged in and has admin role
    console.log('Checking authentication:', { user, isLoggedIn });
    
    // First check if there's a token in cookies and verify it
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (token) {
      try {
        const decoded = jwtService.verifyAccessToken(token);
        console.log('Token decoded:', decoded);
        
        // If we have a valid token but no user in context, update the context
        if (decoded && (!user || user.id !== decoded.sub)) {
          // Try to get user data from localStorage
          const userData = localStorage.getItem('user');
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              // We'll rely on the context provider to handle this
            } catch (error) {
              console.error('Error parsing user data:', error);
            }
          }
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        // Invalid token, clear it
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    if (!isLoggedIn || !user) {
      console.log('Not logged in, redirecting to login');
      router.push('/login?redirect=' + encodeURIComponent(pathname));
      setIsCheckingAuth(false);
      return;
    }
    
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      console.log('User role not admin, redirecting to home');
      router.push('/?message=' + encodeURIComponent('Access denied. Admin privileges required.'));
      setIsCheckingAuth(false);
      return;
    }
    
    // Set language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    setIsCheckingAuth(false);
  }, [router, pathname, user, isLoggedIn]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Products', href: '/admin/products', icon: '📦' },
    { name: 'Orders', href: '/admin/orders', icon: '📋' },
    { name: 'Categories', href: '/admin/categories', icon: '🏷️' },
    { name: 'Artisans', href: '/admin/artisans', icon: '👨‍🎨' },
    { name: 'Banners', href: '/admin/banners', icon: '🖼️' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📊' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <span className="h-6 w-6 text-white">✕</span>
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Sign out</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Sign out</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Admin Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button
                  type="button"
                  className="lg:hidden mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <span className="h-6 w-6">☰</span>
                </button>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
                <Link href="/admin/profile" className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}