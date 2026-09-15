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
// Customer Components
import { ProductCatalog } from './components/customer/ProductCatalog';
import { FragranceDiagnostic } from './components/customer/FragranceDiagnostic';
import { ProductDetailPage } from './components/customer/ProductDetailPage';
import { ProductDetailModal } from './components/customer/ProductDetailModal';

// Dedicated Layouts for Route-Aware Rendering
import { MenCollectionContent } from './MenApp';
import { WomenCollectionContent } from './WomenApp';
import { CollectionPageContent } from './CollectionApp';
import { CheckoutPageContent } from './CheckoutApp';
import { AccountPageContent } from './AccountApp';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/pdp.css';

const MainLayout = () => {
  const { customerView } = useStore();

  const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = new URLSearchParams(search);
  const genderQuery = params.get('gender');
  const viewQuery = params.get('view');
  const productQuery = params.get('product');

  // Product detail condition - highest priority when a product is requested
  const isProduct = Boolean(productQuery) || pathname.includes('product') || customerView === 'product';

  // Category & collection conditions - only active when NOT viewing a specific product
  const isWomen = !isProduct && (pathname.includes('women') || (genderQuery?.toLowerCase() === 'women' && !productQuery));
  const isMen = !isProduct && !isWomen && (pathname.includes('men.html') || pathname.endsWith('/men') || pathname === '/men' || (genderQuery?.toLowerCase() === 'men' && !productQuery));
  const isCollection = !isProduct && (pathname.includes('collection') || customerView === 'collection');
  const isDiagnostic = !isProduct && (pathname.includes('diagnostic') || viewQuery === 'diagnostic' || customerView === 'diagnostic');
  const isCheckout = pathname.includes('checkout') || customerView === 'checkout';
  const isAccount = pathname.includes('account') || customerView === 'account';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Universal Sticky Header */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main style={{ flex: 1 }}>
        <div className="customer-store-view">
          {isCheckout ? (
            <CheckoutPageContent />
          ) : isAccount ? (
            <AccountPageContent />
          ) : isProduct ? (
            <ProductDetailPage />
          ) : isWomen ? (
            <WomenCollectionContent />
          ) : isMen ? (
            <MenCollectionContent />
          ) : isCollection ? (
            <CollectionPageContent />
          ) : isDiagnostic ? (
            <FragranceDiagnostic />
          ) : (
            <ProductCatalog />
          )}
        </div>
      </main>

      {/* Brand Values 5 Icons Banner */}
      <BrandValuesFooter />

      {/* Universal Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      {!isCheckout && <MobileBottomNav />}

      {/* Overlays & Modals */}
      <ProductDetailModal />
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
