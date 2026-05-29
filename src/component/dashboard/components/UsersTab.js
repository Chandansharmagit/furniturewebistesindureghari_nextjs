import React, { useState, useMemo } from 'react';
import { 
  MdSearch, 
  MdFilterList, 
  MdChevronLeft, 
  MdChevronRight, 
  MdMoreHoriz, 
  MdGroup, 
  MdGroupAdd, 
  MdVerified, 
  MdPayments, 
  MdPendingActions 
} from 'react-icons/md';
import './UsersTab.css';

const UsersTab = ({ usersData = [], usersLoading, usersStatistics, formatCurrency }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter & Search Logic
  const filteredUsers = useMemo(() => {
    return usersData.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && user.status === 'Active') ||
        (statusFilter === 'inactive' && user.status === 'Inactive');

      return matchesSearch && matchesStatus;
    });
  }, [usersData, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Format Date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Statistics calculation
  const totalUsers = usersStatistics?.total_users || usersData.length;
  const activeUsers = usersStatistics?.users_with_orders || usersData.filter(u => u.total_orders > 0).length;
  const inactiveUsers = usersStatistics?.users_without_orders || (totalUsers - activeUsers);
  const totalRevenue = usersStatistics?.total_revenue || usersData.reduce((sum, u) => sum + (u.total_spent || 0), 0);
  const averageLtv = activeUsers > 0 ? (totalRevenue / activeUsers) : 0;

  return (
    <div className="cd-client-directory">
      {/* Page Header */}
      <div className="cd-page-header">
        <div>
          <h2 className="cd-header-title">Client Directory</h2>
          <p className="cd-header-subtitle">Managing the relationship lifecycle of our most distinguished patrons.</p>
        </div>
        <div className="cd-header-actions">
          <button className="cd-btn-outline" onClick={() => alert('Exporting customer database...')}>
            Export Database
          </button>
          <button className="cd-btn-primary" onClick={() => alert('New client onboarding form pending release.')}>
            Add Elite Client
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="cd-stats-grid">
        <div className="cd-stat-card">
          <div className="cd-stat-top">
            <MdGroup className="cd-stat-icon" />
            <span className="cd-stat-badge">Total Database</span>
          </div>
          <p className="cd-stat-label">Total Clients</p>
          <h3 className="cd-stat-value">{totalUsers}</h3>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-top">
            <MdVerified className="cd-stat-icon" />
            <span className="cd-stat-badge cd-stat-badge--success">With Transactions</span>
          </div>
          <p className="cd-stat-label">Active Clients</p>
          <h3 className="cd-stat-value">{activeUsers}</h3>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-top">
            <MdPayments className="cd-stat-icon" />
            <span className="cd-stat-badge">Lifetime Value</span>
          </div>
          <p className="cd-stat-label">Avg. Value / Active</p>
          <h3 className="cd-stat-value">{formatCurrency ? formatCurrency(averageLtv) : `₹${averageLtv.toFixed(2)}`}</h3>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-top">
            <MdPendingActions className="cd-stat-icon" />
            <span className="cd-stat-badge cd-stat-badge--error">Zero Orders</span>
          </div>
          <p className="cd-stat-label">Inactive Users</p>
          <h3 className="cd-stat-value">{inactiveUsers}</h3>
        </div>
      </div>

      {/* Main Database Table Container */}
      <div className="cd-table-container">
        {/* Search & Filters */}
        <div className="cd-filters-bar">
          <div className="cd-search-wrapper">
            <MdSearch className="cd-search-icon" />
            <input 
              type="text" 
              className="cd-search-input" 
              placeholder="Search by name, email, phone..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="cd-filter-group">
            <select 
              className="cd-filter-select" 
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">Status: All</option>
              <option value="active">Status: Active</option>
              <option value="inactive">Status: Inactive</option>
            </select>

            <button className="cd-refine-btn" onClick={() => alert('Advanced refinement options.')}>
              <MdFilterList />
              <span>Refine</span>
            </button>
          </div>
        </div>

        {/* Loading and Main Table Rendering */}
        {usersLoading ? (
          <div className="cd-loading">
            <div className="cd-loading-spinner"></div>
            <span className="cd-loading-text">Accessing client records...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="cd-empty-state">
            <MdGroup className="cd-empty-icon" />
            <h4 className="cd-empty-title">No Clients Found</h4>
            <p className="cd-empty-desc">Try resetting your search query or status filter to see client accounts.</p>
          </div>
        ) : (
          <>
            <div className="cd-table-scroll">
              <table className="cd-data-table">
                <thead>
                  <tr>
                    <th>Client Identity</th>
                    <th>Contact Intelligence</th>
                    <th>Total Revenue</th>
                    <th>Last Acquisition</th>
                    <th>Standing</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="cd-client-identity">
                          <div className="cd-client-avatar">
                            <div className="cd-client-avatar--initials">
                              {getInitials(user.name)}
                            </div>
                          </div>
                          <div>
                            <p className="cd-client-name">{user.name}</p>
                            <p className="cd-client-since">Joined {formatDate(user.registration_date)}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="cd-contact-email">{user.email}</p>
                        <p className="cd-contact-phone">{user.phone}</p>
                      </td>
                      <td>
                        <p className="cd-revenue-value">
                          {formatCurrency ? formatCurrency(user.total_spent) : `₹${user.total_spent}`}
                        </p>
                      </td>
                      <td>
                        <p className="cd-last-order-date">{formatDate(user.last_order_date)}</p>
                        <p className="cd-last-order-info">{user.total_orders} order(s)</p>
                      </td>
                      <td>
                        <span className={`cd-badge ${user.status === 'Active' ? 'cd-badge--active' : 'cd-badge--inactive'}`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button className="cd-action-btn" title="More Options">
                          <MdMoreHoriz />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="cd-pagination">
                <p className="cd-pagination-info">
                  Displaying {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} clients
                </p>
                <div className="cd-pagination-controls">
                  <button 
                    className="cd-page-btn cd-page-btn--nav" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <MdChevronLeft />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button 
                        key={pageNum}
                        className={`cd-page-btn ${currentPage === pageNum ? 'cd-page-btn--active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button 
                    className="cd-page-btn cd-page-btn--nav" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <MdChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Focus Section: VIP Engagement Metrics & Recent Activity */}
      <div className="cd-focus-grid">
        <div className="cd-vip-card">
          <div className="cd-vip-glow"></div>
          <div>
            <h4 className="cd-vip-title">VIP Engagement Metrics</h4>
            <p className="cd-vip-description">
              Our elite client base generates a significant portion of our annual furniture patronage. 
              Personalized design advisory services and custom handcrafted teak wood furniture remains our primary luxury driver.
            </p>
          </div>
          <div className="cd-vip-metrics">
            <div>
              <p className="cd-vip-metric-label">Retention Rate</p>
              <h5 className="cd-vip-metric-value">94.2%</h5>
            </div>
            <div>
              <p className="cd-vip-metric-label">Referral Bonus</p>
              <h5 className="cd-vip-metric-value">+18%</h5>
            </div>
            <div className="cd-vip-cta">
              <button className="cd-vip-cta-btn" onClick={() => alert('Displaying VIP Strategy Report...')}>
                View Strategy Report
              </button>
            </div>
          </div>
        </div>

        <div className="cd-activity-card">
          <h4 className="cd-activity-title">Recent Activity Log</h4>
          <div className="cd-activity-list">
            <div className="cd-activity-item">
              <div className="cd-activity-bar cd-activity-bar--gold"></div>
              <div className="cd-activity-content">
                <p className="cd-activity-label">Active Orders Active</p>
                <p className="cd-activity-meta">Customer order pipeline updated • 2 hours ago</p>
              </div>
            </div>
            <div className="cd-activity-item">
              <div className="cd-activity-bar cd-activity-bar--gray"></div>
              <div className="cd-activity-content">
                <p className="cd-activity-label">System Refresh Completed</p>
                <p className="cd-activity-meta">Customer metadata index synchronized • 5 hours ago</p>
              </div>
            </div>
            <div className="cd-activity-item">
              <div className="cd-activity-bar cd-activity-bar--gold"></div>
              <div className="cd-activity-content">
                <p className="cd-activity-label">Tier Evaluations Executed</p>
                <p className="cd-activity-meta">Loyalty tiers updated automatically • 1 day ago</p>
              </div>
            </div>
          </div>
          <button className="cd-activity-cta" onClick={() => alert('Accessing full audit logs...')}>
            View Full Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
