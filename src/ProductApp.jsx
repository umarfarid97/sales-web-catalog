import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthModal } from './components/common/AuthModal';

// Customer PDP & Overlays
import { ProductDetailPage } from './components/customer/ProductDetailPage';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/pdp.css';
import './styles/admin.css';

const ProductPageLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Boutique Sticky Header */}
      <Navbar />

      {/* Dedicated Standalone Product Viewport */}
      <main style={{ flex: 1 }}>
        <div className="customer-store-view">
          <ProductDetailPage />
        </div>
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Universal Interactive Overlays & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function ProductApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <ProductPageLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
