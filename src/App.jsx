import React, { useState } from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import AppFooter from './components/common/AppFooter';
import MobileBottomNav from './components/common/MobileBottomNav';
import AdminProfileModal from './components/common/AdminProfileModal';
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toast, isProfileModalOpen, setIsProfileModalOpen } = useCrm();

  const handleCreateOrderForCustomer = (customer) => {
    setSelectedCustomerForOrder(customer);
    setActiveNav('Orders');
  };

  const handleGlobalSearch = (term) => {
    setActiveNav('Customers');
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <main className="main-content">
        <Header
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onGlobalSearch={handleGlobalSearch}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isMobileSidebarOpen={isMobileSidebarOpen}
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

          {/* Responsive Global Footer */}
          <AppFooter onNavigate={(nav) => setActiveNav(nav)} />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Admin Profile Modal */}
      {isProfileModalOpen && (
        <AdminProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}

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
