'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtService } from '@/lib/auth/jwt';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoggedIn: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  updateUser: (user: User) => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock localization function (in production, use a proper i18n library)
const t = (key: string, lang: string = 'en') => {
  const translations: any = {
    en: {
      loginSuccess: "Welcome back, {name}! Your session is secured.",
      invalidToken: "Session expired, please login again."
    },
    hi: {
      loginSuccess: "स्वागत है, {name}! आपका सत्र सुरक्षित है।",
      invalidToken: "सत्र समाप्त हो गया है, कृपया दोबारा लॉगिन करें।"
    }
  };
  
  return translations[lang][key] || key;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      
      const token = localStorage.getItem('token') || getCookie('token');
      const userData = localStorage.getItem('user');
      const savedLanguage = localStorage.getItem('language') || 'en';
      
      console.log('Token from storage:', token);
      console.log('User data from storage:', userData);
      
      setLanguage(savedLanguage);
      
      if (token && userData) {
        try {
          // Verify token first using the same method as login API
          const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
          const decoded: any = jwt.verify(token, JWT_SECRET, {
            issuer: 'lettex-marketplace',
            audience: 'lettex-users'
          });
          
          console.log('Decoded token:', decoded);
          
          // Additional validation
          if (decoded.iss === 'lettex-marketplace' && decoded.aud === 'lettex-users') {
            const parsedUser = JSON.parse(userData);
            console.log('Parsed user:', parsedUser);
            setUser(parsedUser);
          } else {
            // Invalid token, clean up
            console.log('Invalid token, cleaning up');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            deleteCookie('token');
          }
        } catch (error) {
          console.error('Error parsing user data or invalid token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          deleteCookie('token');
        }
      } else {
        console.log('No token or user data found');
      }
      
      setInitialized(true);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null; // Server-side check
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  // Helper function to delete cookie
  const deleteCookie = (name: string): void => {
    if (typeof document === 'undefined') return; // Server-side check
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Make actual API call to authenticate
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Set user and store token/user data in both localStorage and cookies
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Also set cookie for server-side access with consistent parameters
        if (typeof document !== 'undefined') {
          document.cookie = `token=${data.token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
        }
        
        return {
          success: true,
          message: t('loginSuccess', language).replace('{name}', data.user.name)
        };
      } else {
        return {
          success: false,
          message: data.error || 'Invalid email or password'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    deleteCookie('token');
    
    // Clear cookie with consistent parameters
    if (typeof document !== 'undefined') {
      document.cookie = `token=; path=/; max-age=0; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    }
    
    // Immediately redirect to login page
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Also update cookie for server-side access
    const token = localStorage.getItem('token');
    if (token && typeof document !== 'undefined') {
      document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    }
  };

  const isLoggedIn = !!user;

  // Don't render children until auth state is determined
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoggedIn,
      language,
      setLanguage,
      updateUser,
      isInitialized: initialized
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}