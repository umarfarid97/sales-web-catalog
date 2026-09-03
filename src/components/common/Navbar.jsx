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
  RotateCcw,
  Flame
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
    resetToDemoData,
    isCloudConnected
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
            <div className="brand-icon-box" style={{ background: 'var(--accent-gold-gradient)' }}>
              <Flame size={20} color="#0b0c10" />
            </div>
            <div>
              <span className="font-serif-title" style={{ letterSpacing: '0.12em', fontSize: '1.25rem' }}>LUMINA</span>
              <span style={{ fontSize: '0.62rem', display: 'block', color: 'var(--accent-gold)', letterSpacing: '0.2em', marginTop: '-2px', textTransform: 'uppercase', fontWeight: '700' }}>
                HAUTE PARFUMERIE PARIS
              </span>
            </div>
          </div>

          {/* Search Bar (Customer Mode) */}
          {role === 'customer' && (
            <div className="nav-search-wrap">
              <Search size={18} className="nav-search-icon" style={{ color: 'var(--accent-gold)' }} />
              <input
                type="text"
                placeholder="Search scents, notes (Oud, Vanilla, Rose, Neroli, Cardamom)..."
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
                <span>Boutique</span>
              </button>

              <button
                className={`role-toggle-btn ${role === 'admin' ? 'active-admin' : ''}`}
                onClick={() => setRole('admin')}
                title="Merchant Admin Operations"
              >
                <ShieldCheck size={15} />
                <span>Maison Admin</span>
              </button>
            </div>

            {/* Track Order Button */}
            {role === 'customer' && (
              <button 
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                onClick={() => setIsOrderTrackerOpen(true)}
                title="Track your fragrance delivery"
              >
                <Truck size={15} color="var(--accent-gold)" />
                <span className="hide-mobile">Track Scent</span>
              </button>
            )}

            {/* Wishlist Indicator */}
            {role === 'customer' && (
              <button
                className="btn-icon"
                title={`Saved Fragrances (${favorites.length})`}
                style={{ position: 'relative' }}
              >
                <Heart size={18} color={favorites.length > 0 ? '#fb7185' : 'var(--text-muted)'} fill={favorites.length > 0 ? '#fb7185' : 'none'} />
                {favorites.length > 0 && (
                  <span className="nav-badge-count" style={{ backgroundColor: '#fb7185' }}>
                    {favorites.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button */}
            {role === 'customer' && (
              <button
                className="btn btn-gold"
                style={{ padding: '8px 16px', fontSize: '0.88rem', position: 'relative' }}
                onClick={() => setIsCartOpen(true)}
                title="Open Shopping Bag"
              >
                <ShoppingBag size={17} />
                <span>Bag</span>
                {cartItemCount > 0 && (
                  <span className="badge" style={{ background: '#0b0c10', color: '#fce08b', padding: '1px 7px', fontSize: '0.72rem' }}>
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* Factory Demo Reset Button (Convenience Helper) */}
            <button
              className="btn-icon"
              onClick={resetToDemoData}
              title="Reset to default luxury catalog"
              style={{ opacity: 0.65 }}
            >
              <RotateCcw size={15} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
