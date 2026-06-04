import React from 'react';
import {
  FaBullhorn,
  FaChartLine,
  FaClipboardCheck,
  FaFacebookF,
  FaGoogle,
  FaImages,
  FaSearch,
  FaShoppingBag,
  FaWhatsapp
} from 'react-icons/fa';
import './MarketingDashboard.css';

const MarketingDashboard = ({ dashboardData = {}, productData = {}, salesData = {}, formatCurrency }) => {
  const kpis = dashboardData?.kpis || {};
  const topProducts = productData?.best_performers?.length
    ? productData.best_performers
    : dashboardData?.top_products || [];
  const lowStockCount = Number(productData?.low_stock_count || 0);
  const totalRevenue = Number(kpis.total_revenue || 0);
  const totalOrders = Number(kpis.total_orders || 0);
  const avgOrderValue = Number(kpis.avg_order_value || 0);
  const newCustomers = Number(kpis.new_customers || 0);
  const salesCategories = salesData?.sales_by_category || [];

  const money = (value) => (formatCurrency ? formatCurrency(value) : `Rs. ${Number(value || 0).toLocaleString('en-IN')}`);
  const number = (value) => Number(value || 0).toLocaleString('en-IN');

  const roadmap = [
    {
      phase: 'Days 1-7',
      title: 'Tracking and winning-product setup',
      goal: 'Make sure every visitor, inquiry, add-to-cart, and sale can be measured.',
      actions: [
        'Install Meta Pixel, Google Analytics 4, and Google Search Console.',
        'Choose 10 hero products: sofa, bed, dining, wardrobe, study table, and combo offers.',
        'Fix product titles, images, sale prices, SEO descriptions, and WhatsApp CTA.'
      ]
    },
    {
      phase: 'Days 8-30',
      title: 'Daily content and traffic engine',
      goal: 'Build daily awareness and push traffic to the strongest product pages.',
      actions: [
        'Post 2 product creatives daily on Facebook and Instagram.',
        'Run Rs. 500-1000 per day traffic/message ads for top viewed products.',
        'Create weekly posts for zero-traffic products with better title and image.'
      ]
    },
    {
      phase: 'Days 31-60',
      title: 'Retargeting and lead conversion',
      goal: 'Turn website visitors and message leads into furniture orders.',
      actions: [
        'Retarget website visitors, cart users, and people who messaged the page.',
        'Use WhatsApp follow-up templates for price, delivery, EMI, and custom design.',
        'Bundle products into living room, bedroom, dining, and office offers.'
      ]
    },
    {
      phase: 'Days 61-90',
      title: 'SEO and scale',
      goal: 'Reduce ad dependency by growing Google search traffic.',
      actions: [
        'Refresh pages losing ranking with new copy, FAQs, product links, and schema.',
        'Launch Google Merchant Center and Performance Max after product feed cleanup.',
        'Scale budget only on campaigns with strong lead quality and order conversion.'
      ]
    }
  ];

  const weeklyPlan = [
    { day: 'Mon', focus: 'Sofa', content: 'Best seller post + room-style image', channel: 'Facebook, Instagram' },
    { day: 'Tue', focus: 'Bed', content: 'Storage/comfort benefit post', channel: 'Facebook, WhatsApp' },
    { day: 'Wed', focus: 'Dining', content: 'Family dining offer post', channel: 'Instagram, Facebook' },
    { day: 'Thu', focus: 'Wardrobe', content: 'Storage problem/solution post', channel: 'Facebook' },
    { day: 'Fri', focus: 'Combo offer', content: 'Limited-time bundle campaign', channel: 'Meta Ads' },
    { day: 'Sat', focus: 'Customer decision', content: 'Poll: choose sofa/bed/dining', channel: 'Stories, Reels' },
    { day: 'Sun', focus: 'SEO refresh', content: 'Update weak pages and publish one blog', channel: 'Website, Google' }
  ];

  const productTrafficActions = [
    {
      label: 'Traffic yesterday',
      status: 'Connect GA4',
      action: 'Track sessions, product views, add-to-cart, WhatsApp clicks, and purchases by product page.'
    },
    {
      label: 'Top viewed products',
      status: topProducts.length ? `${topProducts.length} tracked` : 'Sales data only',
      action: 'Promote the top 3 products daily with traffic ads and message ads.'
    },
    {
      label: 'Products with zero traffic',
      status: 'Needs analytics event',
      action: 'Create discovery posts, improve image/title, and link them from category pages.'
    },
    {
      label: 'Pages losing ranking',
      status: 'Connect Search Console',
      action: 'Refresh SEO title, description, FAQ, product schema, and internal links.'
    }
  ];

  const channelPlan = [
    { icon: FaFacebookF, channel: 'Facebook and Instagram', budget: 'Rs. 500-1000/day', target: 'Traffic, messages, retargeting' },
    { icon: FaWhatsapp, channel: 'WhatsApp follow-up', budget: 'Daily manual work', target: 'Convert leads into orders' },
    { icon: FaGoogle, channel: 'Google SEO and Search', budget: 'Content + technical fixes', target: 'Furniture keywords in Nepal' },
    { icon: FaShoppingBag, channel: 'Google Merchant Center', budget: 'After feed setup', target: 'Free listings and PMax ads' }
  ];

  const seoRecovery = [
    'Add "price in Nepal" and city keywords where natural.',
    'Keep product image, title, and category perfectly matched.',
    'Add FAQs for delivery, warranty, customization, EMI, and materials.',
    'Link from homepage, category pages, blogs, and top-viewed products.',
    'Update stale pages every 14 days when impressions drop.'
  ];

  return (
    <div className="mk-dashboard">
      <div className="mk-header">
        <div>
          <p className="mk-kicker">Marketing Command Center</p>
          <h2>90-Day Growth Roadmap</h2>
          <p>Plan content, ads, SEO, product traffic, and lead follow-up from one practical dashboard.</p>
        </div>
        <div className="mk-header-badge">
          <FaBullhorn />
          <span>Furniture Growth Plan</span>
        </div>
      </div>

      <div className="mk-kpi-grid">
        <div className="mk-kpi">
          <span>Revenue Signal</span>
          <strong>{money(totalRevenue)}</strong>
          <p>Use for campaign quality, not only traffic volume.</p>
        </div>
        <div className="mk-kpi">
          <span>Orders Signal</span>
          <strong>{number(totalOrders)}</strong>
          <p>Retarget visitors when orders lag behind traffic.</p>
        </div>
        <div className="mk-kpi">
          <span>Average Order Value</span>
          <strong>{money(avgOrderValue)}</strong>
          <p>Protect margin with bundles and premium add-ons.</p>
        </div>
        <div className="mk-kpi">
          <span>New Customers</span>
          <strong>{number(newCustomers)}</strong>
          <p>Measure how well posts and ads bring fresh buyers.</p>
        </div>
        <div className="mk-kpi">
          <span>Low Stock Risk</span>
          <strong>{number(lowStockCount)}</strong>
          <p>Avoid promoting products that cannot be delivered fast.</p>
        </div>
      </div>

      <div className="mk-section-grid">
        <section className="mk-panel mk-panel--wide">
          <div className="mk-panel-title">
            <FaClipboardCheck />
            <h3>Roadmap</h3>
          </div>
          <div className="mk-roadmap">
            {roadmap.map((item) => (
              <article className="mk-roadmap-item" key={item.phase}>
                <span>{item.phase}</span>
                <h4>{item.title}</h4>
                <p>{item.goal}</p>
                <ul>
                  {item.actions.map((action) => <li key={action}>{action}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mk-panel">
          <div className="mk-panel-title">
            <FaChartLine />
            <h3>Traffic Decisions</h3>
          </div>
          <div className="mk-decision-list">
            {productTrafficActions.map((item) => (
              <div className="mk-decision" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.status}</span>
                </div>
                <p>{item.action}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mk-section-grid">
        <section className="mk-panel">
          <div className="mk-panel-title">
            <FaImages />
            <h3>Weekly Content Calendar</h3>
          </div>
          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Focus</th>
                  <th>Content</th>
                  <th>Channel</th>
                </tr>
              </thead>
              <tbody>
                {weeklyPlan.map((item) => (
                  <tr key={item.day}>
                    <td>{item.day}</td>
                    <td>{item.focus}</td>
                    <td>{item.content}</td>
                    <td>{item.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mk-panel">
          <div className="mk-panel-title">
            <FaSearch />
            <h3>SEO Recovery Checklist</h3>
          </div>
          <div className="mk-checklist">
            {seoRecovery.map((item) => (
              <label key={item}>
                <input type="checkbox" readOnly />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="mk-section-grid">
        <section className="mk-panel">
          <div className="mk-panel-title">
            <FaBullhorn />
            <h3>Channel Budget Plan</h3>
          </div>
          <div className="mk-channel-grid">
            {channelPlan.map(({ icon: Icon, channel, budget, target }) => (
              <div className="mk-channel" key={channel}>
                <Icon />
                <div>
                  <strong>{channel}</strong>
                  <span>{budget}</span>
                  <p>{target}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mk-panel">
          <div className="mk-panel-title">
            <FaShoppingBag />
            <h3>Products to Promote First</h3>
          </div>
          <div className="mk-product-list">
            {topProducts.slice(0, 6).map((product, index) => (
              <div className="mk-product-row" key={product.id || product.name}>
                <span>{index + 1}</span>
                <div>
                  <strong>{product.name}</strong>
                  <p>{money(product.revenue || product.new_price || 0)} revenue signal</p>
                </div>
              </div>
            ))}
            {!topProducts.length && (
              <div className="mk-empty">
                Add traffic analytics and orders to automatically rank the best products for ads.
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="mk-panel mk-panel--wide">
        <div className="mk-panel-title">
          <FaChartLine />
          <h3>Category Focus</h3>
        </div>
        <div className="mk-category-grid">
          {salesCategories.slice(0, 6).map((category) => (
            <div className="mk-category" key={category.category}>
              <span>{category.category}</span>
              <strong>{money(category.revenue)}</strong>
              <p>{number(category.orders || category.order_count)} orders</p>
            </div>
          ))}
          {!salesCategories.length && (
            <div className="mk-empty">Category revenue will appear after sales analytics are available.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MarketingDashboard;
