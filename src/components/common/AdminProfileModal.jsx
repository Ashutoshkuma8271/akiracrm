import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  User,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  Bell,
  Volume2,
  CheckCircle,
  Users,
  Briefcase,
  Flame,
  Snowflake,
  TrendingUp,
  Sliders,
  LogOut,
  Save,
  Check
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function AdminProfileModal({ onClose }) {
  const {
    adminProfile = {},
    updateAdminProfile,
    staffTeamList = [],
    switchAdminStaff,
    orders = [],
    hubs = [],
    showToast
  } = useCrm();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'switch' | 'stats' | 'preferences'
  const [formData, setFormData] = useState({
    name: adminProfile?.name || 'Shreya Kapoor',
    email: adminProfile?.email || 'shreya.kapoor@akirafresh.in',
    phone: adminProfile?.phone || '+91 98101 22890',
    role: adminProfile?.role || 'Operations & Dispatch Lead',
    hubAssigned: adminProfile?.hubAssigned || 'Okhla Central Cold Hub',
    avatarColor: adminProfile?.avatarColor || 'coral',
    fssaiSupervisorId: adminProfile?.fssaiSupervisorId || 'FSSAI-SUP-88219',
    soundAlerts: adminProfile?.soundAlerts ?? true,
    whatsappAlerts: adminProfile?.whatsappAlerts ?? true,
    autoPrintInvoice: adminProfile?.autoPrintInvoice ?? false
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const initials = (formData.name || 'Admin')
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    if (updateAdminProfile) {
      updateAdminProfile({
        ...formData,
        avatarInitials: initials || 'AF'
      });
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const ordersTodayCount = (orders || []).length;
  const transitOrdersCount = (orders || []).filter((o) => o?.status !== 'Delivered').length;

  const displayInitials = (formData.name || 'Admin')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SK';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="modal admin-profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close Profile">
          <X size={20} />
        </button>

        {/* Profile Card Banner */}
        <div className="profile-modal-header">
          <div className="profile-banner-top">
            <div className={`profile-avatar-large ${formData.avatarColor || 'coral'}`}>
              {displayInitials}
            </div>

            <div className="profile-header-info">
              <div className="profile-name-row">
                <h2>{formData.name || 'Administrator'}</h2>
                <span className="staff-id-badge">{adminProfile?.staffId || 'EMP-01'}</span>
              </div>
              <span className="profile-role-title">{formData.role || 'Operations Lead'}</span>
              <div className="profile-hub-chip">
                <Snowflake size={11} />
                <span>{formData.hubAssigned || 'Delhi NCR Central'}</span>
              </div>
            </div>
          </div>

          <div className="profile-modal-tabs">
            <button
              className={`profile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={14} /> Profile
            </button>
            <button
              className={`profile-tab-btn ${activeTab === 'switch' ? 'active' : ''}`}
              onClick={() => setActiveTab('switch')}
            >
              <Users size={14} /> Switch Staff
            </button>
            <button
              className={`profile-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <TrendingUp size={14} /> Metrics
            </button>
            <button
              className={`profile-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <Sliders size={14} /> Settings
            </button>
          </div>
        </div>

        {/* Tab 1: Edit Profile Details */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="profile-modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Operator Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Primary Role / Designation</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Operations & Dispatch Lead">Operations & Dispatch Lead</option>
                  <option value="Fleet & Cold-Chain Logistics Lead">Fleet & Cold-Chain Logistics Lead</option>
                  <option value="Growth & WhatsApp CRM Lead">Growth & WhatsApp CRM Lead</option>
                  <option value="Quality & Blast Freeze Inspector">Quality & Blast Freeze Inspector</option>
                  <option value="Executive Store Manager">Executive Store Manager</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Work Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Hotline / Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Primary Assigned Cold Hub</label>
                <select
                  value={formData.hubAssigned}
                  onChange={(e) => setFormData({ ...formData, hubAssigned: e.target.value })}
                >
                  <option value="Okhla Central Cold Hub">Okhla Central Cold Hub (South Delhi)</option>
                  <option value="Gurugram Cyber Hub">Gurugram Cyber Hub (DLF / Cyber City)</option>
                  <option value="Noida Express Cold Storage">Noida Express Hub (Sec 63 / Greater Noida)</option>
                </select>
              </div>

              <div className="form-group">
                <label>FSSAI Supervisor License ID</label>
                <input
                  type="text"
                  value={formData.fssaiSupervisorId}
                  onChange={(e) => setFormData({ ...formData, fssaiSupervisorId: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Avatar Badge Color</label>
              <div className="color-picker-row">
                {['coral', 'sage', 'sun', 'blue', 'plum', 'mint'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-bubble-btn ${c} ${formData.avatarColor === c ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, avatarColor: c })}
                  >
                    {formData.avatarColor === c && <Check size={14} color="#FFF" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="profile-footer-actions">
              <button type="button" className="secondary-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                {savedSuccess ? (
                  <>
                    <Check size={16} /> Saved!
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Profile Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Switch Staff Team Member */}
        {activeTab === 'switch' && (
          <div className="profile-modal-body">
            <p className="staff-switch-intro">
              Switch your active operator session to manage different cold storage hubs or dispatch shifts in Delhi NCR:
            </p>

            <div className="staff-cards-list">
              {staffTeamList.map((staff) => {
                const isActive = adminProfile.id === staff.id;
                return (
                  <div
                    key={staff.id}
                    className={`staff-member-card ${isActive ? 'active-staff' : ''}`}
                  >
                    <div className={`staff-avatar ${staff.avatarColor || 'coral'}`}>
                      {staff.avatarInitials}
                    </div>

                    <div className="staff-meta">
                      <strong>{staff.name}</strong>
                      <span className="staff-role">{staff.role}</span>
                      <small className="staff-hub-loc">
                        <MapPin size={11} /> {staff.hubAssigned} &bull; {staff.shift}
                      </small>
                    </div>

                    <div className="staff-action-right">
                      {isActive ? (
                        <span className="active-operator-pill">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="secondary-button-sm"
                          onClick={() => {
                            switchAdminStaff(staff.id);
                            onClose();
                          }}
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Operations & Fulfilment Metrics */}
        {activeTab === 'stats' && (
          <div className="profile-modal-body">
            <div className="profile-kpi-grid">
              <div className="profile-kpi-card">
                <span>Active Queue</span>
                <strong>{transitOrdersCount}</strong>
                <small>Orders in packing/transit</small>
              </div>

              <div className="profile-kpi-card">
                <span>Cold-Chain SLA</span>
                <strong className="text-green">99.4%</strong>
                <small>Sub-zero compliance score</small>
              </div>

              <div className="profile-kpi-card">
                <span>Total Dispatched</span>
                <strong>{ordersTodayCount}</strong>
                <small>Fulfilled via Delhi NCR hubs</small>
              </div>

              <div className="profile-kpi-card">
                <span>Blast Freeze SLA</span>
                <strong className="text-cyan">-18.6°C</strong>
                <small>Mean dispatch temperature</small>
              </div>
            </div>

            <div className="fssai-verification-box">
              <ShieldCheck size={24} className="text-green" />
              <div>
                <strong>FSSAI Quality Certification: Active</strong>
                <p>License #13324008000492 &bull; Cryogenic Flash Freeze Protocol Validated for Delhi NCR deliveries.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Preferences */}
        {activeTab === 'preferences' && (
          <div className="profile-modal-body">
            <div className="pref-items-list">
              <label className="pref-item-toggle">
                <div className="pref-info">
                  <div className="pref-title-row">
                    <Volume2 size={16} className="text-sun" />
                    <strong>Order Sound Notifications</strong>
                  </div>
                  <p>Play an instant audio chime whenever a new order is received from Delhi NCR customers.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.soundAlerts}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setFormData({ ...formData, soundAlerts: next });
                    updateAdminProfile({ soundAlerts: next });
                  }}
                />
              </label>

              <label className="pref-item-toggle">
                <div className="pref-info">
                  <div className="pref-title-row">
                    <Bell size={16} className="text-green" />
                    <strong>WhatsApp Dispatch Broadcast Alerts</strong>
                  </div>
                  <p>Send automatic temperature log update links to customers on 1-click dispatch.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.whatsappAlerts}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setFormData({ ...formData, whatsappAlerts: next });
                    updateAdminProfile({ whatsappAlerts: next });
                  }}
                />
              </label>

              <label className="pref-item-toggle">
                <div className="pref-info">
                  <div className="pref-title-row">
                    <Award size={16} className="text-coral" />
                    <strong>Printable Cold-Chain Tax Invoices</strong>
                  </div>
                  <p>Format itemized invoices with GST breakdown and FSSAI license credentials.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoPrintInvoice}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setFormData({ ...formData, autoPrintInvoice: next });
                    updateAdminProfile({ autoPrintInvoice: next });
                  }}
                />
              </label>
            </div>

            <div className="profile-footer-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  showToast('Session locked. Enter PIN to resume.');
                  onClose();
                }}
              >
                <LogOut size={14} /> Lock CRM Session
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={onClose}
              >
                <Check size={16} /> Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
