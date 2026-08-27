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
  ArrowRight
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function CampaignsView() {
  const { campaigns, customers, createCampaign, showToast } = useCrm();
  const [showModal, setShowModal] = useState(false);
  const [testCustomerPhone, setTestCustomerPhone] = useState('+918512877877');

  // New Campaign Form State
  const [campaignTitle, setCampaignTitle] = useState('');
  const [targetSegment, setTargetSegment] = useState('Repeat buyer');
  const [channel, setChannel] = useState('WhatsApp');
  const [couponCode, setCouponCode] = useState('WEEKEND15');
  const [discountDesc, setDiscountDesc] = useState('15% OFF on Kebabs & Family Tubs');
  const [templateText, setTemplateText] = useState(
    'Hey {{name}}! 🍢 Weekend is here. Elevate your grill game with Akira Fresh blast-frozen chicken snacks. Use code {{code}} for {{discount}} today! Shop: https://akirafresh.in'
  );

  const getSegmentCount = (seg) => {
    if (seg === 'All') return customers.length;
    return customers.filter((c) => c.tag === seg).length;
  };

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
          <p className="eyebrow">RETENTION &bull; DIRECT ENGAGEMENT</p>
          <h1>
            Campaigns <span className="heading-count">{campaigns.length} Active</span>
          </h1>
          <p className="subheading">
            Re-engage Delhi NCR meat lovers with high-converting WhatsApp & Email broadcasts.
          </p>
        </div>

        <div className="heading-actions">
          <button className="primary-button" onClick={() => setShowModal(true)}>
            <Plus size={14} /> New Campaign
          </button>
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

              <div className="coupon-pill" onClick={() => handleCopyCode(camp.couponCode)} title="Click to copy coupon">
                <code>{camp.couponCode}</code>
                <Copy size={11} />
              </div>
            </div>

            <h3 className="campaign-title">{camp.title}</h3>
            <p className="campaign-discount-text">{camp.discount}</p>

            <div className="campaign-audience-box">
              <Users size={14} />
              <span>
                Audience: <strong>{camp.targetSegment}</strong> ({camp.sentCount} contacts)
              </span>
            </div>

            <div className="campaign-template-preview">
              <p>"{camp.messageTemplate}"</p>
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
                onClick={() => showToast(`Broadcast triggered for ${camp.sentCount} customers in ${camp.targetSegment}`)}
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
            <strong>WhatsApp is Akira Fresh’s #1 conversion channel</strong>
            <p>
              Messages sent on Thursday & Friday between 4:00 PM - 7:00 PM generate an average <strong>38% lift in weekend barbecue & family tub reorders</strong>.
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

      {/* Create Campaign Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <form className="modal campaign-modal" onSubmit={handleCreateSubmit}>
            <button type="button" className="modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <p className="eyebrow">GROWTH MARKETING</p>
            <h2>Create Campaign</h2>
            <p className="modal-copy">Launch a targeted message to your Akira Fresh audience.</p>

            <div className="form-group">
              <label>Campaign Title *</label>
              <input
                required
                placeholder="e.g. Sunday Kebab Feast 15% OFF"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Audience Segment</label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                >
                  <option value="All">All Customers ({getSegmentCount('All')})</option>
                  <option value="Repeat buyer">Repeat Buyers ({getSegmentCount('Repeat buyer')})</option>
                  <option value="VIP">VIP Customers ({getSegmentCount('VIP')})</option>
                  <option value="At risk">At-Risk Customers ({getSegmentCount('At risk')})</option>
                  <option value="New">New Members ({getSegmentCount('New')})</option>
                </select>
              </div>

              <div className="form-group">
                <label>Channel</label>
                <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                  <option value="WhatsApp">WhatsApp Business API</option>
                  <option value="Email">Email Newsletter</option>
                  <option value="SMS">Direct SMS</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Promo Coupon Code</label>
                <input
                  required
                  placeholder="e.g. FRESH15"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Offer Highlight</label>
                <input
                  required
                  placeholder="e.g. 15% OFF Momos & Kebabs"
                  value={discountDesc}
                  onChange={(e) => setDiscountDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Message Template (Use {'{{name}}'}, {'{{code}}'})</label>
              <textarea
                rows={4}
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
              />
            </div>

            <div className="campaign-reach-summary">
              <span>Estimated Reach:</span>
              <strong>{getSegmentCount(targetSegment)} contacts across Delhi NCR</strong>
            </div>

            <button type="submit" className="primary-button full-width">
              Launch Campaign <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
