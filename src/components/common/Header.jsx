import React, { useState } from 'react';
import { Bell, Snowflake, Menu, X, Search } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import NotificationPopover from './NotificationPopover';

export default function Header({ activeNav, setActiveNav, onGlobalSearch, onToggleMobileSidebar, isMobileSidebarOpen }) {
  const { notifications, showToast } = useCrm();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onGlobalSearch) {
        onGlobalSearch(searchTerm);
      }
      showToast(`Searching for "${searchTerm}"`);
      setShowMobileSearch(false);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="breadcrumbs">
          <span className="hide-on-mobile">Akira Fresh</span>
          <b className="hide-on-mobile">/</b>
          <strong>{activeNav}</strong>
        </div>

        <div className="brand-pill hide-on-mobile-sm">
          <Snowflake size={13} className="snowflake-spin text-emerald" />
          <span>Blast Frozen &bull; Sub-Zero SLA</span>
          <span className="pill-dot"></span>
          <span className="pill-temp">-18.6°C</span>
        </div>
      </div>

      <div className="top-actions">
        {/* Desktop & Tablet Search Form */}
        <form className={`global-search-form ${showMobileSearch ? 'mobile-search-active' : ''}`} onSubmit={handleSearchSubmit}>
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

        <button
          className="icon-button mobile-search-toggle"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          aria-label="Toggle search"
        >
          <Search size={18} />
        </button>

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
          <div className="admin-status hide-on-mobile">
            <strong>Shreya Kapoor</strong>
            <small>Operations Lead</small>
          </div>
        </div>
      </div>
    </header>
  );
}
