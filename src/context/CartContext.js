"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import authService from '../services/authService';

const GuestLeadModal = dynamic(() => import('../component/cart/GuestLeadModal'), {
  loading: () => null,
  ssr: false,
});

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case CART_ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

// Initial State
const initialState = {
  items: []
};

const getInitialCartState = () => {
  if (typeof window === 'undefined') return initialState;

  try {
    const savedCart = localStorage.getItem('furniture_cart');
    if (!savedCart) return initialState;

    const cartData = JSON.parse(savedCart);
    return { items: Array.isArray(cartData) ? cartData : [] };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return initialState;
  }
};

const getInitialGuestLeadInfo = () => {
  if (typeof window === 'undefined') return null;

  try {
    const savedGuest = localStorage.getItem('guest_lead_info');
    return savedGuest ? JSON.parse(savedGuest) : null;
  } catch (error) {
    console.error('Error loading guest lead info:', error);
    return null;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, getInitialCartState);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [guestLeadInfo, setGuestLeadInfo] = useState(getInitialGuestLeadInfo);

  // Save cart to localStorage whenever it changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('furniture_cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  const trackCartAdd = useCallback(async (product) => {
    try {
      const activityModule = await import('../services/activityService');
      const service = activityModule.default || activityModule;
      service.trackAddToCart(product.id, product.quantity || 1, product.price);
    } catch (err) {
      console.error('Error tracking add to cart:', err);
    }
  }, []);

  // Cart Actions
  const addToCart = useCallback((product) => {
    const isAuthenticated = authService.isAuthenticated();
    
    // If not authenticated and no guest info yet, show modal
    if (!isAuthenticated && !guestLeadInfo) {
      setPendingProduct(product);
      setIsGuestModalOpen(true);
      return;
    }

    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product });
    trackCartAdd(product);
  }, [guestLeadInfo, trackCartAdd]);

  const handleGuestLeadConfirm = useCallback((info) => {
    setGuestLeadInfo(info);
    localStorage.setItem('guest_lead_info', JSON.stringify(info));
    setIsGuestModalOpen(false);
    
    // If there was a pending product, add it now
    if (pendingProduct) {
      dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: pendingProduct });
      trackCartAdd(pendingProduct);

      setPendingProduct(null);
    }
  }, [pendingProduct, trackCartAdd]);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  // Cart Calculations
  const getCartTotal = useCallback(() => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.items]);

  const getCartItemsCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }, [state.items]);

  const getCartItem = useCallback((productId) => {
    return state.items.find(item => item.id === productId);
  }, [state.items]);

  const value = useMemo(() => ({
    items: state.items,
    guestLeadInfo,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartItem
  }), [state.items, guestLeadInfo, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount, getCartItem]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {isGuestModalOpen && (
        <GuestLeadModal
          isOpen={isGuestModalOpen}
          onClose={() => setIsGuestModalOpen(false)}
          onConfirm={handleGuestLeadConfirm}
          product={pendingProduct}
        />
      )}
    </CartContext.Provider>
  );
};

// Custom Hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
