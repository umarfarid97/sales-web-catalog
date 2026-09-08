import React, { useState, useMemo } from 'react';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Truck,
  Award,
  ChevronRight
} from 'lucide-react';

export const ProductCatalog = () => {
  const { products } = useStore();

  // Curated newly crafted creations only (strictly selected new releases / launch icons)
  const newlyCraftedProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    
    // Explicit new releases (e.g. SZINDORE)
    const explicitNew = products.filter(p => {
      if (!p || !p.id) return false;
      const b = (p.badge || '').toLowerCase();
      return b.includes('new') || p.isNew;
    });

    // Men's new/launch icons
    const menIcons = products.filter(p => {
      if (!p || !p.id) return false;
      const isM = p.gender === 'Men' || p.category === 'Pour Homme' || String(p.id).startsWith('vlz-men');
      const b = (p.badge || '').toLowerCase();
      return isM && (p.isFeatured || b.includes('launch icon') || b.includes('tier s'));
    });

    // Women's new/launch icons
    const womenIcons = products.filter(p => {
      if (!p || !p.id) return false;
      const isW = p.gender === 'Women' || p.category === 'Pour Femme' || String(p.id).startsWith('vlz-women');
      const b = (p.badge || '').toLowerCase();
      return isW && (p.isFeatured || b.includes('launch icon') || b.includes('tier s'));
    });

    const selected = [];
    explicitNew.forEach(p => selected.push(p));

    let mIdx = 0, wIdx = 0;
    while (selected.length < 6 && (mIdx < menIcons.length || wIdx < womenIcons.length)) {
      if (mIdx < menIcons.length && !selected.some(s => s.id === menIcons[mIdx].id)) {
        selected.push(menIcons[mIdx]);
      }
      mIdx++;
      if (selected.length < 6 && wIdx < womenIcons.length && !selected.some(s => s.id === womenIcons[wIdx].id)) {
        selected.push(womenIcons[wIdx]);
      }
      wIdx++;
    }

    if (selected.length < 6) {
      const existingIds = new Set(selected.map(p => p.id));
      const others = products
        .filter(p => p && p.id && !existingIds.has(p.id))
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      return [...selected, ...others].slice(0, 6);
    }

    return selected.slice(0, 6);
  }, [products]);

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Cinematic Campaign Hero Slider */}
      <HeroBanner />

      {/* 2. FOUR PILLARS LUXURY TRUST RIBBON */}
      <section 
        style={{ 
          background: '#f2ece4',
          borderTop: '1px solid #e4dcd2',
          borderBottom: '1px solid #e4dcd2',
          margin: 0,
          padding: '16px clamp(12px, 3vw, 24px)'
        }}
      >
        <div 
          className="trust-ribbon-grid"
          style={{ 
            maxWidth: '1280px', 
            margin: '0 auto',
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '12px',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', justifyContent: 'center' }}>
            <Award size={18} color="#d97706" strokeWidth={2.4} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.78rem)', fontWeight: 800, color: '#2b1810', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Authentic French Oils
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', justifyContent: 'center' }}>
            <Clock size={18} color="#d97706" strokeWidth={2.4} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.78rem)', fontWeight: 800, color: '#2b1810', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              12h+ Extra Sillage
            </span>
          </div>
          <a href="/bundle" style={{ display: 'flex', alignItems: 'center', gap: '9px', justifyContent: 'center', textDecoration: 'none', color: '#2b1810' }}>
            <Sparkles size={18} color="#d97706" strokeWidth={2.4} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.78rem)', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Save 25% Bundles
            </span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', justifyContent: 'center' }}>
            <Truck size={18} color="#d97706" strokeWidth={2.4} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.78rem)', fontWeight: 800, color: '#2b1810', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Express Courier Dispatch
            </span>
          </div>
        </div>
      </section>

      {/* 4. NEWLY CRAFTED CREATIONS PRODUCT GRID (Matching "Newly Sourced Roasts" in Reference) */}
      <section 
        id="newly-crafted-section"
        style={{ 
          background: '#faf8f5',
          margin: 0, 
          padding: '40px clamp(12px, 3vw, 24px) 24px' 
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Editorial Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: '#f0ebe4', 
                color: '#8c5e3c', 
                padding: '5px 14px', 
                borderRadius: '9999px', 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                letterSpacing: '0.08em', 
                textTransform: 'uppercase', 
                marginBottom: '10px' 
              }}
            >
              <Sparkles size={13} color="#d97706" />
              <span>Selected New Releases</span>
            </div>
            <h2 
              className="section-heading-editorial"
              style={{
                fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
                fontWeight: 800,
                color: '#231710',
                margin: '0 0 10px',
                letterSpacing: '-0.02em'
              }}
            >
              Newly Crafted Creations
            </h2>
            <p 
              style={{ 
                color: '#786558', 
                fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', 
                maxWidth: '620px', 
                margin: '0 auto', 
                lineHeight: 1.5 
              }}
            >
              Hand-blended artisanal extraits formulated with 35% oil concentration for captivating, all-day presence.
            </p>
          </div>

          {/* Product Grid (3 columns on desktop, 2 columns on mobile) */}
          <div 
            className="artisan-product-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 'clamp(12px, 2vw, 24px)',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '32px'
            }}
          >
            {newlyCraftedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Center CTA Button - "View Complete Collection" */}
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <a
              href="/collection"
              className="btn-pill btn-pill-oat"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 32px',
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(44, 26, 17, 0.08)'
              }}
            >
              <span>View Complete Collection</span>
              <ArrowRight size={16} />
            </a>
          </div>

        </div>
      </section>

      {/* 5. MOST RECOMMENDED COLLECTIONS FOR YOU (Asymmetric Bento Mosaic from Reference Picture) */}
      <section 
        style={{ 
          background: '#ffffff',
          margin: '16px 0 0', 
          padding: '44px clamp(12px, 3vw, 24px) 48px',
          borderTop: '1px solid #ede8e1'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Section Header */}
          <div style={{ marginBottom: '28px' }}>
            <h2 
              className="section-heading-editorial"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 800,
                color: '#231710',
                margin: '0 0 8px',
                letterSpacing: '-0.02em'
              }}
            >
              Most Recommended Collections For You
            </h2>
            <p style={{ color: '#786558', fontSize: '0.92rem', margin: 0 }}>
              Curated olfactive journeys crafted to match your distinct character and evening aura.
            </p>
          </div>

          {/* Asymmetric Bento Mosaic Grid: 1 Tall Card Left + 2 Stacked Cards Right */}
          <div 
            className="bento-mosaic-container"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(14px, 2vw, 24px)'
            }}
          >
            
            {/* Left Column: 1 Tall Vertical Card (Men's Signature) */}
            <a
              href="/men"
              className="bento-tall-card"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                minHeight: '490px',
                background: '#1a100a',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                textDecoration: 'none',
                backgroundImage: 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%',
                boxShadow: '0 12px 32px rgba(35, 23, 16, 0.15)',
                transition: 'transform 0.25s ease'
              }}
            >
              {/* Gradient Overlay */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(26, 16, 10, 0.95) 0%, rgba(26, 16, 10, 0.6) 45%, rgba(0, 0, 0, 0.15) 80%, transparent 100%)',
                  pointerEvents: 'none'
                }}
              />

              <div style={{ position: 'relative', zIndex: 2 }}>
                <span 
                  style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 800, 
                    letterSpacing: '0.14em', 
                    textTransform: 'uppercase', 
                    color: '#fbbf24',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}
                >
                  POUR HOMME COUTURE
                </span>
                <h3 
                  style={{ 
                    fontFamily: 'var(--font-brand, serif)', 
                    fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', 
                    fontWeight: 800, 
                    color: '#ffffff', 
                    margin: '0 0 8px',
                    lineHeight: 1.2
                  }}
                >
                  Timeless Elegance & Seduction
                </h3>
                <p 
                  style={{ 
                    color: '#ede8e1', 
                    fontSize: '0.88rem', 
                    lineHeight: 1.45, 
                    margin: '0 0 20px', 
                    maxWidth: '420px' 
                  }}
                >
                  Smoky birch, crisp bergamot and magnetic dry amber designed for commanding presence.
                </p>

                {/* White Pill Button */}
                <div 
                  className="btn-pill btn-pill-white"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 24px',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}
                >
                  <span>Shop Men</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </a>

            {/* Right Column: 2 Stacked Horizontal Cards */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'clamp(14px, 2vw, 24px)' 
              }}
            >
              
              {/* Top Right Card: Women's Floral & Amber Alchemy */}
              <a
                href="/women"
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  minHeight: '233px',
                  flex: 1,
                  background: '#2b1810',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  textDecoration: 'none',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 25%',
                  boxShadow: '0 8px 24px rgba(35, 23, 16, 0.12)',
                  transition: 'transform 0.25s ease'
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(35, 23, 16, 0.95) 0%, rgba(35, 23, 16, 0.6) 50%, rgba(0, 0, 0, 0.15) 85%, transparent 100%)',
                    pointerEvents: 'none'
                  }}
                />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span 
                    style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: 800, 
                      letterSpacing: '0.12em', 
                      textTransform: 'uppercase', 
                      color: '#fbbf24',
                      display: 'inline-block',
                      marginBottom: '6px'
                    }}
                  >
                    POUR FEMME
                  </span>
                  <h3 
                    style={{ 
                      fontFamily: 'var(--font-brand, serif)', 
                      fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', 
                      fontWeight: 800, 
                      color: '#ffffff', 
                      margin: '0 0 6px',
                      lineHeight: 1.2
                    }}
                  >
                    Floral & Amber Alchemy
                  </h3>
                  <p 
                    style={{ 
                      color: '#ede8e1', 
                      fontSize: '0.8rem', 
                      lineHeight: 1.4, 
                      margin: '0 0 14px',
                      maxWidth: '380px'
                    }}
                  >
                    Luminous white petals, rich Madagascar vanilla, and velvety musk.
                  </p>

                  <div 
                    className="btn-pill btn-pill-white"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                  >
                    <span>Shop Women</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </a>

              {/* Bottom Right Card: Collector Wardrobe Trio */}
              <a
                href="/bundle"
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  minHeight: '233px',
                  flex: 1,
                  background: '#1e130c',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  textDecoration: 'none',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&auto=format&fit=crop&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 40%',
                  boxShadow: '0 8px 24px rgba(35, 23, 16, 0.12)',
                  transition: 'transform 0.25s ease'
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(30, 19, 12, 0.95) 0%, rgba(30, 19, 12, 0.6) 50%, rgba(0, 0, 0, 0.15) 85%, transparent 100%)',
                    pointerEvents: 'none'
                  }}
                />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span 
                    style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: 800, 
                      letterSpacing: '0.12em', 
                      textTransform: 'uppercase', 
                      color: '#fbbf24',
                      display: 'inline-block',
                      marginBottom: '6px'
                    }}
                  >
                    SCENT WARDROBE
                  </span>
                  <h3 
                    style={{ 
                      fontFamily: 'var(--font-brand, serif)', 
                      fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', 
                      fontWeight: 800, 
                      color: '#ffffff', 
                      margin: '0 0 6px',
                      lineHeight: 1.2
                    }}
                  >
                    Curate Your Trio & Save 25%
                  </h3>
                  <p 
                    style={{ 
                      color: '#ede8e1', 
                      fontSize: '0.8rem', 
                      lineHeight: 1.4, 
                      margin: '0 0 14px',
                      maxWidth: '380px'
                    }}
                  >
                    Select 3 or 5 full-sized extraits in custom luxury presentation packaging.
                  </p>

                  <div 
                    className="btn-pill btn-pill-white"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                  >
                    <span>Build Your Bundle</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* Mobile responsive layout overrides */}
      <style>{`
        @media (max-width: 900px) {
          .bento-mosaic-container {
            grid-template-columns: 1fr !important;
          }
          .bento-tall-card {
            min-height: 380px !important;
          }
        }
        @media (max-width: 768px) {
          .artisan-product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .trust-ribbon-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px 8px !important;
          }
        }
        @media (max-width: 480px) {
          .artisan-product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

    </div>
  );
};
