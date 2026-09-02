import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, Copy, Check, Eye } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner = () => {
  const { products, setSelectedProductModal, showToast } = useStore();
  const [copied, setCopied] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const featuredList = products.filter((p) => p.isFeatured).slice(0, 3);
  const currentHeroProduct = featuredList[slideIndex] || products[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % (featuredList.length || 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredList.length]);

  const copyPromo = () => {
    navigator.clipboard.writeText('LUMINA25');
    setCopied(true);
    showToast('Promo code LUMINA25 copied to clipboard!', 'success');
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
              <Sparkles size={14} />
              <span>Flagship Drop &bull; Limited Edition</span>
            </div>

            <h1 className="hero-title">
              {currentHeroProduct.name.split(' ').slice(0, 2).join(' ')}{' '}
              <span className="gradient-text">
                {currentHeroProduct.name.split(' ').slice(2).join(' ') || 'Series'}
              </span>
            </h1>

            <p className="hero-description">
              {currentHeroProduct.tagline || currentHeroProduct.description}
            </p>

            <div className="hero-actions">
              <button 
                className="btn btn-primary"
                onClick={scrollToCatalog}
              >
                <span>Explore Catalog</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedProductModal(currentHeroProduct)}
              >
                <Eye size={16} />
                <span>Quick View</span>
              </button>

              <div className="hero-promo-tag">
                <Zap size={14} color="#fbbf24" />
                <span>Use code:</span>
                <span className="hero-promo-code">LUMINA25</span>
                <button
                  onClick={copyPromo}
                  style={{
                    color: copied ? '#34d399' : '#94a3b8',
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

            {/* Slide Indicators */}
            {featuredList.length > 1 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '32px' }}>
                {featuredList.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setSlideIndex(idx)}
                    style={{
                      width: slideIndex === idx ? '28px' : '8px',
                      height: '8px',
                      borderRadius: 'var(--radius-full)',
                      background: slideIndex === idx ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    aria-label={`Slide ${idx + 1}`}
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
              className="hero-main-img"
              onClick={() => setSelectedProductModal(currentHeroProduct)}
              style={{ cursor: 'pointer' }}
            />
            
            {/* Floating Price Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                background: 'rgba(15, 18, 28, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '10px 18px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 3
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Special Launch Price
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                  ${currentHeroProduct.price.toFixed(2)}
                </span>
                {currentHeroProduct.originalPrice > currentHeroProduct.price && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                    ${currentHeroProduct.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
