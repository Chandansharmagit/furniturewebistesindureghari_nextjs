import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config/api';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import UserBlogsTab from './UserBlogsTab';
import './UserProfile.css';

export default function UserProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [orderFilters, setOrderFilters] = useState({
    page: 1,
    limit: 10,
    status: ''
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticatedWithContext()) {
      router.push('/login');
      return;
    }
    loadUserData();
  }, [router]);

  const loadUserData = async () => {
    try {
      const profileResult = await authService.getProfile();
      if (profileResult.success) {
        setProfile(profileResult.data);
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      console.error('Load user data error:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const result = await orderService.getMyOrders(orderFilters);
      if (result.success) {
        setOrders(result.data.orders || []);
        setPagination(result.data.pagination);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Load orders error:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [orderFilters]);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab, loadOrders]);

  const handleOrderFilterChange = (key, value) => {
    setOrderFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setOrderFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const result = await orderService.cancelOrder(orderId, 'Cancelled by customer');
      if (result.success) {
        loadOrders(); // Reload orders to reflect the change
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      setError('Failed to cancel order');
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      const formData = new FormData();
      formData.append('profile_picture', file);

      const result = await authService.uploadProfilePicture(formData);

      if (result.success) {
        // Update profile with new image
        setProfile(prev => ({
          ...prev,
          profile_picture: result.data.profile_picture
        }));
      } else {
        setError(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading && !orders.length && !profile) {
    return (
      <div className="user-profile-main-container">
        <div className="user-profile-loading-spinner">
          <div className="user-profile-spinner-animation"></div>
          <p className="user-profile-loading-text">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-main-container">
      <div className="user-profile-content-wrapper">
        {/* Sidebar */}
        <div className="user-profile-sidebar">
          {/* Profile Header */}
          <div className="user-profile-header-card">
            <div className="user-profile-info-section">
              <div className="user-profile-avatar-container">
                {profile?.profile_picture ? (
                  <img
                    src={profile.profile_picture.startsWith('http') ? profile.profile_picture : `${API_BASE_URL}${profile.profile_picture}`}
                    alt="Profile"
                  />

                ) : (
                  <div className="user-profile-avatar-placeholder">
                    {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
                  </div>
                )}
                <label htmlFor="profile-image-upload" className="user-profile-avatar-upload">
                  {uploadingImage ? (
                    <div className="user-profile-upload-spinner"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM12 17a5 5 0 110-10 5 5 0 010 10z" />
                      <path d="M20 6h-3.586L15 4.586A2 2 0 0013.586 4h-3.172A2 2 0 009 4.586L7.586 6H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2zm0 12H4V8h16v10z" />
                    </svg>
                  )}
                </label>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingImage}
                />
              </div>
              <div className="user-profile-details-container">
                <h1>{profile?.first_name} {profile?.last_name}</h1>
                <p className="user-profile-email-display">{profile?.email}</p>
                <p className="user-profile-phone-display">{profile?.phone}</p>
              </div>
            </div>
            <button className="user-profile-logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="user-profile-navigation-tabs">
            <button
              className={`user-profile-tab-button ${activeTab === 'orders' ? 'user-profile-tab-active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="user-profile-tab-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="user-profile-tab-icon" width="18" height="18">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                My Orders
              </span>
            </button>
            <button
              className={`user-profile-tab-button ${activeTab === 'profile' ? 'user-profile-tab-active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="user-profile-tab-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="user-profile-tab-icon" width="18" height="18">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile Settings
              </span>
            </button>
            <button
              className={`user-profile-tab-button ${activeTab === 'blogs' ? 'user-profile-tab-active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              <span className="user-profile-tab-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="user-profile-tab-icon" width="18" height="18">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                My Journal Entries
              </span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="user-profile-main-content">
          <div className="user-profile-content-area">
            {/* Error Display */}
            {error && (
              <div className="user-profile-error-banner">
                {error}
                <button onClick={() => setError('')} className="user-profile-close-error">×</button>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'orders' && (
              <div className="user-profile-orders-section">
                <div className="user-profile-orders-header">
                  <h2>My Orders</h2>
                  <div className="user-profile-order-filters">
                    <select
                      value={orderFilters.status}
                      onChange={(e) => handleOrderFilterChange('status', e.target.value)}
                      className="user-profile-filter-select"
                    >
                      <option value="">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="user-profile-loading-orders">
                    <div className="user-profile-spinner-animation"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="user-profile-no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <button onClick={() => router.push('/')} className="user-profile-shop-now-btn">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="user-profile-orders-list">
                      {orders.map(order => (
                        <div key={order.id} className="user-profile-order-card">
                          <div className="user-profile-order-header">
                            <div className="user-profile-order-info">
                              <h3>Order #{order.id}</h3>
                              <p className="user-profile-order-date">
                                {orderService.formatOrderDate(order.created_at)}
                              </p>
                            </div>
                            <div className="user-profile-order-status">
                              <span
                                className="user-profile-status-badge"
                                style={{ backgroundColor: orderService.getOrderStatusColor(order.status) }}
                              >
                                {orderService.getOrderStatusText(order.status)}
                              </span>
                            </div>
                          </div>

                          <div className="user-profile-order-details">
                            <div className="user-profile-order-summary">
                              <p><strong>Total:</strong> {orderService.formatCurrency(order.total_amount)}</p>
                              <p><strong>Items:</strong> {order.total_items || 'N/A'}</p>
                              {order.tracking_number && (
                                <p><strong>Tracking:</strong> {order.tracking_number}</p>
                              )}
                            </div>

                            <div className="user-profile-order-actions">
                              <button
                                onClick={() => router.push(`/order/${order.id}`)}
                                className="user-profile-view-details-btn"
                              >
                                View Details
                              </button>
                              {(order.status === 'pending' || order.status === 'confirmed') && (
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="user-profile-cancel-order-btn"
                                >
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.total_pages > 1 && (
                      <div className="user-profile-pagination">
                        <button
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1}
                          className="user-profile-page-btn"
                        >
                          Previous
                        </button>

                        <span className="user-profile-page-info">
                          Page {pagination.current_page} of {pagination.total_pages}
                        </span>

                        <button
                          onClick={() => handlePageChange(pagination.current_page + 1)}
                          disabled={pagination.current_page === pagination.total_pages}
                          className="user-profile-page-btn"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="user-profile-settings-section">
                <h2>Profile Settings</h2>
                <div className="user-profile-form-container">
                  <div className="user-profile-form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profile?.first_name || ''}
                      readOnly
                      className="user-profile-form-input user-profile-readonly"
                    />
                  </div>

                  <div className="user-profile-form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profile?.last_name || ''}
                      readOnly
                      className="user-profile-form-input user-profile-readonly"
                    />
                  </div>

                  <div className="user-profile-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      readOnly
                      className="user-profile-form-input user-profile-readonly"
                    />
                  </div>

                  <div className="user-profile-form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={profile?.phone || ''}
                      readOnly
                      className="user-profile-form-input user-profile-readonly"
                    />
                  </div>

                  <div className="user-profile-form-group">
                    <label>Address</label>
                    <textarea
                      value={profile?.address || ''}
                      readOnly
                      className="user-profile-form-textarea user-profile-readonly"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="user-profile-actions-section">
                  <button
                    onClick={() => router.push('/change-password')}
                    className="user-profile-change-password-btn"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'blogs' && <UserBlogsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}