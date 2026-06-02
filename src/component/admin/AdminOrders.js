import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaDownload, FaArrowLeft, FaTrash } from 'react-icons/fa';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import './AdminOrders.css';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  // Load orders data
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 20,
        sortBy,
        sortOrder
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (submittedSearch.trim()) {
        params.customerSearch = submittedSearch.trim();
      }

      if (dateFrom) {
        params.dateFrom = dateFrom;
      }

      if (dateTo) {
        params.dateTo = dateTo;
      }

      const result = await orderService.getAllOrders(params);

      if (result.success) {
        setOrders(result.data || []);
        setTotalPages(result.pagination?.total_pages || result.pagination?.totalPages || 1);
      } else {
        setError(result.error || 'Failed to load orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, submittedSearch, sortBy, sortOrder, dateFrom, dateTo]);

  // Load orders on component mount and when dependencies change
  useEffect(() => {
    if (authService.isAuthenticatedWithContext()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadOrders();
    } else {
      navigate('/login');
    }
  }, [loadOrders, navigate]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSubmittedSearch(searchTerm.trim());
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSubmittedSearch('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle order status update
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const result = await orderService.updateOrderStatus(orderId, newStatus);
      if (result.success) {
        // Reload orders to reflect the change
        loadOrders();
      } else {
        alert('Failed to update order status: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  // Handle view order details
  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleDeleteOrder = async (order) => {
    const orderLabel = order.order_number ? `#${order.order_number}` : `ID ${order.id}`;
    const confirmed = window.confirm(`Delete order ${orderLabel}? This action cannot be undone.`);

    if (!confirmed) return;

    try {
      setDeletingOrderId(order.id);
      const result = await orderService.deleteOrder(order.id);

      if (result.success) {
        setOrders((currentOrders) => currentOrders.filter((item) => item.id !== order.id));

        if (orders.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        } else {
          loadOrders();
        }
      } else {
        alert('Failed to delete order: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle sort change
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="ao-container">
        <div className="ao-loading-spinner">
          <div className="ao-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ao-container">
      {/* Header */}
      <div className="ao-header">
        <div className="ao-header-left">
          <button 
            className="ao-back-btn"
            onClick={() => navigate('/admin/dashboard')}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>Order Management</h1>
          <p>Manage and track all customer orders</p>
        </div>
        <div className="ao-header-actions">
          <button className="ao-export-btn">
            <FaDownload /> Export Orders
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="ao-controls">
        <form onSubmit={handleSearch} className="ao-search-form">
          <div className="ao-search-input-group">
            <FaSearch className="ao-search-icon" />
            <input
              type="text"
              placeholder="Search order, customer, phone, product, SKU, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ao-search-input"
            />
            <button type="submit" className="ao-search-btn">
              Search
            </button>
          </div>
          {submittedSearch && (
            <div className="ao-applied-search">
              Searching: <strong>{submittedSearch}</strong>
            </div>
          )}
          <div className="ao-advanced-search">
            <label>
              From
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </label>
            <button type="button" className="ao-clear-btn" onClick={handleClearFilters}>
              Clear All
            </button>
          </div>
        </form>

        <div className="ao-filter-controls">
          <div className="ao-status-filters">
            <button 
              className={`ao-filter-btn ${statusFilter === 'all' ? 'ao-active' : ''}`}
              onClick={() => handleStatusFilter('all')}
            >
              All Orders
            </button>
            <button 
              className={`ao-filter-btn ${statusFilter === 'pending' ? 'ao-active' : ''}`}
              onClick={() => handleStatusFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`ao-filter-btn ${statusFilter === 'confirmed' ? 'ao-active' : ''}`}
              onClick={() => handleStatusFilter('confirmed')}
            >
              Confirmed
            </button>
            <button 
              className={`ao-filter-btn ${statusFilter === 'processing' ? 'ao-active' : ''}`}
              onClick={() => handleStatusFilter('processing')}
            >
              Processing
            </button>
            <button 
              className={`ao-filter-btn ${statusFilter === 'shipped' ? 'ao-active' : ''}`}
              onClick={() => handleStatusFilter('shipped')}
            >
              Shipped
            </button>
            <button 
              className={`ao-filter-btn ${statusFilter === 'delivered' ? 'ao-active' : ''}`}
              onClick={() => handleStatusFilter('delivered')}
            >
              Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="ao-error-message">
          <p>Error: {error}</p>
          <button onClick={loadOrders} className="ao-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="ao-table-container">
        <table className="ao-table">
          <thead>
            <tr>
              <th 
                className={`ao-sortable ${sortBy === 'order_number' ? `ao-${sortOrder}` : ''}`}
                onClick={() => handleSort('order_number')}
              >
                Order ID
              </th>
              <th 
                className={`ao-sortable ${sortBy === 'customer_name' ? `ao-${sortOrder}` : ''}`}
                onClick={() => handleSort('customer_name')}
              >
                Customer
              </th>
              <th 
                className={`ao-sortable ${sortBy === 'total_amount' ? `ao-${sortOrder}` : ''}`}
                onClick={() => handleSort('total_amount')}
              >
                Amount
              </th>
              <th>Status</th>
              <th 
                className={`ao-sortable ${sortBy === 'created_at' ? `ao-${sortOrder}` : ''}`}
                onClick={() => handleSort('created_at')}
              >
                Date
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="ao-no-orders">
                  <div className="ao-no-orders-message">
                    <h3>No Orders Found</h3>
                    <p>No orders match your current filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="ao-order-id">#{order.order_number}</span>
                  </td>
                  <td>
                    <div className="ao-customer-info">
                      <span className="ao-customer-name">{order.customer_name}</span>
                      <span className="ao-customer-email">{order.email}</span>
                      {order.phone && <span className="ao-customer-email">{order.phone}</span>}
                    </div>
                  </td>
                  <td>
                    <span className="ao-order-amount">{formatCurrency(order.total_amount)}</span>
                  </td>
                  <td>
                    <select
                      className={`ao-status-select ao-${order.status}`}
                      value={order.status}
                      onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td>
                    <span className="ao-order-date">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="ao-order-actions">
                      <button
                        className="ao-action-btn ao-view-btn"
                        onClick={() => handleViewOrder(order.id)}
                        title="View Order Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="ao-action-btn ao-delete-btn"
                        onClick={() => handleDeleteOrder(order)}
                        title="Delete Order"
                        disabled={deletingOrderId === order.id}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ao-pagination">
          <button
            className="ao-pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="ao-pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`ao-pagination-number ${currentPage === page ? 'ao-active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="ao-pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
