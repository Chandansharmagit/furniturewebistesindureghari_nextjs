import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSync,
  FaChartPie,
  FaClock,
  FaCookieBite,
  FaGlobe,
  FaHistory,
  FaUserSecret,
  FaFire,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import authService from '../../services/authService';
import { buildApiUrl, DASHBOARD_ENDPOINTS } from '../../config/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './UserActivityDashboard.css';

const UserActivityDashboard = () => {
  const [activityData, setActivityData] = useState(null);
  const [sessionsData, setSessionsData] = useState(null);
  const [cookieConsentData, setCookieConsentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Create axios instance with JWT token authentication
  const createApiInstance = useCallback(() => {
    const token = authService.getToken();
    return axios.create({
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }, []);

  const fetchAllData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const api = createApiInstance();
      const [activityRes, sessionsRes, cookieRes] = await Promise.all([
        api.get(`${buildApiUrl(DASHBOARD_ENDPOINTS.USER_ACTIVITY)}?period=${selectedPeriod}`),
        api.get(`${buildApiUrl(DASHBOARD_ENDPOINTS.SESSIONS)}?period=${selectedPeriod}&page=${currentPage}&limit=10`),
        api.get(`${buildApiUrl(DASHBOARD_ENDPOINTS.COOKIE_CONSENT)}?period=${selectedPeriod}`)
      ]);

      setActivityData(activityRes.data.data);
      setSessionsData(sessionsRes.data.data);
      setCookieConsentData(cookieRes.data.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);

      // Provide more specific error messages
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin or Sales Manager role required.');
      } else if (err.response?.status === 404) {
        setError('Dashboard API endpoints not found. Please check server configuration.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to load dashboard data: ${err.response?.data?.error || err.message}`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPeriod, currentPage, createApiInstance]);

  // Manual refresh function
  const handleManualRefresh = useCallback(() => {
    fetchAllData(true);
  }, [fetchAllData]);

  useEffect(() => {
    // Check authentication before fetching data
    if (!authService.validateToken()) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      return;
    }

    const user = authService.getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'sales_manager')) {
      setError('Access denied. Admin or Sales Manager role required.');
      setLoading(false);
      return;
    }

    fetchAllData();
  }, [selectedPeriod, currentPage, fetchAllData]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || loading || error) return;

    const interval = setInterval(() => {
      fetchAllData(true);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, loading, error, fetchAllData]);

  const formatDuration = (seconds) => {
    if (seconds === undefined || seconds === null) return '0s';
    if (seconds < 1) return '< 1s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatIpAddress = (ip) => {
    if (!ip || ip === 'unknown') return 'Unknown IP';
    if (ip === '::1') return 'localhost (IPv6)';
    if (ip === '127.0.0.1') return 'localhost (IPv4)';
    if (ip.startsWith('::ffff:')) return ip.replace('::ffff:', '') + ' (IPv4 mapped)';
    return ip;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner
          size="medium"
          type="pulse"
          message="Loading analytics data"
          color="primary"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchAllData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard-wrapper">
      <motion.div
        className="analytics-header-royal"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-left">
          <h1 className="royal-analytics-title">Command Analytics & Insights</h1>
          <AnimatePresence mode='wait'>
            {lastUpdated && (
              <motion.div
                key={lastUpdated.getTime()}
                className="last-updated-badge"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <FaClock className="icon" /> Last updated: {lastUpdated.toLocaleTimeString()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="header-controls-group">
          <div className="auto-refresh-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
            <span className="switch-label">Auto-refresh</span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className={`royal-btn refresh ${refreshing ? 'refreshing' : ''}`}
          >
            <FaSync className={refreshing ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <div className="period-dropdown">
            <label><FaHistory /> Range:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="royal-select"
            >
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Activity Summary Cards */}
      <div className="analytics-stats-grid">
        <motion.div className="stat-card-royal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-icon sessions"><FaGlobe /></div>
          <div className="card-info">
            <h3>Total Sessions</h3>
            <div className="val">{activityData?.sessionStats?.total_sessions || 0}</div>
          </div>
        </motion.div>

        <motion.div className="stat-card-royal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="card-icon ips"><FaUserSecret /></div>
          <div className="card-info">
            <h3>Unique IPs</h3>
            <div className="val">{activityData?.sessionStats?.unique_ips || 0}</div>
          </div>
        </motion.div>

        <motion.div className="stat-card-royal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="card-icon duration"><FaClock /></div>
          <div className="card-info">
            <h3>Avg Duration</h3>
            <div className="val">
              {formatDuration(activityData?.sessionStats?.avg_session_duration)}
            </div>
          </div>
        </motion.div>

        <motion.div className="stat-card-royal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="card-icon cookie"><FaCookieBite /></div>
          <div className="card-info">
            <h3>Consent Rate</h3>
            <div className="val">{cookieConsentData?.summary?.acceptanceRate || 0}%</div>
          </div>
        </motion.div>
      </div>

      <div className="analytics-content-grid">
        {/* Activity Types Summary */}
        <motion.div className="analytics-card-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="card-header">
            <h2><FaChartPie /> Internal Operations Activity</h2>
          </div>
          <div className="activity-breakdown">
            {activityData?.activitySummary?.map((activity, index) => (
              <div key={index} className="breakdown-row">
                <div className="activity-meta">
                  <span className="type-badge">{activity.activity_type}</span>
                </div>
                <div className="stats-row">
                  <div className="stat"><span className="n">{activity.count}</span> <span className="l">Actions</span></div>
                  <div className="stat"><span className="n">{activity.unique_sessions}</span> <span className="l">Sessions</span></div>
                  <div className="stat"><span className="n">{activity.unique_users}</span> <span className="l">Users</span></div>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: `${Math.min(100, (activity.count / 100) * 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div className="analytics-card-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <div className="card-header">
            <h2><FaFire /> Trending Intelligence</h2>
          </div>
          <div className="royal-table-container">
            <table className="royal-analytics-table">
              <thead>
                <tr>
                  <th>Product Intelligence</th>
                  <th>Visuals</th>
                  <th>Reach</th>
                </tr>
              </thead>
              <tbody>
                {activityData?.topProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <div className="p-main">
                        <span className="p-name">{product.product_name || `ID: ${product.product_id}`}</span>
                        {product.view_count > 5 && <span className="hot-badge">PIVOTAL</span>}
                      </div>
                    </td>
                    <td className="center">
                      <div className="count-display">
                        <span className="num">{product.view_count}</span>
                        <span className="label">Engagements</span>
                      </div>
                    </td>
                    <td className="center">
                      <div className="count-display">
                        <span className="num">{product.unique_viewers}</span>
                        <span className="label">Viewers</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Cookie Consent Analytics */}
      <motion.div className="analytics-card-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <div className="card-header">
          <h2><FaCookieBite /> Policy Engagement Analytics</h2>
        </div>
        <div className="consent-royal-grid">
          <div className="consent-item-royal accept">
            <label>Accepted</label>
            <div className="v">{cookieConsentData?.summary?.accepted_count || 0}</div>
          </div>
          <div className="consent-item-royal decline">
            <label>Declined</label>
            <div className="v">{cookieConsentData?.summary?.declined_count || 0}</div>
          </div>
          <div className="consent-item-royal neutral">
            <label>Pending</label>
            <div className="v">{cookieConsentData?.summary?.no_response_count || 0}</div>
          </div>
        </div>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div className="analytics-card-xl full-width" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <div className="card-header">
          <h2><FaHistory /> Live Transmission Stream</h2>
        </div>
        <div className="royal-table-container scrollable">
          <table className="royal-analytics-table">
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Operator</th>
                <th>Source IP</th>
                <th>Protocol Trace</th>
                <th>Latency</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {sessionsData?.sessions?.map((session, index) => (
                <tr key={index}>
                  <td className="mono">{session.session_id.substring(0, 8)}</td>
                  <td className="email">{session.user_email || 'Unidentified'}</td>
                  <td className="ip">{formatIpAddress(session.ip_address)}</td>
                  <td>
                    <div className="trace-tags">
                      {session.activity_types ? session.activity_types.split(',').map((type, i) => (
                        <span key={i} className="trace-tag">{type}</span>
                      )) : <span className="trace-tag idle">Idle</span>}
                    </div>
                  </td>
                  <td>{formatDuration(session.session_duration)}</td>
                  <td className="time">{formatDate(session.last_activity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sessionsData?.pagination && (
          <div className="royal-pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-btn"
            >
              <FaChevronLeft />
            </button>
            <span className="p-info">
              Trace <strong>{currentPage}</strong> of <strong>{sessionsData.pagination.totalPages}</strong>
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= sessionsData.pagination.totalPages}
              className="p-btn"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserActivityDashboard;