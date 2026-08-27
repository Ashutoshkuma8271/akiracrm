import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Upload,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Edit2,
  Trash2,
  Send,
  ShoppingBag,
  Sparkles,
  Check,
  X,
  FileText,
  Clock,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Award,
  Flame,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function CustomersView({ onSelectCreateOrder, initialSearchQuery = '' }) {
  const {
    customers,
    orders,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addCustomerNote,
    showToast
  } = useCrm();

  const [selectedId, setSelectedId] = useState(customers[0]?.id || null);
  const [mobileViewMode, setMobileViewMode] = useState('list'); // 'list' | 'detail'
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [filterTag, setFilterTag] = useState('All customers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.phone.toLowerCase().includes(q) ||
        (cust.zone && cust.zone.toLowerCase().includes(q)) ||
        (cust.address && cust.address.toLowerCase().includes(q)) ||
        (cust.favoriteProduct && cust.favoriteProduct.toLowerCase().includes(q));

      const matchesFilter =
        filterTag === 'All customers' ||
        cust.tag.toLowerCase() === filterTag.toLowerCase() ||
        (cust.rfmCohort && cust.rfmCohort.toLowerCase().includes(filterTag.toLowerCase()));

      return matchesSearch && matchesFilter;
    });
  }, [customers, searchQuery, filterTag]);

  const selectedCustomer =
    customers.find((c) => c.id === selectedId) || filteredCustomers[0] || customers[0];

  // Customer orders
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter((o) => o.customerId === selectedCustomer.id || o.customerName === selectedCustomer.name);
  }, [orders, selectedCustomer]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Address', 'Zone', 'Tag', 'RFM Cohort', 'Diet Preference', 'Orders', 'Total Spent', 'Favorite Product', 'Notes'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.address || ''}"`,
      `"${c.zone || 'Delhi NCR'}"`,
      `"${c.tag}"`,
      `"${c.rfmCohort || 'Regular'}"`,
      `"${c.dietPreference || 'Standard'}"`,
      c.ordersCount || 0,
      c.totalSpent || 0,
      `"${c.favoriteProduct || ''}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `akira_fresh_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Customer directory exported to CSV');
  };

  // Import CSV
  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          showToast('CSV is empty or invalid format', 'error');
          return;
        }

        let importedCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols[1]) {
            addCustomer({
              name: cols[1],
              phone: cols[2] || '+91 98000 00000',
              email: cols[3] || `${cols[1].toLowerCase().replace(/\s+/g, '')}@example.com`,
              address: cols[4] || 'Delhi NCR',
              zone: cols[5] || 'South Delhi',
              tag: cols[6] || 'New',
              rfmCohort: cols[7] || 'New Prospect',
              notes: cols[12] || 'Imported via CSV'
            });
            importedCount++;
          }
        }
        showToast(`Successfully imported ${importedCount} customers from CSV`);
      } catch (err) {
        showToast('Error reading CSV file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Add Customer Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCust = addCustomer({
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      zone: formData.get('zone'),
      address: formData.get('address'),
      tag: formData.get('tag'),
      rfmCohort: formData.get('tag') === 'VIP' ? 'Champion VIP' : 'New Prospect',
      dietPreference: formData.get('dietPreference') || 'High-Protein Gym Diet',
      favoriteProduct: formData.get('favoriteProduct') || 'The Protein Stock-Up Tub (1kg)',
      notes: formData.get('notes')
    });
    setShowAddModal(false);
    setSelectedId(newCust.id);
  };

  // Edit Customer Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const formData = new FormData(e.target);
    updateCustomer(selectedCustomer.id, {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      zone: formData.get('zone'),
      address: formData.get('address'),
      tag: formData.get('tag'),
      rfmCohort: formData.get('rfmCohort') || selectedCustomer.rfmCohort,
      dietPreference: formData.get('dietPreference') || selectedCustomer.dietPreference,
      favoriteProduct: formData.get('favoriteProduct') || selectedCustomer.favoriteProduct,
      notes: formData.get('notes')
    });
    setShowEditModal(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedCustomer) return;
    addCustomerNote(selectedCustomer.id, newNoteText);
    setNewNoteText('');
  };

  return (
    <div className="customers-view-container">
      {/* Header */}
      <section className="page-heading">
        <div>
          <p className="eyebrow">AKIRA FRESH DIRECTORY & RFM COHORTS</p>
          <h1>
            Customers & LTV
            <span className="heading-count">{customers.length} Profiles</span>
          </h1>
          <p className="subheading">
            Delhi NCR cold-chain customers, dietary preferences, and predictive retention insights.
          </p>
        </div>

        <div className="heading-actions">
          <button className="secondary-button" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
          <button className="secondary-button" onClick={() => fileInputRef.current?.click()}>
            <Upload size={14} /> Import CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".csv"
            onChange={handleImportCSV}
          />
          <button className="primary-button" onClick={() => setShowAddModal(true)}>
            <Plus size={15} /> Add Customer
          </button>
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className={`customers-layout-grid mobile-mode-${mobileViewMode}`}>
        {/* Left: Customer Directory */}
        <div className={`customer-panel ${mobileViewMode === 'detail' ? 'mobile-hidden' : ''}`}>
          <div className="panel-toolbar">
            <div className="search-box">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search by name, phone, zone, dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="filter-row">
              {['All customers', 'VIP', 'Repeat buyer', 'New', 'At risk'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={filterTag === tag ? 'filter-chip selected' : 'filter-chip'}
                >
                  {tag}
                  {tag === 'All customers' && <span>({customers.length})</span>}
                  {tag === 'VIP' && <span>({customers.filter((c) => c.tag === 'VIP').length})</span>}
                  {tag === 'At risk' && <span>({customers.filter((c) => c.tag === 'At risk').length})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="table-head">
            <span>Customer & RFM</span>
            <span>Segment</span>
            <span>Orders</span>
            <span>Total Spent</span>
            <span>Delhi NCR Zone</span>
            <span></span>
          </div>

          {/* Customer Rows */}
          <div className="customer-list">
            {filteredCustomers.length === 0 ? (
              <div className="empty-state">
                <p>No customers match your search criteria.</p>
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                const initials = (cust.name || 'Customer')
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'AF';

                const tagClass = (cust.tag || 'new').toLowerCase().replace(/\s+/g, '-');

                return (
                  <button
                    key={cust.id}
                    onClick={() => {
                      setSelectedId(cust.id);
                      setMobileViewMode('detail');
                    }}
                    className={
                      selectedCustomer?.id === cust.id
                        ? 'customer-row selected-row'
                        : 'customer-row'
                    }
                  >
                    <div className="customer-cell">
                      <div className={`customer-avatar ${cust.avatarColor || 'coral'}`}>
                        {initials}
                      </div>
                      <div className="customer-meta-text">
                        <strong>{cust.name}</strong>
                        <small>{cust.rfmCohort || cust.email}</small>
                      </div>
                    </div>

                    <div>
                      <span className={`tag ${tagClass}`}>
                        {cust.tag || 'New'}
                      </span>
                    </div>

                    <span className="muted-cell">{cust.ordersCount || 0} orders</span>

                    <strong className="text-green">₹{(cust.totalSpent || 0).toLocaleString('en-IN')}</strong>

                    <span className="muted-cell">{cust.zone || 'Delhi NCR'}</span>

                    <span className="row-more">&bull;&bull;&bull;</span>
                  </button>
                );
              })
            )}
          </div>

          <div className="panel-footer">
            Showing {filteredCustomers.length} of {customers.length} registered Akira Fresh clients
          </div>
        </div>

        {/* Right: Selected Customer Profile Drawer */}
        {selectedCustomer && (
          <aside className={`detail-panel ${mobileViewMode === 'list' ? 'mobile-hidden' : ''}`}>
            <button
              className="back-to-list-bar hide-on-desktop"
              onClick={() => setMobileViewMode('list')}
            >
              <ArrowLeft size={14} /> Back to Customer List
            </button>

            <div className="detail-header">
              <div className="rfm-badge-pill">
                <Award size={12} className="text-sun" />
                <span>{selectedCustomer.rfmCohort || 'Loyal Customer'}</span>
              </div>
              <div className="detail-header-actions">
                <button
                  onClick={() => setShowEditModal(true)}
                  title="Edit Customer"
                  className="icon-btn-subtle"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete customer ${selectedCustomer.name}?`)) {
                      deleteCustomer(selectedCustomer.id);
                    }
                  }}
                  title="Delete Customer"
                  className="icon-btn-subtle text-coral"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="profile-intro">
              <div className={`profile-avatar ${selectedCustomer.avatarColor || 'coral'}`}>
                {(selectedCustomer.name || 'Customer')
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'AF'}
              </div>
              <h2>{selectedCustomer.name}</h2>
              <span className={`tag ${(selectedCustomer.tag || 'new').toLowerCase().replace(/\s+/g, '-')}`}>
                {selectedCustomer.tag || 'New'}
              </span>
              <p className="profile-location">
                <MapPin size={12} /> {selectedCustomer.zone || selectedCustomer.address || 'Delhi NCR'}
              </p>
            </div>

            {/* Direct Quick Actions */}
            <div className="detail-actions">
              <a
                href={`https://wa.me/${selectedCustomer.phone?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(
                  `Hi ${selectedCustomer.name}! Akira Fresh here 🍗 Fresh batches of ${selectedCustomer.favoriteProduct || 'your favorites'} are blast-frozen & ready for 2-hr delivery in ${selectedCustomer.zone || 'Delhi NCR'}. Can we pack an order for you? https://akirafresh.in`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn-link"
              >
                <MessageSquare size={14} /> WhatsApp
              </a>

              <button
                className="action-btn-order"
                onClick={() => {
                  if (onSelectCreateOrder) {
                    onSelectCreateOrder(selectedCustomer);
                  } else {
                    showToast(`Creating order for ${selectedCustomer.name}`);
                  }
                }}
              >
                <ShoppingBag size={14} /> Create Order
              </button>
            </div>

            {/* Dietary Preference & Contact Details */}
            <div className="detail-section">
              <div className="section-title">
                <strong>Customer Profile & Contact</strong>
              </div>
              <div className="contact-line">
                <Phone size={13} />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="contact-line">
                <Mail size={13} />
                <span>{selectedCustomer.email}</span>
              </div>
              <div className="contact-line">
                <MapPin size={13} />
                <span>{selectedCustomer.address || selectedCustomer.zone}</span>
              </div>
              {selectedCustomer.dietPreference && (
                <div className="diet-pill-box">
                  <Flame size={12} className="text-coral" />
                  <span>Diet: <strong>{selectedCustomer.dietPreference}</strong></span>
                </div>
              )}
            </div>

            {/* Snapshot Metrics */}
            <div className="detail-section">
              <div className="section-title">
                <strong>Lifetime Value (LTV) Metrics</strong>
              </div>
              <div className="snapshot-grid">
                <div>
                  <span>Total Spent</span>
                  <strong className="text-green">₹{(selectedCustomer.totalSpent || 0).toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span>Total Orders</span>
                  <strong>{selectedCustomer.ordersCount || 0} orders</strong>
                </div>
                <div>
                  <span>Avg Order (AOV)</span>
                  <strong>₹{Math.round((selectedCustomer.totalSpent || 0) / Math.max(1, selectedCustomer.ordersCount || 1))}</strong>
                </div>
                <div>
                  <span>Favorite Dish</span>
                  <strong className="fav-product-text">{selectedCustomer.favoriteProduct || 'Chicken Momos'}</strong>
                </div>
              </div>
            </div>

            {/* Recent Orders Timeline */}
            <div className="detail-section">
              <div className="section-title">
                <strong>Order History ({customerOrders.length})</strong>
              </div>
              {customerOrders.length === 0 ? (
                <p className="settings-note">No orders placed yet.</p>
              ) : (
                <div className="customer-order-timeline">
                  {customerOrders.map((o) => (
                    <div key={o.id} className="timeline-order-item">
                      <div className="timeline-order-top">
                        <strong>#{o.id}</strong>
                        <span className="order-amt">₹{o.totalAmount}</span>
                      </div>
                      <span className="timeline-order-items">
                        {o.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                      </span>
                      <div className="timeline-order-bottom">
                        <span>{new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        <span className={`status-badge-small ${o.status.toLowerCase().replace(/[\s-]/g, '_')}`}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team Notes */}
            <div className="detail-section note-section">
              <div className="section-title">
                <strong>Delivery & Team Notes</strong>
              </div>
              {selectedCustomer.notes && (
                <div className="notes-box">{selectedCustomer.notes}</div>
              )}
              <form onSubmit={handleAddNote} className="add-note-form">
                <input
                  type="text"
                  placeholder="Add delivery slot or dietary preference..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                />
                <button type="submit" className="note-submit-btn">
                  <Plus size={14} />
                </button>
              </form>
            </div>
          </aside>
        )}
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
              <h2>Add New Customer</h2>
              <p className="modal-copy">Create a profile for Delhi NCR cold-chain dispatch.</p>

              <form onSubmit={handleAddSubmit}>
                <div className="form-group">
                  <label>Customer Full Name</label>
                  <input name="name" type="text" required placeholder="e.g. Vikram Malhotra" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>WhatsApp Phone</label>
                    <input name="phone" type="tel" required placeholder="+91 98100 12345" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input name="email" type="email" required placeholder="vikram@example.com" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Delhi NCR Hub / Zone</label>
                    <select name="zone" defaultValue="Gurugram (Cyber City & DLF)">
                      <option value="Gurugram (Cyber City & DLF)">Gurugram (Cyber City & DLF)</option>
                      <option value="South Delhi (Vasant Kunj & Saket)">South Delhi (Vasant Kunj & Saket)</option>
                      <option value="South Delhi (Greater Kailash & GK2)">South Delhi (Greater Kailash & GK2)</option>
                      <option value="West Delhi (Rajouri Garden & Punjabi Bagh)">West Delhi (Rajouri Garden & Punjabi Bagh)</option>
                      <option value="Noida (Sector 62 & Expressway)">Noida (Sector 62 & Expressway)</option>
                      <option value="Ghaziabad / Indirapuram">Ghaziabad / Indirapuram</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Customer Segment</label>
                    <select name="tag" defaultValue="New">
                      <option value="VIP">VIP</option>
                      <option value="Repeat buyer">Repeat Buyer</option>
                      <option value="New">New Customer</option>
                      <option value="At risk">At Risk</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Delivery Address</label>
                  <input name="address" type="text" placeholder="Flat / House No., Apartment, Sector, City" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Dietary Preference</label>
                    <input name="dietPreference" type="text" placeholder="e.g. High-Protein Gym Diet" />
                  </div>
                  <div className="form-group">
                    <label>Favorite Product</label>
                    <input name="favoriteProduct" type="text" placeholder="e.g. The Protein Stock-Up Tub (1kg)" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Delivery Instructions / Notes</label>
                  <textarea name="notes" rows={2} placeholder="Gate pass required, call before delivery..."></textarea>
                </div>

                <button type="submit" className="primary-button full-width">
                  <Check size={16} /> Save Customer
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Customer Modal */}
      <AnimatePresence>
        {showEditModal && selectedCustomer && (
          <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={18} />
              </button>
              <h2>Edit Customer Profile</h2>
              <p className="modal-copy">Update contact, address, or dietary tags.</p>

              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" type="text" required defaultValue={selectedCustomer.name} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>WhatsApp Phone</label>
                    <input name="phone" type="tel" required defaultValue={selectedCustomer.phone} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input name="email" type="email" required defaultValue={selectedCustomer.email} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Delhi NCR Zone</label>
                    <select name="zone" defaultValue={selectedCustomer.zone || 'Gurugram (Cyber City & DLF)'}>
                      <option value="Gurugram (Cyber City & DLF)">Gurugram (Cyber City & DLF)</option>
                      <option value="South Delhi (Vasant Kunj & Saket)">South Delhi (Vasant Kunj & Saket)</option>
                      <option value="South Delhi (Greater Kailash & GK2)">South Delhi (Greater Kailash & GK2)</option>
                      <option value="West Delhi (Rajouri Garden & Punjabi Bagh)">West Delhi (Rajouri Garden & Punjabi Bagh)</option>
                      <option value="Noida (Sector 62 & Expressway)">Noida (Sector 62 & Expressway)</option>
                      <option value="Ghaziabad / Indirapuram">Ghaziabad / Indirapuram</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Segment Tag</label>
                    <select name="tag" defaultValue={selectedCustomer.tag}>
                      <option value="VIP">VIP</option>
                      <option value="Repeat buyer">Repeat Buyer</option>
                      <option value="New">New Customer</option>
                      <option value="At risk">At Risk</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Delivery Address</label>
                  <input name="address" type="text" defaultValue={selectedCustomer.address} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Dietary Preference</label>
                    <input name="dietPreference" type="text" defaultValue={selectedCustomer.dietPreference} />
                  </div>
                  <div className="form-group">
                    <label>Favorite Product</label>
                    <input name="favoriteProduct" type="text" defaultValue={selectedCustomer.favoriteProduct} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" rows={2} defaultValue={selectedCustomer.notes}></textarea>
                </div>

                <button type="submit" className="primary-button full-width">
                  <Check size={16} /> Update Customer Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
