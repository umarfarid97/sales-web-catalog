import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthModal } from './components/common/AuthModal';

// Admin Components
import { AdminHeader } from './components/admin/AdminHeader';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { ProductManager } from './components/admin/ProductManager';
import { ProductFormModal } from './components/admin/ProductFormModal';
import { OrderManager } from './components/admin/OrderManager';
import { OrderDetailModal } from './components/admin/OrderDetailModal';
import { InventoryAlerts } from './components/admin/InventoryAlerts';
import { AttributesManager } from './components/admin/AttributesManager';
import { Shield, ArrowLeft } from 'lucide-react';


// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/admin.css';

const AdminLayout = () => {
  const { adminTab } = useStore();
  const { currentUser, isAuthenticated, isAdmin, openAuthModal } = useAuth();

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fdfdfd', color: '#0b0c10' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1.5rem, 4vw, 3rem) 1rem' }}>
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
        </main>
        <Footer />
        <AuthModal />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <div className="admin-portal-wrapper">
          <div className="container">
            <AdminHeader />

            {adminTab === 'analytics' && <AnalyticsDashboard />}
            {adminTab === 'products' && <ProductManager />}
            {adminTab === 'orders' && <OrderManager />}
            {adminTab === 'inventory' && <InventoryAlerts />}
            {adminTab === 'attributes' && <AttributesManager />}
          </div>

        </div>
      </main>

      <Footer />

      <ProductFormModal />
      <OrderDetailModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function AdminApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <AdminLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
