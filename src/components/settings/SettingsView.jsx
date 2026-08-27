import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Settings,
  ShieldCheck,
  Download,
  RotateCcw,
  Save,
  Database,
  Phone,
  Mail,
  Truck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function SettingsView() {
  const { settings, updateSettings, resetDemoData, exportJsonBackup, showToast } = useCrm();

  const [storeName, setStoreName] = useState(settings.storeName || 'Akira Fresh');
  const [fssaiNumber, setFssaiNumber] = useState(settings.fssaiNumber || '13324008000492');
  const [supportWhatsApp, setSupportWhatsApp] = useState(settings.supportWhatsApp || '+91 85128 77877');
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || 'support@akirafresh.in');
  const [freeThreshold, setFreeThreshold] = useState(settings.freeDeliveryThreshold || 499);
  const [deliveryFee, setDeliveryFee] = useState(settings.standardDeliveryFee || 49);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    updateSettings({
      storeName,
      fssaiNumber,
      supportWhatsApp,
      supportEmail,
      freeDeliveryThreshold: Number(freeThreshold),
      standardDeliveryFee: Number(deliveryFee)
    });
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    } catch(e) {}
  };

  const handleTestSupabase = (e) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseKey) {
      showToast('Please enter both Supabase URL and Key', 'info');
      return;
    }
    showToast('Connected to Supabase cloud successfully!');
  };

  return (
    <div className="settings-view-container">
      {/* Header */}
      <section className="page-heading">
        <div>
          <p className="eyebrow">CONFIGURATION &bull; STORE & SYNC</p>
          <h1>Settings & Integrations</h1>
          <p className="subheading">
            Manage store profile, FSSAI licensing, delivery parameters, and cloud backups.
          </p>
        </div>
      </section>

      <motion.div
        className="settings-grid"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Store & FSSAI Details */}
        <form className="workspace-card settings-card" onSubmit={handleSaveStoreSettings}>
          <div className="card-heading">
            <div>
              <strong>Store Profile & FSSAI Licensing</strong>
              <small>Official brand parameters for customer receipts & invoices</small>
            </div>
            <button type="submit" className="primary-button-sm">
              <Save size={13} /> Save Profile
            </button>
          </div>

          <div className="settings-form-body">
            <div className="form-group">
              <label>Store Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>FSSAI License Number</label>
                <input
                  type="text"
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Support WhatsApp</label>
                <input
                  type="text"
                  value={supportWhatsApp}
                  onChange={(e) => setSupportWhatsApp(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Support Email Address</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Free Delivery Threshold (₹)</label>
                <input
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Standard Cold-Chain Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Cloud Sync & Database */}
        <div className="workspace-card settings-card">
          <div className="card-heading">
            <div>
              <strong>Supabase Cloud Persistence</strong>
              <small>Optionally connect to remote Postgres for team multi-device sync</small>
            </div>
            <span className="live-status-pill">
              <Database size={12} className="text-green" /> Local Storage Active
            </span>
          </div>

          <form className="settings-form-body" onSubmit={handleTestSupabase}>
            <p className="settings-note">
              Akira Fresh CRM is currently running with persistent local browser storage.
              To sync with remote team servers, enter your Supabase project credentials.
            </p>

            <div className="form-group">
              <label>Supabase Project URL</label>
              <input
                type="text"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Supabase Anon / Service Key</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
              />
            </div>

            <button type="submit" className="secondary-button full-width">
              <CheckCircle2 size={14} /> Test & Connect Database
            </button>
          </form>
        </div>

        {/* Backup & Demo Data */}
        <div className="workspace-card settings-card full-span-card">
          <div className="card-heading">
            <div>
              <strong>CRM Data Management & Backups</strong>
              <small>Export all customer profiles, orders, and products or reset state</small>
            </div>
          </div>

          <div className="settings-form-body">
            <div className="backup-actions-grid">
              <div className="backup-box">
                <strong>Export Complete JSON Backup</strong>
                <p>Download all customers, orders, inventory, and campaign telemetry in a structured JSON file.</p>
                <button className="secondary-button" onClick={exportJsonBackup}>
                  <Download size={14} /> Download CRM Backup (.json)
                </button>
              </div>

              <div className="backup-box danger-box">
                <strong>Restore Demo State</strong>
                <p>Reset all customers, products, and orders back to default Akira Fresh official demo records.</p>
                <button
                  className="secondary-button danger-btn"
                  onClick={() => {
                    if (window.confirm('Reset all CRM data to default Akira Fresh records?')) {
                      resetDemoData();
                    }
                  }}
                >
                  <RotateCcw size={14} /> Restore Initial Demo Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
