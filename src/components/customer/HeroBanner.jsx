import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HeroBanner = () => {
  const handleShopNow = () => {
    window.location.href = '/collection.html';
  };

  return (
    <section 
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #09090b 0%, #181512 50%, #0d0c0a 100%)',
        color: '#ffffff',
        overflow: 'hidden',
        borderBottom: '1px solid #27272a'
      }}
    >
      {/* Ambient warm gold backlight highlight behind bottles */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.18) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      <div 
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 3rem)',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          alignItems: 'center',
          gap: 'clamp(1rem, 3vw, 2.5rem)',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Left Editorial Text Column (Matching Picture 1) */}
        <div style={{ maxWidth: '480px' }}>
          <h1 
            style={{
              fontFamily: 'var(--font-brand, "Bodoni Moda", "Playfair Display", serif)',
              fontSize: 'clamp(2.1rem, 5.5vw, 3.8rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#fdfbf7',
              margin: '0 0 1rem',
              letterSpacing: '-0.02em'
            }}
          >
            More<br />
            Than a Scent<br />
            A Better You
          </h1>

          <p 
            style={{
              fontSize: 'clamp(0.88rem, 2vw, 1.1rem)',
              color: '#c9baa9',
              lineHeight: 1.5,
              margin: '0 0 1.75rem',
              maxWidth: '380px',
              fontFamily: 'var(--font-couture, sans-serif)'
            }}
          >
            Premium inspired fragrances for every moment.
          </p>

          <a
            href="/collection.html"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '13px 32px',
              borderRadius: '6px',
              background: '#edd9c0',
              color: '#1a1816',
              fontWeight: 800,
              fontSize: '0.86rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dfc6a6';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#edd9c0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Shop Now
          </a>
        </div>

        {/* Right Visual: Two luxury perfume bottles matching Picture 1 */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 'clamp(8px, 2.5vw, 20px)',
            position: 'relative'
          }}
        >
          {/* Bottle 1: Noir Flacon */}
          <div 
            style={{
              width: 'clamp(115px, 20vw, 210px)',
              filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.85))',
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&auto=format&fit=crop&q=80" 
              alt="Valenszo Noir Absolu"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Bottle 2: Champagne Amber Flacon */}
          <div 
            style={{
              width: 'clamp(110px, 19vw, 200px)',
              filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.85))',
              position: 'relative',
              marginBottom: '-6px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=700&auto=format&fit=crop&q=80" 
              alt="Valenszo Amber Royale"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
