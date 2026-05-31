import axios from 'axios';
import { buildApiUrl } from '../config/api';
import api from '../config/api';

// Create axios instance with authentication
const apiClient = axios.create({
  baseURL: api.BASE_URL,
  timeout: 30000, // Increased to 30 seconds for production database
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT Authorization header
apiClient.interceptors.request.use(
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

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let the global auth interceptor handle 401/403 redirects
    return Promise.reject(error);
  }
);

class DashboardService {
  // Get dashboard overview with KPIs
  async getOverview(period = '30d') {
    try {
      // Convert period format (e.g., '30d' -> '30')
      const periodDays = period.replace(/[^0-9]/g, '');
      
      // Add cache-busting parameter
      const cacheBuster = Date.now();
      
      const response = await apiClient.get(`${buildApiUrl(api.ENDPOINTS.DASHBOARD.OVERVIEW)}?period=${periodDays}&_t=${cacheBuster}`);
      
      console.log('Dashboard API response received:', response.status);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Dashboard overview error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        return {
          success: false,
          error: 'Access token required. Please log in again.'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch dashboard overview'
      };
    }
  }

  // Get revenue analytics
  async getRevenueAnalytics(period = '30d') {
    try {
      const cacheBuster = Date.now();
      const response = await apiClient.get(`${buildApiUrl(api.ENDPOINTS.DASHBOARD.SALES_ANALYTICS)}?period=${period}&_t=${cacheBuster}`);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Revenue analytics error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch revenue analytics'
      };
    }
  }

  // Get order analytics
  async getOrderAnalytics(period = '30d') {
    try {
      const cacheBuster = Date.now();
      const response = await apiClient.get(`${buildApiUrl(api.ENDPOINTS.DASHBOARD.SALES_ANALYTICS)}?period=${period}&_t=${cacheBuster}`);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Order analytics error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch order analytics'
      };
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(period = '30d') {
    try {
      const response = await apiClient.get(`${api.ENDPOINTS.DASHBOARD.CUSTOMER_ANALYTICS}?period=${period}`);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Customer analytics error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch customer analytics'
      };
    }
  }

  // Get product analytics
  async getProductAnalytics(period = '30d') {
    try {
      const cacheBuster = Date.now();
      const response = await apiClient.get(`${buildApiUrl(api.ENDPOINTS.DASHBOARD.PRODUCT_ANALYTICS)}?period=${period}&_t=${cacheBuster}`);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Product analytics error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch product analytics'
      };
    }
  }

  // Get abandoned carts
  async getAbandonedCarts(period = '30d') {
    try {
      const periodDays = period.replace(/[^0-9]/g, '');
      const response = await apiClient.get(`${buildApiUrl(api.ENDPOINTS.DASHBOARD.ABANDONED_CARTS)}?period=${periodDays}`);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Abandoned carts error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch abandoned carts'
      };
    }
  }

  // Get system health
  async getSystemHealth() {
    try {
      const response = await apiClient.get(buildApiUrl(api.ENDPOINTS.DASHBOARD.SYSTEM_HEALTH));
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('System health error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch system health'
      };
    }
  }

  // Get recent activities
  async getRecentActivities(limit = 10) {
    try {
      const response = await apiClient.get(`${buildApiUrl(api.ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES)}?limit=${limit}`);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Recent activities error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch recent activities'
      };
    }
  }

  // Utility functions for formatting dashboard data
  formatCurrency(amount) {
    return `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number || 0);
  }

  formatPercentage(value) {
    return `${(value || 0).toFixed(1)}%`;
  }

  calculateGrowthPercentage(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  getGrowthIndicator(percentage) {
    if (percentage > 0) return { type: 'positive', icon: '↗️' };
    if (percentage < 0) return { type: 'negative', icon: '↘️' };
    return { type: 'neutral', icon: '→' };
  }

  // Format time periods for analytics
  getTimePeriodLabel(period) {
    const periods = {
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 3 months',
      '1y': 'Last year'
    };
    return periods[period] || 'Custom period';
  }

  // Process chart data for visualization
  processChartData(rawData, type = 'line') {
    if (!rawData || !Array.isArray(rawData)) return [];

    switch (type) {
      case 'line':
        return rawData.map(item => ({
          x: item.date || item.label,
          y: item.value || item.amount || 0
        }));
      
      case 'bar':
        return rawData.map(item => ({
          label: item.label || item.name,
          value: item.value || item.count || 0
        }));
      
      case 'pie':
        return rawData.map(item => ({
          name: item.name || item.label,
          value: item.value || item.percentage || 0,
          color: item.color || this.generateColor()
        }));
      
      default:
        return rawData;
    }
  }

  // Generate random colors for charts
  generateColor() {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Get dashboard refresh interval based on user role
  getRefreshInterval(userRole) {
    const intervals = {
      'admin': 30000,      // 30 seconds
      'manager': 60000,    // 1 minute
      'user': 300000       // 5 minutes
    };
    return intervals[userRole] || 300000;
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
