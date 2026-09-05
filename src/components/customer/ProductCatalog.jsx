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
    <div>
      {/* 1. Cinematic Campaign Hero (Picture 1: 'More Than a Scent, A Better You') */}
      <HeroBanner />

      {/* 2. DUAL COLLECTION SPLIT CARDS (MEN & WOMEN - MATCHING PICTURE 1) */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem clamp(12px, 3.5vw, 24px) 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px, 2.5vw, 24px)' }}>
          
          {/* SHOP MEN CARD */}
          <a 
            href="/men.html"
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
                  fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', 
                  fontWeight: 800, 
                  margin: '0 0 4px', 
                  letterSpacing: '0.02em',
                  color: '#ffffff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.95)'
                }}
              >
                SHOP MEN
              </h3>
              <p 
                style={{ 
                  fontSize: 'clamp(0.76rem, 1.8vw, 0.9rem)', 
                  color: '#f3f4f6', 
                  fontWeight: 600, 
                  lineHeight: 1.4, 
                  margin: '0 0 12px',
                  textShadow: '0 1px 6px rgba(0,0,0,0.95)'
                }}
              >
                Bold. Refined. Confident.
              </p>
              <div 
                style={{
                  width: 'clamp(36px, 5vw, 44px)',
                  height: 'clamp(36px, 5vw, 44px)',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
                }}
              >
                <ArrowRight size={18} color="#111827" strokeWidth={2.6} />
              </div>
            </div>
          </a>

          {/* SHOP WOMEN CARD */}
          <a 
            href="/women.html"
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
                  fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', 
                  fontWeight: 800, 
                  margin: '0 0 4px', 
                  letterSpacing: '0.02em',
                  color: '#ffffff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.95)'
                }}
              >
                SHOP WOMEN
              </h3>
              <p 
                style={{ 
                  fontSize: 'clamp(0.76rem, 1.8vw, 0.9rem)', 
                  color: '#f3f4f6', 
                  fontWeight: 600, 
                  lineHeight: 1.4, 
                  margin: '0 0 12px',
                  textShadow: '0 1px 6px rgba(0,0,0,0.95)'
                }}
              >
                Elegant. Feminine. Unique.
              </p>
              <div 
                style={{
                  width: 'clamp(36px, 5vw, 44px)',
                  height: 'clamp(36px, 5vw, 44px)',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
                }}
              >
                <ArrowRight size={18} color="#111827" strokeWidth={2.6} />
              </div>
            </div>
          </a>

        </div>
      </section>

      {/* 3. FOUR PILLARS TRUST STRIP (MATCHING PICTURE 1) */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(12px, 3.5vw, 24px) 2.5rem' }}>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
            gap: '12px',
            background: '#fcfbf9',
            border: '1px solid #e7e5e4',
            borderRadius: '8px',
            padding: '1.25rem 1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#b45309" strokeWidth={2.2} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1c1917', letterSpacing: '0.04em' }}>Premium Quality</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <Clock size={20} color="#b45309" strokeWidth={2.2} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1c1917', letterSpacing: '0.04em' }}>Long Lasting</span>
          </div>
          <a href="/bundle.html" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', textDecoration: 'none', color: '#1c1917' }}>
            <Sparkles size={20} color="#b45309" strokeWidth={2.2} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em' }}>Explore Bundles</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <Truck size={20} color="#b45309" strokeWidth={2.2} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1c1917', letterSpacing: '0.04em' }}>Fast Shipping</span>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE BUNDLE & SAVE PROMOTION BANNER */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(12px, 3.5vw, 24px) 3.5rem' }}>
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '4px 12px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Sparkles size={14} />
              <span>The Maison Scent Wardrobe</span>
            </div>
            <h3 
              style={{ 
                fontFamily: 'var(--font-brand, serif)', 
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', 
                fontWeight: 800, 
                margin: '0 0 1rem', 
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
                fontSize: '0.94rem', 
                lineHeight: 1.6, 
                margin: '0 0 1.75rem', 
                maxWidth: '480px',
                fontWeight: 500,
                textShadow: '0 1px 6px rgba(0,0,0,0.8)'
              }}
            >
              In French perfumery, signature presence comes from layering. Choose 3 or 5 of your favorite creations to enjoy exclusive bundle pricing and receive complimentary collector gift presentation.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => { window.location.href = '/bundle.html'; }}
                style={{
                  padding: '14px 28px',
                  borderRadius: '4px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
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
                onClick={() => { window.location.href = '/diagnostic.html'; }}
                style={{
                  padding: '14px 28px',
                  borderRadius: '4px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1.5px solid rgba(255,255,255,0.75)',
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
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Save 15%
              </div>
              <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 2px', color: '#ffffff' }}>
                RM115
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', textDecoration: 'line-through' }}>
                Standard RM135
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '8px', color: '#ffffff' }}>
                3-Bottle Wardrobe
              </div>
              <div style={{ fontSize: '0.72rem', color: '#e2e8f0', marginTop: '4px' }}>
                Anchor + 2 Companions
              </div>
            </div>

            <div 
              onClick={() => { window.location.href = '/bundle.html'; }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(245, 158, 11, 0.6)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Save 25% · Best Value
              </div>
              <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 2px', color: '#ffffff' }}>
                RM169
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', textDecoration: 'line-through' }}>
                Standard RM225
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '8px', color: '#ffffff' }}>
                5-Bottle Master Collector
              </div>
              <div style={{ fontSize: '0.72rem', color: '#e2e8f0', marginTop: '4px' }}>
                Full Olfactory Spectrum
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
