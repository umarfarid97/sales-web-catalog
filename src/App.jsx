import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrandValuesFooter } from './components/common/BrandValuesFooter';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthModal } from './components/common/AuthModal';

// Customer Components
import { ProductCatalog } from './components/customer/ProductCatalog';
import { FragranceDiagnostic } from './components/customer/FragranceDiagnostic';
import { ProductDetailPage } from './components/customer/ProductDetailPage';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';

// Dedicated Layouts for Route-Aware Rendering
import { MenCollectionContent } from './MenApp';
import { WomenCollectionContent } from './WomenApp';
import { CollectionPageContent } from './CollectionApp';
import { BundleBuilderContent } from './BundleApp';

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
import './styles/pdp.css';
import './styles/admin.css';

const MainLayout = () => {
  const { role, adminTab, customerView, activeGender } = useStore();

  const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = new URLSearchParams(search);
  const genderQuery = params.get('gender');
  const viewQuery = params.get('view');
  const productQuery = params.get('product');

  // Men collection condition
  const isMen = pathname.includes('men') || genderQuery === 'Men';
  // Women collection condition
  const isWomen = pathname.includes('women') || genderQuery === 'Women';
  // All collections condition
  const isCollection = pathname.includes('collection') || customerView === 'collection';
  // Bundle condition
  const isBundle = pathname.includes('bundle') || customerView === 'bundle';
  // Diagnostic quiz condition
  const isDiagnostic = pathname.includes('diagnostic') || viewQuery === 'diagnostic' || customerView === 'diagnostic';
  // Product detail condition
  const isProduct = pathname.includes('product') || Boolean(productQuery) || customerView === 'product';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Universal Sticky Header with Role Switcher */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main style={{ flex: 1 }}>
        {role === 'customer' ? (
          /* ================= CUSTOMER STOREFRONT ================= */
          <div className="customer-store-view">
            {isMen ? (
              <MenCollectionContent />
            ) : isWomen ? (
              <WomenCollectionContent />
            ) : isCollection ? (
              <CollectionPageContent />
            ) : isBundle ? (
              <BundleBuilderContent />
            ) : isDiagnostic ? (
              <FragranceDiagnostic />
            ) : isProduct ? (
              <ProductDetailPage />
            ) : (
              <ProductCatalog />
            )}
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

      {/* Brand Values 5 Icons Banner */}
      <BrandValuesFooter />

      {/* Universal Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Overlays & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <AuthModal />
      <ProductFormModal />
      <OrderDetailModal />
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <MainLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
