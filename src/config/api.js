// API Configuration logic for easy switching between development and production
const isLocalhost = typeof window !== 'undefined'
  ? Boolean(
      window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]' ||
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    )
  : false;

// Respect explicit environment overrides, otherwise fall back to localhost-based auto-detection
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.REACT_APP_ENVIRONMENT || (isLocalhost ? 'development' : 'production');

const BASE_URL = environment === 'production'
  ? (process.env.NEXT_PUBLIC_PROD_API_URL || process.env.REACT_APP_PROD_API_URL || 'https://furnituresinduregharibackend.vercel.app')
  : (process.env.NEXT_PUBLIC_DEV_API_URL || process.env.REACT_APP_DEV_API_URL || 'http://localhost:5000');

const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: BASE_URL,

  // API endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      GOOGLE: '/api/auth/google',
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      PROFILE: '/api/auth/profile',
      UPDATE_PROFILE: '/api/auth/profile',
      VERIFY: '/api/auth/verify',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      CHANGE_PASSWORD: '/api/auth/change-password',
      VERIFY_EMAIL: '/api/auth/verify-email'
    },

    // Product endpoints
    PRODUCTS: {
      LIST: '/api/products',
      DETAIL: '/api/products/:id',
      SEARCH: '/api/products/search',
      CATEGORIES: '/api/categories'
    },

    // Order endpoints (Customer & Admin)
    ORDERS: {
      LIST: '/api/orders', // Admin only
      MY_ORDERS: '/api/orders/my-orders', // Customer orders
      CREATE: '/api/orders',
      DETAIL: '/api/orders/:id',
      UPDATE_STATUS: '/api/orders/:id/status', // Admin only
      UPDATE_TRACKING: '/api/orders/:id/tracking', // Admin only
      CANCEL: '/api/orders/:id/cancel', // Customer can cancel
      OVERVIEW: '/api/orders/overview', // Admin only
      EXPORT: '/api/orders/export/data' // Admin only
    },

    // Customer endpoints (Admin only)
    CUSTOMERS: {
      LIST: '/api/customers',
      DETAIL: '/api/customers/:id',
      PROFILE: '/api/customers/profile',
      OVERVIEW: '/api/customers/overview',
      UPDATE_TYPE: '/api/customers/:id/type',
      ADD_LOYALTY_POINTS: '/api/customers/:id/loyalty-points',
      ANALYTICS: '/api/customers/:id/analytics',
      UPDATE_STATUS: '/api/customers/:id/status',
      EXPORT: '/api/customers/export/data',
      USERS_WITH_ORDERS: '/api/customers/users-with-orders'
    },

    // Dashboard endpoints (Admin only)
    DASHBOARD: {
      OVERVIEW: '/api/dashboard/overview',
      SALES_ANALYTICS: '/api/dashboard/analytics/sales',
      CUSTOMER_ANALYTICS: '/api/dashboard/analytics/customers',
      PRODUCT_ANALYTICS: '/api/dashboard/analytics/products',
      FINANCIAL_ANALYTICS: '/api/dashboard/analytics/financial',
      USER_ACTIVITY: '/api/dashboard/analytics/user-activity',
      SESSIONS: '/api/dashboard/analytics/sessions',
      COOKIE_CONSENT: '/api/dashboard/analytics/cookie-consent',
      ABANDONED_CARTS: '/api/dashboard/analytics/abandoned-carts',
      SYSTEM_HEALTH: '/api/dashboard/system/health',
      RECENT_ACTIVITIES: '/api/dashboard/overview'
    },

    // Sales endpoints (Admin/Sales Manager only)
    SALES: {
      OVERVIEW: '/api/sales/overview',
      ORDERS: '/api/sales/orders',
      ORDER_DETAIL: '/api/sales/orders/:id',
      UPDATE_ORDER_STATUS: '/api/sales/orders/:id/status',
      ANALYTICS: '/api/sales/analytics',
      EXPORT: '/api/sales/export'
    },

    // Coupon endpoints
    COUPONS: {
      LIST: '/api/products/coupons',
      CREATE: '/api/products/coupons',
      VALIDATE: '/api/products/coupons/validate/:code',
      DELETE: '/api/products/coupons/:id'
    },

    // Activity tracking endpoints
    ACTIVITY: {
      PRODUCT_VIEW: '/api/activity/product-view',
      PRODUCT_CLICK: '/api/activity/product-click',
      ADD_TO_CART: '/api/activity/add-to-cart',
      PURCHASE: '/api/activity/purchase',
      SEARCH: '/api/activity/search',
      PAGE_VISIT: '/api/activity/page-visit'
    },

    // Customer data endpoints (Admin only)
    CUSTOMER_DATA: {
      CONTACT_FORMS: '/api/customer-data/contact-forms',
      FEEDBACK: '/api/customer-data/feedback',
      ORDER_REQUESTS: '/api/customer-data/order-requests',
      SUMMARY: '/api/customer-data/summary',
      UPDATE_CONTACT_STATUS: '/api/customer-data/contact-forms/:id/status',
      UPDATE_FEEDBACK_STATUS: '/api/customer-data/feedback/:id/status',
      UPDATE_ORDER_REQUEST_STATUS: '/api/customer-data/order-requests/:id/status'
    },
 
    // Blog endpoints
    BLOG: {
      LIST: '/api/blogs',
      MY_BLOGS: '/api/blogs/user',
      ADMIN_LIST: '/api/blogs/admin/all',
      DETAIL: '/api/blogs/:slug',
      CREATE: '/api/blogs',
      UPDATE: '/api/blogs/:id',
      DELETE: '/api/blogs/:id'
    }
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export the configuration
export default API_CONFIG;

// Export commonly used URLs
export const API_BASE_URL = API_CONFIG.BASE_URL;
export const AUTH_ENDPOINTS = API_CONFIG.ENDPOINTS.AUTH;
export const PRODUCT_ENDPOINTS = API_CONFIG.ENDPOINTS.PRODUCTS;
export const ORDER_ENDPOINTS = API_CONFIG.ENDPOINTS.ORDERS;
export const CUSTOMER_ENDPOINTS = API_CONFIG.ENDPOINTS.CUSTOMERS;
export const DASHBOARD_ENDPOINTS = API_CONFIG.ENDPOINTS.DASHBOARD;
export const SALES_ENDPOINTS = API_CONFIG.ENDPOINTS.SALES;
export const COUPON_ENDPOINTS = API_CONFIG.ENDPOINTS.COUPONS;
export const ACTIVITY_ENDPOINTS = API_CONFIG.ENDPOINTS.ACTIVITY;
export const CUSTOMER_DATA_ENDPOINTS = API_CONFIG.ENDPOINTS.CUSTOMER_DATA;
export const BLOG_ENDPOINTS = API_CONFIG.ENDPOINTS.BLOG;