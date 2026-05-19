import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Search, Calendar, MapPin, Truck, CheckCircle, XCircle, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import './OrderTracking.css';

export default function OrderTracking() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const loadOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.email) {
        setError('User authentication required');
        navigate('/login');
        return;
      }
      
      const result = await orderService.getMyOrders({ page: 1, limit: 50 });
      if (result.success) {
        setOrders(result.data.orders || []);
      } else {
        setError(result.error || 'Failed to load orders');
      }
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [navigate, setError]);

  useEffect(() => {
    if (!authService.isAuthenticatedWithContext()) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [navigate, loadOrders]);

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return { icon: <Clock />, label: 'Order Pending', class: 'pending' };
      case 'confirmed': case 'processing': return { icon: <Package />, label: 'In Preparation', class: 'processing' };
      case 'shipped': return { icon: <Truck />, label: 'On Its Way', class: 'shipped' };
      case 'delivered': return { icon: <CheckCircle />, label: 'Hand Delivered', class: 'delivered' };
      case 'cancelled': case 'refunded': return { icon: <XCircle />, label: 'Cancelled', class: 'cancelled' };
      default: return { icon: <Clock />, label: 'Status Update', class: 'pending' };
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="ot-loading-screen">
        <div className="ot-loader-content">
          <div className="ot-spinner"></div>
          <p className="serif-italic">Verifying order records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ot-page">
      <header className="ot-editorial-header">
        <div className="ot-container">
          <div className="ot-header-badge">Purchase History</div>
          <h1 className="ot-main-title serif">
            Track your <span className="serif-italic">Acquisitions</span>
          </h1>
          <p className="ot-main-subtitle">
            A curated overview of your bespoke pieces and their current journey to your home.
          </p>
        </div>
      </header>

      <section className="ot-controls-section">
        <div className="ot-container">
          <div className="ot-controls-flex">
            <div className="ot-search-pill">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Find by order reference..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="ot-filter-group">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
              <button onClick={() => loadOrders(true)} className="ot-refresh-btn">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="ot-container">
        {error && (
          <div className="ot-error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
            <XCircle style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            {error}
          </div>
        )}
        
        {filteredOrders.length === 0 ? (
          <div className="ot-empty-state">
            <div className="ot-empty-icon"><Package size={48} /></div>
            <h2 className="serif">No Orders Found</h2>
            <p>You haven't added any pieces to your collection yet.</p>
            <Link to="/" className="ot-cta-btn">Start Exploring</Link>
          </div>
        ) : (
          <div className="ot-grid">
            {filteredOrders.map((order, idx) => {
              const status = getStatusInfo(order.status);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order.id} 
                  className={`ot-card ${status.class}`}
                >
                  <div className="ot-card-top">
                    <div className="ot-ref">
                      <span className="ot-label">Reference</span>
                      <h3 className="ot-number">#{order.order_number || order.id}</h3>
                    </div>
                    <div className={`ot-status-pill ${status.class}`}>
                      {status.icon}
                      <span>{status.label}</span>
                    </div>
                  </div>

                  <div className="ot-card-body">
                    <div className="ot-meta-item">
                      <Calendar size={14} />
                      <span>{orderService.formatOrderDate(order.created_at)}</span>
                    </div>
                    <div className="ot-meta-item">
                      <MapPin size={14} />
                      <span>{typeof order.shipping_address === 'string' ? order.shipping_address : order.shipping_address.city}</span>
                    </div>
                  </div>

                  <div className="ot-card-footer">
                    <div className="ot-total">
                      <span className="ot-label">Total Amount</span>
                      <span className="ot-amount">{orderService.formatCurrency(order.total_amount)}</span>
                    </div>
                    <div className="ot-actions">
                      <button 
                        onClick={() => navigate(`/product/${order.id}`)}
                        className="ot-view-details"
                      >
                        Details
                      </button>
                      {(order.status === 'shipped' || order.status === 'processing') && (
                        <button 
                          onClick={async () => {
                            setTrackingLoading(true);
                            setSelectedOrder(order.id);
                            const res = await orderService.trackOrder(order.id);
                            if (res.success) setTrackingDetails(res.data);
                            setTrackingLoading(false);
                          }}
                          className="ot-track-btn"
                        >
                          {trackingLoading && selectedOrder === order.id ? '...' : <Truck size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <AnimatePresence>
        {trackingDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ot-modal-overlay" 
            onClick={() => setTrackingDetails(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="ot-modal" 
              onClick={e => e.stopPropagation()}
            >
              <div className="ot-modal-header">
                <h3 className="serif">Acquisition <span className="serif-italic">Journey</span></h3>
                <button onClick={() => setTrackingDetails(null)} className="ot-close">×</button>
              </div>
              <div className="ot-modal-content">
                <div className="ot-tracking-timeline">
                  <div className="ot-timeline-item active">
                    <div className="ot-dot"></div>
                    <div className="ot-tl-content">
                      <h4>{getStatusInfo(trackingDetails.status).label}</h4>
                      <p>Currently processing at our logistics hub.</p>
                    </div>
                  </div>
                </div>
                {trackingDetails.tracking_url && (
                  <a href={trackingDetails.tracking_url} target="_blank" rel="noreferrer" className="ot-external-link">
                    Track via Carrier Website <ChevronRight size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}