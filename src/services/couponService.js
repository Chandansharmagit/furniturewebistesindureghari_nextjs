import axios from 'axios';
import { COUPON_ENDPOINTS, buildApiUrl } from '../config/api';

// Create axios instance for coupon service
const couponApi = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const getCouponCustomerIdentity = () => {
  if (typeof window === 'undefined') return {};

  const identity = {};
  const inspectValue = (value) => {
    if (!value || typeof value !== 'object') return;

    identity.user_id = identity.user_id || value.id || value.user_id || value.userId || value.customer_id;
    identity.email = identity.email || value.email || value.user_email;

    Object.values(value).forEach((nestedValue) => {
      if (nestedValue && typeof nestedValue === 'object' && !Array.isArray(nestedValue)) {
        inspectValue(nestedValue);
      }
    });
  };

  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    inspectValue(storedUser);
  } catch {
    // Ignore malformed user cache.
  }

  identity.email = identity.email || localStorage.getItem('userEmail') || '';

  Object.keys(localStorage).forEach((key) => {
    if (!/user|customer|auth|profile|client|patron/i.test(key)) return;

    try {
      inspectValue(JSON.parse(localStorage.getItem(key)));
    } catch {
      // Ignore plain token strings.
    }
  });

  return identity;
};

// Add request interceptor to include JWT token
couponApi.interceptors.request.use(
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

// Add response interceptor for error handling
couponApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

class CouponService {
  // Get all coupons
  async getAllCoupons(options = {}) {
    try {
      const response = await couponApi.get(buildApiUrl(COUPON_ENDPOINTS.LIST), {
        params: options.fresh ? { fresh: '1', t: Date.now() } : undefined
      });
      const data = response.data;
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch coupons'
      };
    }
  }

  // Create a new coupon
  async createCoupon(couponData) {
    try {
      const response = await couponApi.post(buildApiUrl(COUPON_ENDPOINTS.CREATE), couponData);
      const data = response.data;
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Create coupon error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create coupon'
      };
    }
  }

  // Validate a coupon
  async validateCoupon(code, options = {}) {
    try {
      const endpoint = COUPON_ENDPOINTS.VALIDATE.replace(':code', code);
      const identity = {
        ...getCouponCustomerIdentity(),
        ...options
      };
      const response = await couponApi.get(buildApiUrl(endpoint), {
        params: {
          ...(identity.email ? { email: identity.email } : {}),
          ...(identity.user_id ? { user_id: identity.user_id } : {})
        }
      });
      const data = response.data;
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to validate coupon'
      };
    }
  }

  // Delete (deactivate) a coupon
  async deleteCoupon(id) {
    try {
      const endpoint = COUPON_ENDPOINTS.DELETE.replace(':id', id);
      const response = await couponApi.delete(buildApiUrl(endpoint));
      const data = response.data;
      return {
        success: true,
        message: data.message || 'Coupon deleted successfully'
      };
    } catch (error) {
      console.error('Delete coupon error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete coupon'
      };
    }
  }

  // Format coupon for display
  formatCoupon(coupon) {
    return {
      ...coupon,
      discount_percentage: parseFloat(coupon.discount_percentage),
      expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'No expiry',
      is_expired: coupon.expiry_date ? new Date(coupon.expiry_date) < new Date() : false
    };
  }

  // Get coupon status color
  getCouponStatusColor(coupon) {
    if (!coupon.is_active) return '#EF4444'; // Red for inactive
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) return '#F59E0B'; // Orange for expired
    return '#10B981'; // Green for active
  }

  // Get coupon status text
  getCouponStatusText(coupon) {
    if (!coupon.is_active) return 'Inactive';
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) return 'Expired';
    return 'Active';
  }
}

const couponService = new CouponService();
export default couponService;
