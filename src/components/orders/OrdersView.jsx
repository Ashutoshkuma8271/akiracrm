import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Download,
  Truck,
  Snowflake,
  Printer,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  X,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Receipt,
  FileText,
  MessageSquare,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function OrdersView({ initialSelectedCustomer = null }) {
  const {
    orders,
    customers,
    products,
    createOrder,
    updateOrderStatus,
    settings,
    showToast
  } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(Boolean(initialSelectedCustomer));
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  // New order form state
  const [newOrderCustomer, setNewOrderCustomer] = useState(initialSelectedCustomer?.id || customers[0]?.id || '');
  const [orderItems, setOrderItems] = useState([
    { productId: products[0]?.id || 'prod-001', qty: 1 }
  ]);
  const [orderSlot, setOrderSlot] = useState('Today: 4:00 PM - 6:00 PM (Cold-Chain Express)');
  const [orderPaymentMethod, setOrderPaymentMethod] = useState('UPI / Razorpay (Paid)');
  const [orderCoupon, setOrderCoupon] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Selected customer object for new order
  const currentCustomerObj = customers.find((c) => c.id === newOrderCustomer) || customers[0];

  // Calculated totals for new order
  const newOrderCalculations = useMemo(() => {
    let subtotal = 0;
    const itemsDetailed = orderItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId) || products[0];
      const lineTotal = (prod?.price || 0) * item.qty;
      subtotal += lineTotal;
      return {
        productId: prod?.id,
        name: prod?.name,
        price: prod?.price,
        qty: item.qty,
        lineTotal
      };
    });

    let discount = 0;
    if (orderCoupon.toUpperCase() === 'STOCKUP') {
      discount = Math.round(subtotal * 0.2);
    } else if (orderCoupon.toUpperCase() === 'PARTY50') {
      discount = 50;
    } else if (orderCoupon.toUpperCase() === 'FRESH30') {
      discount = 100;
    }

    const deliveryFee = subtotal >= (settings.freeDeliveryThreshold || 499) ? 0 : 50;
    const taxAmount = Math.round(subtotal * 0.05); // 5% GST for packaged frozen foods
    const totalAmount = Math.max(0, subtotal - discount + deliveryFee + taxAmount);

    return {
      subtotal,
      discount,
      deliveryFee,
      taxAmount,
      totalAmount,
      itemsDetailed
    };
  }, [orderItems, orderCoupon, products, settings]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        ord.id.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        (ord.phone && ord.phone.toLowerCase().includes(q)) ||
        (ord.customerPhone && ord.customerPhone.toLowerCase().includes(q)) ||
        ord.items.some((i) => i.name.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
      const matchesZone = zoneFilter === 'All' || ord.zone === zoneFilter;

      return matchesSearch && matchesStatus && matchesZone;
    });
  }, [orders, searchQuery, statusFilter, zoneFilter]);

  // Handle line item change
  const handleAddItemRow = () => {
    setOrderItems((prev) => [...prev, { productId: products[0]?.id, qty: 1 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (orderItems.length === 1) return;
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItemQty = (index, delta) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const handleUpdateItemProduct = (index, newProdId) => {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, productId: newProdId } : item))
    );
  };

  // Submit new order
  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();
    if (!currentCustomerObj) return;

    createOrder({
      customerId: currentCustomerObj.id,
      customerName: currentCustomerObj.name,
      customerPhone: currentCustomerObj.phone,
      phone: currentCustomerObj.phone,
      zone: currentCustomerObj.zone || 'South Delhi',
      address: currentCustomerObj.address || currentCustomerObj.location || 'Delhi NCR',
      deliverySlot: orderSlot,
      slot: orderSlot,
      paymentMethod: orderPaymentMethod,
      couponCode: orderCoupon.toUpperCase() || null,
      subtotal: newOrderCalculations.subtotal,
      discountAmount: newOrderCalculations.discount,
      deliveryFee: newOrderCalculations.deliveryFee,
      taxAmount: newOrderCalculations.taxAmount,
      totalAmount: newOrderCalculations.totalAmount,
      items: newOrderCalculations.itemsDetailed,
      status: 'Placed',
      tempLog: '-18.2°C (Deep Freeze Assigned)',
      notes: orderNotes
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (_) {}

    setShowCreateModal(false);
    setOrderCoupon('');
    setOrderNotes('');
  };

  const handleStatusChangeWithFeedback = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (newStatus === 'Delivered') {
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.55 }
        });
      } catch (_) {}
    }
  };

  const handleCopyOrderSummary = (ord) => {
    const summary = `Akira Fresh Order #${ord.id}\nCustomer: ${ord.customerName} (${ord.customerPhone || ord.phone})\nItems: ${(ord.items || []).map(i => `${i.qty}x ${i.name}`).join(', ')}\nTotal: ₹${ord.totalAmount}\nStatus: ${ord.status}\nCold-Chain Temp: ${ord.tempLog || '-18°C Verified'}`;
    navigator.clipboard.writeText(summary);
    setCopiedOrderId(ord.id);
    showToast('Order summary copied to clipboard');
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Export filtered orders dataset to CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      showToast('No orders to export matching current filters', 'error');
      return;
    }

    const headers = [
      'Order ID',
      'Created At / Slot',
      'Customer Name',
      'Customer Phone',
      'Hub Zone',
      'Delivery Address',
      'Items Ordered Summary',
      'Total Items Qty',
      'Subtotal (INR)',
      'Discount (INR)',
      'Delivery Fee (INR)',
      'GST Tax (INR)',
      'Total Amount (INR)',
      'Payment Method',
      'Fulfilment Status',
      'Cold-Chain Telemetry Log',
      'Delivery Instructions'
    ];

    const rows = filteredOrders.map((ord) => {
      const custPhone = ord.phone || ord.customerPhone || '';
      const itemsSummary = (ord.items || []).map((i) => `${i.qty || 1}x ${i.name}`).join('; ');
      const itemsCount = (ord.items || []).reduce((acc, i) => acc + (i.qty || 1), 0);

      return [
        ord.id,
        `"${(ord.deliverySlot || ord.slot || 'Express Cold Slot').replace(/"/g, '""')}"`,
        `"${(ord.customerName || 'Customer').replace(/"/g, '""')}"`,
        `"${custPhone.replace(/"/g, '""')}"`,
        `"${(ord.zone || 'Delhi NCR').replace(/"/g, '""')}"`,
        `"${(ord.address || '').replace(/"/g, '""')}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        itemsCount,
        ord.subtotal || ord.totalAmount || 0,
        ord.discountAmount || 0,
        ord.deliveryFee || 0,
        ord.taxAmount || 0,
        ord.totalAmount || 0,
        `"${(ord.paymentMethod || 'UPI').replace(/"/g, '""')}"`,
        `"${(ord.status || 'Placed').replace(/"/g, '""')}"`,
        `"${(ord.tempLog || '-18.0°C Verified').replace(/"/g, '""')}"`,
        `"${(ord.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const statusSuffix = statusFilter !== 'All' ? `_${statusFilter.toLowerCase().replace(/[\s-]/g, '_')}` : '';
    const zoneSuffix = zoneFilter !== 'All' ? `_${zoneFilter.slice(0, 8).toLowerCase().replace(/[\s-]/g, '_')}` : '';
    link.setAttribute('download', `akira_fresh_orders_filtered${statusSuffix}${zoneSuffix}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(`Downloaded CSV for ${filteredOrders.length} filtered order(s)`);
  };

  return (
    <div className="orders-view-container">
      {/* Header */}
      <section className="page-heading">
        <div>
          <p className="eyebrow">AKIRA FRESH FULFILMENT & COLD-CHAIN DISPATCH</p>
          <h1>
            Orders & Shipments
            <span className="heading-count">{orders.length} Total</span>
          </h1>
          <p className="subheading">
            Live sub-zero dispatch queue, real-time telemetry, and FSSAI printable invoices.
          </p>
        </div>

        <div className="heading-actions">
          <button
            className="secondary-button"
            onClick={handleExportCSV}
            title={`Download CSV for ${filteredOrders.length} filtered orders`}
          >
            <Download size={14} /> Download CSV ({filteredOrders.length})
          </button>
          <button className="primary-button" onClick={() => setShowCreateModal(true)}>
            <Plus size={15} /> Create New Order
          </button>
        </div>
      </section>

      {/* Toolbar & Filters */}
      <div className="orders-toolbar-card">
        <div className="search-box order-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search Order ID, Customer, Phone, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <div className="filter-chips">
            {['All', 'Placed', 'Packing', 'Cold-Chain Transit', 'Delivered'].map((status) => (
              <button
                key={status}
                className={`filter-chip ${statusFilter === status ? 'selected' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Zone Dropdown & Quick Export Button */}
        <div className="zone-select-wrap">
          <span className="filter-label">Hub Zone:</span>
          <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
            <option value="All">All Delhi NCR</option>
            <option value="Gurugram (Cyber City & DLF)">Gurugram (Cyber City & DLF)</option>
            <option value="South Delhi (Vasant Kunj & Saket)">South Delhi (Vasant Kunj & Saket)</option>
            <option value="South Delhi (Greater Kailash & GK2)">South Delhi (Greater Kailash & GK2)</option>
            <option value="Noida (Sector 62 & Expressway)">Noida (Sector 62 & Expressway)</option>
          </select>

          <button
            className="panel-quick-csv-btn"
            onClick={handleExportCSV}
            title={`Export ${filteredOrders.length} filtered orders to CSV`}
          >
            <Download size={12} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="workspace-card">
        <div className="workspace-table">
          <div className="workspace-table-head order-table-head">
            <span>Order & Time</span>
            <span>Customer Details</span>
            <span>Items Ordered</span>
            <span>Total & Mode</span>
            <span>Cold-Chain Status</span>
            <span>Actions</span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders found matching your filters.</p>
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const custPhone = ord.phone || ord.customerPhone || '+91 85128 77877';

              return (
                <div key={ord.id} className="workspace-table-row order-table-row">
                  {/* Order ID & Time */}
                  <div className="order-id-cell">
                    <strong>#{ord.id}</strong>
                    <small>
                      <Clock size={11} /> {ord.deliverySlot || ord.slot || '2-Hr Cold Slot'}
                    </small>
                  </div>

                  {/* Customer Details */}
                  <div className="order-cust-cell">
                    <strong>{ord.customerName || 'Customer'}</strong>
                    <small>
                      <Phone size={10} /> {custPhone || '+91 98100 00000'} &bull; {ord.zone || 'Delhi NCR'}
                    </small>
                  </div>

                  {/* Items List */}
                  <div className="order-items-cell">
                    {Array.isArray(ord.items) && ord.items.map((item, idx) => (
                      <span key={idx} className="order-item-tag">
                        {item.qty || 1}x {item.name || 'Snack'}
                      </span>
                    ))}
                  </div>

                  {/* Amount & Mode */}
                  <div className="order-amount-cell">
                    <strong className="text-green">₹{ord.totalAmount || 0}</strong>
                    <small>{ord.paymentMethod || 'UPI'}</small>
                  </div>

                  {/* Status Dropdown */}
                  <div className="order-status-cell">
                    <select
                      value={ord.status || 'Placed'}
                      onChange={(e) => handleStatusChangeWithFeedback(ord.id, e.target.value)}
                      className={`status-select ${(ord.status || 'placed').toLowerCase().replace(/[\s-]/g, '_')}`}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Cold-Chain Transit">Cold-Chain Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <small className="temp-log-text">{ord.tempLog || ord.temperatureLog || '-18.0°C Verified'}</small>
                  </div>

                  {/* Actions */}
                  <div className="order-actions-cell">
                    <button
                      className="action-icon-btn"
                      title="Copy order details"
                      onClick={() => handleCopyOrderSummary(ord)}
                    >
                      {copiedOrderId === ord.id ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                    </button>
                    <a
                      href={`https://wa.me/${(custPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi ${ord.customerName || 'Customer'}! 🍗 Your Akira Fresh order #${ord.id || ''} is currently ${ord.status || 'In Transit'}. Temperature verified at -18°C in cryogenic insulation. Slot: ${ord.deliverySlot || ord.slot || 'Morning'}. Thank you for choosing Akira Fresh: https://akirafresh.in`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-icon-btn"
                      title="Send WhatsApp Delivery Update"
                    >
                      <MessageSquare size={14} className="text-green" />
                    </a>
                    <button
                      className="action-icon-btn"
                      title="View & Print Cold-Chain Tax Invoice"
                      onClick={() => setSelectedOrderForInvoice(ord)}
                    >
                      <Printer size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Order Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="modal order-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>

              <h2>Create Cold-Chain Order</h2>
              <p className="modal-copy">Assemble ready-to-cook snacks with automated discount and GST rules.</p>

              <form onSubmit={handleCreateOrderSubmit}>
                {/* Select Customer */}
                <div className="form-group">
                  <label>Select Customer Profile</label>
                  <select
                    value={newOrderCustomer}
                    onChange={(e) => setNewOrderCustomer(e.target.value)}
                    required
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone}) - {c.zone || 'Delhi NCR'} [{c.tag}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items Builder */}
                <div className="items-builder-section">
                  <div className="items-builder-header">
                    <strong>Order Items ({orderItems.length})</strong>
                    <button
                      type="button"
                      className="text-button"
                      onClick={handleAddItemRow}
                    >
                      + Add Product
                    </button>
                  </div>

                  <div className="items-builder-list">
                    {orderItems.map((item, index) => {
                      const currentProd = products.find((p) => p.id === item.productId) || products[0];

                      return (
                        <div key={index} className="builder-item-row">
                          {currentProd?.image && (
                            <img
                              src={currentProd.image}
                              alt={currentProd.name}
                              className="builder-prod-thumb"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80';
                              }}
                            />
                          )}
                          <select
                            className="builder-prod-select"
                            value={item.productId}
                            onChange={(e) => handleUpdateItemProduct(index, e.target.value)}
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} - ₹{p.price} ({p.unit})
                              </option>
                            ))}
                          </select>

                          <div className="qty-controls">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(index, -1)}
                            >
                              -
                            </button>
                            <span>{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(index, 1)}
                            >
                              +
                            </button>
                          </div>

                          <strong className="builder-line-total">
                            ₹{(currentProd?.price || 0) * item.qty}
                          </strong>

                          {orderItems.length > 1 && (
                            <button
                              type="button"
                              className="remove-item-btn"
                              onClick={() => handleRemoveItemRow(index)}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Cold-Chain Delivery Slot</label>
                    <select value={orderSlot} onChange={(e) => setOrderSlot(e.target.value)}>
                      <option value="Today: 4:00 PM - 6:00 PM (Cold-Chain Express)">Today: 4:00 PM - 6:00 PM (Cold-Chain Express)</option>
                      <option value="Today: 6:00 PM - 8:00 PM (Cold-Chain Express)">Today: 6:00 PM - 8:00 PM (Cold-Chain Express)</option>
                      <option value="Tomorrow: 8:00 AM - 11:00 AM (Morning Blast Freeze)">Tomorrow: 8:00 AM - 11:00 AM (Morning Blast Freeze)</option>
                      <option value="Tomorrow: 4:00 PM - 7:00 PM (Evening Drop)">Tomorrow: 4:00 PM - 7:00 PM (Evening Drop)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={orderPaymentMethod}
                      onChange={(e) => setOrderPaymentMethod(e.target.value)}
                    >
                      <option value="UPI / Razorpay (Paid)">UPI / Razorpay (Paid)</option>
                      <option value="Credit Card (Paid)">Credit Card (Paid)</option>
                      <option value="Cash on Delivery (Cold Slot)">Cash on Delivery (Cold Slot)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Promo Coupon (e.g. STOCKUP, PARTY50, FRESH30)</label>
                    <input
                      type="text"
                      placeholder="Enter promo coupon code"
                      value={orderCoupon}
                      onChange={(e) => setOrderCoupon(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Delivery Instructions</label>
                    <input
                      type="text"
                      placeholder="Keep in thermal bag until bell rings..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Real-Time Price Summary */}
                <div className="order-summary-box">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <strong>₹{newOrderCalculations.subtotal}</strong>
                  </div>
                  {newOrderCalculations.discount > 0 && (
                    <div className="summary-row text-coral">
                      <span>Discount ({orderCoupon.toUpperCase()})</span>
                      <strong>-₹{newOrderCalculations.discount}</strong>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>GST (5% Packaged Frozen Foods)</span>
                    <strong>₹{newOrderCalculations.taxAmount}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Cold-Chain Express Delivery</span>
                    <strong>
                      {newOrderCalculations.deliveryFee === 0 ? (
                        <span className="text-green">FREE (&ge; ₹499)</span>
                      ) : (
                        `₹${newOrderCalculations.deliveryFee}`
                      )}
                    </strong>
                  </div>
                  <div className="summary-row total-row">
                    <span>Grand Total</span>
                    <strong className="total-amount">₹{newOrderCalculations.totalAmount}</strong>
                  </div>
                </div>

                <button type="submit" className="primary-button full-width">
                  <CheckCircle size={16} /> Dispatch Order (₹{newOrderCalculations.totalAmount})
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Printable Tax Invoice Modal */}
      <AnimatePresence>
        {selectedOrderForInvoice && (
          <div className="modal-backdrop" onClick={() => setSelectedOrderForInvoice(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="modal invoice-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close no-print" onClick={() => setSelectedOrderForInvoice(null)}>
                <X size={18} />
              </button>

              <div className="invoice-header">
                <div className="invoice-brand">
                  <div className="footer-logo">
                    <svg viewBox="0 0 100 100" width="28" height="28">
                      <circle cx="50" cy="50" r="48" fill="#0B2B1B" />
                      <path d="M35 65 C30 45 45 30 65 35 C65 55 50 70 35 65 Z" fill="#22C55E" />
                      <path d="M35 65 L60 40" stroke="#FAF7F0" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h2>AKIRA FRESH</h2>
                    <small>Cold-Chain Delivery &bull; FSSAI Lic #{settings.fssaiNumber || '13324008000492'}</small>
                  </div>
                </div>

                <div className="invoice-meta">
                  <strong>INVOICE #{selectedOrderForInvoice.id}</strong>
                  <p>Date: {new Date(selectedOrderForInvoice.createdAt || Date.now()).toLocaleDateString()}</p>
                  <p>Slot: {selectedOrderForInvoice.deliverySlot || selectedOrderForInvoice.slot}</p>
                </div>
              </div>

              <div className="invoice-addresses">
                <div className="invoice-addr-col">
                  <small>DISPATCHED FROM</small>
                  <strong>Akira Fresh Central Hub (Delhi NCR)</strong>
                  <p>Okhla Phase 2, New Delhi 110020</p>
                  <p>Support: +91 85128 77877 | support@akirafresh.in</p>
                </div>

                <div className="invoice-addr-col">
                  <small>DELIVER TO CUSTOMER</small>
                  <strong>{selectedOrderForInvoice.customerName}</strong>
                  <p>{selectedOrderForInvoice.address || selectedOrderForInvoice.zone}</p>
                  <p>Phone: {selectedOrderForInvoice.phone || selectedOrderForInvoice.customerPhone}</p>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Unit Price</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderForInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{it.name}</strong>
                        <span className="block-text">-18°C Cryogenic Blast Frozen</span>
                      </td>
                      <td className="text-right">{it.qty}</td>
                      <td className="text-right">₹{it.price}</td>
                      <td className="text-right">₹{it.price * it.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-totals">
                <div className="invoice-total-row">
                  <span>Subtotal:</span>
                  <strong>₹{selectedOrderForInvoice.subtotal || selectedOrderForInvoice.totalAmount}</strong>
                </div>
                {selectedOrderForInvoice.discountAmount > 0 && (
                  <div className="invoice-total-row text-coral">
                    <span>Discount:</span>
                    <strong>-₹{selectedOrderForInvoice.discountAmount}</strong>
                  </div>
                )}
                <div className="invoice-total-row">
                  <span>GST (5% Frozen Foods):</span>
                  <strong>₹{selectedOrderForInvoice.taxAmount || Math.round(selectedOrderForInvoice.totalAmount * 0.05)}</strong>
                </div>
                <div className="invoice-total-row">
                  <span>Delivery:</span>
                  <strong>{selectedOrderForInvoice.deliveryFee === 0 ? 'FREE' : `₹${selectedOrderForInvoice.deliveryFee || 50}`}</strong>
                </div>
                <div className="invoice-total-row grand-total-row">
                  <span>Grand Total:</span>
                  <strong className="text-green">₹{selectedOrderForInvoice.totalAmount}</strong>
                </div>
              </div>

              <div className="invoice-footer-badges">
                <div className="seal-badge">
                  <ShieldCheck size={16} /> 100% Halal & FSSAI Certified
                </div>
                <div className="seal-badge">
                  <Snowflake size={16} /> Sub-Zero Cold Chain Delivered (-18°C Verified)
                </div>
              </div>

              <div className="invoice-actions-footer no-print">
                <button className="secondary-button" onClick={() => setSelectedOrderForInvoice(null)}>
                  Close
                </button>
                <button className="primary-button" onClick={() => window.print()}>
                  <Printer size={15} /> Print Tax Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
