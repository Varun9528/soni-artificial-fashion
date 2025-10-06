'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { CartItem } from '@/data/types';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loaded: boolean;
}

interface CartContextType {
  state: CartState;
  addToCart: (productId: string, quantity?: number, variant?: any) => Promise<void>;
  removeFromCart: (productId: string, variant?: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variant?: any) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; variant?: any } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; variant?: any } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADED' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => 
          item.productId === action.payload.productId &&
          JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          itemCount: updatedItems.reduce((total, item) => total + item.quantity, 0)
        };
      }

      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        itemCount: newItems.reduce((total, item) => total + item.quantity, 0)
      };
    }

    case 'REMOVE_FROM_CART': {
      const filteredItems = state.items.filter(
        item => 
          !(item.productId === action.payload.productId &&
            JSON.stringify(item.variant) === JSON.stringify(action.payload.variant))
      );
      return {
        ...state,
        items: filteredItems,
        itemCount: filteredItems.reduce((total, item) => total + item.quantity, 0)
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item => {
        if (item.productId === action.payload.productId &&
            JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((total, item) => total + item.quantity, 0)
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
        loaded: state.loaded
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        itemCount: action.payload.reduce((total, item) => total + item.quantity, 0),
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    loaded: false
  });
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  // Load cart from localStorage on mount or from DB if user is logged in
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Load from database
        try {
          const response = await fetch('/api/cart');
          const data = await response.json();
          if (data.success) {
            dispatch({ type: 'LOAD_CART', payload: data.items });
          } else {
            dispatch({ type: 'SET_LOADED' });
          }
        } catch (error) {
          console.error('Error loading cart from database:', error);
          dispatch({ type: 'SET_LOADED' });
        }
      } else {
        // Load from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart);
            dispatch({ type: 'LOAD_CART', payload: cartItems });
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
          }
        }
        dispatch({ type: 'SET_LOADED' });
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes (for guest users)
  useEffect(() => {
    if (!user && state.loaded) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, user, state.loaded]);

  // Sync cart with database when user logs in
  useEffect(() => {
    if (user && state.loaded && !isSyncing) {
      syncCart();
    }
  }, [user, state.loaded]);

  const syncCart = async () => {
    if (isSyncing || !user) return;
    
    setIsSyncing(true);
    try {
      // Get guest cart from localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const guestCartItems = JSON.parse(savedCart);
        
        // Add guest cart items to database
        for (const item of guestCartItems) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.productId,
              quantity: item.quantity,
              variant: item.variant
            })
          });
        }
        
        // Clear localStorage
        localStorage.removeItem('cart');
        
        // Reload cart from database
        const response = await fetch('/api/cart');
        const data = await response.json();
        if (data.success) {
          dispatch({ type: 'LOAD_CART', payload: data.items });
        }
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const addToCart = async (productId: string, quantity = 1, variant?: any) => {
    if (user) {
      // Add to database
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity,
            variant
          })
        });
        
        const data = await response.json();
        if (data.success) {
          dispatch({
            type: 'ADD_TO_CART',
            payload: { productId, quantity, variant }
          });
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Add to localStorage
      dispatch({
        type: 'ADD_TO_CART',
        payload: { productId, quantity, variant }
      });
    }
  };

  const removeFromCart = async (productId: string, variant?: any) => {
    if (user) {
      // Remove from database
      try {
        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            variant
          })
        });
        
        const data = await response.json();
        if (data.success) {
          dispatch({
            type: 'REMOVE_FROM_CART',
            payload: { productId, variant }
          });
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      // Remove from localStorage
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: { productId, variant }
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number, variant?: any) => {
    if (quantity <= 0) {
      await removeFromCart(productId, variant);
      return;
    }
    
    if (user) {
      // Update in database
      try {
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity,
            variant
          })
        });
        
        const data = await response.json();
        if (data.success) {
          dispatch({
            type: 'UPDATE_QUANTITY',
            payload: { productId, quantity, variant }
          });
        }
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    } else {
      // Update in localStorage
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { productId, quantity, variant }
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      // Clear database cart
      try {
        const response = await fetch('/api/cart/clear', {
          method: 'POST'
        });
        
        const data = await response.json();
        if (data.success) {
          dispatch({ type: 'CLEAR_CART' });
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      // Clear localStorage cart
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      syncCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};