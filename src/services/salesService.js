import axios from 'axios';
import { buildApiUrl } from '../config/api';
import api from '../config/api';

// Create axios instance with authentication
const apiClient = axios.create({
  timeout: 30000, // Increased to 30 seconds for production database
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

// Add request interceptor to include JWT Authorization header
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

class SalesService {
  // Get sales overview/dashboard statistics
  async getOverview() {
    try {
      const cacheBuster = Date.now();
      const response = await apiClient.get(`${buildApiUrl(api.ENDPOINTS.SALES.OVERVIEW)}?_t=${cacheBuster}`);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Sales overview error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch sales overview'
      };
    }
  }

  // Get sales orders with filtering and pagination
  async getOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filtering parameters
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.minAmount) queryParams.append('minAmount', params.minAmount);
      if (params.maxAmount) queryParams.append('maxAmount', params.maxAmount);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${buildApiUrl(api.ENDPOINTS.SALES.ORDERS)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await apiClient.get(url);
      const data = response.data;
      return {
        success: true,
        data: data.data || data,
        pagination: data.pagination || {}
      };
    } catch (error) {
      console.error('Sales orders error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch sales orders'
      };
    }
  }

  // Get sales analytics
  async getAnalytics(period = '30d') {
    try {
      const response = await apiClient.get(`${buildApiUrl(api.ENDPOINTS.DASHBOARD.SALES_ANALYTICS)}?period=${period}`);
      const data = response.data;
      return {
        success: true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Sales analytics error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch sales analytics'
      };
    }
  }

  // Get sales performance by period
  async getPerformance(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.period) queryParams.append('period', params.period);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const url = `${buildApiUrl(api.ENDPOINTS.SALES.ANALYTICS)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await apiClient.get(url);
      const data = response.data;
      return {
        success: true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Sales performance error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch sales performance'
      };
    }
  }

  // Get top selling products
  async getTopProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.period) queryParams.append('period', params.period);
      if (params.category) queryParams.append('category', params.category);

      const url = `${buildApiUrl(api.ENDPOINTS.SALES.ANALYTICS)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await apiClient.get(url);
      const data = response.data;
      return {
        success: true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Top products error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch top products'
      };
    }
  }

  // Export sales data
  async exportData(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.format) queryParams.append('format', params.format);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.status) queryParams.append('status', params.status);
      if (params.includeDetails) queryParams.append('includeDetails', params.includeDetails);

      const url = `${buildApiUrl(api.ENDPOINTS.SALES.EXPORT)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await apiClient.get(url, {
        responseType: 'blob'
      });

      // Handle file download
      const blob = response.data;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `sales-export-${new Date().toISOString().split('T')[0]}.${params.format || 'csv'}`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return {
        success: true,
        message: 'Sales data exported successfully'
      };
    } catch (error) {
      console.error('Export sales data error:', error);
      return {
        success: false,
        error: error.message || 'Failed to export sales data'
      };
    }
  }

  // Utility functions for sales data formatting
  formatCurrency(amount) {
    return `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number || 0);
  }

  formatPercentage(value) {
    return `${(value || 0).toFixed(1)}%`;
  }

  // Calculate sales metrics
  calculateGrowthRate(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  calculateAverageOrderValue(totalRevenue, totalOrders) {
    if (!totalOrders || totalOrders === 0) return 0;
    return totalRevenue / totalOrders;
  }

  calculateConversionRate(orders, visitors) {
    if (!visitors || visitors === 0) return 0;
    return (orders / visitors) * 100;
  }

  // Get sales status badge styling
  getStatusBadge(status) {
    const statusStyles = {
      'pending': { color: '#F59E0B', background: '#FEF3C7' },
      'confirmed': { color: '#3B82F6', background: '#DBEAFE' },
      'processing': { color: '#8B5CF6', background: '#EDE9FE' },
      'shipped': { color: '#06B6D4', background: '#CFFAFE' },
      'delivered': { color: '#10B981', background: '#D1FAE5' },
      'cancelled': { color: '#EF4444', background: '#FEE2E2' },
      'refunded': { color: '#6B7280', background: '#F3F4F6' }
    };
    
    return statusStyles[status?.toLowerCase()] || statusStyles['pending'];
  }

  // Format sales period labels
  getPeriodLabel(period) {
    const periods = {
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 3 months',
      '6m': 'Last 6 months',
      '1y': 'Last year',
      'ytd': 'Year to date',
      'custom': 'Custom period'
    };
    return periods[period] || 'All time';
  }

  // Process sales chart data
  processSalesChartData(rawData, type = 'line') {
    if (!rawData || !Array.isArray(rawData)) return [];

    switch (type) {
      case 'revenue':
        return rawData.map(item => ({
          date: item.date,
          revenue: item.revenue || 0,
          orders: item.orders || 0
        }));
      
      case 'products':
        return rawData.map(item => ({
          name: item.productName || item.name,
          sales: item.totalSales || item.sales || 0,
          quantity: item.totalQuantity || item.quantity || 0,
          revenue: item.totalRevenue || item.revenue || 0
        }));
      
      case 'categories':
        return rawData.map(item => ({
          category: item.categoryName || item.category,
          value: item.sales || item.revenue || 0,
          percentage: item.percentage || 0
        }));
      
      default:
        return rawData;
    }
  }

  // Generate sales report summary
  generateReportSummary(data) {
    if (!data) return null;

    return {
      totalRevenue: data.totalRevenue || 0,
      totalOrders: data.totalOrders || 0,
      averageOrderValue: this.calculateAverageOrderValue(data.totalRevenue, data.totalOrders),
      growthRate: data.growthRate || 0,
      topProduct: data.topSellingProduct || null,
      bestDay: data.bestSalesDay || null,
      conversionRate: data.conversionRate || 0
    };
  }
}

const salesService = new SalesService();
export default salesService;