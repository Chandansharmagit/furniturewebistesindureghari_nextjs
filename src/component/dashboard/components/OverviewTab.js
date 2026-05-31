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
  const trendData = [...(salesData?.sales_trend || [])].sort((a, b) => (
    String(a.period || '').localeCompare(String(b.period || ''))
  ));
  const topProducts = productData?.best_performers?.length
    ? productData.best_performers
    : dashboardData?.top_products || [];
  const inventoryStatus = productData?.inventory_status || [];
  const attentionNeeded = productData?.attention_needed || [];
  const kpis = dashboardData?.kpis || {};
  const revenueGrowth = Number(kpis.revenue_growth || 0);
  const ordersGrowth = Number(kpis.orders_growth || 0);
  const totalRevenue = Number(kpis.total_revenue || 0);
  const totalInventoryValue = Number(productData?.total_stock_value || 0);
  const inventoryYield = totalInventoryValue > 0 ? (totalRevenue / totalInventoryValue) * 100 : 0;
  const topProduct = topProducts[0];

  const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;
  const truncateLabel = (label = '', max = 24) => (
    label.length > max ? `${label.slice(0, max - 3)}...` : label
  );
  const hasValues = (values = []) => values.some(value => Number(value || 0) > 0);

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (['completed', 'delivered', 'confirmed'].includes(s)) return 'ov-badge ov-badge--completed';
    if (s === 'cancelled') return 'ov-badge ov-badge--cancelled';
    return 'ov-badge ov-badge--pending';
  };

  const ChartFrame = ({ hasData, children }) => (
    <div className="ov-chart-frame">
      {hasData ? children : <div className="ov-chart-empty">No data for selected period</div>}
    </div>
  );

  const categoryChartData = {
    labels: salesData?.sales_by_category?.map(item => item.category) || [],
    datasets: [{
      label: 'Revenue (Rs.)',
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
    labels: trendData.map(item => item.period),
    datasets: [{
      label: 'Orders Count',
      data: trendData.map(item => parseInt(item.orders, 10) || 0),
      backgroundColor: 'rgba(52, 58, 64, 0.8)',
      borderWidth: 0
    }]
  };

  const revenueAovChartData = {
    labels: trendData.map(item => item.period),
    datasets: [
      {
        label: 'Revenue (Rs.)',
        data: trendData.map(item => parseFloat(item.revenue) || 0),
        borderColor: '#B19456',
        backgroundColor: 'rgba(177, 148, 86, 0.12)',
        yAxisID: 'y',
        tension: 0.35,
        fill: true
      },
      {
        label: 'Avg Order Value',
        data: trendData.map(item => parseFloat(item.avg_order_value) || 0),
        borderColor: '#825151',
        backgroundColor: 'rgba(130, 81, 81, 0.1)',
        yAxisID: 'y1',
        tension: 0.35
      }
    ]
  };

  const revenueAovOptions = {
    ...royalChartOptions,
    scales: {
      ...royalChartOptions.scales,
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#825151', font: { family: 'Outfit', size: 11 } }
      }
    }
  };

  const topProductChartData = {
    labels: topProducts.slice(0, 6).map(item => truncateLabel(item.name)),
    datasets: [{
      label: 'Revenue (Rs.)',
      data: topProducts.slice(0, 6).map(item => parseFloat(item.revenue) || 0),
      backgroundColor: ['#343A40', '#B19456', '#825151', '#595f65', '#d0c5b5', '#8b7355'],
      borderWidth: 0
    }]
  };

  const inventoryRiskChartData = {
    labels: inventoryStatus.map(item => item.stock_level),
    datasets: [{
      data: inventoryStatus.map(item => parseInt(item.product_count, 10) || 0),
      backgroundColor: ['#825151', '#B19456', '#343A40', '#595f65', '#d0c5b5'],
      borderWidth: 0
    }]
  };

  const insightCards = [
    { label: 'Revenue Growth', value: formatPercent(revenueGrowth), tone: revenueGrowth >= 0 ? 'positive' : 'negative' },
    { label: 'Order Growth', value: formatPercent(ordersGrowth), tone: ordersGrowth >= 0 ? 'positive' : 'negative' },
    { label: 'Inventory Yield', value: formatPercent(inventoryYield), tone: inventoryYield >= 5 ? 'positive' : 'warning' },
    { label: 'Best Seller', value: topProduct ? truncateLabel(topProduct.name, 34) : 'No sales yet', tone: 'neutral' }
  ];

  return (
    <div className="ov-overview-panel">
      {/* Page Header */}
      <div className="ov-page-header">
        <div>
          <h2 className="ov-header-title">Sales Overview</h2>
          <p className="ov-header-subtitle">Track revenue, orders, customers, inventory risk, and product performance.</p>
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

      <div className="ov-insights-grid">
        {insightCards.map((item) => (
          <div className={`ov-insight-card ov-insight-card--${item.tone}`} key={item.label}>
            <span className="ov-insight-label">{item.label}</span>
            <strong className="ov-insight-value">{item.value}</strong>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="ov-charts-grid">
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Revenue Pipeline</h4>
          <ChartFrame hasData={hasValues(revenueChartData?.datasets?.[0]?.data)}>
            <Line data={revenueChartData} options={royalChartOptions} />
          </ChartFrame>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Order Volume Trend</h4>
          <ChartFrame hasData={hasValues(orderVolumeChartData.datasets[0].data)}>
            <Bar data={orderVolumeChartData} options={royalChartOptions} />
          </ChartFrame>
        </div>
        <div className="ov-chart-card ov-chart-card--wide">
          <h4 className="ov-chart-title">Revenue vs Average Order Value</h4>
          <ChartFrame hasData={hasValues(revenueAovChartData.datasets[0].data)}>
            <Line data={revenueAovChartData} options={revenueAovOptions} />
          </ChartFrame>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Category Performance</h4>
          <ChartFrame hasData={hasValues(categoryChartData.datasets[0].data)}>
            <Bar data={categoryChartData} options={categoryChartOptions} />
          </ChartFrame>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Payment Hub</h4>
          <ChartFrame hasData={hasValues(paymentChartData.datasets[0].data)}>
            <Pie data={paymentChartData} options={royalChartOptions} />
          </ChartFrame>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Order Status</h4>
          <ChartFrame hasData={hasValues(ordersChartData?.datasets?.[0]?.data)}>
            <Doughnut data={ordersChartData} options={royalChartOptions} />
          </ChartFrame>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Top Product Revenue</h4>
          <ChartFrame hasData={hasValues(topProductChartData.datasets[0].data)}>
            <Bar data={topProductChartData} options={royalChartOptions} />
          </ChartFrame>
        </div>
        <div className="ov-chart-card">
          <h4 className="ov-chart-title">Inventory Risk Mix</h4>
          <ChartFrame hasData={hasValues(inventoryRiskChartData.datasets[0].data)}>
            <Doughnut data={inventoryRiskChartData} options={royalChartOptions} />
          </ChartFrame>
        </div>
      </div>

      <div className="ov-analysis-grid">
        <div className="ov-table-container">
          <div className="ov-table-header">
            <h4 className="ov-table-title">Inventory Attention</h4>
          </div>
          <div className="ov-table-scroll">
            <table className="ov-data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Recent Sales</th>
                  <th>Issue</th>
                </tr>
              </thead>
              <tbody>
                {attentionNeeded.slice(0, 6).map(item => (
                  <tr key={item.id}>
                    <td>{truncateLabel(item.name, 46)}</td>
                    <td>{formatNumber(item.stock)}</td>
                    <td>{formatNumber(item.recent_sales)}</td>
                    <td><span className="ov-badge ov-badge--pending">{item.issue_type}</span></td>
                  </tr>
                ))}
                {!attentionNeeded.length && (
                  <tr>
                    <td colSpan="4" className="ov-empty-cell">No inventory alerts for this period.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ov-table-container">
          <div className="ov-table-header">
            <h4 className="ov-table-title">Top Product Intelligence</h4>
          </div>
          <div className="ov-table-scroll">
            <table className="ov-data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sold</th>
                  <th>Revenue</th>
                  <th>AOV</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.slice(0, 6).map(item => (
                  <tr key={item.id}>
                    <td>{truncateLabel(item.name, 46)}</td>
                    <td>{formatNumber(item.total_sold)}</td>
                    <td>{formatCurrency(item.revenue)}</td>
                    <td>{formatCurrency(item.avg_selling_price || (Number(item.total_sold) ? Number(item.revenue || 0) / Number(item.total_sold) : 0))}</td>
                  </tr>
                ))}
                {!topProducts.length && (
                  <tr>
                    <td colSpan="4" className="ov-empty-cell">No product sales recorded for this period.</td>
                  </tr>
                )}
              </tbody>
            </table>
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
              {!dashboardData?.recent_orders?.length && (
                <tr>
                  <td colSpan="4" className="ov-empty-cell">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
