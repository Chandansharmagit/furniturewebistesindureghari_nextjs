import React from 'react';
import {
  FaBox,
  FaChartBar,
  FaChartLine,
  FaCommentDots,
  FaDoorOpen,
  FaEnvelopeOpenText,
  FaHome,
  FaPenNib,
  FaShoppingCart,
  FaTicketAlt,
  FaUsers
} from 'react-icons/fa';

const DashboardSidebar = ({
  activeTab,
  handleTabChange,
  navigate,
  handleLogout
}) => {
  const primaryTabs = [
    { id: 'dashboard', label: 'Overview', icon: FaChartBar },
    { id: 'products', label: 'Products', icon: FaBox },
    { id: 'coupons', label: 'Coupons', icon: FaTicketAlt },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine }
  ];

  const customerTabs = [
    { id: 'users', label: 'Customers', icon: FaUsers },
    { id: 'customer-data', label: 'Inquiries', icon: FaCommentDots },
    { id: 'abandoned-carts', label: 'Abandoned Carts', icon: FaShoppingCart },
    { id: 'leads-hub', label: 'Leads Hub', icon: FaEnvelopeOpenText }
  ];

  const contentTabs = [
    { id: 'blogs', label: 'Blogs', icon: FaPenNib }
  ];

  const renderNavGroup = (title, items) => (
    <div className="admin-sidebar-group">
      <p className="admin-sidebar-group-title">{title}</p>
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
          onClick={() => handleTabChange(id)}
        >
          <span className="admin-nav-icon-wrap">
            <Icon className="admin-nav-icon" />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <aside className="admin-dashboard-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-brand-mark">SF</div>
        <div>
          <p className="admin-dashboard-kicker">Sindureghari</p>
          <h1 className="admin-dashboard-title">Admin Panel</h1>
        </div>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {renderNavGroup('Store', primaryTabs)}
        {renderNavGroup('Customers', customerTabs)}
        {renderNavGroup('Content', contentTabs)}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-sidebar-action" onClick={() => navigate('/')}>
          <FaHome />
          <span>View Storefront</span>
        </button>
        <button className="admin-sidebar-action admin-sidebar-action--danger" onClick={handleLogout}>
          <FaDoorOpen />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
