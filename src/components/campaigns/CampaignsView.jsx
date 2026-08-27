import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  MessageSquare,
  Mail,
  Send,
  Users,
  Percent,
  TrendingUp,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Copy,
  X,
  ArrowRight,
  Smartphone,
  CheckCheck,
  Flame,
  Clock
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function CampaignsView() {
  const { campaigns, customers, createCampaign, showToast } = useCrm();
  const [showModal, setShowModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // New Campaign Form State
  const [campaignTitle, setCampaignTitle] = useState('');
  const [targetSegment, setTargetSegment] = useState('VIP & Repeat Buyers');
  const [channel, setChannel] = useState('WhatsApp');
  const [couponCode, setCouponCode] = useState('STOCKUP');
  const [discountDesc, setDiscountDesc] = useState('20% OFF on 1kg Family Tubs');
  const [templateText, setTemplateText] = useState(
    'Hi {{name}}! 🍗 Weekend barbecue plans? Stock up your freezer with Akira Fresh 1kg Protein Tubs at flat 20% OFF with code {{code}}. Delivered at -18°C within 2 hours across Delhi NCR. Order now: https://akirafresh.in'
  );

  const presets = [
    {
      title: 'Weekend Barbecue Blast (1kg Tubs)',
      segment: 'VIP & Repeat Buyers',
      code: 'STOCKUP',
      discount: '20% OFF on 1kg Family Tubs',
      template: 'Hi {{name}}! 🍗 Weekend barbecue plans? Stock up your freezer with Akira Fresh 1kg Protein Tubs at flat 20% OFF with code {{code}}. Delivered at -18°C within 2 hours across Delhi NCR. Order now: https://akirafresh.in'
    },
    {
      title: 'Win-Back Inactive High-Spenders',
      segment: 'At-Risk Customers',
      code: 'FRESH30',
      discount: 'Flat ₹100 OFF on orders > ₹499',
      template: 'We miss you, {{name}}! 🥩 Enjoy your favorite high-protein Akira Fresh snacks this weekend with an exclusive ₹100 credit using code {{code}}. Sub-zero cold chain delivery to your doorstep: https://akirafresh.in'
    },
    {
      title: 'Momos & Dimsum Quick Feast',
      segment: 'Momos & Snacks Lovers',
      code: 'MOMOMANIA',
      discount: 'Buy 2 Momos, Get 1 Burger Patty Free',
      template: 'Hey {{name}}! Ready in 6 mins: Akira Fresh Juicy Himalayan Chicken Momos are in stock! Use code {{code}} for a surprise bonus snack. Freshness guaranteed at -18°C: https://akirafresh.in'
    }
  ];

  const applyPreset = (preset) => {
    setCampaignTitle(preset.title);
    setTargetSegment(preset.segment);
    setCouponCode(preset.code);
    setDiscountDesc(preset.discount);
    setTemplateText(preset.template);
    showToast(`Loaded "${preset.title}" template`);
  };

  const getSegmentCount = (seg) => {
    if (seg === 'All' || seg === 'All Customers') return customers.length;
    if (seg === 'VIP & Repeat Buyers') return customers.filter(c => c.tag === 'VIP' || c.tag === 'Repeat buyer').length;
    if (seg === 'At-Risk Customers') return customers.filter(c => c.tag === 'At risk').length;
    return customers.filter(c => c.tag === seg).length || customers.length;
  };

  const totalCampaignRevenue = campaigns.reduce((acc, c) => acc + (c.revenueGenerated || 0), 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + (c.conversions || 0), 0);
  const totalBroadcastsSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const audienceSize = getSegmentCount(targetSegment);
    createCampaign({
      title: campaignTitle,
      targetSegment,
      channel,
      couponCode: couponCode.toUpperCase(),
      discount: discountDesc,
      audienceSize,
      messageTemplate: templateText
    });

    setShowModal(false);
    setCampaignTitle('');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast(`Copied coupon code ${code} to clipboard`);
  };

  return (
    <div className="campaigns-view-container">
      {/* Header */}
      <section className="page-heading">
        <div>
          <p className="eyebrow">AKIRA FRESH RETENTION & WHATSAPP GROWTH</p>
          <h1>
            Direct Broadcast Studio
            <span className="heading-count">{campaigns.length} Active</span>
          </h1>
          <p className="subheading">
            Re-engage Delhi NCR chicken & mutton lovers with high-converting WhatsApp & SMS drops.
          </p>
        </div>

        <div className="heading-actions">
          <button className="primary-button" onClick={() => setShowModal(true)}>
            <Plus size={14} /> New WhatsApp Drop
          </button>
        </div>
      </section>

      {/* Campaign KPI Metrics */}
      <section className="metric-grid">
        <div className="metric-card">
          <div className="metric-icon sage">
            <TrendingUp size={20} />
          </div>
          <div className="metric-copy">
            <span>Broadcast Revenue</span>
            <strong>₹{totalCampaignRevenue.toLocaleString('en-IN')}</strong>
            <p>
              <b>↑ 38.4%</b> retention lift
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon coral">
            <MessageSquare size={20} />
          </div>
          <div className="metric-copy">
            <span>Total Broadcasts</span>
            <strong>{totalBroadcastsSent.toLocaleString('en-IN')} sent</strong>
            <p>
              <b>92.8% Avg</b> Read Rate
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon sun">
            <CheckCircle size={20} />
          </div>
          <div className="metric-copy">
            <span>Conversions</span>
            <strong>{totalConversions} orders</strong>
            <p>
              <b>26.4%</b> conversion rate
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon blue">
            <Percent size={20} />
          </div>
          <div className="metric-copy">
            <span>Top Coupon</span>
            <strong>STOCKUP</strong>
            <p>
              <b>₹1.42L</b> generated
            </p>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <div className="campaigns-grid">
        {campaigns.map((camp) => (
          <div key={camp.id} className="campaign-card">
            <div className="campaign-card-top">
              <div className="channel-badge-wrap">
                {camp.channel === 'WhatsApp' ? (
                  <span className="channel-badge whatsapp">
                    <MessageSquare size={13} /> WhatsApp Broadcast
                  </span>
                ) : (
                  <span className="channel-badge email">
                    <Mail size={13} /> Email Newsletter
                  </span>
                )}
                <span className={`status-pill ${camp.status.toLowerCase()}`}>{camp.status}</span>
              </div>

              <div
                className="coupon-pill"
                onClick={() => handleCopyCode(camp.couponCode)}
                title="Click to copy coupon code"
              >
                <code>{camp.couponCode}</code>
                <Copy size={11} />
              </div>
            </div>

            <h3 className="campaign-title">{camp.title}</h3>
            <p className="campaign-discount-text">{camp.discount}</p>

            <div className="campaign-audience-box">
              <Users size={14} className="text-coral" />
              <span>Target: <strong>{camp.targetSegment}</strong> ({camp.sentCount || 850} reach)</span>
            </div>

            {/* Live WhatsApp Bubble Preview */}
            <div className="whatsapp-preview-card">
              <div className="wa-bubble-header">
                <div className="wa-sender-avatar">AF</div>
                <div>
                  <strong>Akira Fresh Official</strong>
                  <small>Sub-Zero Cold Chain &bull; FSSAI Verified</small>
                </div>
              </div>
              <p className="wa-bubble-text">
                {camp.messageTemplate
                  .replace('{{name}}', 'Priya')
                  .replace('{{code}}', camp.couponCode)
                  .replace('{{discount}}', camp.discount)}
              </p>
              <div className="wa-bubble-time">
                <span>{camp.scheduledTime || 'Just now'}</span>
                <CheckCheck size={13} className="text-cyan" />
              </div>
            </div>

            {/* Performance Stats */}
            <div className="campaign-metrics-row">
              <div>
                <span>Open Rate</span>
                <strong>{camp.openRate}</strong>
              </div>
              <div>
                <span>Click Rate</span>
                <strong>{camp.clickRate}</strong>
              </div>
              <div>
                <span>Conversions</span>
                <strong>{camp.conversions} orders</strong>
              </div>
              <div>
                <span>Revenue</span>
                <strong className="text-green">₹{(camp.revenueGenerated || 0).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="campaign-card-footer">
              <a
                href={`https://wa.me/918512877877?text=${encodeURIComponent(
                  camp.messageTemplate.replace('{{name}}', 'Priya').replace('{{code}}', camp.couponCode).replace('{{discount}}', camp.discount)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-test-btn"
              >
                <Send size={13} /> Test on WhatsApp <ExternalLink size={12} />
              </a>

              <button
                className="secondary-button-sm"
                onClick={() => showToast(`Broadcast triggered for ${camp.sentCount || 850} customers in ${camp.targetSegment}`)}
              >
                Trigger Broadcast
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Retention Insights Strip */}
      <section className="insight-strip">
        <div className="insight-top-content">
          <div className="insight-icon">
            <Sparkles size={20} />
          </div>
          <div className="insight-body">
            <strong>WhatsApp is Akira Fresh’s #1 Conversion Channel</strong>
            <p>
              Broadcasts sent on Thursday & Friday between 4:00 PM - 7:00 PM generate an average <strong>38% lift in weekend barbecue & 1kg family tub reorders</strong>.
            </p>
          </div>
        </div>
        <button
          className="insight-action-btn"
          onClick={() => setShowModal(true)}
        >
          Schedule Friday Drop <ArrowRight size={14} />
        </button>
      </section>

      {/* Create Campaign Modal with Live Phone Preview */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal campaign-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={18} />
            </button>

            <h2>Create WhatsApp Drop</h2>
            <p className="modal-copy">Launch a high-converting broadcast to Delhi NCR meat lovers.</p>

            {/* Preset Recipe Buttons */}
            <div className="preset-recipes-row">
              <span className="preset-label">Quick Recipes:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => applyPreset(p)}
                >
                  <Flame size={11} className="text-coral" /> {p.title.split(' (')[0]}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>Campaign Title</label>
                <input
                  type="text"
                  required
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Weekend Barbecue Flash Drop"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Segment</label>
                  <select
                    value={targetSegment}
                    onChange={(e) => setTargetSegment(e.target.value)}
                  >
                    <option value="VIP & Repeat Buyers">VIP & Repeat Buyers ({getSegmentCount('VIP & Repeat Buyers')})</option>
                    <option value="VIP">VIP Only ({getSegmentCount('VIP')})</option>
                    <option value="Repeat buyer">Repeat Buyers ({getSegmentCount('Repeat buyer')})</option>
                    <option value="At-Risk Customers">At-Risk Win-Back ({getSegmentCount('At-Risk Customers')})</option>
                    <option value="All Customers">All Delhi NCR Customers ({getSegmentCount('All')})</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Promo Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="STOCKUP"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Discount Offer Headline</label>
                <input
                  type="text"
                  required
                  value={discountDesc}
                  onChange={(e) => setDiscountDesc(e.target.value)}
                  placeholder="20% OFF on 1kg Family Tubs"
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Message Template (Merge tags: {`{{name}}`}, {`{{code}}`}, {`{{discount}}`})</label>
                <textarea
                  rows={4}
                  required
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                ></textarea>
              </div>

              {/* Live Mockup */}
              <div className="live-preview-box">
                <div className="preview-label">
                  <Smartphone size={13} /> Live WhatsApp Preview:
                </div>
                <div className="wa-bubble-preview">
                  <p>
                    {templateText
                      .replace('{{name}}', 'Priya')
                      .replace('{{code}}', couponCode || 'STOCKUP')
                      .replace('{{discount}}', discountDesc || 'Special Offer')}
                  </p>
                  <div className="wa-meta-time">17:30 &bull; Sent via Akira Fresh Cold Chain</div>
                </div>
              </div>

              <button type="submit" className="primary-button full-width">
                <Send size={16} /> Schedule Broadcast ({getSegmentCount(targetSegment)} Recipients)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
