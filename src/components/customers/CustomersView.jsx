import React, { useState, useMemo, useRef } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function CustomersView({ onSelectCreateOrder }) {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All customers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const fileInputRef = useRef(null);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.phone.toLowerCase().includes(q) ||
        cust.location.toLowerCase().includes(q) ||
        (cust.favoriteProduct && cust.favoriteProduct.toLowerCase().includes(q));

      const matchesFilter =
        filterTag === 'All customers' || cust.tag.toLowerCase() === filterTag.toLowerCase();

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
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Location', 'Zone', 'Tag', 'Status', 'Orders', 'Total Spent', 'Favorite Product', 'Notes'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.location}"`,
      `"${c.zone}"`,
      `"${c.tag}"`,
      `"${c.status}"`,
      c.ordersCount,
      c.totalSpent,
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
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols[1]) {
            addCustomer({
              name: cols[1],
              phone: cols[2] || '+91 98000 00000',
              email: cols[3] || `${cols[1].toLowerCase().replace(/\s+/g, '')}@example.com`,
              location: cols[4] || 'Delhi NCR',
              zone: cols[5] || 'South Delhi',
              tag: cols[6] || 'New',
              notes: cols[11] || 'Imported via CSV file'
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

  // Add customer form handler
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCust = addCustomer({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      zone: formData.get('zone'),
      tag: formData.get('tag'),
      favoriteProduct: formData.get('favoriteProduct'),
      dietaryPreference: formData.get('dietaryPreference'),
      notes: formData.get('notes')
    });
    setSelectedId(newCust.id);
    setShowAddModal(false);
  };

  // Edit customer form handler
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateCustomer(selectedCustomer.id, {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      zone: formData.get('zone'),
      tag: formData.get('tag'),
      favoriteProduct: formData.get('favoriteProduct'),
      dietaryPreference: formData.get('dietaryPreference'),
      notes: formData.get('notes')
    });
    setShowEditModal(false);
  };

  // Add note handler
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addCustomerNote(selectedCustomer.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="customers-view-container">
      {/* Header */}
      <section className="page-heading">
        <div>
          <p className="eyebrow">AKIRA FRESH &bull; CRM DIRECTORY</p>
          <h1>
            Customers <span className="heading-count">{customers.length}</span>
          </h1>
          <p className="subheading">
            Cultivate loyalty with Delhi NCR meat & snack lovers.
          </p>
        </div>

        <div className="heading-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCSV}
            accept=".csv"
            style={{ display: 'none' }}
          />
          <button
            className="secondary-button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} /> Import CSV
          </button>
          <button className="secondary-button" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
          <button className="primary-button" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Customer
          </button>
        </div>
      </section>

      {/* Main Customers Grid */}
      <div className="customers-layout-grid">
        {/* Left: Customer List Panel */}
        <div className="customer-panel">
          {/* Toolbar */}
          <div className="panel-toolbar">
            <div className="search-box">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search by name, phone, zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-row">
              {['All customers', 'VIP', 'Repeat buyer', 'New', 'At risk'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={filterTag === tag ? 'filter-chip selected' : 'filter-chip'}
                >
                  {tag}
                  {tag === 'All customers' && <span>{customers.length}</span>}
                  {tag === 'VIP' && <span>{customers.filter((c) => c.tag === 'VIP').length}</span>}
                  {tag === 'At risk' && <span>{customers.filter((c) => c.tag === 'At risk').length}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="table-head">
            <span>Customer</span>
            <span>Segment</span>
            <span>Orders</span>
            <span>Total Spent</span>
            <span>Zone</span>
            <span></span>
          </div>

          {/* Customer Rows */}
          <div className="customer-list">
            {filteredCustomers.length === 0 ? (
              <div className="empty-state">
                <p>No customers match your search criteria.</p>
              </div>
            ) : (
              filteredCustomers.map((cust) => (
                <button
                  key={cust.id}
                  onClick={() => setSelectedId(cust.id)}
                  className={
                    selectedCustomer?.id === cust.id
                      ? 'customer-row selected-row'
                      : 'customer-row'
                  }
                >
                  <div className="customer-cell">
                    <div className={`customer-avatar ${cust.tone || 'coral'}`}>
                      {cust.initials}
                    </div>
                    <div className="customer-meta-text">
                      <strong>{cust.name}</strong>
                      <small>{cust.email}</small>
                    </div>
                  </div>

                  <div>
                    <span className={`tag ${cust.tag.toLowerCase().replace(/\s+/g, '-')}`}>
                      {cust.tag}
                    </span>
                  </div>

                  <span className="muted-cell">{cust.ordersCount} orders</span>

                  <strong>₹{cust.totalSpent.toLocaleString('en-IN')}</strong>

                  <span className="muted-cell">{cust.zone || 'Delhi NCR'}</span>

                  <span className="row-more">&bull;&bull;&bull;</span>
                </button>
              ))
            )}
          </div>

          <div className="panel-footer">
            <span>
              Showing <strong>{filteredCustomers.length}</strong> of {customers.length} customers
            </span>
          </div>
        </div>

        {/* Right: Selected Customer Profile Drawer */}
        {selectedCustomer && (
          <aside className="detail-panel">
            <div className="detail-header">
              <p>Customer Profile</p>
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
              <div className={`profile-avatar ${selectedCustomer.tone || 'coral'}`}>
                {selectedCustomer.initials}
              </div>
              <h2>{selectedCustomer.name}</h2>
              <span className={`tag ${selectedCustomer.tag.toLowerCase().replace(/\s+/g, '-')}`}>
                {selectedCustomer.tag}
              </span>
              <p className="profile-location">
                <MapPin size={12} /> {selectedCustomer.location}
              </p>
            </div>

            {/* Direct Quick Actions */}
            <div className="detail-actions">
              <a
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${selectedCustomer.name}! Akira Fresh here. We have freshly blast-frozen batches of ${selectedCustomer.favoriteProduct || 'your favorites'} ready for delivery across Delhi NCR.`
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
                <ShoppingBag size={14} /> New Order
              </button>
            </div>

            {/* Contact Details */}
            <div className="detail-section">
              <div className="section-title">
                <strong>Contact Information</strong>
              </div>
              <div className="contact-line">
                <Mail size={14} />
                <span>{selectedCustomer.email}</span>
              </div>
              <div className="contact-line">
                <Phone size={14} />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="contact-line">
                <Heart size={14} />
                <span>Prefers: {selectedCustomer.dietaryPreference || 'Halal & Blast Frozen'}</span>
              </div>
            </div>

            {/* Customer Snapshot */}
            <div className="detail-section">
              <div className="section-title">
                <strong>Customer Snapshot</strong>
              </div>
              <div className="snapshot-grid">
                <div>
                  <span>Total Orders</span>
                  <strong>{selectedCustomer.ordersCount}</strong>
                </div>
                <div>
                  <span>Lifetime Spent</span>
                  <strong>₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span>Favorite Snack</span>
                  <strong className="fav-product-text">
                    {selectedCustomer.favoriteProduct || 'Chicken Momos'}
                  </strong>
                </div>
                <div>
                  <span>Delivery Zone</span>
                  <strong>{selectedCustomer.zone || 'Delhi NCR'}</strong>
                </div>
              </div>
            </div>

            {/* Recent Orders Timeline */}
            <div className="detail-section">
              <div className="section-title">
                <strong>Order History ({customerOrders.length})</strong>
              </div>
              {customerOrders.length === 0 ? (
                <small className="muted-text">No previous orders on record.</small>
              ) : (
                <div className="customer-order-timeline">
                  {customerOrders.map((ord) => (
                    <div key={ord.id} className="timeline-order-item">
                      <div className="timeline-order-top">
                        <strong>#{ord.id}</strong>
                        <span className="order-amt">₹{ord.totalAmount}</span>
                      </div>
                      <small className="timeline-order-items">
                        {ord.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                      </small>
                      <div className="timeline-order-bottom">
                        <span className={`status-badge-small ${ord.status.toLowerCase().replace(/[\s-]/g, '_')}`}>
                          {ord.status}
                        </span>
                        <small>{new Date(ord.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team Notes */}
            <div className="detail-section note-section">
              <div className="section-title">
                <strong>Team Notes & Delivery Preferences</strong>
              </div>
              <div className="notes-box">
                <p>{selectedCustomer.notes || 'No notes added yet.'}</p>
              </div>

              <form onSubmit={handleAddNote} className="add-note-form">
                <input
                  type="text"
                  placeholder="Add quick team note..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                />
                <button type="submit" className="note-submit-btn" title="Add Note">
                  <Send size={13} />
                </button>
              </form>
            </div>
          </aside>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <form className="modal" onSubmit={handleAddSubmit}>
            <button type="button" className="modal-close" onClick={() => setShowAddModal(false)}>
              <X size={20} />
            </button>
            <p className="eyebrow">NEW RELATIONSHIP</p>
            <h2>Add Customer</h2>
            <p className="modal-copy">Create a profile for Akira Fresh cold-chain delivery.</p>

            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" required placeholder="e.g. Priya Sharma" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input name="email" type="email" required placeholder="priya@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input name="phone" required placeholder="+91 98123 45678" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Delhi NCR Zone *</label>
                <select name="zone" defaultValue="South Delhi">
                  <option value="South Delhi">South Delhi</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Noida">Noida</option>
                  <option value="West Delhi">West Delhi</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                  <option value="North Delhi">North Delhi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Customer Segment</label>
                <select name="tag" defaultValue="New">
                  <option value="New">New</option>
                  <option value="Repeat buyer">Repeat buyer</option>
                  <option value="VIP">VIP</option>
                  <option value="At risk">At risk</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Address / Landmark</label>
              <input name="location" placeholder="e.g. Magnolias, DLF Phase 5, Gurugram" />
            </div>

            <div className="form-group">
              <label>Favorite Akira Fresh Snack</label>
              <input name="favoriteProduct" placeholder="e.g. Chicken Burger Patty" />
            </div>

            <div className="form-group">
              <label>Dietary & Delivery Notes</label>
              <textarea name="notes" rows={3} placeholder="e.g. Sunday delivery preferred. Extra chutney." />
            </div>

            <button type="submit" className="primary-button full-width">
              Create Customer Profile <ArrowRight size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <form className="modal" onSubmit={handleEditSubmit}>
            <button type="button" className="modal-close" onClick={() => setShowEditModal(false)}>
              <X size={20} />
            </button>
            <p className="eyebrow">UPDATE PROFILE</p>
            <h2>Edit {selectedCustomer.name}</h2>
            <p className="modal-copy">Update contact details and preferences.</p>

            <div className="form-group">
              <label>Full Name</label>
              <input name="name" defaultValue={selectedCustomer.name} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" defaultValue={selectedCustomer.email} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" defaultValue={selectedCustomer.phone} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Delhi NCR Zone</label>
                <select name="zone" defaultValue={selectedCustomer.zone || 'South Delhi'}>
                  <option value="South Delhi">South Delhi</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Noida">Noida</option>
                  <option value="West Delhi">West Delhi</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                  <option value="North Delhi">North Delhi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Segment Tag</label>
                <select name="tag" defaultValue={selectedCustomer.tag}>
                  <option value="New">New</option>
                  <option value="Repeat buyer">Repeat buyer</option>
                  <option value="VIP">VIP</option>
                  <option value="At risk">At risk</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <input name="location" defaultValue={selectedCustomer.location} />
            </div>

            <div className="form-group">
              <label>Favorite Product</label>
              <input name="favoriteProduct" defaultValue={selectedCustomer.favoriteProduct} />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" rows={3} defaultValue={selectedCustomer.notes} />
            </div>

            <button type="submit" className="primary-button full-width">
              Save Changes <Check size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
