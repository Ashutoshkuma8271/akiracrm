import React from 'react';
import { Bell, Check, Package, Truck, AlertTriangle, X } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function NotificationPopover({ onClose }) {
  const { notifications, markNotificationsRead } = useCrm();

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package size={16} className="text-coral" />;
      case 'delivery':
        return <Truck size={16} className="text-green" />;
      case 'inventory':
        return <AlertTriangle size={16} className="text-sun" />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <div className="notification-popover">
      <div className="notif-header">
        <div className="notif-title">
          <Bell size={16} />
          <strong>Live Notifications</strong>
          <span className="notif-badge">{notifications.filter((n) => !n.read).length} new</span>
        </div>
        <div className="notif-actions">
          <button className="notif-mark-read" onClick={markNotificationsRead} title="Mark all read">
            <Check size={14} /> Read all
          </button>
          <button className="notif-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">No new notifications.</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
              <div className="notif-item-icon">{getIcon(n.type)}</div>
              <div className="notif-item-content">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <small>{n.time}</small>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notif-footer">
        <span>Cold-Chain Monitor: All Hubs Normal (-18°C)</span>
      </div>
    </div>
  );
}
