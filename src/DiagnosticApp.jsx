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
          <div 
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#09090b',
              minHeight: 'clamp(200px, 26vw, 280px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'clamp(1.75rem, 4vw, 3rem) clamp(1.5rem, 4vw, 3rem)',
              color: '#ffffff',
              marginBottom: '2rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.14)'
            }}
          >
            {/* Subtle warm ambient glow */}
            <div 
              style={{
                position: 'absolute',
                left: '5%',
                top: '20%',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(197, 160, 89, 0.14) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
              }}
            />

            {/* Left Editorial Text */}
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '480px' }}>
              <h1 
                style={{ 
                  fontFamily: 'var(--font-brand, "Bodoni Moda", "Playfair Display", serif)', 
                  fontSize: 'clamp(2.1rem, 5.5vw, 3.6rem)', 
                  fontWeight: 700, 
                  lineHeight: 1.08, 
                  margin: 0, 
                  letterSpacing: '-0.01em',
                  color: '#ffffff'
                }}
              >
                Olfactory
                <br />
                Diagnostic
              </h1>
              <p 
                style={{ 
                  fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', 
                  color: '#d1d5db', 
                  marginTop: '0.65rem', 
                  fontWeight: 500,
                  fontFamily: 'var(--font-couture, sans-serif)',
                  letterSpacing: '0.02em'
                }}
              >
                Find your signature scent • 4 bespoke diagnostic questions matched to our 345 creations
              </p>
            </div>

            {/* Right Visual: Scent mood flacon with smooth left fade */}
            <div 
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: 'clamp(240px, 48%, 560px)',
                backgroundImage: 'url(https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1000&auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 40%',
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 22%, black 65%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 22%, black 65%)',
                pointerEvents: 'none'
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
