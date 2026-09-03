import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  RotateCcw, 
  X, 
  Cloud, 
  Compass,
  Menu,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ValenszoLogo } from './ValenszoLogo';

export const Navbar = () => {
  const { 
    role, 
    setRole, 
    customerView,
    navigateToDiagnostic,
    navigateToCatalog,
    activeGender,
    selectGenderCollection,
    menCount,
    womenCount,
    cartTotalItems, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery,
    isCloudConnected,
    resetToDemoData,
    showToast,
    setIsOrderTrackerOpen,
    selectedCategory,
    setSelectedCategory
  } = useStore();

  const [isResetting, setIsResetting] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset catalog to the official Valenszo fragrance collection?')) {
      setIsResetting(true);
      await resetToDemoData();
      setIsResetting(false);
      showToast('Catalog refreshed with the official Valenszo collection!', 'success');
    }
  };

  return (
    <>
      {/* Top Valenszo Announcement Banner */}
      <div className="dior-announcement-bar">
        COMPLIMENTARY VALENSZO ART OF GIFTING &bull; <span>2 DELUXE SAMPLES WITH EVERY ORDER</span> &bull; FREE DELIVERY
      </div>

      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container">
          <div className="nav-container">
            
            {/* Left Column: Mobile Menu Trigger (on mobile) or Desktop Nav Links (on desktop) */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button 
                className="btn-icon show-mobile"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                style={{ width: '38px', height: '38px', border: 'none', background: 'transparent' }}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <div className="dior-navbar-links hide-mobile">
                <button 
                  className={`dior-nav-link ${customerView === 'diagnostic' ? 'active' : ''}`}
                  onClick={() => navigateToDiagnostic()}
                  style={{ 
                    color: customerView === 'diagnostic' ? '#000000' : '#b45309', 
                    fontWeight: 800, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px',
                    borderBottom: customerView === 'diagnostic' ? '2px solid #000000' : 'none'
                  }}
                >
                  <Sparkles size={13} color="#d97706" />
                  <span>Find Your Scent</span>
                </button>
                <button 
                  className={`dior-nav-link ${customerView === 'catalog' && activeGender === 'Men' ? 'active' : ''}`}
                  onClick={() => selectGenderCollection('Men')}
                  style={{ fontWeight: activeGender === 'Men' ? 800 : 600 }}
                >
                  Men&apos;s Collection ({menCount})
                </button>
                <button 
                  className={`dior-nav-link ${customerView === 'catalog' && activeGender === 'Women' ? 'active' : ''}`}
                  onClick={() => selectGenderCollection('Women')}
                  style={{ fontWeight: activeGender === 'Women' ? 800 : 600 }}
                >
                  Women&apos;s Collection ({womenCount})
                </button>
              </div>
            </div>

            {/* Center Column: Iconic Centered VALENSZO Logo with VL Monogram */}
            <div 
              style={{ textAlign: 'center', cursor: 'pointer', padding: '4px 6px', display: 'flex', justifyContent: 'center' }}
              onClick={() => {
                navigateToCatalog('All Creations');
                setIsMobileMenuOpen(false);
              }}
              title="VALENSZO Fragrance Malaysia"
            >
              <div className="hide-mobile">
                <ValenszoLogo size="md" subtitle="FRAGRANCE MALAYSIA" />
              </div>
              <div className="show-mobile">
                <ValenszoLogo size="sm" subtitle="FRAGRANCE MALAYSIA" />
              </div>
            </div>

            {/* Right Column: Search, Secondary Actions & Shopping Bag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              
              {/* Scent Search Trigger / Input */}
              {showSearchBox ? (
                <div style={{ position: 'relative', width: 'clamp(140px, 30vw, 220px)' }}>
                  <input
                    type="text"
                    autoFocus
                    className="form-input"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '6px 28px 6px 10px', fontSize: '0.8rem', height: '34px' }}
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchBox(false);
                    }}
                    style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn-icon"
                  onClick={() => setShowSearchBox(true)}
                  title="Search Valenszo Fragrances"
                  aria-label="Search"
                  style={{ width: '36px', height: '36px' }}
                >
                  <Search size={17} />
                </button>
              )}

              {/* Order Tracker (Desktop only) */}
              <button
                className="btn-icon hide-mobile"
                onClick={() => setIsOrderTrackerOpen(true)}
                title="Delivery Tracker"
                aria-label="Delivery Tracker"
              >
                <Compass size={17} />
              </button>

              {/* Cloud Sync Status (Desktop only) */}
              <div 
                className="hide-mobile"
                title={isCloudConnected ? "Connected to Supabase PostgreSQL" : "Local Storage Mode"}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '4px 8px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: isCloudConnected ? '#ecfdf5' : '#f3f4f6',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-couture)',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  color: isCloudConnected ? '#059669' : '#6b7280'
                }}
              >
                <Cloud size={12} />
                <span>{isCloudConnected ? 'LIVE' : 'LOCAL'}</span>
              </div>

              {/* Reset Catalog Button (Desktop only) */}
              <button
                className="btn-icon hide-mobile"
                onClick={handleReset}
                disabled={isResetting}
                title="Reset / Seed Valenszo Catalog"
                aria-label="Reset Collection"
              >
                <RotateCcw size={15} className={isResetting ? 'spin' : ''} />
              </button>

              {/* Role Toggle Switcher: Boutique vs Atelier Admin (Desktop only) */}
              <div className="hide-mobile" style={{ display: 'flex', background: '#f3f4f6', borderRadius: 'var(--radius-sm)', padding: '3px', gap: '2px' }}>
                <button
                  onClick={() => setRole('customer')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: role === 'customer' ? '#000000' : 'transparent',
                    color: role === 'customer' ? '#ffffff' : '#6b7280',
                    fontFamily: 'var(--font-couture)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    cursor: 'pointer'
                  }}
                >
                  Boutique
                </button>
                <button
                  onClick={() => setRole('admin')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: role === 'admin' ? '#000000' : 'transparent',
                    color: role === 'admin' ? '#ffffff' : '#6b7280',
                    fontFamily: 'var(--font-couture)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    cursor: 'pointer'
                  }}
                >
                  Atelier
                </button>
              </div>

              {/* Shopping Bag Button (Responsive: compact on phone, labeled on desktop) */}
              {role === 'customer' && (
                <button
                  className="btn btn-dior-black"
                  onClick={() => setIsCartOpen(true)}
                  style={{ padding: '8px 14px', fontSize: '0.76rem', height: '36px' }}
                  aria-label={`Shopping Bag (${cartTotalItems} items)`}
                >
                  <ShoppingBag size={16} />
                  <span className="hide-mobile">Bag</span>
                  {cartTotalItems > 0 && (
                    <span 
                      style={{
                        background: '#ffffff',
                        color: '#000000',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        marginLeft: '2px'
                      }}
                    >
                      {cartTotalItems}
                    </span>
                  )}
                </button>
              )}

            </div>

          </div>
        </div>

        {/* Luxury Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <div className="mobile-nav-inner">
              
              {/* Featured Olfactory Diagnostic Menu Item */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  className="mobile-nav-item"
                  onClick={() => {
                    navigateToDiagnostic();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    background: customerView === 'diagnostic' ? '#000000' : 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
                    color: '#ffffff',
                    border: '1px solid #d97706',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.18)',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={16} color="#f59e0b" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.04em', color: '#ffffff' }}>
                        Find Your Scent
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>
                        10-Question Olfactory Diagnostic &rarr;
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="#f59e0b" />
                </button>
              </div>

              <div className="mobile-nav-section-title">Valenszo Collections</div>
              <div className="mobile-nav-links">
                <button 
                  className={`mobile-nav-item ${customerView === 'catalog' && activeGender === 'Men' ? 'active' : ''}`}
                  onClick={() => { 
                    selectGenderCollection('Men'); 
                    setIsMobileMenuOpen(false); 
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 14px',
                    borderLeft: activeGender === 'Men' ? '4px solid #000000' : '4px solid transparent',
                    background: activeGender === 'Men' ? '#f3f4f6' : 'transparent',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#111827' }}>Men&apos;s Collection</div>
                    <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>{menCount} Fragrance Creations</div>
                  </div>
                  <ArrowRight size={16} color={activeGender === 'Men' ? '#000000' : '#9ca3af'} />
                </button>

                <button 
                  className={`mobile-nav-item ${customerView === 'catalog' && activeGender === 'Women' ? 'active' : ''}`}
                  onClick={() => { 
                    selectGenderCollection('Women'); 
                    setIsMobileMenuOpen(false); 
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 14px',
                    borderLeft: activeGender === 'Women' ? '4px solid #000000' : '4px solid transparent',
                    background: activeGender === 'Women' ? '#f3f4f6' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '6px'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#111827' }}>Women&apos;s Collection</div>
                    <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>{womenCount} Fragrance Creations</div>
                  </div>
                  <ArrowRight size={16} color={activeGender === 'Women' ? '#000000' : '#9ca3af'} />
                </button>
              </div>

              <div className="mobile-nav-divider" />

              <div className="mobile-nav-section-title">Maison Services</div>
              <div className="mobile-nav-actions">
                <button 
                  className="mobile-nav-action-btn"
                  onClick={() => { setIsOrderTrackerOpen(true); setIsMobileMenuOpen(false); }}
                >
                  <Compass size={16} color="#926917" />
                  <span>Track Fragrance Delivery</span>
                </button>

                <button 
                  className="mobile-nav-action-btn"
                  onClick={() => { handleReset(); setIsMobileMenuOpen(false); }}
                >
                  <RotateCcw size={16} className={isResetting ? 'spin' : ''} />
                  <span>Reset Valenszo Catalog</span>
                </button>
              </div>

              <div className="mobile-nav-divider" />

              <div className="mobile-nav-section-title">Experience Mode</div>
              <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '4px', padding: '3px', gap: '4px' }}>
                <button
                  onClick={() => { setRole('customer'); setIsMobileMenuOpen(false); }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    border: 'none',
                    borderRadius: '3px',
                    background: role === 'customer' ? '#000000' : 'transparent',
                    color: role === 'customer' ? '#ffffff' : '#4b5563',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    cursor: 'pointer'
                  }}
                >
                  Boutique
                </button>
                <button
                  onClick={() => { setRole('admin'); setIsMobileMenuOpen(false); }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    border: 'none',
                    borderRadius: '3px',
                    background: role === 'admin' ? '#000000' : 'transparent',
                    color: role === 'admin' ? '#ffffff' : '#4b5563',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    cursor: 'pointer'
                  }}
                >
                  Atelier Admin
                </button>
              </div>

              <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>
                {isCloudConnected ? '🟢 Connected to Supabase Cloud' : '⚪ Local Storage Mode'}
              </div>

            </div>
          </div>
        )}

      </header>
    </>
  );
};
