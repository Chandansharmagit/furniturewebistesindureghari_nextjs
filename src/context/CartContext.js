"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import authService from '../services/authService';
import GuestLeadModal from '../component/cart/GuestLeadModal';

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

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [guestLeadInfo, setGuestLeadInfo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart and guest info from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('furniture_cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }

      const savedGuest = localStorage.getItem('guest_lead_info');
      if (savedGuest) {
        try {
          setGuestLeadInfo(JSON.parse(savedGuest));
        } catch (error) {
          console.error('Error loading guest lead info:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes (after initial mount load)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('furniture_cart', JSON.stringify(state.items));
    }
  }, [state.items, isLoaded]);

  // Cart Actions
  const addToCart = (product) => {
    const isAuthenticated = authService.isAuthenticated();
    
    // If not authenticated and no guest info yet, show modal
    if (!isAuthenticated && !guestLeadInfo) {
      setPendingProduct(product);
      setIsGuestModalOpen(true);
      return;
    }

    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product });
  };

  const handleGuestLeadConfirm = (info) => {
    setGuestLeadInfo(info);
    localStorage.setItem('guest_lead_info', JSON.stringify(info));
    setIsGuestModalOpen(false);
    
    // If there was a pending product, add it now
    if (pendingProduct) {
      dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: pendingProduct });
      setPendingProduct(null);
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Cart Calculations
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItem = (productId) => {
    return state.items.find(item => item.id === productId);
  };

  const value = {
    items: state.items,
    guestLeadInfo,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <GuestLeadModal 
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onConfirm={handleGuestLeadConfirm}
        product={pendingProduct}
      />
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