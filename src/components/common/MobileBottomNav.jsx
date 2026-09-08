import React from 'react';
import { Home, Compass, Gift, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

export const MobileBottomNav = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { setIsOrderTrackerOpen } = useStore();

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const isHome = currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '';
  const isShop = currentPath.includes('collection');
  const isBundles = currentPath.includes('bundle');

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      openAuthModal({ mode: 'signin', title: 'Maison Client Account' });
    } else {
      setIsOrderTrackerOpen(true);
    }
  };

  return (
    <nav 
      className="valenszo-mobile-bottom-nav"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(9, 11, 16, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 0 10px',
        zIndex: 998,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      <a 
        href="/"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isHome ? '#c5a059' : '#9ca3af',
          fontWeight: isHome ? 700 : 500,
          fontSize: '0.68rem',
          letterSpacing: '0.04em'
        }}
      >
        <Home size={20} strokeWidth={isHome ? 2.4 : 1.7} color={isHome ? '#c5a059' : '#9ca3af'} />
        <span>Home</span>
      </a>

      <a 
        href="/collection"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isShop ? '#c5a059' : '#9ca3af',
          fontWeight: isShop ? 700 : 500,
          fontSize: '0.68rem',
          letterSpacing: '0.04em'
        }}
      >
        <Compass size={20} strokeWidth={isShop ? 2.4 : 1.7} color={isShop ? '#c5a059' : '#9ca3af'} />
        <span>Shop</span>
      </a>

      <a 
        href="/bundle"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isBundles ? '#c5a059' : '#9ca3af',
          fontWeight: isBundles ? 700 : 500,
          fontSize: '0.68rem',
          letterSpacing: '0.04em'
        }}
      >
        <Gift size={20} strokeWidth={isBundles ? 2.4 : 1.7} color={isBundles ? '#c5a059' : '#9ca3af'} />
        <span>Bundles</span>
      </a>

      <button 
        type="button"
        onClick={handleAccountClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#9ca3af',
          fontSize: '0.68rem',
          fontWeight: 500,
          padding: 0,
          letterSpacing: '0.04em'
        }}
      >
        <User size={20} strokeWidth={1.7} color="#9ca3af" />
        <span>Account</span>
      </button>
    </nav>
  );
};
