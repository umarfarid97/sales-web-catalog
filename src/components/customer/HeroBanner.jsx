import React from 'react';

export const HeroBanner = () => {
  return (
    <section 
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #09090b 0%, #141210 50%, #09090b 100%)',
        color: '#ffffff',
        overflow: 'hidden',
        borderBottom: '1px solid #27272a'
      }}
    >
      {/* Ambient warm gold backlight highlight behind bottles */}
      <div 
        style={{
          position: 'absolute',
          top: '15%',
          right: '12%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      <div 
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1rem, 4vw, 3rem)',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          alignItems: 'center',
          gap: 'clamp(1.5rem, 4vw, 3.5rem)',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Left Editorial Text Column (Balanced Luxury Typography) */}
        <div style={{ maxWidth: '540px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#c5a059',
              marginBottom: '1rem'
            }}
          >
            <span>Maison Valenszo</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>Haute Parfumerie</span>
          </div>

          <h1 
            style={{
              fontFamily: 'var(--font-brand, "Bodoni Moda", "Playfair Display", serif)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.12,
              color: '#ffffff',
              margin: '0 0 1.25rem',
              letterSpacing: '-0.015em',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.95)'
            }}
          >
            More Than a Scent,
            <br />
            A Better You
          </h1>

          <p 
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.18rem)',
              color: '#f4f4f5',
              fontWeight: 400,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '460px',
              fontFamily: 'var(--font-couture, sans-serif)',
              letterSpacing: '0.02em',
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.95)'
            }}
          >
            Premium inspired fragrances crafted for confidence, elegance, and every defining moment.
          </p>
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
