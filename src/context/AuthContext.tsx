'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoggedIn: boolean;
  language: string;
  setLanguage: (lang: string) => void;
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

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setLanguage(savedLanguage);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Mock login - in production, make API call to authenticate
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (email === 'admin@pachmarhi.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@pachmarhi.com',
          role: 'admin'
        };
        
        setUser(adminUser);
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        return {
          success: true,
          message: t('loginSuccess', language).replace('{name}', adminUser.name)
        };
      } else if (email === 'user@pachmarhi.com' && password === 'user123') {
        const regularUser = {
          id: 'user-1',
          name: 'Regular User',
          email: 'user@pachmarhi.com',
          role: 'user'
        };
        
        setUser(regularUser);
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(regularUser));
        
        return {
          success: true,
          message: t('loginSuccess', language).replace('{name}', regularUser.name)
        };
      } else {
        return {
          success: false,
          message: 'Invalid email or password'
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
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoggedIn,
      language,
      setLanguage
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