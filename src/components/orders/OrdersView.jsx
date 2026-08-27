import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
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
  FileText
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

  // New order form state
  const [newOrderCustomer, setNewOrderCustomer] = useState(initialSelectedCustomer?.id || customers[0]?.id || '');
  const [orderItems, setOrderItems] = useState([
    { productId: products[0]?.id || 'prod-001', qty: 1 }
  ]);
  const [orderSlot, setOrderSlot] = useState('Today, 04:00 PM - 07:00 PM');
  const [orderPaymentMethod, setOrderPaymentMethod] = useState('UPI (GPay)');
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
    if (orderCoupon.toUpperCase() === 'GRILL15') {
      discount = Math.round(subtotal * 0.15);
    } else if (orderCoupon.toUpperCase() === 'FRESH10') {
      discount = Math.round(subtotal * 0.1);
    } else if (orderCoupon.toUpperCase() === 'STOCKUP') {
      discount = 100;
    }

    const deliveryFee = subtotal >= (settings.freeDeliveryThreshold || 499) ? 0 : (settings.standardDeliveryFee || 49);
    const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

    return {
      subtotal,
      discount,
      deliveryFee,
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
        ord.customerPhone.toLowerCase().includes(q) ||
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

    const newOrder = createOrder({
      customerId: currentCustomerObj.id,
      customerName: currentCustomerObj.name,
      customerPhone: currentCustomerObj.phone,
      customerEmail: currentCustomerObj.email,
      deliveryAddress: currentCustomerObj.location || 'Delhi NCR',
      zone: currentCustomerObj.zone || 'South Delhi',
      items: newOrderCalculations.itemsDetailed.map((i) => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price
      })),
      subtotal: newOrderCalculations.subtotal,
      discountAmount: newOrderCalculations.discount,
      deliveryFee: newOrderCalculations.deliveryFee,
      totalAmount: newOrderCalculations.totalAmount,
      paymentMethod: orderPaymentMethod,
      slot: orderSlot,
      notes: orderNotes
    });

    setShowCreateModal(false);
    setSelectedOrderForInvoice(newOrder);
  };

  return (
    <div className="orders-view-container">
      {/* Header */}
      <section className="page-heading">
        <div>
          <p className="eyebrow">FULFILMENT &bull; COLD-CHAIN DISPATCH</p>
          <h1>
            Orders <span className="heading-count">{orders.length}</span>
          </h1>
          <p className="subheading">
            Live cold-chain tracking and rapid order fulfillment for Delhi NCR.
          </p>
        </div>

        <div className="heading-actions">
          <button className="primary-button" onClick={() => setShowCreateModal(true)}>
            <Plus size={14} /> Create New Order
          </button>
        </div>
      </section>

      {/* Orders Filter Toolbar */}
      <div className="orders-toolbar-card">
        <div className="search-box order-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search order #, customer, phone, or snack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <div className="filter-chips">
            {['All', 'Placed', 'Packing', 'Cold-Chain Transit', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={statusFilter === st ? 'filter-chip selected' : 'filter-chip'}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="zone-select-wrap">
          <span className="filter-label">Zone:</span>
          <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
            <option value="All">All Delhi NCR</option>
            <option value="Gurugram">Gurugram</option>
            <option value="South Delhi">South Delhi</option>
            <option value="Noida">Noida</option>
            <option value="West Delhi">West Delhi</option>
            <option value="Ghaziabad">Ghaziabad</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="workspace-card table-workspace">
        <div className="card-heading">
          <div>
            <strong>Active Order Queue ({filteredOrders.length})</strong>
            <small>Orders packaged in sub-zero insulated boxes</small>
          </div>
          <span className="live-status-pill">
            <Snowflake size={12} className="text-coral" /> -18°C Verified
          </span>
        </div>

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
            filteredOrders.map((ord) => (
              <div key={ord.id} className="workspace-table-row order-table-row">
                {/* Order ID & Time */}
                <div className="order-id-cell">
                  <strong>#{ord.id}</strong>
                  <small>
                    <Clock size={11} /> {ord.slot}
                  </small>
                </div>

                {/* Customer Details */}
                <div className="order-cust-cell">
                  <strong>{ord.customerName}</strong>
                  <small>
                    <Phone size={10} /> {ord.customerPhone} &bull; {ord.zone}
                  </small>
                </div>

                {/* Items List */}
                <div className="order-items-cell">
                  {ord.items.map((item, idx) => (
                    <span key={idx} className="order-item-tag">
                      {item.qty}x {item.name}
                    </span>
                  ))}
                </div>

                {/* Amount & Mode */}
                <div className="order-amount-cell">
                  <strong>₹{ord.totalAmount}</strong>
                  <small>{ord.paymentMethod}</small>
                </div>

                {/* Status Dropdown */}
                <div className="order-status-cell">
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                    className={`status-select ${ord.status.toLowerCase().replace(/[\s-]/g, '_')}`}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Cold-Chain Transit">Cold-Chain Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <small className="temp-log-text">{ord.temperatureLog}</small>
                </div>

                {/* Actions */}
                <div className="order-actions-cell">
                  <button
                    className="action-icon-btn"
                    title="View & Print Cold-Chain Invoice"
                    onClick={() => setSelectedOrderForInvoice(ord)}
                  >
                    <Printer size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}>
          <form className="modal order-modal" onSubmit={handleCreateOrderSubmit}>
            <button type="button" className="modal-close" onClick={() => setShowCreateModal(false)}>
              <X size={20} />
            </button>
            <p className="eyebrow">DISPATCH MANAGEMENT</p>
            <h2>Create New Order</h2>
            <p className="modal-copy">Assemble ready-to-cook snacks for cold-chain delivery.</p>

            {/* Select Customer */}
            <div className="form-group">
              <label>Select Customer *</label>
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

            {/* Items Picker */}
            <div className="items-builder-section">
              <div className="items-builder-header">
                <strong>Cart Items ({orderItems.length})</strong>
                <button type="button" className="text-button" onClick={handleAddItemRow}>
                  + Add Item
                </button>
              </div>

              <div className="items-builder-list">
                {orderItems.map((item, idx) => {
                  const prod = products.find((p) => p.id === item.productId) || products[0];
                  return (
                    <div key={idx} className="builder-item-row">
                      <select
                        value={item.productId}
                        onChange={(e) => handleUpdateItemProduct(idx, e.target.value)}
                        className="builder-prod-select"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - ₹{p.price} ({p.unit})
                          </option>
                        ))}
                      </select>

                      <div className="qty-controls">
                        <button type="button" onClick={() => handleUpdateItemQty(idx, -1)}>
                          -
                        </button>
                        <span>{item.qty}</span>
                        <button type="button" onClick={() => handleUpdateItemQty(idx, 1)}>
                          +
                        </button>
                      </div>

                      <span className="builder-line-total">
                        ₹{(prod?.price || 0) * item.qty}
                      </span>

                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => handleRemoveItemRow(idx)}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Slot & Payment */}
            <div className="form-row">
              <div className="form-group">
                <label>Cold-Chain Slot *</label>
                <select value={orderSlot} onChange={(e) => setOrderSlot(e.target.value)}>
                  <option value="Today, 11:00 AM - 02:00 PM">Today, 11:00 AM - 02:00 PM</option>
                  <option value="Today, 04:00 PM - 07:00 PM">Today, 04:00 PM - 07:00 PM</option>
                  <option value="Today, 07:00 PM - 09:30 PM">Today, 07:00 PM - 09:30 PM</option>
                  <option value="Tomorrow Morning (08:00 - 11:00 AM)">Tomorrow Morning (08:00 - 11:00 AM)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <select value={orderPaymentMethod} onChange={(e) => setOrderPaymentMethod(e.target.value)}>
                  <option value="UPI (GPay)">UPI (GPay)</option>
                  <option value="UPI (Paytm)">UPI (Paytm)</option>
                  <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                  <option value="Credit/Debit Card">Credit/Debit Card (Razorpay)</option>
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                </select>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="form-group">
              <label>Discount Coupon (e.g. GRILL15, FRESH10, STOCKUP)</label>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={orderCoupon}
                onChange={(e) => setOrderCoupon(e.target.value)}
              />
            </div>

            {/* Order Notes */}
            <div className="form-group">
              <label>Delivery Instructions / Rider Notes</label>
              <input
                type="text"
                placeholder="e.g. Call before arrival, leave with concierge"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </div>

            {/* Calculation Summary */}
            <div className="order-summary-box">
              <div className="summary-row">
                <span>Subtotal:</span>
                <strong>₹{newOrderCalculations.subtotal}</strong>
              </div>
              {newOrderCalculations.discount > 0 && (
                <div className="summary-row text-green">
                  <span>Coupon Discount ({orderCoupon.toUpperCase()}):</span>
                  <strong>-₹{newOrderCalculations.discount}</strong>
                </div>
              )}
              <div className="summary-row">
                <span>Cold-Chain Delivery:</span>
                <span>
                  {newOrderCalculations.deliveryFee === 0 ? (
                    <strong className="text-green">FREE (Orders &gt; ₹499)</strong>
                  ) : (
                    `₹${newOrderCalculations.deliveryFee}`
                  )}
                </span>
              </div>
              <div className="summary-row total-row">
                <strong>Grand Total:</strong>
                <strong className="total-amount">₹{newOrderCalculations.totalAmount}</strong>
              </div>
            </div>

            <button type="submit" className="primary-button full-width">
              Confirm & Dispatch Order <ArrowRight size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Cold-Chain Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setSelectedOrderForInvoice(null)}>
          <div className="modal invoice-modal">
            <button type="button" className="modal-close" onClick={() => setSelectedOrderForInvoice(null)}>
              <X size={20} />
            </button>

            {/* Printable Invoice Header */}
            <div className="invoice-header">
              <div className="invoice-brand">
                <div className="brand-symbol">A</div>
                <div>
                  <h2>AKIRA FRESH</h2>
                  <small>Cold-Chain Delivery Slip & Tax Invoice</small>
                </div>
              </div>

              <div className="invoice-meta">
                <strong>INVOICE #{selectedOrderForInvoice.id}</strong>
                <p>Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}</p>
                <p>FSSAI Lic: {settings.fssaiNumber || '13324008000492'}</p>
              </div>
            </div>

            <div className="invoice-addresses">
              <div className="invoice-addr-col">
                <small>DELIVER TO:</small>
                <strong>{selectedOrderForInvoice.customerName}</strong>
                <p>{selectedOrderForInvoice.deliveryAddress}</p>
                <p>Phone: {selectedOrderForInvoice.customerPhone}</p>
                <p>Zone: {selectedOrderForInvoice.zone}</p>
              </div>

              <div className="invoice-addr-col">
                <small>FULFILMENT SPECS:</small>
                <p><strong>Slot:</strong> {selectedOrderForInvoice.slot}</p>
                <p><strong>Payment:</strong> {selectedOrderForInvoice.paymentMethod} ({selectedOrderForInvoice.paymentStatus})</p>
                <p><strong>Temp Log:</strong> {selectedOrderForInvoice.temperatureLog}</p>
                <p><strong>Cold Van:</strong> {selectedOrderForInvoice.riderName}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrderForInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{item.name}</strong>
                      <small className="block-text">Blast-Frozen Ready-to-cook</small>
                    </td>
                    <td>{item.qty}</td>
                    <td>₹{item.price}</td>
                    <td className="text-right">₹{item.qty * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="invoice-totals">
              <div className="invoice-total-row">
                <span>Subtotal:</span>
                <span>₹{selectedOrderForInvoice.subtotal}</span>
              </div>
              {selectedOrderForInvoice.discountAmount > 0 && (
                <div className="invoice-total-row text-green">
                  <span>Discount Applied:</span>
                  <span>-₹{selectedOrderForInvoice.discountAmount}</span>
                </div>
              )}
              <div className="invoice-total-row">
                <span>Cold-Chain Packaging & Delivery:</span>
                <span>{selectedOrderForInvoice.deliveryFee === 0 ? 'FREE' : `₹${selectedOrderForInvoice.deliveryFee}`}</span>
              </div>
              <div className="invoice-total-row grand-total-row">
                <strong>Total Amount Paid:</strong>
                <strong>₹{selectedOrderForInvoice.totalAmount}</strong>
              </div>
            </div>

            <div className="invoice-footer-badges">
              <div className="seal-badge">
                <ShieldCheck size={16} className="text-green" />
                <span>100% Halal & FSSAI Certified</span>
              </div>
              <div className="seal-badge">
                <Snowflake size={16} className="text-coral" />
                <span>Blast Frozen at Source &bull; Keep Below -18°C</span>
              </div>
            </div>

            <div className="invoice-actions-footer no-print">
              <button
                type="button"
                className="secondary-button"
                onClick={() => window.print()}
              >
                <Printer size={15} /> Print Delivery Slip
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  showToast('Invoice PDF generated');
                  setSelectedOrderForInvoice(null);
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
