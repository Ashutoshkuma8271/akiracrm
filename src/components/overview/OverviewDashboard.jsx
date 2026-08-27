import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  Clock,
  RotateCw,
  ExternalLink
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function OverviewDashboard({ onNavigate, onSelectCategory }) {
  const { customers = [], orders = [], products = [], campaigns = [], hubs = [], adminProfile = {}, showToast } = useCrm();
  const [isPingingSensors, setIsPingingSensors] = useState(false);

  const totalRevenue = (orders || []).reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0);
  const activeOrdersCount = (orders || []).filter((o) => o?.status !== 'Delivered' && o?.status !== 'Cancelled').length;
  const vipCount = (customers || []).filter((c) => c?.tag === 'VIP').length;
  const atRiskCount = (customers || []).filter((c) => c?.tag === 'At risk').length;
  const firstName = adminProfile?.name ? adminProfile.name.split(' ')[0] : 'Shreya';

  const categories = [
    { name: 'Family Packs (1kg)', share: 34, revenue: '₹4.8L', trend: '+28%', color: 'coral' },
    { name: 'Kebabs & Tikkas', share: 26, revenue: '₹3.6L', trend: '+14%', color: 'sage' },
    { name: 'Chicken Snacks', share: 22, revenue: '₹3.1L', trend: '+19%', color: 'sun' },
    { name: 'Momos & Dimsums', share: 12, revenue: '₹1.7L', trend: '+11%', color: 'blue' },
    { name: 'Mutton Delicacies', share: 6, revenue: '₹85K', trend: '+8%', color: 'plum' }
  ];

  const handlePingSensors = () => {
    setIsPingingSensors(true);
    setTimeout(() => {
      setIsPingingSensors(false);
      showToast('All 4 Delhi NCR Cold Storage Hubs verified: -18.6°C optimal cryogenic SLA');
    }, 600);
  };

  const handleCategoryClick = (catName) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    } else if (onNavigate) {
      onNavigate('Products');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div
      className="overview-container"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.section className="page-heading" variants={itemVariants}>
        <div>
          <p className="eyebrow">AKIRA FRESH &bull; DELHI NCR OPERATIONS</p>
          <h1>Good afternoon, {firstName}</h1>
          <p className="subheading">
            Sub-zero cold chain live: <strong>{activeOrdersCount} active shipments</strong> moving across Delhi NCR.
          </p>
        </div>

        <div className="heading-actions">
          <button
            className={`secondary-button ${isPingingSensors ? 'spinning-btn' : ''}`}
            onClick={handlePingSensors}
            title="Ping live IoT thermal sensors across all cold rooms"
          >
            <RotateCw size={14} /> Telemetry Check
          </button>
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
      </motion.section>

      {/* Akira Fresh Brand & Storefront Sync Banner */}
      <motion.div className="brand-store-banner" variants={itemVariants}>
        <div className="brand-store-left">
          <div className="brand-store-logo">
            <svg viewBox="0 0 100 100" width="20" height="20">
              <circle cx="50" cy="50" r="48" fill="#072416" />
              <path d="M35 65 C30 45 45 30 65 35 C65 55 50 70 35 65 Z" fill="#10B981" />
              <path d="M35 65 L60 40" stroke="#FAF7F0" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="brand-store-title">
              <span>Akira Fresh Consumer Store</span>
              <span className="brand-store-status-pill">
                <span className="live-dot" /> LIVE AT AKIRAFRESH.IN
              </span>
            </div>
            <p className="brand-store-desc">
              Direct from blast-freeze to kitchen &bull; 100% antibiotic residue-free &bull; 2-hour express delivery across Delhi NCR
            </p>
          </div>
        </div>

        <a
          href="https://akirafresh.in"
          target="_blank"
          rel="noopener noreferrer"
          className="brand-store-btn"
        >
          <span>Open akirafresh.in</span>
          <ExternalLink size={13} />
        </a>
      </motion.div>

      {/* Primary KPI Metrics */}
      <motion.section className="metric-grid" variants={itemVariants}>
        <motion.div
          className="metric-card clickable"
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('Orders')}
          title="Click to view all revenue & orders"
        >
          <div className="metric-icon coral">
            <TrendingUp size={20} />
          </div>
          <div className="metric-copy">
            <span>CRM Revenue</span>
            <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong>
            <p>
              <b>↑ 18.4%</b> vs last week
            </p>
          </div>
          <span className="metric-arrow">
            <ArrowUpRight size={16} />
          </span>
        </motion.div>

        <motion.div
          className="metric-card clickable"
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('Orders')}
          title="Click to view active shipments"
        >
          <div className="metric-icon sage">
            <ShoppingBag size={20} />
          </div>
          <div className="metric-copy">
            <span>In Transit</span>
            <strong>{activeOrdersCount} orders</strong>
            <p>
              <b>↑ 99.4%</b> Cold SLA
            </p>
          </div>
          <span className="metric-arrow">
            <ArrowUpRight size={16} />
          </span>
        </motion.div>

        <motion.div
          className="metric-card clickable"
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('Customers')}
          title="Click to view all customers"
        >
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
        </motion.div>

        <motion.div
          className="metric-card clickable"
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('Campaigns')}
          title="Click to launch win-back campaigns"
        >
          <div className="metric-icon blue">
            <AlertCircle size={20} />
          </div>
          <div className="metric-copy">
            <span>At Risk</span>
            <strong>{atRiskCount} contacts</strong>
            <p className="negative">
              <b>{atRiskCount}</b> win-back drop
            </p>
          </div>
          <span className="metric-arrow">
            <ArrowUpRight size={16} />
          </span>
        </motion.div>
      </motion.section>

      {/* Two Columns: Category Analytics & Real-Time Hub Telemetry */}
      <div className="dashboard-columns">
        {/* Category Contribution breakdown */}
        <motion.div className="workspace-card" variants={itemVariants}>
          <div className="card-heading">
            <div>
              <strong>Akira Fresh Product Mix & Revenue</strong>
              <small>Real-time share across blast-frozen categories (Click to filter catalog)</small>
            </div>
            <button className="text-button" onClick={() => onNavigate('Products')}>
              View All <span>→</span>
            </button>
          </div>

          <div className="category-breakdown-body">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="cat-stat-item clickable"
                onClick={() => handleCategoryClick(cat.name)}
                title={`Filter products by ${cat.name}`}
              >
                <div className="cat-stat-meta">
                  <span className="cat-stat-name">{cat.name}</span>
                  <div className="cat-stat-right">
                    <strong>{cat.revenue}</strong>
                    <span className="cat-stat-badge">{cat.trend}</span>
                  </div>
                </div>
                <div className={`progress-track ${cat.color}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.share}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Delhi NCR Cold-Chain Hubs Telemetry */}
        <motion.div className="workspace-card" variants={itemVariants}>
          <div className="card-heading">
            <div>
              <strong>Delhi NCR Cold Hub Status</strong>
              <small>Blast frozen temperature (-18°C) monitoring</small>
            </div>
            <span className="live-status-pill clickable" onClick={() => onNavigate('Logistics')}>
              <span className="live-dot" /> LIVE
            </span>
          </div>

          <div className="hub-status-list">
            {(hubs || []).slice(0, 4).map((hub) => (
              <div
                key={hub?.id || hub?.name || Math.random()}
                className="hub-mini-card clickable"
                onClick={() => onNavigate('Logistics')}
                title={`View ${hub?.name} details & refrigerated fleet`}
              >
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
        </motion.div>
      </div>

      {/* Live Recent Fulfilment Queue */}
      <motion.div className="workspace-card orders-stream-card" variants={itemVariants}>
        <div className="card-heading">
          <div>
            <strong>Recent Order Fulfilment Stream</strong>
            <small>Live fulfilment queue for Delhi NCR cold chain</small>
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
              <div
                key={order?.id || Math.random()}
                className="workspace-table-row five-col clickable"
                onClick={() => onNavigate('Orders')}
                title="Click to view order details & invoice"
              >
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
      </motion.div>

      {/* AI Retention & Growth Playbook */}
      <motion.section className="insight-strip" variants={itemVariants}>
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
      </motion.section>
    </motion.div>
  );
}
