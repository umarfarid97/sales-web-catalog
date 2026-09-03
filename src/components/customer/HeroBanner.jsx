import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Gift, Copy, Check, Eye, Flame, Feather } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner = () => {
  const { products, setSelectedProductModal, showToast } = useStore();
  const [copied, setCopied] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const featuredList = products.filter((p) => p.isFeatured).slice(0, 4);
  const currentHeroProduct = featuredList[slideIndex] || products[0];

  useEffect(() => {
    if (featuredList.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % featuredList.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [featuredList.length]);

  const copyPromo = () => {
    navigator.clipboard.writeText('LUXE25');
    setCopied(true);
    showToast('Promo code LUXE25 copied to clipboard (25% off)!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('product-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!currentHeroProduct) return null;

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-banner-card">
          
          {/* Left Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={13} color="var(--accent-gold)" />
              <span>Haute Parfumerie &bull; Extrait de Parfum</span>
            </div>

            <h1 className="hero-title">
              {currentHeroProduct.name.split(' ').slice(0, 2).join(' ')}{' '}
              <span className="gold-shimmer-text">
                {currentHeroProduct.name.split(' ').slice(2).join(' ') || 'Parfum'}
              </span>
            </h1>

            <p className="hero-description">
              {currentHeroProduct.tagline || currentHeroProduct.description}
            </p>

            <div className="hero-actions">
              <button 
                className="btn btn-gold"
                onClick={scrollToCatalog}
              >
                <span>Discover All Scents</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedProductModal(currentHeroProduct)}
              >
                <Eye size={16} color="var(--accent-gold)" />
                <span>Explore Pyramid</span>
              </button>

              <div className="hero-promo-tag">
                <Gift size={15} color="var(--accent-gold)" />
                <span>25% Off:</span>
                <span className="hero-promo-code">LUXE25</span>
                <button
                  onClick={copyPromo}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: copied ? '#34d399' : '#fce08b',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                    marginLeft: '2px'
                  }}
                  title="Copy code"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Perks Row */}
            <div className="hero-perks-row">
              <div className="hero-perk-item">
                <Gift size={14} color="var(--accent-gold)" />
                <span>2 Free 2ml Samples</span> with every order
              </div>
              <div className="hero-perk-item">
                <Feather size={14} color="var(--accent-gold)" />
                <span>Free Custom Engraving</span> on all flacons
              </div>
            </div>

            {/* Slide Indicators */}
            {featuredList.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                {featuredList.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setSlideIndex(idx)}
                    style={{
                      width: idx === slideIndex ? '32px' : '10px',
                      height: '6px',
                      borderRadius: '4px',
                      background: idx === slideIndex ? 'var(--accent-gold-gradient)' : 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    title={item.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Visual Image */}
          <div className="hero-visual">
            <div className="hero-img-backdrop" />
            <img
              src={currentHeroProduct.images[0]}
              alt={currentHeroProduct.name}
              className="hero-image"
              onClick={() => setSelectedProductModal(currentHeroProduct)}
              style={{ cursor: 'pointer' }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
