import React from 'react';
import { Home, Compass, Sparkles, MessageCircle } from 'lucide-react';

export const MobileBottomNav = () => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';

  const isHome = currentPath === '' || currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('/');
  const isShop = currentPath.includes('collection') || currentPath.includes('men') || currentPath.includes('women');
  const isQuiz = currentPath.includes('diagnostic');

  return (
    <nav 
      className="valenszo-mobile-bottom-nav"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(250, 248, 245, 0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid #ede8e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 0 10px',
        zIndex: 998,
        boxShadow: '0 -2px 12px rgba(44, 26, 17, 0.06)'
      }}
    >
      <a 
        href="index.html"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isHome ? '#2b1810' : '#8c7d72',
          fontWeight: isHome ? 800 : 500,
          fontSize: '0.68rem',
          letterSpacing: '0.04em'
        }}
      >
        <Home size={20} strokeWidth={isHome ? 2.4 : 1.7} color={isHome ? '#2b1810' : '#8c7d72'} />
        <span>Home</span>
      </a>

      <a 
        href="collection.html"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isShop ? '#2b1810' : '#8c7d72',
          fontWeight: isShop ? 800 : 500,
          fontSize: '0.68rem',
          letterSpacing: '0.04em'
        }}
      >
        <Compass size={20} strokeWidth={isShop ? 2.4 : 1.7} color={isShop ? '#2b1810' : '#8c7d72'} />
        <span>Shop</span>
      </a>

      <a 
        href="diagnostic.html"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isQuiz ? '#d97706' : '#8c7d72',
          fontWeight: isQuiz ? 800 : 500,
          fontSize: '0.68rem',
          letterSpacing: '0.04em'
        }}
      >
        <Sparkles size={20} strokeWidth={isQuiz ? 2.4 : 1.7} color={isQuiz ? '#d97706' : '#8c7d72'} />
        <span>Quiz</span>
      </a>

      <a 
        href="https://wa.me/60182868402?text=Hello%20Valenszo%20Fragrance%20Concierge!%20I%20am%20browsing%20your%20online%20catalog."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: '#128C7E',
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: 0,
          letterSpacing: '0.04em'
        }}
      >
        <MessageCircle size={20} strokeWidth={2} color="#128C7E" />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
};
