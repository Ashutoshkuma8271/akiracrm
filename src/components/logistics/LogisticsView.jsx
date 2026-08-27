import React, { useState } from 'react';
import {
  Truck,
  Snowflake,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ThermometerSnowflake,
  RotateCw
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function LogisticsView() {
  const { hubs, orders, showToast } = useCrm();
  const [refreshing, setRefreshing] = useState(false);

  const activeFleet = [
    { vanId: 'Van #01', hub: 'South Delhi Central Hub', driver: 'Devinder Singh', phone: '+91 99104 55123', temp: '-18.8°C', ordersActive: 3, zone: 'GK & Saket', status: 'On Route' },
    { vanId: 'Van #02', hub: 'Gurugram Cyber Hub', driver: 'Vikram Yadav', phone: '+91 98112 33410', temp: '-19.1°C', ordersActive: 2, zone: 'DLF Phase 5', status: 'Loading' },
    { vanId: 'Van #04', hub: 'Gurugram Cyber Hub', driver: 'Ramesh Kumar', phone: '+91 98711 00219', temp: '-18.4°C', ordersActive: 4, zone: 'Cyber City & Sohna Rd', status: 'On Route' },
    { vanId: 'Van #05', hub: 'Noida Express Hub', driver: 'Amit Verma', phone: '+91 98733 90123', temp: '-18.7°C', ordersActive: 2, zone: 'Sec 62 & Indirapuram', status: 'Delivering' }
  ];

  const handleRefreshTemp = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('All cold-chain sensors pinged: 100% compliance at -18°C');
    }, 800);
  };

  return (
    <div className="logistics-view-container">
      {/* Header */}
      <section className="page-heading">
        <div>
          <p className="eyebrow">COLD CHAIN LOGISTICS &bull; DELHI NCR</p>
          <h1>Cold-Chain Hubs & Dispatch Fleet</h1>
          <p className="subheading">
            Live sub-zero (-18°C) monitoring across 4 central fulfilment chambers & refrigerated vans.
          </p>
        </div>

        <div className="heading-actions">
          <button
            className={`secondary-button ${refreshing ? 'spinning-btn' : ''}`}
            onClick={handleRefreshTemp}
          >
            <RotateCw size={14} /> Refresh Sensors
          </button>
        </div>
      </section>

      {/* Central Hubs Grid */}
      <div className="hubs-grid">
        {hubs.map((hub) => (
          <div key={hub.id} className="hub-card">
            <div className="hub-card-top">
              <div>
                <span className="hub-tag">Primary Cold Hub</span>
                <h3 className="hub-title">{hub.name}</h3>
                <p className="hub-location">
                  <MapPin size={12} /> {hub.location}
                </p>
              </div>

              <div className="chamber-temp-badge">
                <ThermometerSnowflake size={16} className="text-coral" />
                <strong>{hub.chamberTemp}</strong>
                <small>Chamber Status</small>
              </div>
            </div>

            <div className="hub-coverage-tags">
              {hub.coverage.map((area, idx) => (
                <span key={idx} className="coverage-pill">
                  {area}
                </span>
              ))}
            </div>

            <div className="hub-stats-row">
              <div>
                <span>Active Vans</span>
                <strong>{hub.activeVans} Units</strong>
              </div>
              <div>
                <span>Capacity</span>
                <strong>{hub.capacity}</strong>
              </div>
              <div>
                <span>Today's Dispatches</span>
                <strong>{hub.deliveriesToday} orders</strong>
              </div>
              <div>
                <span>SLA Score</span>
                <strong className="text-green">{hub.slaScore}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet Live Table */}
      <div className="workspace-card table-workspace fleet-workspace">
        <div className="card-heading">
          <div>
            <strong>Refrigerated Fleet Status & Active Dispatches</strong>
            <small>Equipped with sub-zero insulated boxes and telemetry</small>
          </div>
          <span className="live-status-pill">
            <Radio size={12} className="text-green pulse-dot" /> LIVE FLEET TELEMETRY
          </span>
        </div>

        <div className="workspace-table">
          <div className="workspace-table-head fleet-table-head">
            <span>Van / Unit</span>
            <span>Driver & Contact</span>
            <span>Operating Hub</span>
            <span>Temp Reading</span>
            <span>Assigned Zone</span>
            <span>Fleet Status</span>
          </div>

          {activeFleet.map((van) => (
            <div key={van.vanId} className="workspace-table-row fleet-table-row">
              <div className="van-id-cell">
                <Truck size={16} className="text-coral" />
                <strong>{van.vanId}</strong>
              </div>

              <div>
                <strong>{van.driver}</strong>
                <small>{van.phone}</small>
              </div>

              <div>
                <span>{van.hub}</span>
              </div>

              <div>
                <span className="live-temp-badge">{van.temp}</span>
              </div>

              <div>
                <span>{van.zone}</span>
                <small>{van.ordersActive} orders aboard</small>
              </div>

              <div>
                <span className={`fleet-status-pill ${van.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {van.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Certification */}
      <section className="insight-strip logistics-cert-strip">
        <div className="insight-top-content">
          <div className="insight-icon">
            <ShieldCheck size={20} className="text-green" />
          </div>
          <div className="insight-body">
            <strong>Akira Fresh Cold-Chain Quality Guarantee</strong>
            <p>
              Every blast-frozen chicken & mutton snack is packaged in insulated dry-ice containers with thermal color-change indicators.
              If the package temperature exceeds -12°C during transit, it is automatically flagged for replacement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
