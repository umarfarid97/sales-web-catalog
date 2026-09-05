import React from 'react';
import { HeroBanner } from './HeroBanner';
import { SavoirFaireSection } from './SavoirFaireSection';
import { 
  Gift, 
  RefreshCw, 
  Feather, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ProductCatalog = () => {
  return (
    <div>
      {/* 1. Cinematic Campaign Hero (Picture 1: 'More Than a Scent, A Better You') */}
      <HeroBanner />

      {/* 2. DUAL COLLECTION SPLIT CARDS (MEN & WOMEN - MATCHING PICTURE 1) */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem clamp(12px, 3.5vw, 24px) 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px, 2.5vw, 24px)' }}>
          
          {/* SHOP MEN CARD */}
          <div 
            onClick={() => { window.location.href = '/collection.html?gender=Men'; }}
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: 'clamp(260px, 46vw, 440px)',
              background: '#09090b',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(1rem, 3.5vw, 2rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              backgroundImage: 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              transition: 'transform 0.25s ease'
            }}
          >
            {/* Dark gradient overlay protecting bottom text */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
              <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: 'clamp(1.15rem, 3vw, 1.6rem)', fontWeight: 800, margin: '0 0 4px', letterSpacing: '0.02em' }}>
                SHOP MEN
              </h3>
              <p style={{ fontSize: 'clamp(0.72rem, 1.8vw, 0.86rem)', color: '#d1d5db', lineHeight: 1.4, margin: '0 0 12px' }}>
                Bold. Refined. Confident.
              </p>
              <div 
                style={{
                  width: 'clamp(36px, 5vw, 44px)',
                  height: 'clamp(36px, 5vw, 44px)',
                  borderRadius: '50%',
                  background: '#edd9c0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <ArrowRight size={18} color="#111827" strokeWidth={2.4} />
              </div>
            </div>
          </div>

          {/* SHOP WOMEN CARD */}
          <div 
            onClick={() => { window.location.href = '/collection.html?gender=Women'; }}
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: 'clamp(260px, 46vw, 440px)',
              background: '#18181b',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(1rem, 3.5vw, 2rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              transition: 'transform 0.25s ease'
            }}
          >
            {/* Dark gradient overlay protecting bottom text */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
              <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: 'clamp(1.15rem, 3vw, 1.6rem)', fontWeight: 800, margin: '0 0 4px', letterSpacing: '0.02em' }}>
                SHOP WOMEN
              </h3>
              <p style={{ fontSize: 'clamp(0.72rem, 1.8vw, 0.86rem)', color: '#d1d5db', lineHeight: 1.4, margin: '0 0 12px' }}>
                Elegant. Feminine. Unique.
              </p>
              <div 
                style={{
                  width: 'clamp(36px, 5vw, 44px)',
                  height: 'clamp(36px, 5vw, 44px)',
                  borderRadius: '50%',
                  background: '#edd9c0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <ArrowRight size={18} color="#111827" strokeWidth={2.4} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SIGNATURE BUNDLE & SAVE PROMOTION BANNER */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '1rem clamp(16px, 3.5vw, 36px) 3rem' }}>
        <div 
          style={{
            background: 'linear-gradient(135deg, #111827 0%, #000000 100%)',
            borderRadius: '12px',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(197, 160, 89, 0.2)', color: '#c5a059', padding: '4px 12px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Sparkles size={14} />
              <span>The Maison Scent Wardrobe</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              CURATE YOUR SIGNATURE BUNDLE & SAVE UP TO 25%
            </h3>
            <p style={{ color: '#d1d5db', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.75rem', maxWidth: '480px' }}>
              In French perfumery, signature presence comes from layering. Choose 3 or 5 of your favorite creations to enjoy exclusive bundle pricing and receive complimentary collector gift presentation.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => { window.location.href = '/bundle.html'; }}
                style={{
                  padding: '14px 28px',
                  borderRadius: '4px',
                  background: '#c5a059',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Build Your Bundle</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => { window.location.href = '/diagnostic.html'; }}
                style={{
                  padding: '14px 28px',
                  borderRadius: '4px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Take Scent Quiz
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div 
              onClick={() => { window.location.href = '/bundle.html'; }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#c5a059', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Save 15%
              </div>
              <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 2px' }}>
                RM115
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                Standard RM135
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '8px', color: '#ffffff' }}>
                3-Bottle Wardrobe
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>
                Anchor + 2 Companions
              </div>
            </div>

            <div 
              onClick={() => { window.location.href = '/bundle.html'; }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Save 25% · Best Value
              </div>
              <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 2px' }}>
                RM169
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                Standard RM225
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '8px', color: '#ffffff' }}>
                5-Bottle Master Collector
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>
                Full Olfactory Spectrum
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Savoir-Faire Raw Materials Showcase */}
      <SavoirFaireSection />

      {/* 5. The Valenszo Art of Gifting Experience */}
      <section className="dior-gifting-experience">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <div className="couture-sub" style={{ marginBottom: '6px' }}>
              Online Boutique Privileges
            </div>
            <h2 className="couture-title" style={{ fontSize: '2rem', color: '#000000' }}>
              The Valenszo Art of Gifting
            </h2>
            <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Make each gift unique with personalized engraving, iconic Valenszo presentation boxes, and complimentary deluxe samples.
            </p>
          </div>

          <div className="dior-gifting-grid">
            <div className="dior-gifting-card">
              <div className="dior-gifting-icon">
                <Gift size={24} />
              </div>
              <h3 className="couture-title" style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Iconic Gift Box</h3>
              <p style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                Every order is nestled in the signature Valenszo gift box, tied with a custom ribbon.
              </p>
            </div>

            <div className="dior-gifting-card">
              <div className="dior-gifting-icon">
                <Feather size={24} />
              </div>
              <h3 className="couture-title" style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Personalized Engraving</h3>
              <p style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                Engrave your flacon with initials or a memorable date for a bespoke keepsake.
              </p>
            </div>

            <div className="dior-gifting-card">
              <div className="dior-gifting-icon">
                <RefreshCw size={24} />
              </div>
              <h3 className="couture-title" style={{ fontSize: '0.95rem', marginBottom: '8px' }}>2 Deluxe Samples</h3>
              <p style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                Discover new olfactory creations with 2 complimentary deluxe miniatures.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
