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

// Customer Components
import { FragranceDiagnostic } from './components/customer/FragranceDiagnostic';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/pdp.css';
import './styles/admin.css';

import { ChevronRight } from 'lucide-react';

const DiagnosticLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', color: '#111827' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem clamp(12px, 3.5vw, 24px)' }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.25rem' }}>
            <a href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</a>
            <ChevronRight size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Scent Finder</span>
          </div>

          {/* Diagnostic Hero Banner */}
          <div className="editorial-hero-banner">
            {/* Deep dark protective scrim preventing any camouflage with photo */}
            <div className="editorial-hero-scrim" />

            {/* Ambient warm glow */}
            <div 
              style={{
                position: 'absolute',
                left: '5%',
                top: '20%',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(197, 160, 89, 0.12) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />

            {/* Left Editorial Text */}
            <div className="editorial-hero-text">
              <h1 className="editorial-hero-title">
                Olfactory
                <br />
                Diagnostic
              </h1>
              <p className="editorial-hero-subtitle">
                Find your signature scent • 4 bespoke diagnostic questions matched to our 345 creations
              </p>
            </div>

            {/* Right Visual: Scent mood flacon with smooth left fade */}
            <div 
              className="editorial-hero-media"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1000&auto=format&fit=crop&q=80)',
                backgroundPosition: 'center 40%'
              }}
            />
          </div>

          <FragranceDiagnostic />
        </div>
      </main>

      <BrandValuesFooter />

      <Footer />

      <MobileBottomNav />

      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function DiagnosticApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <DiagnosticLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
