import React, { useState } from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import OverviewDashboard from './components/overview/OverviewDashboard';
import CustomersView from './components/customers/CustomersView';
import OrdersView from './components/orders/OrdersView';
import ProductsView from './components/products/ProductsView';
import CampaignsView from './components/campaigns/CampaignsView';
import LogisticsView from './components/logistics/LogisticsView';
import SettingsView from './components/settings/SettingsView';
import { Check, Info, AlertTriangle } from 'lucide-react';

function CrmApp() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [selectedCustomerForOrder, setSelectedCustomerForOrder] = useState(null);
  const { toast } = useCrm();

  const handleCreateOrderForCustomer = (customer) => {
    setSelectedCustomerForOrder(customer);
    setActiveNav('Orders');
  };

  const handleGlobalSearch = (term) => {
    setActiveNav('Customers');
  };

  return (
    <div className="app-shell">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="main-content">
        <Header
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onGlobalSearch={handleGlobalSearch}
        />

        <div className="page-wrap">
          {activeNav === 'Overview' && (
            <OverviewDashboard onNavigate={(nav) => setActiveNav(nav)} />
          )}

          {activeNav === 'Customers' && (
            <CustomersView onSelectCreateOrder={handleCreateOrderForCustomer} />
          )}

          {activeNav === 'Orders' && (
            <OrdersView initialSelectedCustomer={selectedCustomerForOrder} />
          )}

          {activeNav === 'Products' && <ProductsView />}

          {activeNav === 'Campaigns' && <CampaignsView />}

          {activeNav === 'Logistics' && <LogisticsView />}

          {activeNav === 'Settings' && <SettingsView />}
        </div>
      </main>

      {/* Global Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type || 'success'}`}>
          <span className="toast-icon">
            {toast.type === 'error' ? (
              <AlertTriangle size={14} />
            ) : toast.type === 'info' ? (
              <Info size={14} />
            ) : (
              <Check size={14} />
            )}
          </span>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CrmProvider>
      <CrmApp />
    </CrmProvider>
  );
}
