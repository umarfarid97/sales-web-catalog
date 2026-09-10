import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrandValuesFooter } from './components/common/BrandValuesFooter';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthModal } from './components/common/AuthModal';
import { Shield, ArrowLeft } from 'lucide-react';

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
import { CheckoutPageContent } from './CheckoutApp';

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
  const { role, adminTab, customerView } = useStore();
  const { currentUser, isAuthenticated, isAdmin, openAuthModal } = useAuth();

  const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = new URLSearchParams(search);
  const genderQuery = params.get('gender');
  const viewQuery = params.get('view');
  const productQuery = params.get('product');

  const isAdminRoute = pathname.includes('admin');
  const showAdminPortal = (role === 'admin' || isAdminRoute) && isAdmin;

  // Product detail condition - highest priority when a product is requested
  const isProduct = Boolean(productQuery) || pathname.includes('product') || customerView === 'product';

  // Category & collection conditions - only active when NOT viewing a specific product
  const isWomen = !isProduct && (pathname.includes('women') || (genderQuery?.toLowerCase() === 'women' && !productQuery));
  const isMen = !isProduct && !isWomen && (pathname.includes('men.html') || pathname.endsWith('/men') || pathname === '/men' || (genderQuery?.toLowerCase() === 'men' && !productQuery));
  const isCollection = !isProduct && (pathname.includes('collection') || customerView === 'collection');
  const isBundle = !isProduct && (pathname.includes('bundle') || customerView === 'bundle');
  const isDiagnostic = !isProduct && (pathname.includes('diagnostic') || viewQuery === 'diagnostic' || customerView === 'diagnostic');
  const isCheckout = pathname.includes('checkout') || customerView === 'checkout';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Universal Sticky Header with Role Switcher */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main style={{ flex: 1 }}>
        {isAdminRoute && !isAdmin ? (
          /* ================= RESTRICTED ADMIN AREA ================= */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1.5rem, 4vw, 3rem) 1rem', minHeight: '60vh' }}>
            <div style={{ maxWidth: '460px', width: '100%', textAlign: 'center', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#b45309' }}>
                <Shield size={32} />
              </div>

              {isAuthenticated ? (
                <>
                  <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.5rem', color: '#0b0c10', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    Restricted Administrator Area
                  </h2>
                  <p style={{ color: '#4b5563', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                    You are signed in as <strong style={{ color: '#b45309' }}>{currentUser?.email}</strong>. This account does not have administrator privileges.
                  </p>
                  <a
                    href="/"
                    className="admin-btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '14px', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    Return to Store
                  </a>
                </>
              ) : (
                <>
                  <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.6rem', color: '#0b0c10', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    Store Admin Access
                  </h2>
                  <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                    Authentication required. Please sign in with administrator credentials to manage inventory and customer orders.
                  </p>
                  <button
                    className="admin-btn-primary"
                    onClick={() => openAuthModal({ mode: 'signin', title: 'Store Admin Sign In' })}
                    style={{ width: '100%', padding: '14px', borderRadius: '4px', marginBottom: '1rem', cursor: 'pointer' }}
                  >
                    Sign In as Administrator
                  </button>
                  <a
                    href="/"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.84rem', textDecoration: 'none', marginTop: '0.5rem' }}
                  >
                    <ArrowLeft size={14} /> Return to Store
                  </a>
                </>
              )}
            </div>
          </div>
        ) : showAdminPortal ? (
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
        ) : (
          /* ================= CUSTOMER STOREFRONT ================= */
          <div className="customer-store-view">
            {isCheckout ? (
              <CheckoutPageContent />
            ) : isProduct ? (
              <ProductDetailPage />
            ) : isWomen ? (
              <WomenCollectionContent />
            ) : isMen ? (
              <MenCollectionContent />
            ) : isCollection ? (
              <CollectionPageContent />
            ) : isBundle ? (
              <BundleBuilderContent />
            ) : isDiagnostic ? (
              <FragranceDiagnostic />
            ) : (
              <ProductCatalog />
            )}
          </div>
        )}
      </main>

      {/* Brand Values 5 Icons Banner */}
      <BrandValuesFooter />

      {/* Universal Footer */}
      <Footer />

      {/* Mobile Bottom Navigation (hidden on checkout for distraction-free ordering) */}
      {!isCheckout && <MobileBottomNav />}

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
