import React from 'react';
import { ShieldCheck, Snowflake, Phone, Mail } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function AppFooter({ onNavigate }) {
  const { settings = {} } = useCrm();

  return (
    <footer className="crm-app-footer">
      <div className="footer-top-row">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg viewBox="0 0 100 100" width="22" height="22">
                <circle cx="50" cy="50" r="48" fill="#0B2B1B" />
                <path d="M35 65 C30 45 45 30 65 35 C65 55 50 70 35 65 Z" fill="#22C55E" />
                <path d="M35 65 L60 40" stroke="#FAF7F0" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <strong>Akira Fresh CRM</strong>
          </div>
          <p className="footer-tagline">
            Premium frozen ready-to-cook chicken and mutton snacks delivered via cold-chain across Delhi NCR.
          </p>
        </div>

        <div className="footer-trust-col">
          <div className="footer-badge-pill">
            <ShieldCheck size={14} className="text-emerald" />
            <span>FSSAI Lic: {settings?.fssaiNumber || '13324008000492'}</span>
          </div>
          <div className="footer-badge-pill">
            <Snowflake size={14} className="text-cyan" />
            <span>-18°C Cryogenic Blast Freeze</span>
          </div>
        </div>

        <div className="footer-contact-col">
          <a
            href="https://wa.me/918512877877"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >
            <Phone size={13} />
            <span>+91 85128 77877</span>
          </a>
          <a
            href="mailto:support@akirafresh.in"
            className="footer-contact-link"
          >
            <Mail size={13} />
            <span>support@akirafresh.in</span>
          </a>
        </div>
      </div>

      <div className="footer-bottom-row">
        <span>&copy; {new Date().getFullYear()} Akira Fresh Foods Pvt. Ltd. All rights reserved.</span>
        <div className="footer-status-pill">
          <span className="live-dot"></span>
          <span>Delhi NCR Cold-Chain Telemetry: Active</span>
        </div>
      </div>
    </footer>
  );
}
