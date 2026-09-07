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

  // CRITICAL: "women" contains the substring "men". Must check women first with precedence!
  const isWomen = pathname.includes('women') || genderQuery?.toLowerCase() === 'women';
  const isMen = !isWomen && (pathname.includes('men.html') || pathname.endsWith('/men') || pathname === '/men' || genderQuery?.toLowerCase() === 'men');
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
                    You are signed in as <strong style={{ color: '#b45309' }}>{currentUser?.email}</strong>. This account does not have Maison Valenszo atelier administrator privileges.
                  </p>
                  <a
                    href="/"
                    className="admin-btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '14px', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    Return to Boutique Storefront
                  </a>
                </>
              ) : (
                <>
                  <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.6rem', color: '#0b0c10', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    Atelier Administrator Access
                  </h2>
                  <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                    Authentication required. Please sign in with Maison Valenszo administrative credentials to manage inventory and client orders.
                  </p>
                  <button
                    className="admin-btn-primary"
                    onClick={() => openAuthModal({ mode: 'signin', title: 'Atelier Administrator Sign In' })}
                    style={{ width: '100%', padding: '14px', borderRadius: '4px', marginBottom: '1rem', cursor: 'pointer' }}
                  >
                    Sign In as Administrator
                  </button>
                  <a
                    href="/"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.84rem', textDecoration: 'none', marginTop: '0.5rem' }}
                  >
                    <ArrowLeft size={14} /> Return to Customer Storefront
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
            {isWomen ? (
              <WomenCollectionContent />
            ) : isMen ? (
              <MenCollectionContent />
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
