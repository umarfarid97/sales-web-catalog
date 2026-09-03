import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  UserCheck, 
  Sparkles, 
  RotateCcw, 
  X,
  Compass,
  Gift,
  Cloud,
  Layers
} from 'lucide-react';

export const Navbar = () => {
  const { 
    role, 
    setRole, 
    cartTotalItems, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery,
    isCloudConnected,
    resetToDemoData,
    showToast,
    setIsOrderTrackerOpen,
    setSelectedCategory
  } = useStore();

  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset catalog to the complete Dior Sauvage & Haute Parfumerie collection?')) {
      setIsResetting(true);
      await resetToDemoData();
      setIsResetting(false);
      showToast('Catalog refreshed with the complete Sauvage & Privée collection!', 'success');
    }
  };

  return (
    <>
      {/* Top Dior Couture Announcement Bar */}
      <div className="dior-announcement-bar">
        COMPLIMENTARY ART OF GIFTING &amp; 2 SAMPLES WITH EVERY ORDER &bull; <span>FREE WHITE-GLOVE CLIMATE DELIVERY</span>
      </div>

      <header className="site-header">
        <div className="container">
          <div className="nav-container">
            
            {/* Brand Mark: LUMINA • SAUVAGE */}
            <div 
              className="brand-logo"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedCategory('All Creations')}
            >
              <div className="brand-icon-box" style={{ background: 'var(--accent-copper-gradient)', width: '38px', height: '38px', borderRadius: '4px' }}>
                <Sparkles size={20} color="#040711" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="couture-title" style={{ fontSize: '1.25rem', letterSpacing: '0.28em', lineHeight: 1.1 }}>
                  SAUVAGE
                </span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent-copper-light)', fontWeight: 700 }}>
                  Haute Parfumerie Paris
                </span>
              </div>
            </div>

            {/* Scent Search Bar */}
            <div className="nav-search-wrap">
              <Search size={15} className="nav-search-icon" style={{ color: 'var(--accent-copper-light)' }} />
              <input
                type="text"
                className="nav-search-input"
                placeholder="Search raw notes (Bergamot, Vanilla, Cardamom, Elixir)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search Fragrance Vault"
              />
              {searchQuery && (
                <button
                  className="nav-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear Search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Navigation Actions */}
            <div className="nav-actions">
              
              {/* Order Tracker */}
              <button
                className="btn-icon hide-mobile"
                onClick={() => setIsOrderTrackerOpen(true)}
                title="Maison Delivery Tracker"
                aria-label="Maison Delivery Tracker"
              >
                <Compass size={18} />
              </button>

              {/* Cloud Sync Status Indicator */}
              <div 
                className="hide-mobile"
                title={isCloudConnected ? "Connected to Supabase PostgreSQL" : "Local Storage Mode"}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '5px 12px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: isCloudConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                  border: isCloudConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-couture)',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  color: isCloudConnected ? '#34d399' : 'var(--text-muted)'
                }}
              >
                <Cloud size={13} />
                <span>{isCloudConnected ? 'SUPABASE LIVE' : 'OFFLINE'}</span>
              </div>

              {/* Reset Catalog Button */}
              <button
                className="btn-icon"
                onClick={handleReset}
                disabled={isResetting}
                title="Reset / Seed Sauvage Collection"
                aria-label="Reset Collection"
              >
                <RotateCcw size={16} className={isResetting ? 'spin' : ''} />
              </button>

              {/* Role Switcher: Customer vs Maison Admin */}
              <div className="role-toggle-group">
                <button
                  className={`role-toggle-btn ${role === 'customer' ? 'active' : ''}`}
                  onClick={() => setRole('customer')}
                  aria-label="Boutique Mode"
                >
                  <Sparkles size={13} />
                  <span>Boutique</span>
                </button>
                <button
                  className={`role-toggle-btn ${role === 'admin' ? 'active-admin' : ''}`}
                  onClick={() => setRole('admin')}
                  aria-label="Maison Atelier Mode"
                >
                  <UserCheck size={13} />
                  <span>Atelier</span>
                </button>
              </div>

              {/* Shopping Bag Button */}
              {role === 'customer' && (
                <button
                  className="btn btn-dior-solid"
                  onClick={() => setIsCartOpen(true)}
                  style={{ padding: '10px 18px', position: 'relative' }}
                  aria-label={`Shopping Bag (${cartTotalItems} items)`}
                >
                  <ShoppingBag size={17} />
                  <span style={{ fontSize: '0.8rem' }}>Bag</span>
                  {cartTotalItems > 0 && (
                    <span 
                      style={{
                        background: 'var(--accent-copper)',
                        color: '#040711',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        marginLeft: '4px'
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
      </header>
    </>
  );
};
