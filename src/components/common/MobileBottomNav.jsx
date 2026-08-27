import React from 'react';
import { LayoutDashboard, Users, ShoppingBag, Package, Megaphone } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function MobileBottomNav({ activeNav, setActiveNav }) {
  const { customers, orders } = useCrm();

  const items = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Customers', icon: Users, badge: customers.length },
    { label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => o.status !== 'Delivered').length },
    { label: 'Products', icon: Package },
    { label: 'Campaigns', icon: Megaphone }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map(({ label, icon: Icon, badge }) => (
        <button
          key={label}
          onClick={() => setActiveNav(label)}
          className={`bottom-nav-item ${activeNav === label ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon-wrap">
            <Icon size={19} />
            {badge ? <span className="bottom-nav-badge">{badge}</span> : null}
          </div>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
