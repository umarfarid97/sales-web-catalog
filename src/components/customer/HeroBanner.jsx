import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroBanner = () => {
  const { setSelectedProductModal, products, activeGender, menCount, womenCount, navigateToDiagnostic } = useStore();

  const handleDiscoverElixir = () => {
    const elixir = products.find((p) => p.sku === 'SVG-LX-001' || p.name.includes('Elixir')) || products[0];
    if (elixir) {
      setSelectedProductModal(elixir);
    }
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('sauvage-catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentCount = activeGender === 'Men' ? menCount : womenCount;

  return (
    <section className="dior-hero-campaign">
      <div className="dior-hero-media-bg" />

      <div className="container">
        <div className="dior-hero-content">
          
          <div className="dior-hero-eyebrow">
            Maison Valenszo &bull; {activeGender === 'Men' ? `Men's Collection (${menCount} Creations)` : `Women's Collection (${womenCount} Creations)`}
          </div>

          <div style={{ margin: '8px 0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '100vw' }}>
            <div className="valenszo-monogram-mark" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', color: '#ffffff', marginBottom: '-4px' }} aria-hidden="true">
              <span className="vl-v">V</span>
              <span className="vl-l">L</span>
            </div>
            <h1 className="dior-hero-title" style={{ fontFamily: 'var(--font-brand)', margin: '0' }}>
              VALENSZO
            </h1>
            <div style={{ fontFamily: 'var(--font-couture)', fontSize: 'clamp(0.62rem, 1.8vw, 0.74rem)', letterSpacing: 'clamp(0.18em, 1.2vw, 0.44em)', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700, textTransform: 'uppercase', marginTop: '6px' }}>
              {activeGender === 'Men' ? "MEN'S COLLECTION" : "WOMEN'S COLLECTION"}
            </div>
          </div>

          <p className="dior-hero-tagline">
            {activeGender === 'Men'
              ? `Raw, noble, and magnetic all at once. Discover ${menCount} masterfully structured masculine creations dictated by rare essences.`
              : `Radiant, poetic, and captivating all at once. Discover ${womenCount} sublime feminine and romantic creations crafted for modern allure.`}
          </p>

          <div className="dior-hero-buttons">
            <button
              className="btn btn-dior-white"
              onClick={handleScrollToCatalog}
              style={{ padding: '14px 32px' }}
            >
              <span>Explore The Line</span>
              <ArrowRight size={15} />
            </button>

            <button
              className="btn btn-dior-outline"
              onClick={navigateToDiagnostic}
              style={{ padding: '14px 32px', borderColor: '#ffffff', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Sparkles size={15} color="#f59e0b" />
              <span>Find Your Scent</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
