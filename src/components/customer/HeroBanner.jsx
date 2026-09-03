import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroBanner = () => {
  const { setSelectedProductModal, products } = useStore();

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

  return (
    <section className="dior-hero-campaign">
      <div className="dior-hero-media-bg" />

      <div className="container">
        <div className="dior-hero-content">
          
          <div className="dior-hero-eyebrow">
            Maison Christian Dior &bull; Fragrance
          </div>

          <h1 className="dior-hero-title">
            SAUVAGE
          </h1>

          <p className="dior-hero-tagline">
            Raw and noble all at once. An act of creation inspired by wide-open spaces under a blue-sky night.
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
              onClick={handleDiscoverElixir}
              style={{ padding: '14px 32px', borderColor: '#ffffff', color: '#ffffff' }}
            >
              <span>Discover Sauvage Elixir</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
