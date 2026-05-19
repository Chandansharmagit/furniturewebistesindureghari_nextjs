import axios from 'axios';
import { API_BASE_URL, ACTIVITY_ENDPOINTS } from '../config/api';

// Create axios instance for activity tracking
const activityApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include JWT Authorization header
activityApi.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get device info
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let device = 'desktop';
  
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    device = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    device = 'mobile';
  }
  
  return {
    device,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    userAgent
  };
};

// Helper function to get current page info
const getPageInfo = () => {
  return {
    pageUrl: window.location.href,
    referrerUrl: document.referrer || null
  };
};

// Helper function to get guest info if available
const getGuestInfo = () => {
  try {
    const saved = localStorage.getItem('guest_lead_info');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

class ActivityService {
  // Track product view
  static async trackProductView(productId, categoryId = null) {
    try {
      const deviceInfo = getDeviceInfo();
      const pageInfo = getPageInfo();
      const guestInfo = getGuestInfo();
      
      await activityApi.post(ACTIVITY_ENDPOINTS.PRODUCT_VIEW, {
        productId,
        categoryId,
        ...pageInfo,
        ...deviceInfo,
        guest_info: guestInfo
      });
    } catch (error) {
      console.error('Failed to track product view:', error);
      // Don't throw error to avoid disrupting user experience
    }
  }

  // Track product click
  static async trackProductClick(productId, categoryId = null, clickType = 'general') {
    try {
      const deviceInfo = getDeviceInfo();
      const pageInfo = getPageInfo();
      const guestInfo = getGuestInfo();
      
      await activityApi.post(ACTIVITY_ENDPOINTS.PRODUCT_CLICK, {
        productId,
        categoryId,
        clickType, // 'image', 'title', 'button', 'card', etc.
        ...pageInfo,
        ...deviceInfo,
        guest_info: guestInfo
      });
    } catch (error) {
      console.error('Failed to track product click:', error);
    }
  }

  // Track add to cart
  static async trackAddToCart(productId, quantity = 1, price = null) {
    try {
      const deviceInfo = getDeviceInfo();
      const pageInfo = getPageInfo();
      const guestInfo = getGuestInfo();
      
      await activityApi.post(ACTIVITY_ENDPOINTS.ADD_TO_CART, {
        productId,
        quantity,
        price,
        ...pageInfo,
        ...deviceInfo,
        guest_info: guestInfo
      });
    } catch (error) {
      console.error('Failed to track add to cart:', error);
    }
  }

  // Track purchase
  static async trackPurchase(orderId, products, totalAmount) {
    try {
      const deviceInfo = getDeviceInfo();
      const pageInfo = getPageInfo();
      const guestInfo = getGuestInfo();
      
      await activityApi.post(ACTIVITY_ENDPOINTS.PURCHASE, {
        orderId,
        products, // Array of {productId, quantity, price}
        totalAmount,
        ...pageInfo,
        ...deviceInfo,
        guest_info: guestInfo
      });
    } catch (error) {
      console.error('Failed to track purchase:', error);
    }
  }

  // Track search (without saving query as per requirements)
  static async trackSearch(categoryId = null, resultsCount = 0) {
    try {
      const deviceInfo = getDeviceInfo();
      const pageInfo = getPageInfo();
      
      await activityApi.post(ACTIVITY_ENDPOINTS.SEARCH, {
        categoryId,
        resultsCount,
        ...pageInfo,
        ...deviceInfo
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  }

  // Track page visit
  static async trackPageVisit(timeSpent = 0) {
    try {
      const deviceInfo = getDeviceInfo();
      const pageInfo = getPageInfo();
      
      await activityApi.post(ACTIVITY_ENDPOINTS.PAGE_VISIT, {
        timeSpent,
        ...pageInfo,
        ...deviceInfo
      });
    } catch (error) {
      console.error('Failed to track page visit:', error);
    }
  }

  // Get activity summary (for debugging)
  static async getActivitySummary(sessionId) {
    try {
      const response = await activityApi.get(`/summary/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get activity summary:', error);
      throw error;
    }
  }
}

// Utility functions for easy integration
export const trackProductView = ActivityService.trackProductView;
export const trackProductClick = ActivityService.trackProductClick;
export const trackAddToCart = ActivityService.trackAddToCart;
export const trackPurchase = ActivityService.trackPurchase;
export const trackSearch = ActivityService.trackSearch;
export const trackPageVisit = ActivityService.trackPageVisit;

export default ActivityService;