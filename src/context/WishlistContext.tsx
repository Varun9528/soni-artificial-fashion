'use client';

import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { WishlistItem } from '@/data/types';
import { useAuth } from './AuthContext';

interface WishlistState {
  items: WishlistItem[];
  loaded: boolean;
}

interface WishlistContextType {
  state: WishlistState;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  syncWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
  | { type: 'SET_LOADED' };

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      // Check if item already exists
      if (state.items.some(item => item.productId === action.payload.productId)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload)
      };

    case 'CLEAR_WISHLIST':
      return {
        items: [],
        loaded: state.loaded
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload,
        loaded: true
      };

    case 'SET_LOADED':
      return {
        ...state,
        loaded: true
      };

    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    loaded: false
  });
  const { user, isInitialized } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const syncWishlist = useCallback(async () => {
    if (isSyncing || !user) return;
    
    setIsSyncing(true);
    try {
      // Get guest wishlist from localStorage
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const guestWishlistItems = JSON.parse(savedWishlist);
        
        // Add guest wishlist items to database
        for (const item of guestWishlistItems) {
          await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.productId
            })
          });
        }
        
        // Clear localStorage
        localStorage.removeItem('wishlist');
        
        // Reload wishlist from database
        const response = await fetch('/api/wishlist');
        const data = await response.json();
        if (data.success) {
          dispatch({ type: 'LOAD_WISHLIST', payload: data.items });
        }
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, user]);

  // Load wishlist from localStorage on mount or from DB if user is logged in
  useEffect(() => {
    // Only load wishlist when auth context is initialized
    if (!isInitialized) return;

    const loadWishlist = async () => {
      if (user) {
        // Load from database
        try {
          const response = await fetch('/api/wishlist');
          const data = await response.json();
          if (data.success) {
            dispatch({ type: 'LOAD_WISHLIST', payload: data.items });
          } else {
            dispatch({ type: 'SET_LOADED' });
          }
        } catch (error) {
          console.error('Error loading wishlist from database:', error);
          dispatch({ type: 'SET_LOADED' });
        }
      } else {
        // Load from localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          try {
            const wishlistItems = JSON.parse(savedWishlist);
            dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems.map((id: string) => ({ productId: id, addedAt: new Date().toISOString() })) });
          } catch (error) {
            console.error('Error loading wishlist from localStorage:', error);
          }
        }
        dispatch({ type: 'SET_LOADED' });
      }
    };

    loadWishlist();
  }, [user, isInitialized]);

  // Save wishlist to localStorage whenever it changes (for guest users)
  useEffect(() => {
    if (!user && state.loaded) {
      const productIds = state.items.map(item => item.productId);
      localStorage.setItem('wishlist', JSON.stringify(productIds));
    }
  }, [state.items, user, state.loaded]);

  // Sync wishlist with database when user logs in
  useEffect(() => {
    if (user && state.loaded && !isSyncing) {
      syncWishlist();
    }
  }, [user, state.loaded, isInitialized, isSyncing, syncWishlist]);

  const addToWishlist = async (productId: string) => {
    if (user) {
      // Add to database
      try {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId })
        });
        
        const data = await response.json();
        if (data.success) {
          dispatch({ type: 'ADD_TO_WISHLIST', payload: { productId, addedAt: new Date().toISOString() } });
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    } else {
      // Add to localStorage
      dispatch({ type: 'ADD_TO_WISHLIST', payload: { productId, addedAt: new Date().toISOString() } });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      // Remove from database
      try {
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId })
        });
        
        const data = await response.json();
        if (data.success) {
          dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      // Remove from localStorage
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    }
  };

  const isInWishlist = (productId: string) => {
    return state.items.some(item => item.productId === productId);
  };

  const clearWishlist = async () => {
    if (user) {
      // Clear database wishlist
      try {
        const response = await fetch('/api/wishlist/clear', {
          method: 'POST'
        });
        
        const data = await response.json();
        if (data.success) {
          dispatch({ type: 'CLEAR_WISHLIST' });
        }
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    } else {
      // Clear localStorage wishlist
      dispatch({ type: 'CLEAR_WISHLIST' });
    }
  };

  return (
    <WishlistContext.Provider value={{
      state,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      syncWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};