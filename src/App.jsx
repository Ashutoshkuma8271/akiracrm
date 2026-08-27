import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  const [selectedCategoryForProducts, setSelectedCategoryForProducts] = useState('All');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toast, isProfileModalOpen, setIsProfileModalOpen } = useCrm();

  const handleCreateOrderForCustomer = (customer) => {
    setSelectedCustomerForOrder(customer);
    setActiveNav('Orders');
  };

  const handleNavigateToCategory = (categoryName) => {
    setSelectedCategoryForProducts(categoryName);
    setActiveNav('Products');
  };

  const handleGlobalSearch = (term) => {
    setGlobalSearchQuery(term);
    setActiveNav('Customers');
  };

  return (
    <div className="app-shell" id="akira-crm-root">
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="page-animated-inner"
            >
              {activeNav === 'Overview' && (
                <OverviewDashboard
                  onNavigate={(nav) => setActiveNav(nav)}
                  onSelectCategory={handleNavigateToCategory}
                />
              )}

              {activeNav === 'Customers' && (
                <CustomersView
                  initialSearchQuery={globalSearchQuery}
                  onSelectCreateOrder={handleCreateOrderForCustomer}
                />
              )}

              {activeNav === 'Orders' && (
                <OrdersView initialSelectedCustomer={selectedCustomerForOrder} />
              )}

              {activeNav === 'Products' && (
                <ProductsView initialCategory={selectedCategoryForProducts} />
              )}

              {activeNav === 'Campaigns' && <CampaignsView />}

              {activeNav === 'Logistics' && <LogisticsView />}

              {activeNav === 'Settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>

          {/* Responsive Global Footer */}
          <AppFooter onNavigate={(nav) => setActiveNav(nav)} />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Admin Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <AdminProfileModal onClose={() => setIsProfileModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`toast toast-${toast.type || 'success'}`}
            role="status"
            aria-live="polite"
          >
            <span className="toast-icon">
              {toast.type === 'error' ? (
                <AlertTriangle size={15} />
              ) : toast.type === 'info' ? (
                <Info size={15} />
              ) : (
                <Check size={15} />
              )}
            </span>
            <span className="toast-message">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
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
