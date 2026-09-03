import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  RotateCcw, 
  X,
  Cloud,
  Compass
} from 'lucide-react';
import { ValenszoLogo } from './ValenszoLogo';

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
    selectedCategory,
    setSelectedCategory
  } = useStore();

  const [isResetting, setIsResetting] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

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

      <header className="site-header">
        <div className="container">
          <div className="nav-container">
            
            {/* Left Column: Valenszo Navigation Links */}
            <div className="dior-navbar-links hide-mobile">
              <button 
                className={`dior-nav-link ${selectedCategory === 'All Sauvage' || selectedCategory === 'All Creations' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All Creations')}
              >
                Creations
              </button>
              <button 
                className={`dior-nav-link ${selectedCategory === 'La Collection Privée' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('La Collection Privée')}
              >
                La Collection Privée
              </button>
              <button 
                className={`dior-nav-link ${selectedCategory === 'Discovery & Sets' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('Discovery & Sets')}
              >
                Gift Sets
              </button>
            </div>

            {/* Center Column: Iconic Centered VALENSZO Logo with VL Monogram */}
            <div 
              style={{ textAlign: 'center', cursor: 'pointer', padding: '4px 12px' }}
              onClick={() => setSelectedCategory('All Creations')}
              title="VALENSZO Fragrance Malaysia"
            >
              <ValenszoLogo size="md" subtitle="FRAGRANCE MALAYSIA" />
            </div>

            {/* Right Column: Search, Atelier Mode & Shopping Bag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              
              {/* Scent Search Trigger / Input */}
              {showSearchBox ? (
                <div style={{ position: 'relative', width: '220px' }}>
                  <input
                    type="text"
                    autoFocus
                    className="form-input"
                    placeholder="Search Valenszo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '6px 30px 6px 12px', fontSize: '0.82rem' }}
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchBox(false);
                    }}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
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
                >
                  <Search size={17} />
                </button>
              )}

              {/* Order Tracker */}
              <button
                className="btn-icon hide-mobile"
                onClick={() => setIsOrderTrackerOpen(true)}
                title="Delivery Tracker"
                aria-label="Delivery Tracker"
              >
                <Compass size={17} />
              </button>

              {/* Cloud Sync Status */}
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

              {/* Reset Catalog Button */}
              <button
                className="btn-icon"
                onClick={handleReset}
                disabled={isResetting}
                title="Reset / Seed Valenszo Catalog"
                aria-label="Reset Collection"
              >
                <RotateCcw size={15} className={isResetting ? 'spin' : ''} />
              </button>

              {/* Role Toggle Switcher: Boutique vs Atelier Admin */}
              <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 'var(--radius-sm)', padding: '3px', gap: '2px' }}>
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

              {/* Shopping Bag Button */}
              {role === 'customer' && (
                <button
                  className="btn btn-dior-black"
                  onClick={() => setIsCartOpen(true)}
                  style={{ padding: '9px 18px', fontSize: '0.78rem' }}
                  aria-label={`Shopping Bag (${cartTotalItems} items)`}
                >
                  <ShoppingBag size={16} />
                  <span>Bag</span>
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
                        fontSize: '0.7rem',
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
