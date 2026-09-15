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
  LogOut,
  Shield,
  MessageCircle
} from 'lucide-react';
import { ValenszoLogo } from './ValenszoLogo';

export const Navbar = () => {
  const { 
    role, 
    setRole, 
    customerView,
    activeGender,
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
            Receive a Free Valenszo Deluxe Sample with any order over RM200 &bull; Free Express Delivery Across Malaysia
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

      {/* 2. Artisanal Luxury Top Bar (Matching Craft & Cafe Header) */}
      <header className="site-header" style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: '#231710', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#ffffff'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 36px)',
          height: '66px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          
          {/* Left Column: Hamburger Menu & Brand Monogram on Desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 2 }}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open Menu"
              title="Menu"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                transition: 'opacity 0.2s ease'
              }}
            >
              {isMenuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
            </button>

            <a 
              href="index.html"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                textDecoration: 'none', 
                color: '#ffffff' 
              }}
            >
              <ValenszoLogo 
                size="topbar" 
                showMonogram={true} 
                showBrandName={false} 
                showSubtitle={false} 
                inverted={true}
              />
              <span style={{ 
                fontFamily: 'var(--font-brand, serif)', 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                letterSpacing: '0.12em',
                color: '#ffffff',
                display: 'none'
              }} className="desktop-brand-text">
                VALENSZO
              </span>
            </a>
          </div>

          {/* Center Column: Desktop Navigation Links (Craft & Cafe Style) */}
          <nav 
            className="desktop-nav-links"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'clamp(14px, 2vw, 28px)',
              listStyle: 'none'
            }}
          >
            <a href="men.html" style={{ textDecoration: 'none', color: '#e5ded6', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em', transition: 'color 0.2s' }}>
              Men
            </a>
            <a href="women.html" style={{ textDecoration: 'none', color: '#e5ded6', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em', transition: 'color 0.2s' }}>
              Women
            </a>
            <a href="diagnostic.html" style={{ textDecoration: 'none', color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} />
              <span>Scent Quiz</span>
            </a>
          </nav>

          {/* Right Column: Direct WhatsApp Concierge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
            <a
              href="https://wa.me/60182868402?text=Hello%20Valenszo%20Fragrance%20Concierge!%20I%20am%20browsing%20your%20online%20catalog."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Concierge"
              title="Chat with Fragrance Concierge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: '#128C7E',
                color: '#ffffff',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textDecoration: 'none',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 12px rgba(18, 140, 126, 0.3)',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#075E54'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#128C7E'; }}
            >
              <MessageCircle size={16} />
              <span>WhatsApp Concierge</span>
            </a>
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
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  onClick={() => {
                    if (role === 'admin') {
                      setRole('customer');
                    }
                    setIsMenuOpen(false);
                    window.location.href = 'index.html';
                  }}
                >
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
                      LUXURY PERFUMES
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
                      window.location.href = 'diagnostic.html';
                      setIsMenuOpen(false);
                    }}
                    style={{
                      background: customerView === 'diagnostic' ? '#000000' : 'linear-gradient(135deg, #18181b 0%, #090b10 100%)',
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
                      href="men.html"
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
                        <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '2px' }}>{menCount} Men&apos;s Perfumes</div>
                      </div>
                      <ArrowRight size={16} color={activeGender === 'Men' ? '#000000' : '#9ca3af'} />
                    </a>

                    <a 
                      href="women.html"
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
                        <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '2px' }}>{womenCount} Women&apos;s Perfumes</div>
                      </div>
                      <ArrowRight size={16} color={activeGender === 'Women' ? '#000000' : '#9ca3af'} />
                    </a>
                  </div>
                </div>

                {/* Fragrance Concierge Section */}
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                  <div style={{ padding: '16px', background: '#fafaf9', borderRadius: '8px', border: '1px solid #e7e5e4', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#128C7E', fontWeight: 800, marginBottom: '4px' }}>
                      Bespoke Concierge
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#000000', marginBottom: '4px' }}>
                      Need Fragrance Recommendations?
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#6b7280', marginBottom: '12px', lineHeight: 1.4 }}>
                      Speak directly with our fragrance specialists for personalized scent advice, notes breakdown, or custom inquiries.
                    </div>
                    <a
                      href="https://wa.me/60182868402?text=Hello%20Valenszo%20Fragrance%20Concierge!%20I%20am%20browsing%20your%20online%20catalog."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: '#128C7E',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(18, 140, 126, 0.25)'
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

                    {isAdmin && (
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
                    )}
                  </div>
                </div>

                {/* Experience Mode Switcher (Visible strictly to Atelier Admin) */}
                {isAdmin && (
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
                        Store
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
                        Admin
                      </button>
                    </div>

                    <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>
                      {isCloudConnected ? '🟢 Connected to Supabase Cloud' : '⚪ Local Storage Mode'}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </>
        )}

      </header>
    </>
  );
};
