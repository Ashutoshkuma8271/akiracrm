import React, { useMemo, useState } from 'react';

const initialCustomers = [
  { id: 1, name: 'Ananya Mehta', initials: 'AM', phone: '+91 98765 42190', email: 'ananya.m@gmail.com', location: 'Gurugram, HR', tag: 'VIP', status: 'Active', orders: 14, value: '₹18,420', lastOrder: 'Today, 10:42 AM', favorite: 'Chicken Seekh Kebab', tone: 'coral', note: 'Prefers Sunday morning delivery. Loves the spicy range.' },
  { id: 2, name: 'Rohan Kapoor', initials: 'RK', phone: '+91 98110 88432', email: 'rohan.kapoor@icloud.com', location: 'South Delhi, DL', tag: 'Repeat buyer', status: 'Active', orders: 8, value: '₹9,840', lastOrder: 'Yesterday, 6:18 PM', favorite: 'Smoked Chicken Sausages', tone: 'sage', note: 'Usually shops family packs after 7pm.' },
  { id: 3, name: 'Ishita Malhotra', initials: 'IM', phone: '+91 99582 11307', email: 'ishita.m@outlook.com', location: 'Noida, UP', tag: 'New', status: 'Active', orders: 2, value: '₹2,190', lastOrder: '12 Aug, 1:08 PM', favorite: 'Cheese Chicken Momos', tone: 'sun', note: 'First order arrived smoothly. Follow up with a second-order offer.' },
  { id: 4, name: 'Vikram Singh', initials: 'VS', phone: '+91 98990 77651', email: 'vikram.singh@gmail.com', location: 'Dwarka, DL', tag: 'At risk', status: 'Paused', orders: 6, value: '₹7,230', lastOrder: '28 Jul, 8:30 PM', favorite: 'Achari Chicken Tikka', tone: 'blue', note: 'No activity in 30 days. Send a win-back message.' },
  { id: 5, name: 'Nisha Arora', initials: 'NA', phone: '+91 98711 24318', email: 'nisha.arora@gmail.com', location: 'Saket, DL', tag: 'Repeat buyer', status: 'Active', orders: 11, value: '₹14,670', lastOrder: '26 Jul, 11:15 AM', favorite: 'Mutton Galouti Kebab', tone: 'plum', note: 'High-value weekend customer.' },
  { id: 6, name: 'Kabir Bansal', initials: 'KB', phone: '+91 99991 63142', email: 'kabir.bansal@gmail.com', location: 'Vasant Kunj, DL', tag: 'New', status: 'Active', orders: 1, value: '₹890', lastOrder: '21 Jul, 4:20 PM', favorite: 'Chicken Cheese Poppers', tone: 'mint', note: 'Welcome journey in progress.' }
];

const nav = [
  ['Overview', '⌂'], ['Customers', '♧'], ['Orders', '▤'], ['Campaigns', '◌'], ['Products', '▦']
];

