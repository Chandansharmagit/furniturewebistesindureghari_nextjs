import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaShoppingCart, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaExternalLinkAlt,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaChrome,
  FaSafari,
  FaFirefox,
  FaEdge,
  FaGlobe,
  FaSearch,
  FaFilter,
  FaList,
  FaThLarge,
  FaChevronDown,
  FaChevronUp,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaTimes
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import dashboardService from '../../../services/dashboardService';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import authService from '../../../services/authService';
import { API_BASE_URL } from '../../../config/api';
import './AbandonedCartsTab.css';

const AbandonedCartsTab = ({ selectedPeriod, setSelectedPeriod }) => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and state
  const [viewMode, setViewMode] = useState('clustering'); // 'clustering' or 'list'
  const [expertMode, setExpertMode] = useState(false); // simple mode by default
  const [searchTerm, setSearchTerm] = useState('');
  const [ipFilter, setIpFilter] = useState('all'); // 'all', 'shared', 'unique'
  const [userTypeFilter, setUserTypeFilter] = useState('all'); // 'all', 'registered', 'anonymous'
  const [expandedGroups, setExpandedGroups] = useState({});

  // Custom modals & notifications state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, data: null });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  // Helper: Device category parser
  const getDeviceDetails = (userAgent) => {
    if (!userAgent) return { type: 'Desktop', browser: 'Browser' };
    let type = 'Desktop';
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      type = 'Mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      type = 'Tablet';
    }
    
    let browser = 'Browser';
    if (/chrome|crios/i.test(userAgent)) browser = 'Chrome';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
    else if (/firefox|iceweasel/i.test(userAgent)) browser = 'Firefox';
    else if (/edge|edg/i.test(userAgent)) browser = 'Edge';
    
    return { type, browser };
  };

  // Helper: Intent classification
  const getIntentCategory = (group) => {
    const sessionCount = group.sessionIds.size;
    const itemCount = group.items.length;
    const value = group.totalValue;
    const isRegistered = group.customerNames.size > 0;
    
    if (value >= 10000) return { label: '🔥 High Interest (Big Cart)', className: 'intent-high-value' };
    if (sessionCount > 1) return { label: '🔄 Returning Visitor', className: 'intent-multi-session' };
    if (itemCount >= 3) return { label: '🛍️ Active Shopper', className: 'intent-active' };
    if (isRegistered) return { label: '👥 Registered Customer', className: 'intent-lead' };
    return { label: '👀 Window Shopper', className: 'intent-casual' };
  };

  const toggleGroup = (ip) => {
    setExpandedGroups(prev => ({
      ...prev,
      [ip]: !prev[ip]
    }));
  };

  // Open custom delete confirmation modal
  const handleDeleteClick = (e, data) => {
    e.stopPropagation(); // prevent accordion toggle
    setDeleteConfirm({ isOpen: true, data });
  };

  // Execute DELETE call
  const confirmDeleteAction = async () => {
    if (!deleteConfirm.data) return;
    const { sessionId, productId, ipAddress } = deleteConfirm.data;

    try {
      const credentials = authService.getCredentials();
      const params = new URLSearchParams();
      if (ipAddress) params.append('ipAddress', ipAddress);
      else {
        if (sessionId) params.append('sessionId', sessionId);
        if (productId) params.append('productId', productId);
      }

      const response = await fetch(`${API_BASE_URL}/api/dashboard/analytics/abandoned-carts?${params.toString()}`, {
        method: 'DELETE',
        headers: credentials
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showToast('Abandoned cart records removed successfully', 'success');
        loadAbandonedCarts();
      } else {
        showToast(data.message || 'Failed to delete records', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('An error occurred while deleting the cart record', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, data: null });
    }
  };

  // IP matching counts
  const ipCounts = {};
  carts.forEach(c => {
    if (c.ip_address) {
      ipCounts[c.ip_address] = (ipCounts[c.ip_address] || 0) + 1;
    }
  });

  // Unique / Duplicate IP stats
  const uniqueIps = new Set(carts.map(c => c.ip_address).filter(Boolean)).size;
  const duplicateIpsCount = Object.values(ipCounts).filter(c => c > 1).length;

  // Filter carts
  const filteredCarts = carts.filter(cart => {
    // 1. Search term match
    const name = cart.customer_name || '';
    const email = cart.customer_email || '';
    const ip = cart.ip_address || '';
    const prod = cart.product_name || '';
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ip.includes(searchTerm) ||
      prod.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (!matchesSearch) return false;
    
    // 2. IP Match filter
    const count = ipCounts[cart.ip_address] || 0;
    if (ipFilter === 'shared' && count <= 1) return false;
    if (ipFilter === 'unique' && count > 1) return false;
    
    // 3. User type filter
    const isReg = !!cart.customer_name;
    if (userTypeFilter === 'registered' && !isReg) return false;
    if (userTypeFilter === 'anonymous' && isReg) return false;
    
    return true;
  });

  // Group filtered carts by IP address
  const groupCartsByIp = (cartsList) => {
    const groups = {};
    cartsList.forEach(cart => {
      const ip = cart.ip_address || 'Unknown IP';
      if (!groups[ip]) {
        groups[ip] = {
          ip,
          items: [],
          totalValue: 0,
          customerNames: new Set(),
          customerEmails: new Set(),
          sessionIds: new Set(),
          userAgent: cart.user_agent || '',
          lastActive: cart.added_at,
        };
      }
      groups[ip].items.push(cart);
      groups[ip].totalValue += parseFloat(cart.price) * (cart.quantity || 1);
      if (cart.customer_name) groups[ip].customerNames.add(cart.customer_name);
      if (cart.customer_email) groups[ip].customerEmails.add(cart.customer_email);
      if (cart.session_id) groups[ip].sessionIds.add(cart.session_id);
      if (new Date(cart.added_at) > new Date(groups[ip].lastActive)) {
        groups[ip].lastActive = cart.added_at;
      }
    });
    // Sort by last active descending
    return Object.values(groups).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
  };

  const groupedCarts = groupCartsByIp(filteredCarts);

  if (loading) return <LoadingSpinner message="Retrieving abandoned treasures..." />;
  if (error) return <div className="admin-error-card"><h3>Error</h3><p>{error}</p></div>;

  return (
    <div className="abandoned-carts-container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`royal-toast royal-toast-${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="pu-section-header-royal">
        <div className="header-main">
          <h2>Abandoned Carts</h2>
          <p>Track users who left items in their cart, categorized and grouped by device signature</p>
        </div>
        <div className="pu-header-controls" style={{ display: 'flex', gap: '15px' }}>
          {/* Simple vs Expert mode toggle */}
          <div className="view-mode-toggle" style={{ marginRight: '10px' }}>
            <button
              type="button"
              className={`toggle-btn ${!expertMode ? 'active' : ''}`}
              onClick={() => setExpertMode(false)}
              title="Simplified view for non-technical users"
            >
              <FaEyeSlash /> <span>Simple View</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${expertMode ? 'active' : ''}`}
              onClick={() => setExpertMode(true)}
              title="Advanced technical data view"
            >
              <FaEye /> <span>Tech View</span>
            </button>
          </div>

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
          <div className="stat-icon"><FaDesktop /></div>
          <div className="stat-info">
            <h3>{uniqueIps}</h3>
            <p>{expertMode ? "Unique IPs" : "Estimated Shoppers"}</p>
          </div>
        </div>
        <div className="royal-stat-card">
          <div className="stat-icon"><FaFilter /></div>
          <div className="stat-info">
            <h3>{duplicateIpsCount}</h3>
            <p>{expertMode ? "Shared IP Matches" : "Multi-Item Devices"}</p>
          </div>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="pu-filter-panel-royal abandoned-filters-bar">
        <div className="search-box-wrap">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder={expertMode ? "Search IP, Customer, Product..." : "Search Customer or Product..."}
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-search-input"
          />
        </div>
        
        <div className="filters-group">
          {expertMode && (
            <div className="filter-select-wrap">
              <FaFilter className="filter-icon" />
              <select 
                value={ipFilter} 
                onChange={(e) => setIpFilter(e.target.value)}
                className="royal-select"
              >
                <option value="all">All IP Matches</option>
                <option value="shared">Shared IPs Only</option>
                <option value="unique">Unique IPs Only</option>
              </select>
            </div>
          )}

          <div className="filter-select-wrap">
            <select 
              value={userTypeFilter} 
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="royal-select"
            >
              <option value="all">All User Types</option>
              <option value="registered">Registered Customers</option>
              <option value="anonymous">Guest Visitors</option>
            </select>
          </div>
        </div>

        <div className="view-mode-toggle">
          <button 
            type="button" 
            className={`toggle-btn ${viewMode === 'clustering' ? 'active' : ''}`}
            onClick={() => setViewMode('clustering')}
            title="Grouped by Device"
          >
            <FaThLarge /> <span>Device Clusters</span>
          </button>
          <button 
            type="button" 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List of all items"
          >
            <FaList /> <span>List View</span>
          </button>
        </div>
      </div>

      {/* Content Rendering based on ViewMode */}
      {viewMode === 'clustering' ? (
        <div className="device-clustering-grid">
          {groupedCarts.length === 0 ? (
            <div className="no-data-luxury">
              <FaShoppingCart size={48} />
              <h3>No Devices Found</h3>
              <p>No abandoned sessions match your current filter selection.</p>
            </div>
          ) : (
            groupedCarts.map(group => {
              const { type, browser } = getDeviceDetails(group.userAgent);
              const intent = getIntentCategory(group);
              const isExpanded = !!expandedGroups[group.ip];
              
              const DeviceIcon = type === 'Mobile' ? FaMobileAlt : type === 'Tablet' ? FaTabletAlt : FaDesktop;
              const BrowserIcon = browser === 'Chrome' ? FaChrome : browser === 'Safari' ? FaSafari : browser === 'Firefox' ? FaFirefox : browser === 'Edge' ? FaEdge : FaGlobe;
              
              // Friendly title for simple view
              const clusterTitle = expertMode 
                ? group.ip 
                : `Shopper from ${type} (${browser})`;
              
              return (
                <div key={group.ip} className={`device-cluster-card ${isExpanded ? 'expanded' : ''} ${group.items.length > 1 ? 'has-multiple-items' : ''}`}>
                  <div 
                    className="cluster-card-header"
                    onClick={() => toggleGroup(group.ip)}
                  >
                    <div className="header-left">
                      <div className="device-icon-wrap" title={`${type} - ${browser}`}>
                        <DeviceIcon className="device-icon" />
                        <BrowserIcon className="browser-icon" />
                      </div>
                      <div className="device-meta-info">
                        <div className="ip-heading">
                          <h4>{clusterTitle}</h4>
                          {group.items.length > 1 && (
                            <span className="shared-badge">
                              {expertMode ? `IP Match (${group.items.length} items)` : `${group.items.length} Abandoned Items`}
                            </span>
                          )}
                        </div>
                        <div className="device-subtext">
                          <span>Last Active: {formatDate(group.lastActive)}</span>
                          {expertMode && (
                            <span className="session-count-badge">{group.sessionIds.size} {group.sessionIds.size > 1 ? 'Sessions' : 'Session'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="header-right">
                      <div className="insight-badge-group">
                        <span className={`intent-badge ${intent.className}`}>{intent.label}</span>
                        <span className="total-value-badge">₹{group.totalValue.toLocaleString('en-IN')}</span>
                      </div>
                      
                      {/* Delete device cluster */}
                      <button 
                        className="btn-delete-cart" 
                        onClick={(e) => handleDeleteClick(e, { ipAddress: group.ip })}
                        title="Remove all items from this device"
                      >
                        <FaTrashAlt />
                      </button>

                      <button className="expand-indicator-btn">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="cluster-card-content">
                      <div className="cluster-summary-banner">
                        <div className="summary-col">
                          <h5>Customer Info</h5>
                          {group.customerNames.size > 0 ? (
                            Array.from(group.customerNames).map(name => (
                              <div key={name} className="customer-detail-line">
                                <FaUser size={12} className="meta-icon" /> <strong>{name}</strong>
                              </div>
                            ))
                          ) : (
                            <span className="anonymous-user-badge">Anonymous Visitor</span>
                          )}
                          {Array.from(group.customerEmails).map(email => (
                            <div key={email} className="customer-email-line">
                              <FaEnvelope size={12} className="meta-icon" /> {email}
                            </div>
                          ))}
                        </div>
                        
                        {expertMode && (
                          <div className="summary-col">
                            <h5>User Agent Signature</h5>
                            <span className="ua-signature">{group.userAgent}</span>
                          </div>
                        )}
                      </div>

                      <table className="royal-data-table cluster-items-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>Added At</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((cart, idx) => (
                            <tr key={`${cart.session_id}-${idx}`}>
                              <td>
                                <div className="product-cell-royal">
                                  <img src={cart.product_image} alt={cart.product_name} />
                                  <div className="product-meta">
                                    <span className="product-name-luxury">{cart.product_name}</span>
                                    {expertMode && (
                                      <span className="session-tag">Session: {cart.session_id.substring(0, 8)}...</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>₹{parseFloat(cart.price).toLocaleString('en-IN')}</td>
                              <td>{cart.quantity || 1}</td>
                              <td>₹{(parseFloat(cart.price) * (cart.quantity || 1)).toLocaleString('en-IN')}</td>
                              <td>{formatDate(cart.added_at)}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    className="btn-icon-royal" 
                                    onClick={() => window.open(`/product/${cart.product_id}`, '_blank')}
                                    title="View Product Page"
                                  >
                                    <FaExternalLinkAlt size={12} />
                                  </button>
                                  
                                  {/* Delete single item */}
                                  <button 
                                    className="btn-icon-royal btn-delete-cart-item" 
                                    onClick={(e) => handleDeleteClick(e, { sessionId: cart.session_id, productId: cart.product_id })}
                                    title="Remove this item"
                                  >
                                    <FaTrashAlt size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="royal-table-container">
          {filteredCarts.length === 0 ? (
            <div className="no-data-luxury">
              <FaShoppingCart size={48} />
              <h3>No Abandoned Carts</h3>
              <p>No records match your selected filters.</p>
            </div>
          ) : (
            <table className="royal-data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>{expertMode ? "Details & IP" : "Shopping Device"}</th>
                  <th>Added At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCarts.map((cart, index) => {
                  const { type, browser } = getDeviceDetails(cart.user_agent);
                  const DeviceIcon = type === 'Mobile' ? FaMobileAlt : type === 'Tablet' ? FaTabletAlt : FaDesktop;
                  
                  return (
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
                            <span className="anonymous-user-badge">Anonymous Visitor</span>
                          )}
                          {expertMode && (
                            <div className="session-tag">Session: {cart.session_id.substring(0, 8)}...</div>
                          )}
                        </div>
                      </td>
                      <td className="details-td">
                        <div className="activity-details">
                          <div className="detail-item font-semibold">Qty: {cart.quantity || 1}</div>
                          <div className="detail-item ip-with-icon" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <DeviceIcon title={`${type} - ${browser}`} style={{ color: '#B19456' }} />
                            <span>{expertMode ? `IP: ${cart.ip_address}` : `on ${type} (${browser})`}</span>
                          </div>
                          {ipCounts[cart.ip_address] > 1 && (
                            <span className="linked-ip-badge" title="Other items abandoned from this device">
                              {expertMode ? `Linked Device (${ipCounts[cart.ip_address]} items)` : `Linked Shopping Session`}
                            </span>
                          )}
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
                          
                          {/* Delete item */}
                          <button 
                            className="btn-icon-royal btn-delete-cart-item" 
                            onClick={(e) => handleDeleteClick(e, { sessionId: cart.session_id, productId: cart.product_id })}
                            title="Remove this item"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Custom React Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="reply-modal-overlay" onClick={() => setDeleteConfirm({ isOpen: false, data: null })}>
          <div className="reply-modal-container" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="reply-modal-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
              <div className="title-area" style={{ color: '#dc2626' }}>
                <FaTrashAlt className="header-icon" style={{ color: '#dc2626' }} />
                <h3 style={{ color: '#dc2626' }}>Clear Records?</h3>
              </div>
              <button className="close-btn" onClick={() => setDeleteConfirm({ isOpen: false, data: null })} aria-label="Close modal">
                <MdClose />
              </button>
            </div>

            <div className="reply-modal-form" style={{ paddingTop: '0.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', textAlign: 'left' }}>
                {deleteConfirm.data?.ipAddress 
                  ? `Are you sure you want to remove all abandoned carts for customer device group ${expertMode ? deleteConfirm.data.ipAddress : ''}? This action cannot be undone.`
                  : `Are you sure you want to delete this item from the list?`
                }
              </p>
              
              <div className="reply-modal-actions" style={{ marginTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => setDeleteConfirm({ isOpen: false, data: null })}
                >
                  Keep
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: '#ffffff' }}
                  onClick={confirmDeleteAction}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbandonedCartsTab;
