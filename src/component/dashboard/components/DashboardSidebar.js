import React from 'react';
import { 
  FaChartBar, FaBox, FaTicketAlt, FaChartLine, 
  FaUsers, FaCommentDots, FaHome, FaDoorOpen, FaPenNib, FaShoppingCart,
  FaEnvelopeOpenText 
} from 'react-icons/fa';

const DashboardSidebar = ({ 
  activeTab, 
  handleTabChange, 
  sidebarExpanded, 
  setSidebarExpanded, 
  navigate, 
  handleLogout 
}) => {
  return (
    <div className={`admin-dashboard-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="admin-sidebar-header">
        {sidebarExpanded && <h1 className="admin-dashboard-title">Royal Admin</h1>}
        <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
          {sidebarExpanded ? '◀' : '▶'}
        </button>
      </div>
      <nav className="admin-sidebar-nav">
        <button 
          className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} 
          onClick={() => handleTabChange('dashboard')}
        >
          <FaChartBar className="admin-nav-icon" /> {sidebarExpanded && <span>Executive Center</span>}
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} 
          onClick={() => handleTabChange('products')}
        >
          <FaBox className="admin-nav-icon" /> {sidebarExpanded && <span>Product Control</span>}
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'coupons' ? 'active' : ''}`} 
          onClick={() => handleTabChange('coupons')}
        >
          <FaTicketAlt className="admin-nav-icon" /> {sidebarExpanded && <span>Coupon Registry</span>}
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} 
          onClick={() => handleTabChange('analytics')}
        >
          <FaChartLine className="admin-nav-icon" /> {sidebarExpanded && <span>User Metrics</span>}
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} 
          onClick={() => handleTabChange('users')}
        >
          <FaUsers className="admin-nav-icon" /> {sidebarExpanded && <span>User Database</span>}
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'customer-data' ? 'active' : ''}`} 
          onClick={() => handleTabChange('customer-data')}
        >
          <FaCommentDots className="admin-nav-icon" /> {sidebarExpanded && <span>Inquiries</span>}
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'blogs' ? 'active' : ''}`} 
          onClick={() => handleTabChange('blogs')}
        >
          <FaPenNib className="admin-nav-icon" /> {sidebarExpanded && <span>Journal Control</span>}
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'abandoned-carts' ? 'active' : ''}`} 
          onClick={() => handleTabChange('abandoned-carts')}
        >
          <FaShoppingCart className="admin-nav-icon" /> {sidebarExpanded && <span>Abandoned Carts</span>}
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'leads-hub' ? 'active' : ''}`} 
          onClick={() => handleTabChange('leads-hub')}
        >
          <FaEnvelopeOpenText className="admin-nav-icon" /> {sidebarExpanded && <span>Leads Hub</span>}
        </button>
        <div className="nav-divider" />
        <button className="admin-nav-item" onClick={() => navigate('/')}>
          <FaHome className="admin-nav-icon" /> {sidebarExpanded && <span>Back to Site</span>}
        </button>
        <button className="admin-nav-item" onClick={handleLogout}>
          <FaDoorOpen className="admin-nav-icon" /> {sidebarExpanded && <span>Logout</span>}
        </button>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
