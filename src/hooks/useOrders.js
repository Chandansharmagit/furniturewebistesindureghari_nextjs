import { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import authService from '../services/authService';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    if (!authService.isAuthenticatedWithContext()) {
      setOrders([]);
      setOrdersCount(0);
      setPendingOrdersCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getMyOrders({
        page: 1,
        limit: 100 // Get more orders to get accurate count
      });
      
      if (result.success && result.data && result.data.orders) {
        const ordersList = result.data.orders;
        setOrders(ordersList);
        setOrdersCount(ordersList.length);
        
        // Count pending/processing orders (orders that need attention)
        const pendingCount = ordersList.filter(order => 
          ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status?.toLowerCase())
        ).length;
        setPendingOrdersCount(pendingCount);
      } else {
        setOrders([]);
        setOrdersCount(0);
        setPendingOrdersCount(0);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders');
      setOrders([]);
      setOrdersCount(0);
      setPendingOrdersCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Refresh orders when authentication status changes
  useEffect(() => {
    const handleAuthChange = () => {
      loadOrders();
    };

    // Listen for auth changes (login/logout)
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const refreshOrders = () => {
    loadOrders();
  };

  return {
    orders,
    ordersCount,
    pendingOrdersCount, // Orders that need user attention
    loading,
    error,
    refreshOrders
  };
};

export default useOrders;