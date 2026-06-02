import axios from 'axios';
import { COUPON_ENDPOINTS, buildApiUrl } from '../config/api';

// Create axios instance for coupon service
const couponApi = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include JWT token
couponApi.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    const method = (config.method || 'get').toLowerCase();
    if (authToken && method !== 'get') {
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
    console.error('Coupon API error:', error);
    return Promise.reject(error);
  }
);

class CouponService {
  // Get all coupons
  async getAllCoupons(options = {}) {
    try {
      const response = await couponApi.get(buildApiUrl(COUPON_ENDPOINTS.LIST), {
        params: options.fresh ? { fresh: '1', t: Date.now() } : undefined,
        headers: options.fresh ? { 'Cache-Control': 'no-cache' } : undefined
      });
      const data = response.data;
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Get all coupons error:', error);
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
  async validateCoupon(code) {
    try {
      const endpoint = COUPON_ENDPOINTS.VALIDATE.replace(':code', code);
      const response = await couponApi.get(buildApiUrl(endpoint));
      const data = response.data;
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Validate coupon error:', error);
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
