import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import AdminOrders from '../admin/AdminOrders';

// Modular Components
import DashboardSidebar from './components/DashboardSidebar';
// Removed DashboardHeader import
import OverviewTab from './components/OverviewTab';
import RestockPanel from './components/RestockPanel';
import CouponsTab from './components/CouponsTab';
import UsersTab from './components/UsersTab';
import SubmissionsTab from './components/SubmissionsTab';
import ComplaintBoxTab from './components/ComplaintBoxTab';
import AdminBlogsTab from './components/AdminBlogsTab';
import AbandonedCartsTab from './components/AbandonedCartsTab';
import LeadsHubTab from './components/LeadsHubTab';
import MarketingDashboard from './components/MarketingDashboard';

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

// ─── Module-level API Cache (90 second TTL) ───────────────────────────
const _apiCache = new Map();
const CACHE_TTL = 90_000;
const getCached = (key) => {
  const entry = _apiCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { _apiCache.delete(key); return null; }
  return entry.data;
};
const setCache = (key, data) => _apiCache.set(key, { data, ts: Date.now() });
const clearCache = () => _apiCache.clear();
// ──────────────────────────────────────────────────────────────────────

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
  const [coupons, setCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [usersStatistics, setUsersStatistics] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [feedbackSubmissions, setFeedbackSubmissions] = useState([]);
  const [orderRequestSubmissions, setOrderRequestSubmissions] = useState([]);
  const [notificationCounts, setNotificationCounts] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [tabOrder, setTabOrder] = useState([
    'dashboard', 'orders', 'products', 'coupons', 'analytics', 'marketing',
    'users', 'customer-data', 'complaint-box', 'abandoned-carts', 'leads-hub', 'blogs'
  ]);
  // Track which tabs have already loaded their data
  const loadedTabsRef = useRef(new Set(['dashboard']));

  const registerTabActivity = useCallback((tabId) => {
    setTabOrder(prevOrder => {
      if (prevOrder[0] === tabId) return prevOrder; // Already at the top
      const filtered = prevOrder.filter(id => id !== tabId);
      return [tabId, ...filtered];
    });
  }, []);

  const prevCountsRef = useRef({});
  useEffect(() => {
    let changed = false;
    Object.keys(notificationCounts).forEach(tabId => {
      const prev = prevCountsRef.current[tabId] || 0;
      const current = notificationCounts[tabId] || 0;
      if (current > prev) {
        registerTabActivity(tabId);
        changed = true;
      }
    });
    prevCountsRef.current = { ...notificationCounts };
  }, [notificationCounts, registerTabActivity]);

  // ── Load overview + sidebar badge counts only (fast, lightweight) ──
  const loadDashboardData = useCallback(async (silentRefresh = false) => {
    try {
      if (!silentRefresh) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const cacheKey = `overview-${selectedPeriod}`;
      let overviewData, salesDataResult, productAnalytics;

      const cached = getCached(cacheKey);
      if (cached && !silentRefresh) {
        ({ overviewData, salesDataResult, productAnalytics } = cached);
      } else {
        const [overviewRes, salesRes, productRes] = await Promise.all([
          dashboardService.getOverview(selectedPeriod),
          salesService.getAnalytics(selectedPeriod),
          dashboardService.getProductAnalytics(selectedPeriod)
        ]);
        overviewData = overviewRes.success ? overviewRes.data : {};
        salesDataResult = salesRes.success ? salesRes.data : {};
        productAnalytics = productRes.success ? productRes.data : {};
        setCache(cacheKey, { overviewData, salesDataResult, productAnalytics });
      }

      setDashboardData(overviewData);
      setSalesData(salesDataResult);
      setProductData(productAnalytics);

      setNotificationCounts(prev => ({
        ...prev,
        dashboard: overviewData?.recent_orders?.length || 0,
        orders: overviewData?.recent_orders?.length || 0,
        users: overviewData?.kpis?.new_customers || 0,
        products: productAnalytics?.low_stock_count || 0
      }));

      // Load sidebar badge counts in background (non-blocking)
      try {
        const credentials = authService.getCredentials();
        const [summaryRes, abandonedRes] = await Promise.all([
          fetch(`${API_BASE_URL}${CUSTOMER_DATA_ENDPOINTS.SUMMARY}`, {
            headers: { ...credentials, 'Content-Type': 'application/json' }
          }),
          dashboardService.getAbandonedCarts(selectedPeriod)
        ]);

        if (summaryRes.ok) {
          const summary = await summaryRes.json();
          const contactNew = Number(summary?.data?.contactForms?.new_count || 0);
          const feedbackNew = Number(summary?.data?.feedback?.new_count || 0);
          const orderRequestNew = Number(summary?.data?.orderRequests?.new_count || 0);
          const complaintNew = Number(summary?.data?.complaints?.new_count || 0);
          setNotificationCounts(prev => ({
            ...prev,
            'customer-data': contactNew + feedbackNew + orderRequestNew,
            'complaint-box': complaintNew,
            'leads-hub': orderRequestNew
          }));
        }
        if (abandonedRes.success) {
          setNotificationCounts(prev => ({
            ...prev,
            'abandoned-carts': Array.isArray(abandonedRes.data) ? abandonedRes.data.length : 0
          }));
        }
      } catch (badgeError) {
        console.warn('Sidebar badge counts unavailable:', badgeError);
      }
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboardData();
  }, [navigate, loadDashboardData]);


  const loadCoupons = useCallback(async (force = false) => {
    if (!force && getCached('coupons')) {
      setCoupons(getCached('coupons'));
      return;
    }
    try {
      setCouponLoading(true);
      const result = await couponService.getAllCoupons();
      if (result.success) {
        setCoupons(result.data || []);
        setCache('coupons', result.data || []);
      }
    } finally {
      setCouponLoading(false);
    }
  }, []);

  const loadUsersData = useCallback(async (force = false) => {
    if (!force && getCached('users')) {
      const c = getCached('users');
      setUsersData(c.users);
      setUsersStatistics(c.statistics);
      return;
    }
    setUsersLoading(true);
    try {
      const credentials = authService.getCredentials();
      const response = await fetch(`${API_BASE_URL}/api/customers/users-with-orders`, {
        headers: { 'Content-Type': 'application/json', ...credentials }
      });
      if (response.ok) {
        const data = await response.json();
        setUsersData(data.users || []);
        setUsersStatistics(data.statistics || null);
        setCache('users', { users: data.users || [], statistics: data.statistics || null });
      }
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadCustomerSubmissions = useCallback(async () => {
    try {
      setSubmissionsLoading(true);
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
      setSubmissionsLoading(false);
    }
  }, []);

  const handleLogout = () => { authService.logout(); clearCache(); navigate('/login'); };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    registerTabActivity(tab);
  };
  // Force-refresh clears cache so fresh data is always fetched
  const handleRefresh = () => { clearCache(); loadedTabsRef.current.clear(); loadDashboardData(true); };
  const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`;
  const formatNumber = (number) => new Intl.NumberFormat('en-US').format(number || 0);

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Delete coupon?')) {
      const res = await couponService.deleteCoupon(id);
      if (res.success) { _apiCache.delete('coupons'); loadCoupons(true); }
    }
  };

  // ── Lazy tab data loading — only fetch on first visit ──────────────
  useEffect(() => {
    if (loadedTabsRef.current.has(activeTab)) return; // already loaded
    loadedTabsRef.current.add(activeTab);
    if (activeTab === 'coupons') loadCoupons();
    if (activeTab === 'users') loadUsersData();
    if (activeTab === 'customer-data') loadCustomerSubmissions();
  }, [activeTab, loadCoupons, loadUsersData, loadCustomerSubmissions]);

  // Chart configs moved to local variables for cleaner render logic
  const chronologicalSalesTrend = [...(salesData?.sales_trend || [])].sort((a, b) => (
    String(a.period || '').localeCompare(String(b.period || ''))
  ));

  const revenueChartData = {
    labels: chronologicalSalesTrend.map(item => item.period),
    datasets: [{
      label: 'Revenue (Rs.)',
      data: chronologicalSalesTrend.map(item => parseFloat(item.revenue) || 0),
      borderColor: '#B19456', 
      backgroundColor: 'rgba(177, 148, 86, 0.1)', 
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6
    }],
  };

  const ordersChartData = {
    labels: salesData?.order_status_distribution?.map(item => item.status) || [],
    datasets: [{
      data: salesData?.order_status_distribution?.map(item => item.count) || [],
      backgroundColor: ['#B19456', '#343A40', '#825151', '#595f65', '#d0c5b5'],
    }],
  };

  const royalChartOptions = {
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: 'top', 
        labels: { 
          color: '#343A40', 
          font: { family: 'Outfit', size: 12, weight: '600' } 
        } 
      } 
    },
    scales: { 
      x: { 
        grid: { display: false },
        ticks: { color: '#595f65', font: { family: 'Outfit', size: 11 } }
      }, 
      y: { 
        grid: { color: 'rgba(0, 0, 0, 0.06)' },
        ticks: { color: '#595f65', font: { family: 'Outfit', size: 11 } }
      } 
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <OverviewTab 
            dashboardData={dashboardData} 
            productData={productData} 
            salesData={salesData}
            revenueChartData={revenueChartData} 
            ordersChartData={ordersChartData} 
            royalChartOptions={royalChartOptions} 
            formatCurrency={formatCurrency} 
            formatNumber={formatNumber} 
            handleRefresh={handleRefresh} 
            refreshing={refreshing} 
            navigate={navigate} 
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
          />
        );
      case 'products':
        return (
          <div className="product-management">
            <div className="pu-section-header-royal">
              <h2>Product Management</h2>
              <p>Initialize and manage your product repository</p>
            </div>
            <RestockPanel />
            <ProductUploading />
          </div>
        );
      case 'orders':
        return <AdminOrders />;
      case 'coupons':
        return <CouponsTab coupons={coupons} couponLoading={couponLoading} handleDeleteCoupon={handleDeleteCoupon} />;
      case 'analytics':
        return <UserActivityDashboard />;
      case 'marketing':
        return (
          <MarketingDashboard
            dashboardData={dashboardData}
            productData={productData}
            salesData={salesData}
            formatCurrency={formatCurrency}
          />
        );
      case 'users':
        return <UsersTab usersData={usersData} usersLoading={usersLoading} usersStatistics={usersStatistics} formatCurrency={formatCurrency} />;
      case 'customer-data':
        return (
          <SubmissionsTab 
            contactSubmissions={contactSubmissions} 
            feedbackSubmissions={feedbackSubmissions} 
            orderRequestSubmissions={orderRequestSubmissions}
            isLoading={submissionsLoading}
          />
        );
      case 'complaint-box':
        return <ComplaintBoxTab />;
      case 'blogs':
        return <AdminBlogsTab />;
      case 'abandoned-carts':
        return <AbandonedCartsTab selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />;
      case 'leads-hub':
        return <LeadsHubTab />;
      default:
        return <div>Select a module from the command sidebar</div>;
    }
  };

  if (loading && !refreshing) return <div className="admin-dashboard-loading"><LoadingSpinner size="large" message="Booting Systems..." /></div>;
  if (error) return <div className="admin-dashboard-error"><h2>System Offline</h2><p>{error}</p><button onClick={handleRefresh}>RETRY</button></div>;

  return (
    <div className={`admin-dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <DashboardSidebar 
        activeTab={activeTab} 
        handleTabChange={handleTabChange} 
        navigate={navigate} 
        handleLogout={handleLogout} 
        notificationCounts={notificationCounts}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        tabOrder={tabOrder}
      />
      <div className="admin-dashboard-main">
        <div className="admin-main-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
