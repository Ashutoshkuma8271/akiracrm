import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Megaphone,
  Truck,
  Settings,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Snowflake
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function Sidebar({ activeNav, setActiveNav }) {
  const { customers, orders, products, campaigns } = useCrm();

  const mainNav = [
    { label: 'Overview', icon: LayoutDashboard, badge: null },
    { label: 'Customers', icon: Users, badge: customers.length },
    { label: 'Orders', icon: ShoppingBag, badge: orders.filter((o) => o.status !== 'Delivered').length },
    { label: 'Products', icon: Package, badge: products.length },
    { label: 'Campaigns', icon: Megaphone, badge: campaigns.length },
    { label: 'Logistics', icon: Truck, badge: 'Delhi NCR' }
  ];

  return (
    <aside className="sidebar">
      <div className="brand-mark">
        <div className="brand-symbol">
          <span>A</span>
        </div>
        <div className="brand-text">
          <strong>akira</strong>
          <small>FRESH CRM</small>
        </div>
      </div>

      <div className="workspace-switcher">
        <span className="workspace-dot" />
        <div className="workspace-info">
          <span className="workspace-name">Akira Fresh Delhi NCR</span>
          <span className="workspace-sub">Cold-Chain Hub v2.4</span>
        </div>
        <span className="chevron">⌄</span>
      </div>

      <p className="nav-label">Management Hub</p>
      <nav className="nav-group">
        {mainNav.map(({ label, icon: Icon, badge }) => (
          <button
            key={label}
            onClick={() => setActiveNav(label)}
            className={activeNav === label ? 'nav-item active' : 'nav-item'}
          >
            <span className="nav-icon">
              <Icon size={18} />
            </span>
            <span className="nav-text">{label}</span>
            {badge !== null && <span className="nav-count">{badge}</span>}
          </button>
        ))}
      </nav>

      <p className="nav-label">System & Store</p>
      <nav className="nav-group">
        <button
          onClick={() => setActiveNav('Settings')}
          className={activeNav === 'Settings' ? 'nav-item active' : 'nav-item'}
        >
          <span className="nav-icon">
            <Settings size={18} />
          </span>
          <span className="nav-text">Settings & Sync</span>
        </button>

        <a
          href="https://wa.me/918512877877"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item nav-link"
        >
          <span className="nav-icon">
            <HelpCircle size={18} />
          </span>
          <span className="nav-text">WhatsApp Support</span>
          <ExternalLink size={12} className="nav-external" />
        </a>
      </nav>

      <div className="sidebar-trust-badge">
        <ShieldCheck size={14} className="text-green" />
        <div>
          <span>FSSAI Lic: 13324008000492</span>
          <small>100% Halal & Blast Frozen</small>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-avatar">SK</div>
        <div className="user-info">
          <strong>Shreya Kapoor</strong>
          <small>Operations Administrator</small>
        </div>
      </div>
    </aside>
  );
}
