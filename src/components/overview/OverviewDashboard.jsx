import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertCircle,
  Truck,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Snowflake,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function OverviewDashboard({ onNavigate }) {
  const { customers, orders, products, campaigns, hubs, showToast } = useCrm();

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const vipCount = customers.filter((c) => c.tag === 'VIP').length;
  const atRiskCount = customers.filter((c) => c.tag === 'At risk').length;

  const categories = [
    { name: 'Family Packs (1kg)', share: 34, revenue: '₹4.8L', trend: '+28%', color: 'coral' },
    { name: 'Kebabs & Tikkas', share: 26, revenue: '₹3.6L', trend: '+14%', color: 'sage' },
    { name: 'Chicken Snacks & Patties', share: 22, revenue: '₹3.1L', trend: '+19%', color: 'sun' },
    { name: 'Momos & Dimsums', share: 12, revenue: '₹1.7L', trend: '+11%', color: 'blue' },
    { name: 'Mutton Delicacies', share: 6, revenue: '₹85K', trend: '+8%', color: 'plum' }
  ];

  return (
    <div className="overview-container">
      <section className="page-heading">
        <div>
          <p className="eyebrow">AKIRA FRESH &bull; DELHI NCR OPERATIONS</p>
          <h1>Good afternoon, Shreya</h1>
          <p className="subheading">
            Sub-zero cold chain live: <strong>{activeOrdersCount} active shipments</strong> moving across Delhi NCR.
          </p>
        </div>

        <div className="heading-actions">
          <button
            className="secondary-button"
            onClick={() => onNavigate('Logistics')}
          >
            <Truck size={15} /> Cold Hubs
          </button>
          <button
            className="primary-button"
            onClick={() => onNavigate('Orders')}
          >
            <span>＋</span> New Order
          </button>
        </div>
      </section>

      {/* Primary KPI Metrics */}
      <section className="metric-grid">
        <div className="metric-card">
          <div className="metric-icon coral">
            <TrendingUp size={20} />
          </div>
          <div className="metric-copy">
            <span>CRM Revenue</span>
            <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong>
            <p>
              <b>↑ 18.4%</b> growth
            </p>
          </div>
          <span className="metric-arrow">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-icon sage">
            <ShoppingBag size={20} />
          </div>
          <div className="metric-copy">
            <span>In Transit</span>
            <strong>{activeOrdersCount} orders</strong>
            <p>
              <b>↑ 98.9%</b> SLA
            </p>
          </div>
          <span className="metric-arrow">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-icon sun">
            <Users size={20} />
          </div>
          <div className="metric-copy">
            <span>Customers</span>
            <strong>{customers.length} total</strong>
            <p>
              <b>{vipCount} VIP</b> members
            </p>
          </div>
          <span className="metric-arrow">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-icon blue">
            <AlertCircle size={20} />
          </div>
          <div className="metric-copy">
            <span>At Risk</span>
            <strong>{atRiskCount} contacts</strong>
            <p className="negative">
              <b>{atRiskCount}</b> win-back
            </p>
          </div>
          <span className="metric-arrow">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </section>

      {/* Grid Layout: Category Mix + Live Hub Monitor */}
      <div className="dashboard-columns">
        {/* Category Revenue Breakdown */}
        <div className="workspace-card">
          <div className="card-heading">
            <div>
              <strong>Akira Fresh Product Mix & Revenue</strong>
              <small>Real-time share across blast-frozen categories</small>
            </div>
            <button className="text-button" onClick={() => onNavigate('Products')}>
              View All <span>→</span>
            </button>
          </div>

          <div className="category-breakdown-body">
            {categories.map((cat) => (
              <div key={cat.name} className="cat-stat-row">
                <div className="cat-stat-meta">
                  <span className="cat-stat-name">{cat.name}</span>
                  <div className="cat-stat-right">
                    <strong>{cat.revenue}</strong>
                    <span className="cat-stat-badge">{cat.trend}</span>
                  </div>
                </div>
                <div className={`progress-track ${cat.color}`}>
                  <div style={{ width: `${cat.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delhi NCR Cold Hub Status */}
        <div className="workspace-card">
          <div className="card-heading">
            <div>
              <strong>Delhi NCR Cold Hub Status</strong>
              <small>Blast frozen temp (-18°C) monitoring</small>
            </div>
            <span className="live-status-pill">
              <span className="live-dot"></span> LIVE
            </span>
          </div>

          <div className="hub-status-list">
            {hubs.map((hub) => (
              <div key={hub.id} className="hub-mini-card">
                <div className="hub-mini-left">
                  <div className="hub-icon-wrap">
                    <Snowflake size={16} className="text-coral" />
                  </div>
                  <div>
                    <strong>{hub.name}</strong>
                    <small>{hub.activeVans} vans &bull; {hub.deliveriesToday} orders</small>
                  </div>
                </div>
                <div className="hub-mini-right">
                  <span className="hub-temp-badge">{hub.chamberTemp}</span>
                  <span className="hub-sla-tag">SLA {hub.slaScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Recent Orders Feed */}
      <div className="workspace-card orders-stream-card">
        <div className="card-heading">
          <div>
            <strong>Recent Orders & Dispatch Stream</strong>
            <small>Live fulfilment queue for Delhi NCR</small>
          </div>
          <button className="secondary-button-sm" onClick={() => onNavigate('Orders')}>
            View All ({orders.length}) <span>→</span>
          </button>
        </div>

        <div className="workspace-table">
          <div className="workspace-table-head five-col">
            <span>Order ID</span>
            <span>Customer & Zone</span>
            <span>Items Summary</span>
            <span>Total & Mode</span>
            <span>Status & Slot</span>
          </div>

          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="workspace-table-row five-col" onClick={() => onNavigate('Orders')}>
              <div>
                <strong>#{order.id}</strong>
                <small className="order-time">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              </div>
              <div>
                <strong>{order.customerName}</strong>
                <small>{order.zone}</small>
              </div>
              <div className="items-cell">
                <span>{order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</span>
              </div>
              <div>
                <strong>₹{order.totalAmount}</strong>
                <small>{order.paymentMethod}</small>
              </div>
              <div>
                <span className={`status-badge ${order.status.toLowerCase().replace(/[\s-]/g, '_')}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Retention & Growth Playbook (Responsive Card) */}
      <section className="insight-strip">
        <div className="insight-top-content">
          <div className="insight-icon">
            <Sparkles size={20} />
          </div>
          <div className="insight-body">
            <strong>Akira Fresh Growth Playbook: 1kg Family Pack Surge</strong>
            <p>
              Repeat customers in Gurugram & South Delhi are reordering <strong>The Protein Stock-Up Tub (1kg)</strong> every 8 days.
              Launch a targeted WhatsApp broadcast with code <code>STOCKUP</code> to generate an estimated ₹45,000 in weekend orders.
            </p>
          </div>
        </div>
        <button
          className="insight-action-btn"
          onClick={() => onNavigate('Campaigns')}
        >
          Launch WhatsApp Campaign <ArrowRight size={14} />
        </button>
      </section>
    </div>
  );
}
