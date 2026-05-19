import axios from 'axios';
import { buildApiUrl, CUSTOMER_ENDPOINTS, DASHBOARD_ENDPOINTS } from '../config/api';
import api from '../config/api';

// Create axios instance for customer requests
const customerApi = axios.create({
  baseURL: api.BASE_URL,
  timeout: 30000, // Increased to 30 seconds for production database
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

// Add request interceptor to include JWT Authorization header
customerApi.interceptors.request.use(
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

// Response interceptor for error handling
customerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let the global auth interceptor handle 401/403 redirects
    return Promise.reject(error);
  }
);

class CustomerService {
  // Admin customer management methods
  async getAllCustomers(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        customer_type,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort_by,
        sort_order,
        ...(search && { search }),
        ...(customer_type && { customer_type })
      });
      
      const response = await customerApi.get(
        `${buildApiUrl(CUSTOMER_ENDPOINTS.LIST)}?${queryParams}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get all customers error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch customers'
      };
    }
  }

  async getCustomerDetails(customerId) {
    try {
      const url = buildApiUrl(CUSTOMER_ENDPOINTS.DETAIL.replace(':id', customerId));
      const response = await customerApi.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get customer details error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch customer details'
      };
    }
  }

  async getCustomersOverview() {
    try {
      const response = await customerApi.get(
        buildApiUrl(CUSTOMER_ENDPOINTS.OVERVIEW)
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get customers overview error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch customers overview'
      };
    }
  }

  // Alias method for dashboard compatibility
  async getOverview() {
    return this.getCustomersOverview();
  }

  async updateCustomerType(customerId, customerType) {
    try {
      const url = buildApiUrl(`${api.CUSTOMERS.UPDATE_TYPE}/${customerId}`);
      const response = await customerApi.put(url, { customer_type: customerType });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update customer type error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update customer type'
      };
    }
  }

  async addLoyaltyPoints(customerId, points, reason = '') {
    try {
      const url = buildApiUrl(`${api.CUSTOMERS.ADD_LOYALTY_POINTS}/${customerId}`);
      const response = await customerApi.post(url, { points, reason });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Add loyalty points error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to add loyalty points'
      };
    }
  }

  async getCustomerAnalytics(customerId, period = '30') {
    try {
      const url = buildApiUrl(`${api.CUSTOMERS.ANALYTICS}/${customerId}`);
      const response = await customerApi.get(`${url}?period=${period}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get customer analytics error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch customer analytics'
      };
    }
  }

  // Dashboard customer analytics
  async getAnalytics(period = '365') {
    try {
      const url = buildApiUrl(DASHBOARD_ENDPOINTS.CUSTOMER_ANALYTICS);
      const response = await customerApi.get(`${url}?period=${period}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Customer analytics error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch customer analytics'
      };
    }
  }

  async updateCustomerStatus(customerId, isActive) {
    try {
      const url = buildApiUrl(`${api.CUSTOMERS.UPDATE_STATUS}/${customerId}`);
      const response = await customerApi.put(url, { is_active: isActive });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update customer status error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update customer status'
      };
    }
  }

  async exportCustomerData(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await customerApi.get(
        `${buildApiUrl(api.CUSTOMERS.EXPORT)}?${queryParams}`,
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Export customer data error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to export customer data'
      };
    }
  }

  // Utility methods
  getCustomerTypeColor(type) {
    const typeColors = {
      'regular': '#6b7280',
      'premium': '#f59e0b',
      'vip': '#8b5cf6',
      'wholesale': '#3b82f6'
    };
    return typeColors[type] || '#6b7280';
  }

  getCustomerTypeText(type) {
    const typeTexts = {
      'regular': 'Regular',
      'premium': 'Premium',
      'vip': 'VIP',
      'wholesale': 'Wholesale'
    };
    return typeTexts[type] || type;
  }

  formatCustomerSince(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  formatCurrency(amount) {
    return `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  calculateCustomerLifetimeValue(totalSpent, totalOrders, customerSince) {
    const monthsSince = Math.max(1, 
      (new Date() - new Date(customerSince)) / (1000 * 60 * 60 * 24 * 30)
    );
    return {
      averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
      monthlySpending: totalSpent / monthsSince,
      orderFrequency: totalOrders / monthsSince
    };
  }
}

const customerService = new CustomerService();
export default customerService;