import React, { useState, useEffect, useCallback } from 'react';
import { FaShoppingCart, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';
import dashboardService from '../../../services/dashboardService';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import './AbandonedCartsTab.css';

const AbandonedCartsTab = ({ selectedPeriod, setSelectedPeriod }) => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAbandonedCarts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getAbandonedCarts(selectedPeriod);
      if (result.success) {
        setCarts(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load abandoned carts');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    loadAbandonedCarts();
  }, [loadAbandonedCarts]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner message="Retrieving abandoned treasures..." />;
  if (error) return <div className="admin-error-card"><h3>Error</h3><p>{error}</p></div>;

  return (
    <div className="abandoned-carts-container">
      <div className="pu-section-header-royal">
        <div className="header-main">
          <h2>Abandoned Carts</h2>
          <p>Track users who left items in their cart without checking out</p>
        </div>
        <div className="pu-header-controls">
          <select 
            className="pu-period-select" 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">Yearly Overview</option>
          </select>
        </div>
      </div>

      <div className="royal-stats-grid">
        <div className="royal-stat-card">
          <div className="stat-icon"><FaShoppingCart /></div>
          <div className="stat-info">
            <h3>{carts.length}</h3>
            <p>Abandoned Items</p>
          </div>
        </div>
        <div className="royal-stat-card">
          <div className="stat-icon"><FaUser /></div>
          <div className="stat-info">
            <h3>{new Set(carts.map(c => c.session_id)).size}</h3>
            <p>Unique Sessions</p>
          </div>
        </div>
        <div className="royal-stat-card">
          <div className="stat-icon"><FaCalendarAlt /></div>
          <div className="stat-info">
            <h3>{selectedPeriod}</h3>
            <p>Analysis Period</p>
          </div>
        </div>
      </div>

      <div className="royal-table-container">
        {carts.length === 0 ? (
          <div className="no-data-luxury">
            <FaShoppingCart size={48} />
            <h3>No Abandoned Carts</h3>
            <p>Your conversion rate is looking great! No abandoned items found for this period.</p>
          </div>
        ) : (
          <table className="royal-data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Details</th>
                <th>Added At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart, index) => (
                <tr key={`${cart.session_id}-${index}`}>
                  <td className="product-td">
                    <div className="product-cell-royal">
                      <img src={cart.product_image} alt={cart.product_name} />
                      <div className="product-meta">
                        <span className="product-name-luxury">{cart.product_name}</span>
                        <span className="product-price-tag">₹{parseFloat(cart.price).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="customer-td">
                    <div className="customer-info-luxury">
                      {cart.customer_name ? (
                        <>
                          <div className="customer-name-group">
                            <FaUser className="meta-icon" /> <strong>{cart.customer_name}</strong>
                          </div>
                          <div className="customer-meta-item">
                            <FaEnvelope className="meta-icon" /> {cart.customer_email}
                          </div>
                          {cart.customer_phone && (
                            <div className="customer-meta-item">
                              <FaPhone className="meta-icon" /> {cart.customer_phone}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="anonymous-user-badge">Anonymous Guest</span>
                      )}
                      <div className="session-tag">Session: {cart.session_id.substring(0, 8)}...</div>
                    </div>
                  </td>
                  <td className="details-td">
                    <div className="activity-details">
                      <div className="detail-item">Qty: {cart.quantity || 1}</div>
                      <div className="detail-item">IP: {cart.ip_address}</div>
                    </div>
                  </td>
                  <td className="date-td">
                    <div className="date-luxury">{formatDate(cart.added_at)}</div>
                  </td>
                  <td className="actions-td">
                    <div className="action-buttons-royal">
                      <button className="btn-icon-royal" title="View Product">
                        <FaExternalLinkAlt onClick={() => window.open(`/product/${cart.product_id}`, '_blank')} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AbandonedCartsTab;
