import React from 'react';
import { 
  MdRefresh, MdAttachMoney, MdInventory2, MdPeople, MdChair,
  MdPersonAdd, MdTrendingUp, MdAccountBalanceWallet
} from 'react-icons/md';
import { Line, Doughnut, Bar, Pie } from 'react-chartjs-2';
import './OverviewTab.css';

const OverviewTab = ({ 
  dashboardData, 
  productData, 
  salesData,
  revenueChartData, 
  ordersChartData, 
  royalChartOptions, 
  formatCurrency, 
  formatNumber, 
  handleRefresh, 
  refreshing, 
  navigate,
  selectedPeriod,
  setSelectedPeriod
}) => {

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return 'ov-badge ov-badge--completed';
    if (s === 'cancelled') return 'ov-badge ov-badge--cancelled';
    return 'ov-badge ov-badge--pending';
  };

  const categoryChartData = {
    labels: salesData?.sales_by_category?.map(item => item.category) || [],
    datasets: [{
      label: 'Revenue (₹)',
      data: salesData?.sales_by_category?.map(item => parseFloat(item.revenue) || 0) || [],
      backgroundColor: '#B19456',
      borderWidth: 0
    }]
  };

  const categoryChartOptions = {
    ...royalChartOptions,
    indexAxis: 'y',
    plugins: {
      ...royalChartOptions.plugins,
      legend: { display: false }
    }
  };

  const paymentChartData = {
    labels: salesData?.sales_by_payment?.map(item => item.payment_method?.toUpperCase()) || [],
    datasets: [{
      data: salesData?.sales_by_payment?.map(item => parseFloat(item.revenue) || 0) || [],
      backgroundColor: ['#343A40', '#B19456', '#825151', '#595f65'],
      borderWidth: 0
    }]
  };

  const orderVolumeChartData = {
    labels: salesData?.sales_trend?.map(item => item.period) || [],
    datasets: [{
      label: 'Orders Count',
      data: salesData?.sales_trend?.map(item => parseInt(item.orders) || 0) || [],
      backgroundColor: 'rgba(52, 58, 64, 0.8)',
      borderWidth: 0
    }]
  };

  return (
    <div className="ov-overview-panel">
      {/* Page Header */}
      <div className="ov-page-header">
        <div>
          <h2 className="ov-header-title">Executive Command Center</h2>
          <p className="ov-header-subtitle">Strategic performance monitoring & financial intelligence.</p>
        </div>
        <div className="ov-header-actions">
          <select 
            className="ov-period-select" 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">Yearly Overview</option>
          </select>
          <button className="ov-btn-refresh" onClick={handleRefresh} disabled={refreshing}>
            <MdRefresh className={refreshing ? 'fa-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="ov-stats-grid">
        <div className="ov-stat-card">
          <div className="ov-stat-icon"><MdAttachMoney /></div>
          <div>
            <p className="ov-stat-label">Total Revenue</p>
            <h3 className="ov-stat-value">{formatCurrency(dashboardData?.kpis?.total_revenue)}</h3>
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-icon"><MdInventory2 /></div>
          <div>
            <p className="ov-stat-label">Orders</p>
            <h3 className="ov-stat-value">{formatNumber(dashboardData?.kpis?.total_orders)}</h3>
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-icon"><MdTrendingUp /></div>
          <div>
            <p className="ov-stat-label">Avg Order Value</p>
            <h3 className="ov-stat-value">{formatCurrency(dashboardData?.kpis?.avg_order_value)}</h3>
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-icon"><MdAccountBalanceWallet /></div>
          <div>
            <p className="ov-stat-label">Inventory Value</p>
            <h3 className="ov-stat-value">{formatCurrency(productData?.total_stock_value)}</h3>
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-icon"><MdPeople /></div>
          <div>
            <p className="ov-stat-label">Total Patrons</p>
            <h3 className="ov-stat-value">{formatNumber(dashboardData?.kpis?.total_customers)}</h3>
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-icon"><MdPeople /></div>
          <div>
            <p className="ov-stat-label">Active Patrons</p>
            <h3 className="ov-stat-value">{formatNumber(dashboardData?.kpis?.active_customers)}</h3>
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-icon"><MdPersonAdd /></div>
          <div>
            <p className="ov-stat-label">New Signups</p>
            <h3 className="ov-stat-value">{formatNumber(dashboardData?.kpis?.new_customers)}</h3>
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-icon"><MdChair /></div>
          <div>
            <p className="ov-stat-label">Low Stock Items</p>
            <h3 className="ov-stat-value">{formatNumber(productData?.low_stock_count)}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="ov-charts-grid">
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Revenue Pipeline</h4>
          <div style={{ height: '300px' }}>
            <Line data={revenueChartData} options={royalChartOptions} />
          </div>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Order Volume Trend</h4>
          <div style={{ height: '300px' }}>
            <Bar data={orderVolumeChartData} options={royalChartOptions} />
          </div>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Category Performance</h4>
          <div style={{ height: '300px' }}>
            <Bar data={categoryChartData} options={categoryChartOptions} />
          </div>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Payment Hub</h4>
          <div style={{ height: '300px' }}>
            <Pie data={paymentChartData} options={royalChartOptions} />
          </div>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Order Status</h4>
          <div style={{ height: '300px' }}>
            <Doughnut data={ordersChartData} options={royalChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="ov-table-container">
        <div className="ov-table-header">
          <h4 className="ov-table-title">Real-time Registry</h4>
          <button 
            onClick={() => navigate('/admin/orders')} 
            className="ov-btn-outline"
          >
            View All
          </button>
        </div>
        <div className="ov-table-scroll">
          <table className="ov-data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Revenue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recent_orders?.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td>#{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td>{formatCurrency(order.total_amount)}</td>
                  <td>
                    <span className={getStatusClass(order.status)}>
                      {(order.status || '').toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