function App() {
  const [activeNav, setActiveNav] = useState('Customers');
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All customers');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');
  const selected = customers.find((customer) => customer.id === selectedId) || customers[0];

  const visibleCustomers = useMemo(() => customers.filter((customer) => {
    const matchesQuery = `${customer.name} ${customer.email} ${customer.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All customers' || customer.tag === filter;
    return matchesQuery && matchesFilter;
  }), [customers, query, filter]);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function addCustomer(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get('name');
    const email = form.get('email');
    const phone = form.get('phone');
    const newCustomer = { id: Date.now(), name, email, phone, initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(), location: 'Delhi NCR', tag: 'New', status: 'Active', orders: 0, value: '₹0', lastOrder: 'Not yet ordered', favorite: '—', tone: 'mint', note: 'Newly added contact.' };
    setCustomers([newCustomer, ...customers]);
    setSelectedId(newCustomer.id);
    setShowModal(false);
    showToast(`${name} added to your customers`);
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-mark"><span className="brand-symbol">A</span><div><strong>akira</strong><small>FRESH CRM</small></div></div>
      <div className="workspace-switcher"><span className="workspace-dot" /> <span>Akira Fresh</span><span className="chevron">⌄</span></div>
      <p className="nav-label">Workspace</p>
      <nav>{nav.map(([label, icon]) => <button key={label} onClick={() => setActiveNav(label)} className={activeNav === label ? 'nav-item active' : 'nav-item'}><span className="nav-icon">{icon}</span>{label}{label === 'Customers' && <span className="nav-count">248</span>}</button>)}</nav>
      <p className="nav-label">Manage</p>
      <nav><button className="nav-item"><span className="nav-icon">⚙</span>Settings</button><button className="nav-item"><span className="nav-icon">?</span>Help center</button></nav>
      <div className="sidebar-footer"><div className="user-avatar">SK</div><div><strong>Shreya Kapoor</strong><small>Administrator</small></div><span className="more">•••</span></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧<i /></button><div className="top-avatar">SK</div></div></header>
      <div className="page-wrap">
        {activeNav !== 'Customers' && <WorkspaceView section={activeNav} showToast={showToast} />}
        {activeNav === 'Customers' && <>
        <section className="page-heading"><div><p className="eyebrow">CUSTOMER RELATIONSHIP</p><h1>Customers <span className="heading-count">248</span></h1><p className="subheading">Know your regulars. Grow every relationship.</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => showToast('Import flow is ready for your CSV')}><span>↥</span> Import</button><button className="primary-button" onClick={() => setShowModal(true)}><span>＋</span> Add customer</button></div></section>
        <section className="metric-grid"><Metric label="Total customers" value="248" change="12.8%" detail="vs. last month" icon="♧" color="coral" /><Metric label="Repeat purchase rate" value="64.2%" change="8.4%" detail="vs. last month" icon="↻" color="sage" /><Metric label="Customer LTV" value="₹6,840" change="5.1%" detail="vs. last month" icon="↗" color="sun" /><Metric label="At risk" value="18" change="3.2%" detail="vs. last month" icon="!" color="blue" negative /></section>
        <section className="content-grid"><div className="customer-panel"><div className="panel-toolbar"><div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers..." /></div><div className="filter-row">{['All customers', 'VIP', 'Repeat buyer', 'At risk'].map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'filter-chip selected' : 'filter-chip'}>{item}{item === 'All customers' && <span>248</span>}</button>)}</div><button className="view-button">☷</button></div><div className="table-head"><span>Customer</span><span>Segment</span><span>Orders</span><span>Total spent</span><span>Last order</span><span /></div><div className="customer-list">{visibleCustomers.map((customer) => <button className={customer.id === selectedId ? 'customer-row selected-row' : 'customer-row'} key={customer.id} onClick={() => setSelectedId(customer.id)}><div className="customer-cell"><div className={`customer-avatar ${customer.tone}`}>{customer.initials}</div><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div><div><span className={`tag ${customer.tag.toLowerCase().replace(' ', '-')}`}>{customer.tag}</span></div><span className="muted-cell">{customer.orders}</span><strong>{customer.value}</strong><span className="muted-cell">{customer.lastOrder}</span><span className="row-more">•••</span></button>)}{visibleCustomers.length === 0 && <div className="empty-state">No customers match your search.</div>}</div><div className="panel-footer"><span>Showing <strong>{visibleCustomers.length}</strong> of 248 customers</span><div className="pagination"><button>‹</button><button className="page-active">1</button><button>2</button><button>3</button><button>...</button><button>25</button><button>›</button></div></div></div>
          <CustomerDetail customer={selected} onMessage={() => showToast(`Message queued for ${selected.name}`)} />
        </section>
        <section className="insight-strip"><div className="insight-icon">✦</div><div><strong>Retention opportunity</strong><p>18 customers haven't ordered in 30+ days. A small nudge could bring them back.</p></div><button onClick={() => { setFilter('At risk'); showToast('Showing at-risk customers'); }}>View at-risk customers <span>→</span></button></section>
        </>}
      </div>
    </main>
    {showModal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowModal(false)}><form className="modal" onSubmit={addCustomer}><button type="button" className="modal-close" onClick={() => setShowModal(false)}>×</button><p className="eyebrow">NEW RELATIONSHIP</p><h2>Add customer</h2><p className="modal-copy">Start a new customer profile for Akira Fresh.</p><label>Full name<input name="name" required placeholder="e.g. Priya Sharma" /></label><label>Email address<input name="email" type="email" required placeholder="priya@email.com" /></label><label>Phone number<input name="phone" required placeholder="+91 98xxx xxxxx" /></label><button className="primary-button full-width">Create customer <span>→</span></button></form></div>}
    {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
  </div>;
}

function WorkspaceView({ section, showToast }) {
  const copy = {
    Overview: ['AKIRA FRESH / OPERATIONS', 'Good afternoon, Shreya', 'Here is what is happening across your customer experience today.'],
    Orders: ['FULFILMENT / COLD CHAIN', 'Orders', 'Keep every Delhi NCR delivery moving smoothly.'],
    Campaigns: ['RETENTION / OUTREACH', 'Campaigns', 'Turn your best products into reasons to come back.'],
    Products: ['CATALOG / PRODUCT MIX', 'Products', 'Track the ranges your customers love most.']
  }[section];
  const rows = section === 'Orders'
    ? [['#AF-1048', 'Ananya Mehta', 'Chicken Seekh Kebab', '₹1,420', 'Out for delivery'], ['#AF-1047', 'Rohan Kapoor', 'Family Pack / 1kg', '₹2,190', 'Packed'], ['#AF-1046', 'Ishita Malhotra', 'Cheese Chicken Momos', '₹890', 'Delivered']]
    : section === 'Campaigns'
      ? [['Weekend Grill Club', 'Repeat buyers', 'WhatsApp', '64%', 'Active'], ['Your freezer, upgraded', 'New customers', 'Email', '28%', 'Draft'], ['We miss you', 'At risk', 'WhatsApp', '41%', 'Scheduled']]
      : [['Chicken Snacks', 'Chicken Cheese Poppers', '48 SKUs', '₹3.2L', 'In stock'], ['Kebabs', 'Chicken Seekh Kebab', '32 SKUs', '₹2.4L', 'In stock'], ['Momos', 'Cheese Chicken Momos', '18 SKUs', '₹1.1L', 'Low stock']];
  const headings = section === 'Orders' ? ['Order', 'Customer', 'Product', 'Value', 'Status'] : section === 'Campaigns' ? ['Campaign', 'Audience', 'Channel', 'Open rate', 'Status'] : ['Category', 'Top product', 'Range', 'Revenue', 'Inventory'];
  const action = section === 'Orders' ? 'New order' : section === 'Campaigns' ? 'New campaign' : 'Add product';
  if (section === 'Overview') return <><section className="page-heading"><div><p className="eyebrow">{copy[0]}</p><h1>{copy[1]}</h1><p className="subheading">{copy[2]}</p></div><button className="primary-button" onClick={() => showToast('Report exported successfully')}>↧ Export report</button></section><section className="metric-grid"><Metric label="Today's revenue" value="₹42,680" change="18.4%" detail="vs. yesterday" icon="↗" color="coral" /><Metric label="Orders today" value="86" change="12.1%" detail="vs. yesterday" icon="▤" color="sage" /><Metric label="Active customers" value="230" change="4.8%" detail="this month" icon="♧" color="sun" /><Metric label="Open tickets" value="7" change="2" detail="need attention" icon="!" color="blue" negative /></section><section className="insight-strip"><div className="insight-icon">✦</div><div><strong>Today’s best signal</strong><p>Repeat customers are ordering 1.8× more family packs this week.</p></div><button onClick={() => showToast('Campaign brief created')}>Create campaign <span>→</span></button></section></>;
  return <><section className="page-heading"><div><p className="eyebrow">{copy[0]}</p><h1>{copy[1]}</h1><p className="subheading">{copy[2]}</p></div><button className="primary-button" onClick={() => showToast(`${action} flow opened`)}>＋ {action}</button></section><div className="workspace-card table-workspace"><div className="card-heading"><div><strong>{section === 'Orders' ? 'Recent orders' : section === 'Campaigns' ? 'Your campaigns' : 'Product catalogue'}</strong><small>{rows.length} records updated today</small></div><button className="secondary-button" onClick={() => showToast('Export prepared')}>↧ Export</button></div><div className="workspace-table"><div className="workspace-table-head">{headings.map((heading) => <span key={heading}>{heading}</span>)}</div>{rows.map((row) => <button className="workspace-table-row" key={row[0]} onClick={() => showToast(`${row[0]} selected`)}>{row.map((value, index) => <span className={index === row.length - 1 ? 'status-text' : ''} key={`${row[0]}-${index}`}>{value}</span>)}</button>)}</div></div><section className="insight-strip"><div className="insight-icon">✦</div><div><strong>Akira Fresh playbook</strong><p>{section === 'Orders' ? 'Cold-chain handoffs are on track. 94% of today’s orders are within SLA.' : section === 'Campaigns' ? 'WhatsApp is your strongest channel. Keep the next offer personal and product-led.' : 'Your top categories are ready for a fresh bundle or weekend flash sale.'}</p></div><button onClick={() => showToast('Action saved')}>Take action <span>→</span></button></section></>;
}

function Metric({ label, value, change, detail, icon, color, negative }) { return <div className="metric-card"><div className={`metric-icon ${color}`}>{icon}</div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><p className={negative ? 'negative' : ''}><b>{negative ? '↓' : '↑'} {change}</b> {detail}</p></div><span className="metric-arrow">↗</span></div>; }
function CustomerDetail({ customer, onMessage }) { return <aside className="detail-panel"><div className="detail-header"><p>Customer profile</p><button>•••</button></div><div className="profile-intro"><div className={`profile-avatar ${customer.tone}`}>{customer.initials}</div><h2>{customer.name}</h2><span className={`tag ${customer.tag.toLowerCase().replace(' ', '-')}`}>{customer.tag}</span><p>{customer.location}</p></div><div className="detail-actions"><button onClick={onMessage}>✉ Message</button><button onClick={() => alert('Order creation flow opened')}>＋ New order</button></div><div className="detail-section"><div className="section-title"><strong>Contact details</strong><button>✎</button></div><p className="contact-line"><span>✉</span>{customer.email}</p><p className="contact-line"><span>♧</span>{customer.phone}</p></div><div className="detail-section"><div className="section-title"><strong>Customer snapshot</strong><button>↗</button></div><div className="snapshot-grid"><div><span>Orders</span><strong>{customer.orders}</strong></div><div><span>Total spent</span><strong>{customer.value}</strong></div><div><span>Last order</span><strong>{customer.lastOrder.split(',')[0]}</strong></div><div><span>Favorite</span><strong>{customer.favorite}</strong></div></div></div><div className="detail-section note-section"><div className="section-title"><strong>Team note</strong><button>✎</button></div><p>{customer.note}</p></div><button className="profile-link">Open full profile <span>→</span></button></aside>; }

export default App;
