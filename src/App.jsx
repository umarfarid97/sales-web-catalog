import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Customer Components
import { HeroBanner } from './components/customer/HeroBanner';
import { CategoryFilter } from './components/customer/CategoryFilter';
import { ProductCatalog } from './components/customer/ProductCatalog';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';

// Admin Components
import { AdminHeader } from './components/admin/AdminHeader';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { ProductManager } from './components/admin/ProductManager';
import { ProductFormModal } from './components/admin/ProductFormModal';
import { OrderManager } from './components/admin/OrderManager';
import { OrderDetailModal } from './components/admin/OrderDetailModal';
import { InventoryAlerts } from './components/admin/InventoryAlerts';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/admin.css';

const MainLayout = () => {
  const { role, adminTab } = useStore();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Universal Sticky Header with Role Switcher */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main style={{ flex: 1 }}>
        {role === 'customer' ? (
          /* ================= CUSTOMER STOREFRONT ================= */
          <div className="customer-store-view">
            <HeroBanner />
            <CategoryFilter />
            <ProductCatalog />
          </div>
        ) : (
          /* ================= ADMIN MANAGEMENT PORTAL ================= */
          <div className="admin-portal-wrapper">
            <div className="container">
              <AdminHeader />

              {/* Subtab Views */}
              {adminTab === 'analytics' && <AnalyticsDashboard />}
              {adminTab === 'products' && <ProductManager />}
              {adminTab === 'orders' && <OrderManager />}
              {adminTab === 'inventory' && <InventoryAlerts />}
            </div>
          </div>
        )}
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Overlays & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <ProductFormModal />
      <OrderDetailModal />
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
