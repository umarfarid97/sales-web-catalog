import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrandValuesFooter } from './components/common/BrandValuesFooter';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthModal } from './components/common/AuthModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { AccountPage } from './components/customer/AccountPage';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/pdp.css';
import './styles/admin.css';

export const AccountPageContent = () => {
  return <AccountPage />;
};

const AccountLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Sticky Header */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main style={{ flex: 1 }}>
        <AccountPageContent />
      </main>

      {/* Brand Values 5 Icons Banner */}
      <BrandValuesFooter />

      {/* Universal Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Overlays & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function AccountApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <AccountLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
