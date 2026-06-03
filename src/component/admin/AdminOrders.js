import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaEye,
  FaDownload,
  FaArrowLeft,
  FaTrash,
  FaClipboardList,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaRupeeSign
} from 'react-icons/fa';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import { buildApiUrl } from '../../config/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [activeControlTab, setActiveControlTab] = useState('orders');
  const [registeredCustomers, setRegisteredCustomers] = useState([]);
  const [customerLookupFilter, setCustomerLookupFilter] = useState({
    name: '',
    email: '',
    contact: '',
    sku: '',
    status: 'all'
  });
  const [loyaltyCouponState, setLoyaltyCouponState] = useState({});

  useEffect(() => {
    const loadRegisteredCustomers = async () => {
      const authToken = typeof window !== 'undefined'
        ? localStorage.getItem('token')
          || localStorage.getItem('authToken')
          || localStorage.getItem('adminToken')
          || localStorage.getItem('accessToken')
          || localStorage.getItem('userToken')
        : '';
      const candidateEndpoints = [
        '/api/users',
        '/api/user',
        '/api/admin/users',
        '/api/users/all',
        '/api/user/all',
        '/api/users/getAllUsers',
        '/api/user/getAllUsers',
        '/api/auth/users',
        '/api/auth/all-users',
        '/api/admin/all-users',
        '/api/customers',
        '/api/admin/customers',
        '/api/customers/all',
        '/api/customer-data/customers',
        '/api/customer-data/customers/all',
        '/api/customer-data',
        '/api/customer-data/summary'
      ];
      const findCustomerArrays = (value) => {
        if (Array.isArray(value)) return [value];
        if (!value || typeof value !== 'object') return [];

        return Object.entries(value).flatMap(([key, nestedValue]) => {
          const keyLooksRelevant = /customer|user|patron|client/i.test(key);
          const nestedArrays = findCustomerArrays(nestedValue);

          if (keyLooksRelevant && Array.isArray(nestedValue)) {
            return [nestedValue, ...nestedArrays];
          }

          return nestedArrays;
        });
      };
      const looksLikeCustomer = (item) => {
        if (!item || typeof item !== 'object') return false;
        return Boolean(
          item.name
          || item.full_name
          || item.fullName
          || item.username
          || item.email
          || item.phone
          || item.contact
          || item.mobile
        );
      };
      const mergeCustomers = (nextCustomers) => {
        setRegisteredCustomers((currentCustomers) => {
          const customerMap = new Map();

          [...currentCustomers, ...nextCustomers].forEach((customer) => {
            const customerKey = customer.id
              || customer.user_id
              || customer.customer_id
              || customer.email
              || customer.phone
              || customer.contact
              || customer.mobile;

            if (customerKey) customerMap.set(String(customerKey), customer);
          });

          return Array.from(customerMap.values());
        });
      };
      const loadCachedCustomers = () => {
        if (typeof window === 'undefined') return;

        const cachedCustomers = [];
        const inspectValue = (value) => {
          if (Array.isArray(value)) {
            value.filter(looksLikeCustomer).forEach((customer) => cachedCustomers.push(customer));
            value.forEach(inspectValue);
            return;
          }

          if (!value || typeof value !== 'object') return;
          if (looksLikeCustomer(value)) cachedCustomers.push(value);
          Object.values(value).forEach(inspectValue);
        };

        Object.keys(localStorage).forEach((key) => {
          if (!/customer|user|auth|profile|patron|client/i.test(key)) return;

          try {
            inspectValue(JSON.parse(localStorage.getItem(key)));
          } catch {
            // Ignore plain string tokens and unrelated cached values.
          }
        });

        if (cachedCustomers.length > 0) mergeCustomers(cachedCustomers);
      };

      loadCachedCustomers();

      for (const endpoint of candidateEndpoints) {
        try {
          const response = await fetch(buildApiUrl(endpoint), {
            credentials: 'include',
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined
          });
          if (!response.ok) continue;
          const payload = await response.json();
          const possibleCustomers = findCustomerArrays(payload)
            .map((items) => items.filter(looksLikeCustomer))
            .sort((a, b) => b.length - a.length)[0];

          if (Array.isArray(possibleCustomers) && possibleCustomers.length > 0) {
            mergeCustomers(possibleCustomers);
            return;
          }
        } catch {
          // Customer lookup still works from orders when a registry endpoint is unavailable.
        }
      }
    };

    loadRegisteredCustomers();
  }, []);
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
    const currentOrder = orders.find((order) => String(order.id) === String(orderId));

    if (String(currentOrder?.status || '').toLowerCase() === 'delivered') {
      alert('This order is already completed and cannot be updated.');
      return;
    }

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

  const visibleRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const processingOrders = orders.filter((order) => order.status === 'processing').length;
  const deliveredOrders = orders.filter((order) => order.status === 'delivered').length;
  const formatCompactCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`;
  const extractOrderSkus = (order) => {
    const directSkus = [
      order.sku,
      order.product_sku,
      order.productSku,
      order.variant_sku,
      order.variantSku
    ].filter(Boolean);
    const rawItems = order.items || order.order_items || order.products || order.product_details || [];
    let items = rawItems;

    if (typeof rawItems === 'string') {
      try {
        items = JSON.parse(rawItems);
      } catch {
        items = [];
      }
    }

    const itemSkus = Array.isArray(items)
      ? items.flatMap((item) => [
        item?.sku,
        item?.product_sku,
        item?.productSku,
        item?.variant_sku,
        item?.variantSku
      ]).filter(Boolean)
      : [];

    return [...directSkus, ...itemSkus].map((sku) => String(sku).toLowerCase());
  };
  const registeredCustomerSeed = registeredCustomers.reduce((customers, customer) => {
    const customerId = customer.id || customer.user_id || customer.customer_id || customer.email || customer.phone;
    if (!customerId) return customers;

    customers[customerId] = {
      id: customerId,
      name: customer.name || customer.full_name || customer.fullName || customer.username || 'Registered Customer',
      email: customer.email || 'No email added',
      phone: customer.phone || customer.contact || customer.mobile || customer.phone_number || 'No phone added',
      image: customer.profile_image || customer.profileImage || customer.avatar || customer.image || '',
      totalOrders: Number(customer.total_orders || customer.totalOrders || 0),
      cancelled: 0,
      refunds: 0,
      revenue: Number(customer.total_spent || customer.totalSpend || customer.total_spend || 0),
      skus: new Set(),
      registeredOnly: true,
      lastOrder: ''
    };

    return customers;
  }, {});
  const customerLookupRows = Object.values(
    orders.reduce((customers, order) => {
      const customerId = order.user_id || order.customer_id || order.email || order.phone || order.id;
      const customerName = order.customer_name || order.name || order.full_name || order.user_name || 'Guest Customer';
      const status = String(order.status || '').toLowerCase();
      const existing = customers[customerId] || {
        id: customerId,
        name: customerName,
        email: order.email || order.customer_email || 'No email added',
        phone: order.phone || order.customer_phone || 'No phone added',
        image: order.profile_image || order.user_image || order.avatar || '',
        totalOrders: 0,
        cancelled: 0,
        refunds: 0,
        revenue: 0,
        skus: new Set(),
        registeredOnly: false,
        lastOrder: order.created_at || order.order_date || order.date || ''
      };

      existing.registeredOnly = false;
      existing.name = existing.name === 'Registered Customer' || existing.name === 'Guest Customer' ? customerName : existing.name;
      existing.email = existing.email === 'No email added' ? (order.email || order.customer_email || existing.email) : existing.email;
      existing.phone = existing.phone === 'No phone added' ? (order.phone || order.customer_phone || existing.phone) : existing.phone;
      existing.image = existing.image || order.profile_image || order.user_image || order.avatar || '';
      existing.totalOrders += 1;
      existing.revenue += Number(order.total_amount || order.totalAmount || 0);
      existing.cancelled += status === 'cancelled' || status === 'canceled' ? 1 : 0;
      existing.refunds += status === 'refunded' || status === 'refund' ? 1 : 0;
      extractOrderSkus(order).forEach((sku) => existing.skus.add(sku));
      existing.lastOrder = order.created_at || order.order_date || order.date || existing.lastOrder;
      customers[customerId] = existing;
      return customers;
    }, registeredCustomerSeed)
  );
  const getCustomerStatus = (customer) => {
    if (customer.revenue >= 200000) {
      return {
        label: 'VIP',
        className: 'vip',
        discount: 'Eligible for loyalty discount'
      };
    }

    if (customer.totalOrders > 0) {
      return {
        label: 'Regular',
        className: 'regular',
        discount: customer.revenue >= 100000 ? 'Offer upgrade discount' : 'Standard offers'
      };
    }

    return {
      label: 'Registered',
      className: 'registered',
      discount: 'Send first-order offer'
    };
  };
  const generateLoyaltyCoupon = async (customer) => {
    const customerKey = customer.id || customer.email;

    setLoyaltyCouponState((current) => ({
      ...current,
      [customerKey]: { loading: true, message: 'Generating coupon...' }
    }));

    try {
      const response = await fetch(buildApiUrl('/api/customer-data/loyalty-coupons/generate'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: customer.id,
          email: customer.email,
          customer_name: customer.name,
          total_spend: customer.revenue
        })
      });
      const payload = await response.json();

      setLoyaltyCouponState((current) => ({
        ...current,
        [customerKey]: {
          loading: false,
          coupon: payload.coupon,
          message: payload.message || (payload.success ? 'Coupon generated.' : 'Unable to generate coupon.'),
          success: payload.success
        }
      }));
    } catch (error) {
      setLoyaltyCouponState((current) => ({
        ...current,
        [customerKey]: {
          loading: false,
          success: false,
          message: error.message || 'Unable to generate coupon.'
        }
      }));
    }
  };
  const filteredCustomerLookupRows = customerLookupRows.filter((customer) => {
    const identityNeedles = [
      customerLookupFilter.name,
      customerLookupFilter.email,
      customerLookupFilter.contact
    ].map((value) => value.trim().toLowerCase()).filter(Boolean);
    const skuNeedle = customerLookupFilter.sku.trim().toLowerCase();
    const identityHaystack = [
      customer.name,
      customer.email,
      customer.phone
    ].map((value) => String(value || '').toLowerCase()).join(' ');
    const hasIdentitySearch = identityNeedles.length > 0;
    const identityMatch = identityNeedles.length === 0
      || identityNeedles.some((needle) => identityHaystack.includes(needle));
    const skuMatch = !skuNeedle || Array.from(customer.skus || []).some((sku) => String(sku).includes(skuNeedle));
    const status = getCustomerStatus(customer).className;
    const statusMatch = customerLookupFilter.status === 'all' || status === customerLookupFilter.status;
    const visibilityMatch = customer.totalOrders > 0 || hasIdentitySearch;

    return visibilityMatch && identityMatch && skuMatch && statusMatch;
  }).sort((a, b) => {
    const bDate = new Date(b.lastOrder || 0).getTime();
    const aDate = new Date(a.lastOrder || 0).getTime();
    if (bDate !== aDate) return bDate - aDate;
    return Number(b.totalOrders || 0) - Number(a.totalOrders || 0);
  });

  return (
    <div className={`ao-container ao-tab-${activeControlTab}`}>
      <span className="ao-legacy-back-icon" aria-hidden="true"><FaArrowLeft /></span>
      {/* Header */}
      <div className="ao-header">
        <div className="ao-header-left">
          <button 
            className="ao-back-btn"
            onClick={() => navigate('/admin/dashboard')}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <span className="ao-eyebrow">Real-time Registry</span>
          <h1>Order Control</h1>
          <p>Manage and track all customer orders</p>
        </div>
        <div className="ao-header-actions">
          <button className="ao-export-btn">
            <FaDownload /> Export Orders
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="ao-control-tabs" role="tablist" aria-label="Order control views">
        <button
          type="button"
          className={`ao-control-tab ${activeControlTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveControlTab('orders')}
          role="tab"
          aria-selected={activeControlTab === 'orders'}
        >
          <FaClipboardList />
          Order Registry
        </button>
        <button
          type="button"
          className={`ao-control-tab ${activeControlTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveControlTab('customers')}
          role="tab"
          aria-selected={activeControlTab === 'customers'}
        >
          <FaEye />
          Customer Lookup
        </button>
      </div>

      <div className="ao-customer-lookup-panel">
        <div className="ao-customer-lookup-head">
          <div>
            <span className="ao-eyebrow">Customer Intelligence</span>
            <h2>Lookup Customer Details</h2>
            <p>Review profile details, order volume, cancellations, refunds, and visible spend from the current order registry.</p>
          </div>
          <strong>{filteredCustomerLookupRows.length} Customers</strong>
        </div>

        <div className="ao-customer-filter-bar">
          <label>
            <span>Search by name</span>
            <input
              type="search"
              value={customerLookupFilter.name}
              onChange={(event) => setCustomerLookupFilter((current) => ({
                ...current,
                name: event.target.value
              }))}
              placeholder="Customer name"
            />
          </label>
          <label>
            <span>Search by email</span>
            <input
              type="search"
              value={customerLookupFilter.email}
              onChange={(event) => setCustomerLookupFilter((current) => ({
                ...current,
                email: event.target.value
              }))}
              placeholder="name@example.com"
            />
          </label>
          <label>
            <span>Search by contact</span>
            <input
              type="search"
              value={customerLookupFilter.contact}
              onChange={(event) => setCustomerLookupFilter((current) => ({
                ...current,
                contact: event.target.value
              }))}
              placeholder="98XXXXXXXX"
            />
          </label>
          <label>
            <span>Purchased SKU</span>
            <input
              type="search"
              value={customerLookupFilter.sku}
              onChange={(event) => setCustomerLookupFilter((current) => ({
                ...current,
                sku: event.target.value
              }))}
              placeholder="SKU-1024"
            />
          </label>
          <label>
            <span>Customer status</span>
            <select
              value={customerLookupFilter.status}
              onChange={(event) => setCustomerLookupFilter((current) => ({
                ...current,
                status: event.target.value
              }))}
            >
              <option value="all">All statuses</option>
              <option value="vip">VIP only</option>
              <option value="regular">Regular only</option>
              <option value="registered">Registered only</option>
            </select>
          </label>
          <button
            type="button"
            className="ao-customer-filter-clear"
            onClick={() => setCustomerLookupFilter({ name: '', email: '', contact: '', sku: '', status: 'all' })}
          >
            Clear
          </button>
        </div>

        <div className="ao-customer-grid">
          {filteredCustomerLookupRows.length > 0 ? filteredCustomerLookupRows.map((customer) => (
            <article className="ao-customer-card" key={customer.id}>
              <div className="ao-customer-card-top">
                {customer.image ? (
                  <img src={customer.image} alt={customer.name} className="ao-customer-avatar" />
                ) : (
                  <span className="ao-customer-avatar ao-customer-avatar--initial">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div>
                  <h3>{customer.name}</h3>
                  <p>{customer.email}</p>
                  <p>{customer.phone}</p>
                </div>
              </div>

              <div className="ao-customer-status-row">
                <span className={`ao-customer-status-tag ${getCustomerStatus(customer).className}`}>
                  {getCustomerStatus(customer).label}
                </span>
                <span className="ao-customer-discount-note">
                  {getCustomerStatus(customer).discount}
                </span>
              </div>

              {getCustomerStatus(customer).className === 'vip' && (
                <div className="ao-loyalty-action">
                  <button
                    type="button"
                    onClick={() => generateLoyaltyCoupon(customer)}
                    disabled={loyaltyCouponState[customer.id || customer.email]?.loading}
                  >
                    {loyaltyCouponState[customer.id || customer.email]?.loading
                      ? 'Generating...'
                      : 'Generate 40% Coupon'}
                  </button>
                  {loyaltyCouponState[customer.id || customer.email]?.message && (
                    <p className={loyaltyCouponState[customer.id || customer.email]?.success ? 'success' : 'error'}>
                      {loyaltyCouponState[customer.id || customer.email]?.coupon?.code
                        ? `${loyaltyCouponState[customer.id || customer.email].coupon.code} - ${loyaltyCouponState[customer.id || customer.email].message}`
                        : loyaltyCouponState[customer.id || customer.email].message}
                    </p>
                  )}
                </div>
              )}

              <div className="ao-customer-stats">
                <span>
                  <small>Total Orders</small>
                  <strong>{customer.totalOrders}</strong>
                </span>
                <span>
                  <small>Cancelled</small>
                  <strong>{customer.cancelled}</strong>
                </span>
                <span>
                  <small>Refunds</small>
                  <strong>{customer.refunds}</strong>
                </span>
                <span>
                  <small>Total Spend</small>
                  <strong>{formatCompactCurrency(customer.revenue)}</strong>
                </span>
              </div>

              {customer.skus?.size > 0 && (
                <div className="ao-customer-skus">
                  <small>Purchased SKU</small>
                  <div>
                    {Array.from(customer.skus).slice(0, 4).map((sku) => (
                      <em key={sku}>{sku}</em>
                    ))}
                    {customer.skus.size > 4 && <em>+{customer.skus.size - 4}</em>}
                  </div>
                </div>
              )}
            </article>
          )) : (
            <div className="ao-customer-empty">
              <FaClipboardList />
              <h3>No customer records found</h3>
              <p>Try a name, email, contact, or connect the registered customer API if this user has not purchased yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="ao-summary-grid">
        <div className="ao-summary-card ao-summary-card--wide">
          <span className="ao-summary-icon"><FaRupeeSign /></span>
          <div>
            <p>Visible Revenue</p>
            <strong>{formatCompactCurrency(visibleRevenue)}</strong>
          </div>
        </div>
        <div className="ao-summary-card">
          <span className="ao-summary-icon"><FaClipboardList /></span>
          <div>
            <p>Orders Shown</p>
            <strong>{orders.length}</strong>
          </div>
        </div>
        <div className="ao-summary-card">
          <span className="ao-summary-icon"><FaClock /></span>
          <div>
            <p>Pending</p>
            <strong>{pendingOrders}</strong>
          </div>
        </div>
        <div className="ao-summary-card">
          <span className="ao-summary-icon"><FaTruck /></span>
          <div>
            <p>Processing</p>
            <strong>{processingOrders}</strong>
          </div>
        </div>
        <div className="ao-summary-card">
          <span className="ao-summary-icon"><FaCheckCircle /></span>
          <div>
            <p>Delivered</p>
            <strong>{deliveredOrders}</strong>
          </div>
        </div>
      </div>

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
              orders.map((order) => {
                const isCompleted = String(order.status || '').toLowerCase() === 'delivered';

                return (
                  <tr key={order.id} className={isCompleted ? 'ao-order-completed-row' : ''}>
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
                      <div className="ao-status-control">
                        <select
                          className={`ao-status-select ao-${order.status}`}
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                          disabled={isCompleted}
                          aria-label={isCompleted ? 'Order completed' : 'Update order status'}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                        {isCompleted && (
                          <span className="ao-completed-badge">
                            <FaCheckCircle /> Completed
                          </span>
                        )}
                      </div>
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
                );
              })
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
