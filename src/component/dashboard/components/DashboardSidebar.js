import React from 'react';
import {
  FaBox,
  FaBullhorn,
  FaChartBar,
  FaChartLine,
  FaCommentDots,
  FaDoorOpen,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
  FaHome,
  FaPenNib,
  FaReceipt,
  FaShoppingCart,
  FaTicketAlt,
  FaUsers,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const DashboardSidebar = ({
  activeTab,
  handleTabChange,
  navigate,
  handleLogout,
  notificationCounts = {},
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  tabOrder = []
}) => {
  const allTabs = [
    { id: 'dashboard', label: 'Overview', icon: FaChartBar, group: 'Store' },
    { id: 'orders', label: 'Order Control', icon: FaReceipt, group: 'Store' },
    { id: 'products', label: 'Products', icon: FaBox, group: 'Store' },
    { id: 'coupons', label: 'Coupons', icon: FaTicketAlt, group: 'Store' },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine, group: 'Store' },
    { id: 'marketing', label: 'Marketing', icon: FaBullhorn, group: 'Store' },
    { id: 'users', label: 'Customers', icon: FaUsers, group: 'Customers' },
    { id: 'customer-data', label: 'Inquiries', icon: FaCommentDots, group: 'Customers' },
    { id: 'complaint-box', label: 'Complaint Box', icon: FaExclamationTriangle, group: 'Customers' },
    { id: 'abandoned-carts', label: 'Abandoned Carts', icon: FaShoppingCart, group: 'Customers' },
    { id: 'leads-hub', label: 'Leads Hub', icon: FaEnvelopeOpenText, group: 'Customers' },
    { id: 'blogs', label: 'Blogs', icon: FaPenNib, group: 'Content' }
  ];

  const defaultTabOrder = [
    'dashboard', 'orders', 'products', 'coupons', 'analytics', 'marketing',
    'users', 'customer-data', 'complaint-box', 'abandoned-carts', 'leads-hub', 'blogs'
  ];

  const activeOrder = tabOrder.length > 0 ? tabOrder : defaultTabOrder;
  const orderedTabs = activeOrder.map(tabId => allTabs.find(t => t.id === tabId)).filter(Boolean);

  const renderNavGroup = (title, items) => (
    <div className="admin-sidebar-group">
      {!isSidebarCollapsed && <p className="admin-sidebar-group-title">{title}</p>}
      {items.map(({ id, label, icon: Icon, group }) => {
        const count = Number(notificationCounts[id] || 0);
        const isRecentlyActive = activeOrder.indexOf(id) === 0 && count > 0;
        
        return (
          <button
            key={id}
            type="button"
            className={`admin-nav-item ${activeTab === id ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''} ${isRecentlyActive ? 'recently-active-pulse' : ''}`}
            onClick={() => handleTabChange(id)}
            title={isSidebarCollapsed ? `${label} (${group})` : undefined}
          >
            <span className="admin-nav-icon-wrap">
              <Icon className="admin-nav-icon" />
              {isSidebarCollapsed && count > 0 && <span className="admin-nav-badge-dot"></span>}
            </span>
            {!isSidebarCollapsed && (
              <>
                <span className="admin-nav-label-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, textAlign: 'left' }}>
                  <span className="admin-nav-label" style={{ lineHeight: '1.2' }}>{label}</span>
                  <span className={`admin-nav-group-badge badge-${group.toLowerCase()}`}>{group}</span>
                </span>
                {count > 0 && <span className="admin-nav-badge">+{count > 99 ? '99' : count}</span>}
              </>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="admin-dashboard-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-brand-mark">SF</div>
        {!isSidebarCollapsed && (
          <div className="admin-sidebar-header-text">
            <p className="admin-dashboard-kicker">Sindureghari</p>
            <h1 className="admin-dashboard-title">Admin Panel</h1>
          </div>
        )}
        <button 
          className="admin-sidebar-toggle-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {renderNavGroup('Navigation Menu', orderedTabs)}
      </nav>

      <div className="admin-sidebar-footer">
        <button 
          className={`admin-sidebar-action ${isSidebarCollapsed ? 'collapsed' : ''}`} 
          onClick={() => navigate('/')}
          title={isSidebarCollapsed ? "View Storefront" : undefined}
        >
          <FaHome />
          {!isSidebarCollapsed && <span>View Storefront</span>}
        </button>
        <button 
          className={`admin-sidebar-action admin-sidebar-action--danger ${isSidebarCollapsed ? 'collapsed' : ''}`} 
          onClick={handleLogout}
          title={isSidebarCollapsed ? "Logout" : undefined}
        >
          <FaDoorOpen />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
