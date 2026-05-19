import { useCallback, useEffect, useRef } from 'react';
import ActivityService from '../services/activityService';

// Custom hook for activity tracking
const useActivityTracking = () => {
  const trackingRef = useRef(new Set()); // To prevent duplicate tracking
  const viewTimeoutRef = useRef(null);
  const pageStartTimeRef = useRef(Date.now()); // Track page visit start time

  // Track product view with debouncing
  const trackProductView = useCallback((productId, categoryId = null, delay = 1000) => {
    const trackingKey = `view_${productId}`;
    
    // Clear existing timeout
    if (viewTimeoutRef.current) {
      clearTimeout(viewTimeoutRef.current);
    }
    
    // Set new timeout to track view after delay
    viewTimeoutRef.current = setTimeout(() => {
      if (!trackingRef.current.has(trackingKey)) {
        trackingRef.current.add(trackingKey);
        ActivityService.trackProductView(productId, categoryId);
        
        // Remove from tracking set after 5 minutes to allow re-tracking
        setTimeout(() => {
          trackingRef.current.delete(trackingKey);
        }, 5 * 60 * 1000);
      }
    }, delay);
  }, []);

  // Track product click
  const trackProductClick = useCallback((productId, categoryId = null, clickType = 'general') => {
    ActivityService.trackProductClick(productId, categoryId, clickType);
  }, []);

  // Track add to cart
  const trackAddToCart = useCallback((productId, quantity = 1, price = null) => {
    ActivityService.trackAddToCart(productId, quantity, price);
  }, []);

  // Track purchase
  const trackPurchase = useCallback((orderId, products, totalAmount) => {
    ActivityService.trackPurchase(orderId, products, totalAmount);
  }, []);

  // Track search
  const trackSearch = useCallback((categoryId = null, resultsCount = 0) => {
    ActivityService.trackSearch(categoryId, resultsCount);
  }, []);

  // Track page visit with time spent
  const trackPageVisit = useCallback((customTimeSpent = null) => {
    const timeSpent = customTimeSpent || Math.floor((Date.now() - pageStartTimeRef.current) / 1000);
    ActivityService.trackPageVisit(timeSpent);
    // Reset page start time for next tracking
    pageStartTimeRef.current = Date.now();
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (viewTimeoutRef.current) {
        clearTimeout(viewTimeoutRef.current);
      }
    };
  }, []);

  return {
    trackProductView,
    trackProductClick,
    trackAddToCart,
    trackPurchase,
    trackSearch,
    trackPageVisit
  };
};

export default useActivityTracking;