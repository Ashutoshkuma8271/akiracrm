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
  Snowflake,
  X
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function Sidebar({ activeNav, setActiveNav, isMobileOpen, onCloseMobile }) {
  const {
    customers = [],
    orders = [],
    products = [],
    campaigns = [],
    adminProfile = {},
    setIsProfileModalOpen
  } = useCrm();

  const mainNav = [
    { label: 'Overview', icon: LayoutDashboard, badge: null },
    { label: 'Customers', icon: Users, badge: (customers || []).length },
    { label: 'Orders', icon: ShoppingBag, badge: (orders || []).filter((o) => o?.status !== 'Delivered').length },
    { label: 'Products', icon: Package, badge: (products || []).length },
    { label: 'Campaigns', icon: Megaphone, badge: (campaigns || []).length },
    { label: 'Logistics', icon: Truck, badge: 'Delhi NCR' }
  ];

  const adminName = adminProfile?.name || 'Shreya Kapoor';
  const adminRole = adminProfile?.role || 'Operations Lead';
  const adminColor = adminProfile?.avatarColor || 'coral';
  const adminInitials = adminProfile?.avatarInitials || 'SK';

  const handleNavClick = (label) => {
    setActiveNav(label);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header-row">
          <div className="brand-mark">
            <div className="brand-symbol">
              <svg viewBox="0 0 100 100" width="24" height="24">
                <circle cx="50" cy="50" r="48" fill="#0B2B1B" />
                <path d="M35 65 C30 45 45 30 65 35 C65 55 50 70 35 65 Z" fill="#22C55E" />
                <path d="M35 65 L60 40" stroke="#FAF7F0" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="brand-text">
              <strong>akira</strong>
              <small>FRESH CRM</small>
            </div>
          </div>

          <button className="sidebar-mobile-close" onClick={onCloseMobile}>
            <X size={20} />
          </button>
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
              onClick={() => handleNavClick(label)}
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
            onClick={() => handleNavClick('Settings')}
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
          <ShieldCheck size={16} className="text-emerald" />
          <div>
            <span>FSSAI Lic: 13324008000492</span>
            <small>100% Halal & Blast Frozen</small>
          </div>
        </div>

        <div
          className="sidebar-footer clickable"
          onClick={() => {
            if (setIsProfileModalOpen) setIsProfileModalOpen(true);
            if (onCloseMobile) onCloseMobile();
          }}
          title="Click to edit administrator profile & switch operator"
          role="button"
          tabIndex={0}
        >
          <div className={`user-avatar ${adminColor}`}>
            {adminInitials}
          </div>
          <div className="user-info">
            <strong>{adminName}</strong>
            <small>{adminRole}</small>
          </div>
        </div>
      </aside>
    </>
  );
}
