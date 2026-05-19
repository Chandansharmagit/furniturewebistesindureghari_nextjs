import { ORDER_ENDPOINTS, buildApiUrl } from '../config/api';

class OrderService {
  // Get customer's orders with pagination and filtering
  async getMyOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filtering parameters
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const url = `${buildApiUrl(ORDER_ENDPOINTS.MY_ORDERS)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          orders: data.orders || [],
          pagination: data.pagination || {}
        }
      };
    } catch (error) {
      console.error('Get my orders error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch orders'
      };
    }
  }

  // Create a new order
  async createOrder(orderData) {
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch(buildApiUrl(ORDER_ENDPOINTS.CREATE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Create order error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create order'
      };
    }
  }

  // Get single order details
  async getOrderDetails(id) {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl(ORDER_ENDPOINTS.DETAIL.replace(':id', id)), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Get order details error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch order details'
      };
    }
  }

  // Cancel an order
  async cancelOrder(id, reason = '') {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(buildApiUrl(ORDER_ENDPOINTS.CANCEL.replace(':id', id)), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Order cancelled successfully'
      };
    } catch (error) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel order'
      };
    }
  }

  // Track an order
  async trackOrder(id) {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${buildApiUrl(ORDER_ENDPOINTS.DETAIL.replace(':id', id))}/track`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Track order error:', error);
      return {
        success: false,
        error: error.message || 'Failed to track order'
      };
    }
  }

  // Admin methods for order management
  async getAllOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filtering parameters
      if (params.status) queryParams.append('status', params.status);
      if (params.customerSearch) queryParams.append('customer_search', params.customerSearch);
      if (params.dateFrom) queryParams.append('date_from', params.dateFrom);
      if (params.dateTo) queryParams.append('date_to', params.dateTo);
      if (params.sortBy) queryParams.append('sort_by', params.sortBy);
      if (params.sortOrder) queryParams.append('sort_order', params.sortOrder);

      const url = `${buildApiUrl(ORDER_ENDPOINTS.LIST)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.orders || [],
        pagination: data.pagination || {}
      };
    } catch (error) {
      console.error('Get all orders error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch orders'
      };
    }
  }

  // Update order status (Admin only)
  async updateOrderStatus(id, status, notes = '') {
    try {
      const response = await fetch(`${buildApiUrl(ORDER_ENDPOINTS.UPDATE_STATUS.replace(':id', id))}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Order status updated successfully'
      };
    } catch (error) {
      console.error('Update order status error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update order status'
      };
    }
  }

  // Utility methods
  formatCurrency(amount) {
    return `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatOrderDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getOrderStatusColor(status) {
    const statusColors = {
      'pending': '#FEF3C7',
      'confirmed': '#DBEAFE',
      'processing': '#EDE9FE',
      'shipped': '#CFFAFE',
      'delivered': '#D1FAE5',
      'cancelled': '#FEE2E2',
      'refunded': '#F3F4F6'
    };
    
    return statusColors[status?.toLowerCase()] || statusColors['pending'];
  }

  getOrderStatusText(status) {
    const statusTexts = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded'
    };
    
    return statusTexts[status?.toLowerCase()] || 'Pending';
  }

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

  canCancelOrder(status) {
    const cancellableStatuses = ['pending', 'confirmed'];
    return cancellableStatuses.includes(status?.toLowerCase());
  }
}

const orderService = new OrderService();
export default orderService;