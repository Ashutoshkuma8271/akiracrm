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
  const { customers = [], orders = [], products = [], campaigns = [], hubs = [], adminProfile = {}, showToast } = useCrm();

  const totalRevenue = (orders || []).reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0);
  const activeOrdersCount = (orders || []).filter((o) => o?.status !== 'Delivered' && o?.status !== 'Cancelled').length;
  const vipCount = (customers || []).filter((c) => c?.tag === 'VIP').length;
  const atRiskCount = (customers || []).filter((c) => c?.tag === 'At risk').length;
  const firstName = adminProfile?.name ? adminProfile.name.split(' ')[0] : 'Shreya';

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
          <h1>Good afternoon, {firstName}</h1>
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

      {/* Two Columns: Category Analytics & Real-Time Hub Telemetry */}
      <div className="dashboard-columns">
        {/* Category Contribution breakdown */}
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
              <div key={cat.name} className="cat-stat-item">
                <div className="cat-stat-meta">
                  <span className="cat-stat-name">{cat.name}</span>
                  <div className="cat-stat-right">
                    <strong>{cat.revenue}</strong>
                    <span className="cat-stat-badge">{cat.trend}</span>
                  </div>
                </div>
                <div className={`progress-track ${cat.color}`}>
                  <div style={{ width: `${cat.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Delhi NCR Cold-Chain Hubs Telemetry */}
        <div className="workspace-card">
          <div className="card-heading">
            <div>
              <strong>Delhi NCR Cold Hub Status</strong>
              <small>Blast frozen temp (-18°C) monitoring</small>
            </div>
            <span className="live-status-pill">
              <span className="live-dot" /> LIVE
            </span>
          </div>

          <div className="hub-status-list">
            {(hubs || []).slice(0, 4).map((hub) => (
              <div key={hub?.id || hub?.name || Math.random()} className="hub-mini-card">
                <div className="hub-mini-left">
                  <div className="hub-icon-wrap">
                    <Snowflake size={16} className="text-coral" />
                  </div>
                  <div>
                    <strong>{hub?.name || 'Cold Storage Hub'}</strong>
                    <small>{hub?.subText || hub?.location || 'Delhi NCR'}</small>
                  </div>
                </div>
                <div className="hub-mini-right">
                  <span className="hub-temp-badge">{hub?.chamberTemp || '-18.5°C'}</span>
                  <span className="hub-sla-tag">SLA {hub?.slaScore || '99%'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Recent Fulfilment Queue */}
      <div className="workspace-card orders-stream-card">
        <div className="card-heading">
          <div>
            <strong>Recent Order Fulfilment Stream</strong>
            <small>Live fulfilment queue for Delhi NCR</small>
          </div>
          <button className="secondary-button-sm" onClick={() => onNavigate('Orders')}>
            View All ({orders?.length || 0}) <span>→</span>
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

          {(orders || []).slice(0, 5).map((order) => {
            const itemsText = Array.isArray(order?.items)
              ? order.items.map((i) => `${i?.qty || 1}x ${i?.name || 'Snack'}`).join(', ')
              : 'Cold-Chain Package';
            const statusText = order?.status || 'Placed';
            const statusClass = statusText.toLowerCase().replace(/[\s-]/g, '_');
            const orderTime = order?.createdAt
              ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now';

            return (
              <div key={order?.id || Math.random()} className="workspace-table-row five-col" onClick={() => onNavigate('Orders')}>
                <div>
                  <strong>#{order?.id || 'ORD'}</strong>
                  <small className="order-time">{orderTime}</small>
                </div>
                <div>
                  <strong>{order?.customerName || 'Customer'}</strong>
                  <small>{order?.zone || 'Delhi NCR'}</small>
                </div>
                <div className="items-cell">
                  <span>{itemsText}</span>
                </div>
                <div>
                  <strong>₹{order?.totalAmount || 0}</strong>
                  <small>{order?.paymentMethod || 'UPI (Paid)'}</small>
                </div>
                <div>
                  <span className={`status-badge ${statusClass}`}>
                    {statusText}
                  </span>
                </div>
              </div>
            );
          })}
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
              High-frequency buyers in <b>Gurugram Cyber City & South Delhi</b> re-order on Fridays. Launch the automated WhatsApp campaign with coupon <code>STOCKUP</code> to trigger 25+ re-orders today.
            </p>
          </div>
        </div>
        <button
          className="insight-action-btn"
          onClick={() => onNavigate('Campaigns')}
        >
          Launch WhatsApp Drop <span>→</span>
        </button>
      </section>
    </div>
  );
}
