import React from 'react';
import { 
  FaSync, FaDollarSign, FaBox, FaUsers, FaCouch 
} from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';

const OverviewTab = ({ 
  dashboardData, 
  productData, 
  revenueChartData, 
  ordersChartData, 
  royalChartOptions, 
  formatCurrency, 
  formatNumber, 
  handleRefresh, 
  refreshing, 
  navigate 
}) => {
  return (
    <div className="pu-tab-content-royal">
      <div className="pu-section-header-royal">
        <div className="header-main">
          <h2>Executive Command Center</h2>
          <p>Strategic performance monitoring & financial intelligence</p>
        </div>
        <button className="pu-refresh-btn-royal" onClick={handleRefresh} disabled={refreshing}>
          <FaSync className={refreshing ? 'fa-spin' : ''} /> REFRESH COMMAND
        </button>
      </div>

      <div className="pu-machinery-grid-royal">
        {/* KPI Cards */}
        <div className="pu-grid-span-3">
          <div className="pu-summary-card-royal">
            <div className="card-icon"><FaDollarSign /></div>
            <div className="card-info">
              <h3>TOTAL REVENUE</h3>
              <div className="card-value">{formatCurrency(dashboardData?.kpis?.total_revenue)}</div>
            </div>
          </div>
        </div>
        <div className="pu-grid-span-3">
          <div className="pu-summary-card-royal">
            <div className="card-icon"><FaBox /></div>
            <div className="card-info">
              <h3>ORDERS</h3>
              <div className="card-value">{formatNumber(dashboardData?.kpis?.total_orders)}</div>
            </div>
          </div>
        </div>
        <div className="pu-grid-span-3">
          <div className="pu-summary-card-royal">
            <div className="card-icon"><FaUsers /></div>
            <div className="card-info">
              <h3>CUSTOMERS</h3>
              <div className="card-value">{formatNumber(dashboardData?.kpis?.active_customers)}</div>
            </div>
          </div>
        </div>
        <div className="pu-grid-span-3">
          <div className="pu-summary-card-royal">
            <div className="card-icon"><FaCouch /></div>
            <div className="card-info">
              <h3>LOW STOCK</h3>
              <div className="card-value">{formatNumber(productData?.low_stock_count)}</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="pu-grid-span-8">
          <div className="pu-chart-card-royal">
            <h3>Revenue Pipeline</h3>
            <div style={{ height: '300px' }}>
              <Line data={revenueChartData} options={royalChartOptions} />
            </div>
          </div>
        </div>
        <div className="pu-grid-span-4">
          <div className="pu-chart-card-royal">
            <h3>Order Status</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={ordersChartData} options={royalChartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="pu-grid-span-12">
          <div className="pu-submission-section-royal">
            <div className="pu-submission-header-royal">
              <h3>Real-time Registry</h3>
              <button 
                onClick={() => navigate('/admin/orders')} 
                className="pu-view-btn-royal"
              >
                VIEW ALL
              </button>
            </div>
            <div className="pu-table-container-royal">
              <table className="pu-royal-data-table">
                <thead>
                  <tr>
                    <th>ORDER</th>
                    <th>CUSTOMER</th>
                    <th>REVENUE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recent_orders?.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td>#{order.order_number}</td>
                      <td>{order.customer_name}</td>
                      <td>{formatCurrency(order.total_amount)}</td>
                      <td><span className={`pu-status-royal ${order.status}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
