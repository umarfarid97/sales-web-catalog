import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    setIsCartOpen,
    products = [],
    openProductDetail,
    setSelectedProductModal
  } = useStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

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

  // Live Predictive Search Results
  const liveSearchResults = useMemo(() => {
    if (!products || !searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    const cleanDigits = q.replace(/[#\s]/g, '');

    return products.filter((p) => {
      if (!p || !p.id) return false;
      const name = String(p.name || '').toLowerCase();
      const brand = String(p.brand || p.brandInspiration || '').toLowerCase();
      const sku = String(p.sku || '').toLowerCase();
      const catalogNo = String(p.catalogNo || '');
      const family = String(p.olfactoryFamily || p.dominantAccord || '').toLowerCase();
      const traits = Array.isArray(p.traits) ? p.traits.join(' ').toLowerCase() : '';

      return name.includes(q) ||
        brand.includes(q) ||
        sku.includes(q) ||
        (cleanDigits && catalogNo === cleanDigits) ||
        family.includes(q) ||
        traits.includes(q);
    }).slice(0, 5);
  }, [products, searchQuery]);

  // Handle click outside to close live search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelectProduct = (product) => {
    setIsSearchFocused(false);
    setIsMenuOpen(false);
    setSearchQuery('');
    if (openProductDetail) {
      openProductDetail(product);
    } else if (setSelectedProductModal) {
      setSelectedProductModal(product);
    } else {
      const isW = (product.gender || '').toLowerCase() === 'women';
      window.location.href = `${isW ? 'women.html' : 'men.html'}?product=${encodeURIComponent(product.id)}`;
    }
  };

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
                fontFamily: 'var(--font-brand)', 
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
              padding: 0,
              fontFamily: 'var(--font-sans)'
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
            {/* Search Input Box with Live Predictive Results */}
            <div ref={searchContainerRef} style={{ position: 'relative' }}>
              <form 
                onSubmit={handleSearchSubmit}
                className="navbar-desktop-search"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f2efe9',
                  borderRadius: '9999px',
                  padding: '7px 16px',
                  gap: '8px',
                  border: isSearchFocused ? '1px solid #111111' : '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s',
                  boxShadow: isSearchFocused ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <Search size={14} color={isSearchFocused ? '#111111' : '#6b7280'} />
                <input 
                  type="text" 
                  placeholder="Search perfumes, brands, #..." 
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.82rem',
                    outline: 'none',
                    color: '#111111',
                    width: isSearchFocused || searchQuery ? '200px' : '130px',
                    transition: 'width 0.25s ease'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    style={{ background: 'none', border: 'none', padding: '1px', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={13} />
                  </button>
                )}
              </form>

              {/* Desktop Predictive Dropdown */}
              {isSearchFocused && searchQuery.trim().length >= 2 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '360px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #ede8e0',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '10px 14px', background: '#faf8f5', borderBottom: '1px solid #ede8e0', fontSize: '0.72rem', fontWeight: 700, color: '#786558', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Live Suggestions</span>
                    <span>{liveSearchResults.length} found</span>
                  </div>

                  {liveSearchResults.length > 0 ? (
                    <div style={{ maxHeight: '310px', overflowY: 'auto' }}>
                      {liveSearchResults.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 14px',
                            borderBottom: '1px solid #f5f2eb',
                            cursor: 'pointer',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#faf8f5'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                        >
                          <img
                            src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&auto=format&fit=crop&q=80'}
                            alt={prod.name}
                            style={{
                              width: '42px',
                              height: '42px',
                              objectFit: 'contain',
                              background: '#f8f6f2',
                              borderRadius: '6px',
                              padding: '2px',
                              border: '1px solid #ede8e0',
                              flexShrink: 0
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1a1410', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prod.name}
                              </span>
                              {prod.catalogNo && (
                                <span style={{ fontSize: '0.68rem', background: '#f0ebe4', color: '#8c5e3c', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                                  #{prod.catalogNo}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#786558', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {(prod.brand || prod.brandInspiration) ? `Inspired by ${prod.brand || prod.brandInspiration}` : (prod.gender ? `${prod.gender}'s Collection` : 'Extrait de Parfum')}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1410', fontFamily: 'var(--font-mono)' }}>
                              From RM{prod.price_30ml ? Number(prod.price_30ml).toFixed(0) : '45'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#8c7d70', fontSize: '0.82rem' }}>
                      No exact matches found for &quot;{searchQuery}&quot;.
                    </div>
                  )}

                  <a
                    href={`collection.html?q=${encodeURIComponent(searchQuery.trim())}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      background: '#1a1410',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em'
                    }}
                  >
                    <span>View all results for &quot;{searchQuery}&quot;</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              )}
            </div>

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
                    placeholder="Search perfumes, brands, #..." 
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
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', padding: '1px', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </form>

                {/* Mobile Live Suggestions List */}
                {searchQuery.trim().length >= 2 && (
                  <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #ede8e0', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{ padding: '8px 12px', background: '#faf8f5', borderBottom: '1px solid #ede8e0', fontSize: '0.7rem', fontWeight: 700, color: '#786558', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Suggestions ({liveSearchResults.length})
                    </div>
                    {liveSearchResults.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderBottom: '1px solid #f5f2eb', cursor: 'pointer' }}
                      >
                        <img
                          src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&auto=format&fit=crop&q=80'}
                          alt={prod.name}
                          style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#f8f6f2', borderRadius: '4px' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1410', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.name} {prod.catalogNo ? `(#${prod.catalogNo})` : ''}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#786558', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.brand || prod.brandInspiration || 'Extrait de Parfum'}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1a1410' }}>
                          RM{prod.price_30ml ? Number(prod.price_30ml).toFixed(0) : '45'}
                        </span>
                      </div>
                    ))}
                    <a
                      href={`collection.html?q=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => setIsMenuOpen(false)}
                      style={{ display: 'block', padding: '9px 12px', background: '#1a1410', color: '#ffffff', textAlign: 'center', fontSize: '0.76rem', fontWeight: 700, textDecoration: 'none' }}
                    >
                      View all results &rarr;
                    </a>
                  </div>
                )}

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
