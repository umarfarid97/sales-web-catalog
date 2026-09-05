import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  RotateCcw, 
  X, 
  Compass,
  Menu,
  Sparkles,
  ArrowRight,
  User,
  Search,
  LogOut,
  Shield,
  UserCheck
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
    isCloudConnected,
    resetToDemoData,
    showToast,
    setIsOrderTrackerOpen
  } = useStore();

  const [isResetting, setIsResetting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const { currentUser, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleOutsideClick = () => setIsAccountMenuOpen(false);
    if (isAccountMenuOpen) {
      window.addEventListener('click', handleOutsideClick);
      return () => window.removeEventListener('click', handleOutsideClick);
    }
  }, [isAccountMenuOpen]);

  // Bulletproof body scroll lock when side drawer is open (prevents background scrolling and stutter on mobile phones)
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyPosition = document.body.style.position;
      const originalBodyTop = document.body.style.top;
      const originalBodyWidth = document.body.style.width;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.overscrollBehavior = '';
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.overscrollBehavior = '';
        document.body.style.position = originalBodyPosition;
        document.body.style.top = originalBodyTop;
        document.body.style.width = originalBodyWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

  const handleReset = async () => {
    if (window.confirm('Reset catalog to the official Valenszo fragrance collection?')) {
      setIsResetting(true);
      await resetToDemoData();
      setIsResetting(false);
      showToast('Catalog refreshed with the official Valenszo collection!', 'success');
    }
  };

  const handleSearchClick = () => {
    if (typeof window !== 'undefined') {
      if (!window.location.pathname.includes('collection.html')) {
        window.location.href = '/collection.html';
        return;
      }
      const searchInput = document.querySelector('input[type="text"]');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInput.focus();
      }
    }
  };

  return (
    <>
      {/* 1. Sleek Announcement Banner (with dismissible 'X') */}
      {showAnnouncement && (
        <div style={{
          background: '#000000',
          color: '#ffffff',
          fontSize: '0.72rem',
          fontWeight: 600,
          fontFamily: 'var(--font-couture, sans-serif)',
          letterSpacing: '0.06em',
          padding: '9px 42px 9px 24px',
          textAlign: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1.4
        }}>
          <span>
            Receive a Complimentary Maison Valenszo Deluxe Sample with any order over RM200 &bull; Free Express Delivery Across Malaysia
          </span>
          <button
            onClick={() => setShowAnnouncement(false)}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.75)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. Minimalist Parisian Luxury Top Bar (Matching Dior Boutique Header) */}
      <header className="site-header" style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: '#ffffff', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)' 
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 36px)',
          height: '62px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          
          {/* Left Column: Hamburger Menu & Search Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open Boutique Menu"
              title="Boutique Menu"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                transition: 'opacity 0.2s ease'
              }}
            >
              {isMenuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
            </button>

            <button
              onClick={handleSearchClick}
              aria-label="Search Fragrance Catalog"
              title="Search Fragrances"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                transition: 'opacity 0.2s ease'
              }}
            >
              <Search size={20} strokeWidth={1.75} />
            </button>
          </div>

          {/* Center Column: Iconic VALENSZO Monogram Logo Emblem (Mathematically Centered) */}
          <div 
            style={{ 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
            onClick={() => {
              window.location.href = '/';
            }}
            title="VALENSZO Haute Parfumerie"
          >
            <ValenszoLogo 
              size="topbar" 
              showMonogram={true} 
              showBrandName={false} 
              showSubtitle={false} 
            />
          </div>

          {/* Right Column: Account / Order Tracker & Shopping Bag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
            
            {/* Account / Order Tracker with Status Dot & Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAuthenticated) {
                    openAuthModal({ mode: 'signin' });
                  } else {
                    setIsAccountMenuOpen(prev => !prev);
                  }
                }}
                aria-label="Track Orders & Account"
                title={isAuthenticated ? `Maison Account: ${currentUser.name}` : "Maison Client Sign In"}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  position: 'relative',
                  transition: 'opacity 0.2s ease'
                }}
              >
                <User size={21} strokeWidth={1.75} />
                {/* Status dot: Green when logged in, Orange when guest */}
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isAuthenticated ? '#16a34a' : '#ea580c',
                  boxShadow: '0 0 0 1.5px #ffffff'
                }} />
              </button>

              {/* Account Dropdown Menu for Authenticated Users */}
              {isAuthenticated && isAccountMenuOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: '260px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                    zIndex: 100,
                    padding: '12px 0',
                    color: '#000000'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ padding: '4px 16px 10px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#b38e44', fontWeight: 700 }}>
                      Maison Client
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#000000', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser.email}
                    </div>
                    {isAdmin && (
                      <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 6px', background: '#fef3c7', color: '#92400e', borderRadius: '3px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Atelier Administrator
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '6px 0' }}>
                    <button
                      onClick={() => {
                        setIsOrderTrackerOpen(true);
                        setIsAccountMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '9px 16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Compass size={15} color="#926917" />
                      <span>My Orders & Tracker</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setRole(role === 'admin' ? 'customer' : 'admin');
                          setIsAccountMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '9px 16px',
                          background: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#374151',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Shield size={15} color="#926917" />
                        <span>{role === 'admin' ? 'Return to Boutique' : 'Atelier Portal'}</span>
                      </button>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '6px' }}>
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountMenuOpen(false);
                        showToast('Signed out of Maison Valenszo.', 'info');
                      }}
                      style={{
                        width: '100%',
                        padding: '9px 16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Bag Button with Counter Badge */}
            {role === 'customer' && (
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping Bag (${cartTotalItems} items)`}
                title="Shopping Bag"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  position: 'relative',
                  transition: 'opacity 0.2s ease'
                }}
              >
                <ShoppingBag size={21} strokeWidth={1.75} />
                {cartTotalItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#000000',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-couture)',
                    lineHeight: 1
                  }}>
                    {cartTotalItems}
                  </span>
                )}
              </button>
            )}

          </div>

        </div>

        {/* 3. Luxury Boutique Slide-Over Drawer (Accessible on Desktop & Mobile) */}
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay (Blocks all background touches) */}
            <div 
              onClick={() => setIsMenuOpen(false)}
              onTouchMove={(e) => e.preventDefault()}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: '100dvh',
                background: 'rgba(0, 0, 0, 0.52)',
                backdropFilter: 'blur(2px)',
                zIndex: 998,
                animation: 'fadeIn 0.2s ease-out',
                touchAction: 'none'
              }}
            />

            {/* Slide Drawer Panel (Pinned viewport height, no background overscroll) */}
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                height: '100vh',
                height: '100dvh',
                maxHeight: '100dvh',
                width: 'clamp(280px, 84vw, 380px)',
                background: '#ffffff',
                zIndex: 999,
                boxShadow: '4px 0 28px rgba(0, 0, 0, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y'
              }}
            >
              {/* Drawer Header (Fixed at top of drawer, non-scrollable) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderBottom: '1px solid #f3f4f6',
                flexShrink: 0,
                background: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ValenszoLogo size="sm" showMonogram={true} showBrandName={false} showSubtitle={false} />
                  <div>
                    <span style={{
                      fontFamily: 'var(--font-brand, "Bodoni Moda", serif)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      color: '#000000',
                      display: 'block',
                      lineHeight: 1
                    }}>
                      VALENSZO
                    </span>
                    <span style={{
                      fontSize: '0.62rem',
                      fontFamily: 'var(--font-couture)',
                      letterSpacing: '0.15em',
                      color: '#9ca3af',
                      marginTop: '3px',
                      display: 'block'
                    }}>
                      HAUTE PARFUMERIE
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#4b5563',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%'
                  }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body (Isolated scroll container with iOS momentum scrolling) */}
              <div 
                style={{ 
                  padding: '20px 20px calc(36px + env(safe-area-inset-bottom, 16px))', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '20px', 
                  flex: 1,
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                  touchAction: 'pan-y'
                }}
              >
                
                {/* Featured Olfactory Diagnostic Menu Item */}
                <div>
                  <button
                    onClick={() => {
                      window.location.href = '/diagnostic.html';
                      setIsMenuOpen(false);
                    }}
                    style={{
                      background: customerView === 'diagnostic' ? '#000000' : 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
                      color: '#ffffff',
                      border: '1px solid #d97706',
                      padding: '14px 16px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.18)',
                      width: '100%',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Sparkles size={16} color="#f59e0b" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.04em', color: '#ffffff' }}>
                          Find Your Scent
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>
                          4-Step Olfactory Diagnostic &rarr;
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={16} color="#f59e0b" />
                  </button>
                </div>

                {/* Collections Section */}
                <div>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#c5a059',
                    marginBottom: '10px',
                    fontFamily: 'var(--font-couture)'
                  }}>
                    Fragrance Collections
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <a 
                      href="/men.html"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderLeft: activeGender === 'Men' ? '4px solid #000000' : '4px solid transparent',
                        background: activeGender === 'Men' ? '#f3f4f6' : '#fafafa',
                        borderTop: '1px solid #f3f4f6',
                        borderRight: '1px solid #f3f4f6',
                        borderBottom: '1px solid #f3f4f6',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>Men&apos;s Collection</div>
                        <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '2px' }}>{menCount} Fragrance Creations</div>
                      </div>
                      <ArrowRight size={16} color={activeGender === 'Men' ? '#000000' : '#9ca3af'} />
                    </a>

                    <a 
                      href="/women.html"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderLeft: activeGender === 'Women' ? '4px solid #000000' : '4px solid transparent',
                        background: activeGender === 'Women' ? '#f3f4f6' : '#fafafa',
                        borderTop: '1px solid #f3f4f6',
                        borderRight: '1px solid #f3f4f6',
                        borderBottom: '1px solid #f3f4f6',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>Women&apos;s Collection</div>
                        <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '2px' }}>{womenCount} Fragrance Creations</div>
                      </div>
                      <ArrowRight size={16} color={activeGender === 'Women' ? '#000000' : '#9ca3af'} />
                    </a>

                    <button 
                      onClick={() => { 
                        window.location.href = '/bundle.html'; 
                        setIsMenuOpen(false); 
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderLeft: '4px solid transparent',
                        background: '#fafafa',
                        borderTop: '1px solid #f3f4f6',
                        borderRight: '1px solid #f3f4f6',
                        borderBottom: '1px solid #f3f4f6',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>Signature Bundles</div>
                        <div style={{ fontSize: '0.74rem', color: '#c5a059', marginTop: '2px', fontWeight: 600 }}>Save up to 25% on 3 or 5 Bottles</div>
                      </div>
                      <ArrowRight size={16} color="#9ca3af" />
                    </button>
                  </div>
                </div>

                {/* Maison Services Section */}
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                  
                  {/* Member Authentication Status Card */}
                  {isAuthenticated ? (
                    <div style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: '4px', border: '1px solid #e5e7eb', marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b38e44', fontWeight: 700 }}>
                        {isAdmin ? '👑 Atelier Administrator' : '✨ Privilege Member'}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000000', marginTop: '2px' }}>
                        {currentUser.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentUser.email}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                          showToast('Signed out of Maison Valenszo.', 'info');
                        }}
                        style={{
                          marginTop: '8px',
                          padding: '5px 10px',
                          background: '#ffffff',
                          border: '1px solid #d1d5db',
                          borderRadius: '3px',
                          fontSize: '0.72rem',
                          color: '#dc2626',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '12px 14px', background: '#fafaf9', borderRadius: '4px', border: '1px solid #e7e5e4', marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#000000', marginBottom: '2px' }}>
                        Maison Valenszo Privilege
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#6b7280', marginBottom: '8px' }}>
                        Sign in or register to track deliveries and access exclusive privileges.
                      </div>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          openAuthModal({ mode: 'signin' });
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: '#000000',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          cursor: 'pointer'
                        }}
                      >
                        Client Sign In / Register
                      </button>
                    </div>
                  )}

                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#c5a059',
                    marginBottom: '10px',
                    fontFamily: 'var(--font-couture)'
                  }}>
                    Maison Services
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button 
                      onClick={() => { setIsOrderTrackerOpen(true); setIsMenuOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '11px 14px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: '#374151',
                        fontSize: '0.84rem',
                        fontWeight: 600
                      }}
                    >
                      <Compass size={17} color="#926917" />
                      <span>Track Fragrance Delivery</span>
                    </button>

                    <button 
                      onClick={() => { handleReset(); setIsMenuOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '11px 14px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: '#374151',
                        fontSize: '0.84rem',
                        fontWeight: 600
                      }}
                    >
                      <RotateCcw size={17} className={isResetting ? 'spin' : ''} />
                      <span>Reset Valenszo Catalog</span>
                    </button>
                  </div>
                </div>

                {/* Experience Mode Switcher (Boutique vs Atelier Admin) */}
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginTop: 'auto' }}>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#9ca3af',
                    marginBottom: '8px',
                    fontFamily: 'var(--font-couture)'
                  }}>
                    Experience Mode
                  </div>
                  <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '4px', padding: '3px', gap: '4px' }}>
                    <button
                      onClick={() => { setRole('customer'); setIsMenuOpen(false); }}
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
                      onClick={() => { setRole('admin'); setIsMenuOpen(false); }}
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

                  <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>
                    {isCloudConnected ? '🟢 Connected to Supabase Cloud' : '⚪ Local Storage Mode'}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

      </header>
    </>
  );
};
