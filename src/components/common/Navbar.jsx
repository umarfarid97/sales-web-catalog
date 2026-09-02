import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  X, 
  Heart, 
  ShieldCheck, 
  Store, 
  Truck, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const Navbar = () => {
  const {
    role,
    setRole,
    searchQuery,
    setSearchQuery,
    cartItemCount,
    cartSubtotal,
    setIsCartOpen,
    favorites,
    setIsOrderTrackerOpen,
    resetToDemoData
  } = useStore();

  return (
    <header className="site-header">
      <div className="container">
        <div className="nav-container">
          
          {/* Brand Logo */}
          <div 
            className="brand-logo" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setRole('customer');
              setSearchQuery('');
            }}
          >
            <div className="brand-icon-box">
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <span>LUMINA</span>
              <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--accent-primary)', letterSpacing: '0.15em', marginTop: '-4px' }}>
                STUDIO STORE
              </span>
            </div>
          </div>

          {/* Search Bar (Customer Mode) */}
          {role === 'customer' && (
            <div className="nav-search-wrap">
              <Search size={18} className="nav-search-icon" />
              <input
                type="text"
                placeholder="Search high-fidelity gear, audio, keyboards, smart home..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nav-search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="nav-search-clear"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {/* Actions & Role Switcher */}
          <div className="nav-actions">
            
            {/* Role Switcher Pill */}
            <div className="role-toggle-group">
              <button
                className={`role-toggle-btn ${role === 'customer' ? 'active' : ''}`}
                onClick={() => setRole('customer')}
                title="Customer Storefront View"
              >
                <Store size={15} />
                <span>Store</span>
              </button>

              <button
                className={`role-toggle-btn ${role === 'admin' ? 'active-admin' : ''}`}
                onClick={() => setRole('admin')}
                title="Merchant Admin Operations"
              >
                <ShieldCheck size={15} />
                <span>Admin View</span>
              </button>
            </div>

            {role === 'customer' && (
              <>
                {/* Track Order Trigger */}
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsOrderTrackerOpen(true)}
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  title="Track Your Order"
                >
                  <Truck size={15} />
                  <span>Track Order</span>
                </button>

                {/* Cart Trigger */}
                <button
                  className="cart-trigger-btn"
                  onClick={() => setIsCartOpen(true)}
                  aria-label={`Open Cart with ${cartItemCount} items`}
                >
                  <ShoppingBag size={18} />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="cart-count-badge">
                      {cartItemCount}
                    </span>
                  )}
                  {cartSubtotal > 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#818cf8', marginLeft: '4px', fontWeight: 700 }}>
                      ${cartSubtotal.toFixed(0)}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Quick Demo Reset Utility */}
            <button
              onClick={resetToDemoData}
              className="btn-icon"
              title="Reset Demo Data (Factory Defaults)"
              style={{ width: '36px', height: '36px' }}
            >
              <RotateCcw size={15} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
