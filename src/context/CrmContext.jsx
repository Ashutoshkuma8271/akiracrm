import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCustomers,
  initialOrders,
  initialProducts,
  initialCampaigns,
  initialColdChainHubs,
  initialStoreSettings,
  initialAdminProfile,
  staffTeamList
} from '../data/mockData';

const CrmContext = createContext();

export function CrmProvider({ children }) {
  // Helper for safe JSON loading
  const safeLoad = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
      console.warn(`Error reading localStorage for ${key}:`, e);
      return fallback;
    }
  };

  // Admin Profile & Active Staff Member
  const [adminProfile, setAdminProfile] = useState(() => safeLoad('akira_admin_profile', initialAdminProfile));

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Customers
  const [customers, setCustomers] = useState(() => safeLoad('akira_customers', initialCustomers));

  // Orders
  const [orders, setOrders] = useState(() => safeLoad('akira_orders', initialOrders));

  // Products
  const [products, setProducts] = useState(() => safeLoad('akira_products', initialProducts));

  // Campaigns
  const [campaigns, setCampaigns] = useState(() => safeLoad('akira_campaigns', initialCampaigns));

  // Logistics Hubs
  const [hubs, setHubs] = useState(() => safeLoad('akira_hubs', initialColdChainHubs));

  // Settings
  const [settings, setSettings] = useState(() => safeLoad('akira_settings', initialStoreSettings));

  // UI state
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Cold-Chain Delivery Dispatched',
      message: 'Van #04 departed Gurugram Hub with Order #AF-1049 (Pooja Verma)',
      time: '10 mins ago',
      type: 'delivery',
      read: false
    },
    {
      id: 'notif-2',
      title: 'New High-Value Order Placed',
      message: 'Order #AF-1048 by VIP customer Ananya Mehta (₹1,340)',
      time: '45 mins ago',
      type: 'order',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Low Stock Warning',
      message: 'Mutton Galouti Kebab is down to 15 units. Consider restocking blast freezer.',
      time: '2 hours ago',
      type: 'inventory',
      read: true
    }
  ]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('akira_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('akira_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('akira_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('akira_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('akira_hubs', JSON.stringify(hubs));
  }, [hubs]);

  useEffect(() => {
    localStorage.setItem('akira_settings', JSON.stringify(settings));
  }, [settings]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Mark all notifications as read
  const markNotificationsRead = () => {
    setNotifications((prev) => (prev || []).map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // Customer Operations
  const addCustomer = (customerData) => {
    const initials = customerData.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: customerData.name,
      initials: initials || 'AF',
      phone: customerData.phone,
      email: customerData.email,
      location: customerData.location || 'Delhi NCR',
      zone: customerData.zone || 'South Delhi',
      tag: customerData.tag || 'New',
      status: customerData.status || 'Active',
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toISOString(),
      favoriteProduct: customerData.favoriteProduct || 'Chicken Momos',
      tone: ['coral', 'sage', 'sun', 'blue', 'plum', 'mint'][Math.floor(Math.random() * 6)],
      notes: customerData.notes || 'Newly added customer profile.',
      dietaryPreference: customerData.dietaryPreference || 'Blast-Frozen Ready-to-cook',
      registeredDate: new Date().toISOString().split('T')[0]
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`Added ${newCustomer.name} to Akira Fresh CRM`);
    return newCustomer;
  };

  const updateCustomer = (id, updatedFields) => {
    setCustomers((prev) =>
      prev.map((cust) => (cust.id === id ? { ...cust, ...updatedFields } : cust))
    );
    showToast('Customer profile updated');
  };

  const deleteCustomer = (id) => {
    const customer = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast(`Removed customer ${customer ? customer.name : ''}`, 'info');
  };

  const addCustomerNote = (id, noteText) => {
    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id === id) {
          const timestamp = new Date().toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric'
          });
          const newNotes = cust.notes
            ? `${cust.notes}\n[${timestamp}]: ${noteText}`
            : `[${timestamp}]: ${noteText}`;
          return { ...cust, notes: newNotes };
        }
        return cust;
      })
    );
    showToast('Team note recorded');
  };

  // Orders Operations
  const createOrder = (orderData) => {
    const orderNumber = 1000 + orders.length + 1;
    const newOrder = {
      id: `AF-${orderNumber}`,
      orderNumber,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress,
      zone: orderData.zone || 'South Delhi',
      items: orderData.items,
      subtotal: orderData.subtotal,
      discountAmount: orderData.discountAmount || 0,
      deliveryFee: orderData.deliveryFee || 0,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: orderData.paymentStatus || 'Paid',
      status: 'Placed',
      slot: orderData.slot || 'Today, 04:00 PM - 07:00 PM',
      createdAt: new Date().toISOString(),
      riderName: 'Assigning Cold-Chain Rider...',
      riderPhone: '-',
      temperatureLog: '-19.0°C (Pre-chill ready)',
      notes: orderData.notes || 'Blast-frozen cold-chain shipment.'
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update customer stats
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === orderData.customerId) {
          return {
            ...c,
            ordersCount: c.ordersCount + 1,
            totalSpent: c.totalSpent + newOrder.totalAmount,
            lastOrderDate: new Date().toISOString(),
            tag: c.ordersCount + 1 > 5 ? 'VIP' : 'Repeat buyer'
          };
        }
        return c;
      })
    );

    // Adjust product inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const item = orderData.items.find((i) => i.productId === prod.id);
        if (item) {
          return { ...prod, stock: Math.max(0, prod.stock - item.qty) };
        }
        return prod;
      })
    );

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Order Placed',
        message: `Order #${newOrder.id} (${newOrder.customerName}) for ₹${newOrder.totalAmount}`,
        time: 'Just now',
        type: 'order',
        read: false
      },
      ...prev
    ]);

    showToast(`Order #${newOrder.id} created successfully`);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let rider = ord.riderName;
          let tempLog = ord.temperatureLog;
          if (newStatus === 'Cold-Chain Transit' && ord.riderName.includes('Assigning')) {
            rider = 'Devinder Singh (Van #01)';
            tempLog = '-18.8°C (Verified in transit)';
          } else if (newStatus === 'Delivered') {
            tempLog = '-18.5°C (Delivered intact)';
          }
          return { ...ord, status: newStatus, riderName: rider, temperatureLog: tempLog };
        }
        return ord;
      })
    );
    showToast(`Order #${orderId} marked as ${newStatus}`);
  };

  // Products Operations
  const addProduct = (prodData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      sku: prodData.sku || `AF-${prodData.category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-2)}`,
      name: prodData.name,
      category: prodData.category || 'Chicken Snacks',
      price: Number(prodData.price) || 199,
      originalPrice: Number(prodData.originalPrice) || Number(prodData.price) * 1.15,
      discountPercent: Number(prodData.discountPercent) || 0,
      rating: 4.8,
      reviewsCount: 1,
      stock: Number(prodData.stock) || 30,
      unit: prodData.unit || 'Pack',
      isBestseller: Boolean(prodData.isBestseller),
      isFlashSale: Boolean(prodData.isFlashSale),
      blastFrozen: true,
      description: prodData.description || 'Premium frozen snack prepared for instant cooking.',
      protein: prodData.protein || '20g protein / 100g'
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added to catalog`);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updatedFields } : prod))
    );
    showToast('Product catalog updated');
  };

  const adjustStock = (id, changeAmount) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const newStock = Math.max(0, prod.stock + changeAmount);
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );
    showToast('Stock level updated');
  };

  // Campaigns Operations
  const createCampaign = (campaignData) => {
    const newCampaign = {
      id: `camp-${Date.now()}`,
      title: campaignData.title,
      targetSegment: campaignData.targetSegment || 'All',
      channel: campaignData.channel || 'WhatsApp',
      openRate: '0%',
      clickRate: '0%',
      status: 'Active',
      sentCount: campaignData.audienceSize || 85,
      conversions: 0,
      revenueGenerated: 0,
      couponCode: campaignData.couponCode || 'FRESH10',
      discount: campaignData.discount || '10% OFF',
      messageTemplate: campaignData.messageTemplate || ''
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    showToast(`Campaign "${newCampaign.title}" launched on ${newCampaign.channel}`);
    return newCampaign;
  };

  // Reset to demo data
  const resetDemoData = () => {
    setCustomers(initialCustomers);
    setOrders(initialOrders);
    setProducts(initialProducts);
    setCampaigns(initialCampaigns);
    setHubs(initialColdChainHubs);
    setSettings(initialStoreSettings);
    localStorage.clear();
    showToast('Demo data restored successfully', 'info');
  };

  // Export JSON backup
  const exportJsonBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      store: settings,
      customers,
      orders,
      products,
      campaigns,
      hubs
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `akira-fresh-crm-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Full CRM backup downloaded');
  };

  // Persist admin profile
  useEffect(() => {
    localStorage.setItem('akira_admin_profile', JSON.stringify(adminProfile));
  }, [adminProfile]);

  // Update admin profile
  const updateAdminProfile = (updates) => {
    setAdminProfile((prev) => ({ ...prev, ...updates }));
    showToast('Admin profile updated successfully');
  };

  // Switch active staff member
  const switchAdminStaff = (staffId) => {
    const found = staffTeamList.find((s) => s.id === staffId);
    if (found) {
      setAdminProfile((prev) => ({
        ...prev,
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        role: found.role,
        hubAssigned: found.hubAssigned,
        avatarInitials: found.avatarInitials,
        avatarColor: found.avatarColor,
        fssaiSupervisorId: found.fssaiSupervisorId || prev.fssaiSupervisorId,
        shift: found.shift || prev.shift
      }));
      showToast(`Switched active operator to ${found.name}`);
    }
  };

  return (
    <CrmContext.Provider
      value={{
        adminProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        staffTeamList,
        updateAdminProfile,
        switchAdminStaff,
        customers,
        orders,
        products,
        campaigns,
        hubs,
        settings,
        toast,
        notifications,
        showToast,
        markNotificationsRead,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addCustomerNote,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        adjustStock,
        createCampaign,
        updateSettings: (newSettings) => {
          setSettings((prev) => ({ ...prev, ...newSettings }));
          showToast('Store settings saved');
        },
        resetDemoData,
        exportJsonBackup
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
}
