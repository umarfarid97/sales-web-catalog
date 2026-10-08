import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Menu, 
  Sparkles, 
  ArrowRight, 
  Search, 
  ShoppingBag,
  MessageCircle,
  User,
  LogOut
} from 'lucide-react';

export const Navbar = () => {
  const { 
    customerView,
    activeGender,
    menCount,
    womenCount,
    cart = [],
    setIsCartOpen
  } = useStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { currentUser, isAuthenticated, logout } = useAuth();

  const cartCount = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  const search = typeof window !== 'undefined' ? window.location.search.toLowerCase() : '';
  const isHome = pathname === '' || pathname === '/' || pathname.endsWith('index.html') || pathname.endsWith('/');
  const isWomen = pathname.includes('women');
  const isMen = !isWomen && (pathname.includes('men.html') || pathname.endsWith('/men') || pathname === '/men' || (pathname.includes('men') && !pathname.includes('women')));
  const isCollection = pathname.includes('collection');
  const isAllCollection = isCollection && !isMen && !isWomen;
  const isDiagnostic = pathname.includes('diagnostic');

  // Bulletproof body scroll lock when side drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyPosition = document.body.style.position;
      const originalBodyTop = document.body.style.top;
      const originalBodyWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.position = originalBodyPosition;
        document.body.style.top = originalBodyTop;
        document.body.style.width = originalBodyWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `collection.html?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header 
        className="prv-navbar site-header" 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 100, 
          background: 'rgba(252, 251, 249, 0.96)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          color: '#111111',
          transition: 'all 0.3s ease'
        }}
      >
        <div 
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 clamp(16px, 3.5vw, 32px)',
            height: '74px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          {/* Mobile Menu Button (Left on Mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
              className="navbar-mobile-toggle"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111111',
                borderRadius: '6px'
              }}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Brand Logo */}
            <a 
              href="index.html" 
              style={{ 
                fontFamily: 'var(--font-brand, "Bodoni Moda", "Playfair Display", serif)', 
                fontSize: 'clamp(1.25rem, 2.5vw, 1.48rem)', 
                fontWeight: 800, 
                letterSpacing: '0.22em', 
                color: '#111111', 
                textDecoration: 'none',
                textTransform: 'uppercase',
                display: 'inline-block',
                lineHeight: 1
              }}
            >
              VALENSZO
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav 
            className="navbar-desktop-nav"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'clamp(18px, 2.2vw, 32px)',
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}
          >
            <a 
              href="index.html" 
              style={{ 
                textDecoration: 'none', 
                color: isHome ? '#111111' : '#4b5563', 
                fontSize: '0.86rem', 
                fontWeight: isHome ? 700 : 500, 
                letterSpacing: '0.04em',
                transition: 'color 0.2s',
                borderBottom: isHome ? '1.5px solid #111111' : '1.5px solid transparent',
                paddingBottom: '2px'
              }}
            >
              Home
            </a>
            <a 
              href="collection.html" 
              style={{ 
                textDecoration: 'none', 
                color: isAllCollection ? '#111111' : '#4b5563', 
                fontSize: '0.86rem', 
                fontWeight: isAllCollection ? 700 : 500, 
                letterSpacing: '0.04em',
                transition: 'color 0.2s',
                borderBottom: isAllCollection ? '1.5px solid #111111' : '1.5px solid transparent',
                paddingBottom: '2px'
              }}
            >
              All Collections
            </a>
            <a 
              href="men.html" 
              style={{ 
                textDecoration: 'none', 
                color: isMen ? '#111111' : '#4b5563', 
                fontSize: '0.86rem', 
                fontWeight: isMen ? 700 : 500, 
                letterSpacing: '0.04em',
                transition: 'color 0.2s',
                borderBottom: isMen ? '1.5px solid #111111' : '1.5px solid transparent',
                paddingBottom: '2px'
              }}
            >
              Men
            </a>
            <a 
              href="women.html" 
              style={{ 
                textDecoration: 'none', 
                color: isWomen ? '#111111' : '#4b5563', 
                fontSize: '0.86rem', 
                fontWeight: isWomen ? 700 : 500, 
                letterSpacing: '0.04em',
                transition: 'color 0.2s',
                borderBottom: isWomen ? '1.5px solid #111111' : '1.5px solid transparent',
                paddingBottom: '2px'
              }}
            >
              Women
            </a>
            <a 
              href="diagnostic.html" 
              style={{ 
                textDecoration: 'none', 
                color: isDiagnostic ? '#111111' : '#4b5563', 
                fontSize: '0.86rem', 
                fontWeight: isDiagnostic ? 700 : 500, 
                letterSpacing: '0.04em', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                transition: 'color 0.2s',
                borderBottom: isDiagnostic ? '1.5px solid #111111' : '1.5px solid transparent',
                paddingBottom: '2px'
              }}
            >
              <Sparkles size={13} />
              <span>Scent Quiz</span>
            </a>
            <a 
              href="https://wa.me/60182868402?text=Hello%20Valenszo,%20I%20would%20like%20to%20inquire%20about%20your%20fragrances" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                textDecoration: 'none', 
                color: '#4b5563', 
                fontSize: '0.86rem', 
                fontWeight: 500, 
                letterSpacing: '0.04em',
                transition: 'color 0.2s'
              }}
            >
              Contact Us
            </a>
          </nav>

          {/* Right Action Controls: Search & Bag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Input Box */}
            <form 
              onSubmit={handleSearchSubmit}
              className="navbar-desktop-search"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f2efe9',
                borderRadius: '9999px',
                padding: '6px 14px',
                gap: '8px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                transition: 'background 0.2s'
              }}
            >
              <Search size={14} color="#6b7280" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.82rem',
                  outline: 'none',
                  color: '#111111',
                  width: '120px'
                }}
              />
            </form>

            {/* Shopping Bag Trigger Button */}
            <button 
              onClick={() => setIsCartOpen && setIsCartOpen(true)}
              aria-label="View shopping bag"
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '1px solid #dfd8cc',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#111111',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#111111';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#dfd8cc';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: '#111111',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    minWidth: '17px',
                    height: '17px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    lineHeight: 1
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Slide-Over Drawer */}
        {isMenuOpen && (
          <>
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
                background: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(3px)',
                zIndex: 998,
                touchAction: 'none'
              }}
            />

            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                height: '100dvh',
                width: 'clamp(280px, 82vw, 360px)',
                background: '#faf8f5',
                zIndex: 999,
                boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Drawer Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                borderBottom: '1px solid #eeebdf',
                background: '#ffffff'
              }}>
                <a 
                  href="index.html" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-brand, "Bodoni Moda", serif)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    color: '#111111',
                    textDecoration: 'none'
                  }}
                >
                  VALENSZO
                </a>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '6px',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                {/* Search In Drawer */}
                <form 
                  onSubmit={handleSearchSubmit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ffffff',
                    border: '1px solid #e5e0d8',
                    borderRadius: '999px',
                    padding: '8px 14px',
                    gap: '8px',
                    marginBottom: '10px'
                  }}
                >
                  <Search size={15} color="#8c7d70" />
                  <input 
                    type="text" 
                    placeholder="Search perfumes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '0.84rem',
                      outline: 'none',
                      color: '#111111',
                      width: '100%'
                    }}
                  />
                </form>

                <a 
                  href="index.html" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    background: isHome ? '#ffffff' : 'transparent',
                    color: '#111111',
                    fontWeight: isHome ? 700 : 500,
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: isHome ? '1px solid #eeebdf' : '1px solid transparent'
                  }}
                >
                  <span>Home</span>
                  <ArrowRight size={14} color="#8c7d70" />
                </a>

                <a 
                  href="collection.html" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    background: isAllCollection ? '#ffffff' : 'transparent',
                    color: '#111111',
                    fontWeight: isAllCollection ? 700 : 500,
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: isAllCollection ? '1px solid #eeebdf' : '1px solid transparent'
                  }}
                >
                  <span>All Collections</span>
                  <ArrowRight size={14} color="#8c7d70" />
                </a>

                <a 
                  href="men.html" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    background: isMen ? '#ffffff' : 'transparent',
                    color: '#111111',
                    fontWeight: isMen ? 700 : 500,
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: isMen ? '1px solid #eeebdf' : '1px solid transparent'
                  }}
                >
                  <span>Men's Fragrances</span>
                  <ArrowRight size={14} color="#8c7d70" />
                </a>

                <a 
                  href="women.html" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    background: isWomen ? '#ffffff' : 'transparent',
                    color: '#111111',
                    fontWeight: isWomen ? 700 : 500,
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: isWomen ? '1px solid #eeebdf' : '1px solid transparent'
                  }}
                >
                  <span>Women's Fragrances</span>
                  <ArrowRight size={14} color="#8c7d70" />
                </a>


                <a 
                  href="diagnostic.html" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    background: isDiagnostic ? '#ffffff' : 'transparent',
                    color: '#111111',
                    fontWeight: isDiagnostic ? 700 : 500,
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: isDiagnostic ? '1px solid #eeebdf' : '1px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={14} color="#111111" />
                    <span>Scent Quiz</span>
                  </div>
                  <ArrowRight size={14} color="#8c7d70" />
                </a>

                {/* Direct WhatsApp in Drawer */}
                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #eeebdf' }}>
                  <a 
                    href="https://wa.me/60182868402?text=Hello%20Valenszo!%20I%20would%20like%20assistance%20with%20your%20perfume%20catalog." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      background: '#111111',
                      color: '#ffffff',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      justifyContent: 'center'
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp Support</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};
