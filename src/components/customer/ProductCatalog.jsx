import React from 'react';
import { HeroBanner } from './HeroBanner';
import { 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Truck
} from 'lucide-react';

export const ProductCatalog = () => {
  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Cinematic Campaign Hero Slider */}
      <HeroBanner />

      {/* 2. DUAL COLLECTION SPLIT CARDS (MEN & WOMEN) - ZERO GAP */}
      <section 
        style={{ 
          background: '#ffffff', 
          margin: 0, 
          padding: '8px clamp(8px, 2vw, 16px) 8px' 
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(6px, 1.5vw, 12px)' }}>
          
          {/* SHOP MEN CARD */}
          <a 
            href="/men"
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: 'clamp(240px, 48vw, 420px)',
              background: '#09090b',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(1rem, 3vw, 1.8rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundImage: 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              textDecoration: 'none',
              transition: 'transform 0.25s ease'
            }}
          >
            {/* Deep dark gradient overlay protecting bottom text from camouflage */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.15) 75%, transparent 100%)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
              <h3 
                style={{ 
                  fontFamily: 'var(--font-brand, serif)', 
                  fontSize: 'clamp(1.15rem, 2.8vw, 1.6rem)', 
                  fontWeight: 800, 
                  margin: '0 0 3px', 
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.95)'
                }}
              >
                SHOP MEN
              </h3>
              <p 
                style={{ 
                  fontSize: 'clamp(0.72rem, 1.6vw, 0.86rem)', 
                  color: '#f3f4f6', 
                  fontWeight: 600, 
                  lineHeight: 1.35, 
                  margin: '0 0 10px',
                  textShadow: '0 1px 6px rgba(0,0,0,0.95)'
                }}
              >
                Bold. Refined. Confident.
              </p>
              <div 
                style={{
                  width: 'clamp(32px, 4.5vw, 42px)',
                  height: 'clamp(32px, 4.5vw, 42px)',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
                }}
              >
                <ArrowRight size={16} color="#111827" strokeWidth={2.6} />
              </div>
            </div>
          </a>

          {/* SHOP WOMEN CARD */}
          <a 
            href="/women"
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: 'clamp(240px, 48vw, 420px)',
              background: '#18181b',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(1rem, 3vw, 1.8rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              textDecoration: 'none',
              transition: 'transform 0.25s ease'
            }}
          >
            {/* Deep dark gradient overlay protecting bottom text from camouflage */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.15) 75%, transparent 100%)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
              <h3 
                style={{ 
                  fontFamily: 'var(--font-brand, serif)', 
                  fontSize: 'clamp(1.15rem, 2.8vw, 1.6rem)', 
                  fontWeight: 800, 
                  margin: '0 0 3px', 
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.95)'
                }}
              >
                SHOP WOMEN
              </h3>
              <p 
                style={{ 
                  fontSize: 'clamp(0.72rem, 1.6vw, 0.86rem)', 
                  color: '#f3f4f6', 
                  fontWeight: 600, 
                  lineHeight: 1.35, 
                  margin: '0 0 10px',
                  textShadow: '0 1px 6px rgba(0,0,0,0.95)'
                }}
              >
                Elegant. Feminine. Unique.
              </p>
              <div 
                style={{
                  width: 'clamp(32px, 4.5vw, 42px)',
                  height: 'clamp(32px, 4.5vw, 42px)',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
                }}
              >
                <ArrowRight size={16} color="#111827" strokeWidth={2.6} />
              </div>
            </div>
          </a>

        </div>
      </section>

      {/* 3. FOUR PILLARS LUXURY TRUST RIBBON - FLUSH, ZERO GAP */}
      <section 
        style={{ 
          background: '#f8f9fa',
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
          margin: 0,
          padding: '12px clamp(8px, 2vw, 16px)'
        }}
      >
        <div 
          className="trust-ribbon-grid"
          style={{ 
            maxWidth: '1280px', 
            margin: '0 auto',
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '10px',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <ShieldCheck size={18} color="#b45309" strokeWidth={2.4} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.78rem)', fontWeight: 700, color: '#111827', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Premium Quality
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <Clock size={18} color="#b45309" strokeWidth={2.4} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.78rem)', fontWeight: 700, color: '#111827', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Long Lasting
            </span>
          </div>
          <a href="/bundle" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', textDecoration: 'none', color: '#111827' }}>
            <Sparkles size={18} color="#b45309" strokeWidth={2.4} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.78rem)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Explore Bundles
            </span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <Truck size={18} color="#b45309" strokeWidth={2.4} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.78rem)', fontWeight: 700, color: '#111827', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Fast Shipping
            </span>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE BUNDLE & SAVE PROMOTION BANNER - FLUSH, ZERO GAP */}
      <section 
        style={{ 
          background: '#ffffff',
          margin: 0, 
          padding: '10px clamp(8px, 2vw, 16px) 24px' 
        }}
      >
        <div 
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #111827 0%, #000000 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: 'clamp(1.5rem, 3.5vw, 3rem)',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '4px 12px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Sparkles size={14} />
              <span>The Maison Scent Wardrobe</span>
            </div>
            <h3 
              style={{ 
                fontFamily: 'var(--font-brand, serif)', 
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
                fontWeight: 800, 
                margin: '0 0 0.85rem', 
                letterSpacing: '-0.01em', 
                lineHeight: 1.2,
                color: '#ffffff',
                textShadow: '0 2px 12px rgba(0,0,0,0.85)'
              }}
            >
              CURATE YOUR SIGNATURE BUNDLE & SAVE UP TO 25%
            </h3>
            <p 
              style={{ 
                color: '#f3f4f6', 
                fontSize: '0.9rem', 
                lineHeight: 1.55, 
                margin: '0 0 1.5rem', 
                maxWidth: '480px',
                fontWeight: 500,
                textShadow: '0 1px 6px rgba(0,0,0,0.8)'
              }}
            >
              In French perfumery, signature presence comes from layering. Choose 3 or 5 of your favorite creations to enjoy exclusive bundle pricing and receive complimentary collector gift presentation.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { window.location.href = '/bundle'; }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '4px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                }}
              >
                <span>Build Your Bundle</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => { window.location.href = '/diagnostic'; }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '4px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1.5px solid rgba(255,255,255,0.75)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Take Scent Quiz
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div 
              onClick={() => { window.location.href = '/bundle'; }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '8px',
                padding: '1.25rem 1rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Save 15%
              </div>
              <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.35rem', fontWeight: 800, margin: '4px 0 2px', color: '#ffffff' }}>
                RM115
              </div>
              <div style={{ fontSize: '0.7rem', color: '#cbd5e1', textDecoration: 'line-through' }}>
                Standard RM135
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '6px', color: '#ffffff' }}>
                3-Bottle Wardrobe
              </div>
              <div style={{ fontSize: '0.7rem', color: '#e2e8f0', marginTop: '3px' }}>
                Anchor + 2 Companions
              </div>
            </div>

            <div 
              onClick={() => { window.location.href = '/bundle'; }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(245, 158, 11, 0.6)',
                borderRadius: '8px',
                padding: '1.25rem 1rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Save 25% · Best Value
              </div>
              <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.35rem', fontWeight: 800, margin: '4px 0 2px', color: '#ffffff' }}>
                RM169
              </div>
              <div style={{ fontSize: '0.7rem', color: '#cbd5e1', textDecoration: 'line-through' }}>
                Standard RM225
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '6px', color: '#ffffff' }}>
                5-Bottle Master Collector
              </div>
              <div style={{ fontSize: '0.7rem', color: '#e2e8f0', marginTop: '3px' }}>
                Full Olfactory Spectrum
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .trust-ribbon-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px 8px !important;
          }
        }
      `}</style>
    </div>
  );
};
