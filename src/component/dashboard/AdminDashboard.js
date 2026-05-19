import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import dashboardService from '../../services/dashboardService';
import salesService from '../../services/salesService';
import authService from '../../services/authService';
import couponService from '../../services/couponService';
import { API_BASE_URL, CUSTOMER_DATA_ENDPOINTS } from '../../config/api';
import ProductUploading from '../../dashboard/productUplaoding/ProductUploading';
import UserActivityDashboard from '../../dashboard/analytics/UserActivityDashboard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Modular Components
import DashboardSidebar from './components/DashboardSidebar';
import DashboardHeader from './components/DashboardHeader';
import OverviewTab from './components/OverviewTab';
import CouponsTab from './components/CouponsTab';
import UsersTab from './components/UsersTab';
import SubmissionsTab from './components/SubmissionsTab';
import AdminBlogsTab from './components/AdminBlogsTab';
import AbandonedCartsTab from './components/AbandonedCartsTab';
import LeadsHubTab from './components/LeadsHubTab';

import './AdminDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [feedbackSubmissions, setFeedbackSubmissions] = useState([]);
  const [orderRequestSubmissions, setOrderRequestSubmissions] = useState([]);

  // Load dashboard metrics
  const loadDashboardData = useCallback(async (silentRefresh = false) => {
    try {
      if (!silentRefresh) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const [overviewRes, salesRes, productRes] = await Promise.all([
        dashboardService.getOverview(selectedPeriod),
        salesService.getAnalytics(selectedPeriod),
        dashboardService.getProductAnalytics(selectedPeriod),
        dashboardService.getSystemHealth()
      ]);

      setDashboardData(overviewRes.data);
      setSalesData(salesRes.data);
      setProductData(productRes.data);
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    if (!authService.isAuthenticatedWithContext()) {
      navigate('/login');
      return;
    }
    const user = authService.getCurrentUser();
    if (!user || user.email !== 'sharma18chandan@gmail.com') {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [navigate, loadDashboardData]);


  const loadCoupons = useCallback(async () => {
    try {
      setCouponLoading(true);
      const result = await couponService.getAllCoupons();
      if (result.success) setCoupons(result.data || []);
    } finally {
      setCouponLoading(false);
    }
  }, []);

  const loadUsersData = useCallback(async () => {
    setUsersLoading(true);
    try {
      const credentials = authService.getCredentials();
      const response = await fetch(`${API_BASE_URL}/api/customers/users-with-orders`, {
        headers: { 'Content-Type': 'application/json', ...credentials }
      });
      if (response.ok) {
        const data = await response.json();
        setUsersData(data.users || []);
      }
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadCustomerSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const credentials = authService.getCredentials();
      const headers = { ...credentials, 'Content-Type': 'application/json' };
      
      const [contactRes, feedbackRes, orderRequestsRes] = await Promise.all([
        fetch(`${API_BASE_URL}${CUSTOMER_DATA_ENDPOINTS.CONTACT_FORMS}`, { headers }),
        fetch(`${API_BASE_URL}${CUSTOMER_DATA_ENDPOINTS.FEEDBACK}`, { headers }),
        fetch(`${API_BASE_URL}${CUSTOMER_DATA_ENDPOINTS.ORDER_REQUESTS}`, { headers })
      ]);

      if (contactRes.ok) setContactSubmissions((await contactRes.json()).data || []);
      if (feedbackRes.ok) setFeedbackSubmissions((await feedbackRes.json()).data || []);
      if (orderRequestsRes.ok) setOrderRequestSubmissions((await orderRequestsRes.json()).data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => { authService.logout(); navigate('/login'); };
  const handleTabChange = (tab) => setActiveTab(tab);
  const handleRefresh = () => loadDashboardData();
  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN')}`;
  const formatNumber = (number) => new Intl.NumberFormat('en-US').format(number || 0);

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Delete coupon?')) {
      const res = await couponService.deleteCoupon(id);
      if (res.success) loadCoupons();
    }
  };

  useEffect(() => {
    if (activeTab === 'coupons') loadCoupons();
    if (activeTab === 'users') loadUsersData();
    if (activeTab === 'customer-data') loadCustomerSubmissions();
  }, [activeTab, loadCoupons, loadUsersData, loadCustomerSubmissions]);

  // Chart configs moved to local variables for cleaner render logic
  const revenueChartData = {
    labels: salesData?.sales_trend?.map(item => item.period) || [],
    datasets: [{
      label: 'Revenue (₹)',
      data: salesData?.sales_trend?.map(item => parseFloat(item.revenue) || 0) || [],
      borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.4,
    }],
  };

  const ordersChartData = {
    labels: salesData?.order_status_distribution?.map(item => item.status) || [],
    datasets: [{
      data: salesData?.order_status_distribution?.map(item => item.count) || [],
      backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'],
    }],
  };

  const royalChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { color: '#64748b', font: { family: 'Outfit', size: 12 } } } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' } } }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <OverviewTab 
            dashboardData={dashboardData} 
            productData={productData} 
            revenueChartData={revenueChartData} 
            ordersChartData={ordersChartData} 
            royalChartOptions={royalChartOptions} 
            formatCurrency={formatCurrency} 
            formatNumber={formatNumber} 
            handleRefresh={handleRefresh} 
            refreshing={refreshing} 
            navigate={navigate} 
          />
        );
      case 'products':
        return (
          <div className="product-management">
            <div className="pu-section-header-royal">
              <h2>Product Management</h2>
              <p>Initialize and manage your product repository</p>
            </div>
            <ProductUploading />
          </div>
        );
      case 'coupons':
        return <CouponsTab coupons={coupons} couponLoading={couponLoading} handleDeleteCoupon={handleDeleteCoupon} />;
      case 'analytics':
        return <UserActivityDashboard />;
      case 'users':
        return <UsersTab usersData={usersData} usersLoading={usersLoading} />;
      case 'customer-data':
        return (
          <SubmissionsTab 
            contactSubmissions={contactSubmissions} 
            feedbackSubmissions={feedbackSubmissions} 
            orderRequestSubmissions={orderRequestSubmissions} 
          />
        );
      case 'blogs':
        return <AdminBlogsTab />;
      case 'abandoned-carts':
        return <AbandonedCartsTab selectedPeriod={selectedPeriod} />;
      case 'leads-hub':
        return <LeadsHubTab />;
      default:
        return <div>Select a module from the command sidebar</div>;
    }
  };

  if (loading && !refreshing) return <div className="admin-dashboard-loading"><LoadingSpinner size="large" message="Booting Systems..." /></div>;
  if (error) return <div className="admin-dashboard-error"><h2>System Offline</h2><p>{error}</p><button onClick={handleRefresh}>RETRY</button></div>;

  return (
    <div className="admin-dashboard-container">
      <DashboardSidebar 
        activeTab={activeTab} 
        handleTabChange={handleTabChange} 
        sidebarExpanded={sidebarExpanded} 
        setSidebarExpanded={setSidebarExpanded} 
        navigate={navigate} 
        handleLogout={handleLogout} 
      />
      <div className="admin-dashboard-main">
        <DashboardHeader 
          selectedPeriod={selectedPeriod} 
          setSelectedPeriod={setSelectedPeriod} 
          userName={authService.getCurrentUser()?.name} 
        />
        <div className="admin-main-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;