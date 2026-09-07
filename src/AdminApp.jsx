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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0d14', color: '#ffffff' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '460px', width: '100%', textAlign: 'center', background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '2.5rem 2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.15)', border: '1px solid #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#f59e0b' }}>
              <Shield size={32} />
            </div>

            {isAuthenticated ? (
              <>
                <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  Restricted Administrator Area
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  You are signed in as <strong style={{ color: '#f59e0b' }}>{currentUser?.email}</strong>. This account does not have Maison Valenszo atelier administrator privileges.
                </p>
                <a
                  href="/"
                  className="dior-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', background: '#d97706', color: '#ffffff', padding: '14px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem', textDecoration: 'none' }}
                >
                  Return to Boutique Storefront
                </a>
              </>
            ) : (
              <>
                <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.6rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  Atelier Administrator Access
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  Authentication required. Please sign in with Maison Valenszo administrative credentials to manage inventory and client orders.
                </p>
                <button
                  className="dior-btn"
                  onClick={() => openAuthModal({ mode: 'signin', title: 'Atelier Administrator Sign In' })}
                  style={{ width: '100%', background: '#d97706', color: '#ffffff', padding: '14px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem', border: 'none', cursor: 'pointer' }}
                >
                  Sign In as Administrator
                </button>
                <a
                  href="/"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '0.84rem', textDecoration: 'none', marginTop: '0.5rem' }}
                >
                  <ArrowLeft size={14} /> Return to Customer Storefront
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
