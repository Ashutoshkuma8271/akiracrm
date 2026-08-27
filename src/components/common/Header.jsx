import React, { useState } from 'react';
import { Bell, Snowflake, ShieldCheck, Search, Sparkles } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import NotificationPopover from './NotificationPopover';

export default function Header({ activeNav, setActiveNav, onGlobalSearch }) {
  const { notifications, customers, orders, products, showToast } = useCrm();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onGlobalSearch) {
        onGlobalSearch(searchTerm);
      }
      showToast(`Searching for "${searchTerm}"`);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="breadcrumbs">
          <span>Akira Fresh CRM</span>
          <b>/</b>
          <strong>{activeNav}</strong>
        </div>

        <div className="brand-pill">
          <Snowflake size={14} className="snowflake-spin text-coral" />
          <span>Blast Frozen &bull; Sub-Zero Cold Chain</span>
          <span className="pill-dot"></span>
          <span className="pill-temp">-18.6°C SLA Active</span>
        </div>
      </div>

      <div className="top-actions">
        <form className="global-search-form" onSubmit={handleSearchSubmit}>
          <Search size={15} className="search-icon-svg" />
          <input
            type="text"
            placeholder="Search customers, orders, snacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </form>

        <div className="notif-wrapper">
          <button
            className="icon-button"
            aria-label="Notifications"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-counter">{unreadCount}</span>}
          </button>

          {showNotifs && <NotificationPopover onClose={() => setShowNotifs(false)} />}
        </div>

        <div className="top-avatar-wrap" title="Administrator: Shreya Kapoor">
          <div className="top-avatar">SK</div>
          <div className="admin-status">
            <strong>Shreya Kapoor</strong>
            <small>Operations Lead</small>
          </div>
        </div>
      </div>
    </header>
  );
}
