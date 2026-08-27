import React from 'react';
import { LayoutDashboard, Users, ShoppingBag, Package, Megaphone, Truck, Settings } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function MobileBottomNav({ activeNav, setActiveNav }) {
  const { customers, orders } = useCrm();

  const items = [
    { label: 'Overview', icon: LayoutDashboard, badge: null },
    { label: 'Customers', icon: Users, badge: customers.length },
    { label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => o.status !== 'Delivered').length },
    { label: 'Products', icon: Package, badge: null },
    { label: 'Campaigns', icon: Megaphone, badge: null },
    { label: 'Logistics', icon: Truck, badge: null }
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-inner">
        {items.map(({ label, icon: Icon, badge }) => (
          <button
            key={label}
            onClick={() => setActiveNav(label)}
            className={`bottom-nav-item ${activeNav === label ? 'active' : ''}`}
            aria-label={label}
          >
            <div className="bottom-nav-icon-wrap">
              <Icon size={18} />
              {badge !== null && badge > 0 ? (
                <span className="bottom-nav-badge">{badge}</span>
              ) : null}
            </div>
            <span className="bottom-nav-label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
