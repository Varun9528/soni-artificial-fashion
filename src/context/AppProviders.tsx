'use client';

import { ReactNode } from 'react';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};