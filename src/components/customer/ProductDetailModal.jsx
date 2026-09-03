import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Star, 
  Sparkles, 
  Layers, 
  Wind, 
  Clock, 
  Check, 
  Gift, 
  Feather,
  RefreshCw,
  Droplets,
  Flame,
  ShieldCheck
} from 'lucide-react';

export const ProductDetailModal = () => {
  const { 
    selectedProductModal, 
    setSelectedProductModal, 
    addToCart, 
    favorites, 
    toggleFavorite,
    showToast 
  } = useStore();

  const product = selectedProductModal;

  // Selected Flacon Size State
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1); // Default to 100ml
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [engravingText, setEngravingText] = useState('');
  const [showEngravingInput, setShowEngravingInput] = useState(false);

  if (!product) return null;

  const isFav = favorites.includes(product.id);
  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : [
        { label: '60 ml Flacon', ml: 60, priceMultiplier: 0.75, isRefillable: true },
        { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0, isRefillable: true },
        { label: '200 ml Eco-Refillable', ml: 200, priceMultiplier: 1.68, isRefillable: true }
      ];

  const currentSizeObj = sizes[selectedSizeIndex] || sizes[0];
  const dynamicPrice = Math.round(product.price * currentSizeObj.priceMultiplier);

  const handleAddToCart = () => {
    addToCart(
      product, 
      quantity, 
      currentSizeObj.label, 
      showEngravingInput && engravingText.trim() ? engravingText.trim() : null,
      dynamicPrice
    );

    const engravingMsg = showEngravingInput && engravingText.trim() ? ` with bespoke engraving "${engravingText}"` : '';
    showToast(`Added ${quantity}x ${product.name} (${currentSizeObj.label})${engravingMsg} to your Bag!`, 'success');
    setSelectedProductModal(null);
  };

  return (
    <div 
      className="modal-overlay"
      onClick={() => setSelectedProductModal(null)}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="modal-content modal-content-lg"
        style={{ background: 'rgba(7, 11, 24, 0.98)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setSelectedProductModal(null)}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px', padding: '36px' }}>
          
          {/* Left Column: Flacon Gallery */}
          <div>
            <div 
              style={{
                width: '100%',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: 'radial-gradient(circle at center, rgba(18, 30, 64, 0.6) 0%, rgba(4, 7, 17, 0.95) 80%)',
                border: '1px solid var(--border-card)',
                marginBottom: '16px',
                position: 'relative'
              }}
            >
              <img 
                src={product.images[activeImageIndex] || product.images[0]} 
                alt={product.name}
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
              
              {product.refillable && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    background: 'rgba(4, 7, 17, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#6ee7b7',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-couture)',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={12} />
                  <span>100% Sustainable &amp; Refillable</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2px solid #ffffff' : '1px solid var(--border-subtle)',
                      background: 'none',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Performance Gauges */}
            <div 
              style={{
                marginTop: '24px',
                padding: '18px',
                background: 'rgba(11, 17, 34, 0.75)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="var(--accent-copper)" /> Longevity
                </span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{product.longevity || '16+ Hours (Eternal)'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wind size={14} color="var(--accent-copper)" /> Sillage &amp; Trail
                </span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{product.sillage || 'Magnetic & Enveloping'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Olfactory Architecture & Order Actions */}
          <div>
            
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-copper">
                {product.category}
              </span>
              <span className="couture-sub" style={{ color: 'var(--accent-copper-light)' }}>
                {product.concentration}
              </span>
            </div>

            <h2 className="couture-title" style={{ fontSize: '1.8rem', letterSpacing: '0.14em', marginBottom: '8px', color: '#ffffff' }}>
              {product.name}
            </h2>

            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '16px' }}>
              &ldquo;{product.tagline}&rdquo;
            </p>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.65', marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* 3-Tier Olfactory Notes Pyramid */}
            {product.pyramid && (
              <div style={{ margin: '20px 0' }}>
                <div className="couture-sub" style={{ color: 'var(--accent-copper-light)', marginBottom: '8px' }}>
                  Olfactory Pyramid &bull; Savoir-Faire Architecture
                </div>

                <div className="fragrance-pyramid-container">
                  {/* Top */}
                  <div className="pyramid-tier-card">
                    <span className="pyramid-badge tier-top">Top Notes (0-15m)</span>
                    <div className="pyramid-notes-list">
                      {product.pyramid.topNotes?.map((n, i) => (
                        <span key={i} className="pyramid-note-pill">{n}</span>
                      ))}
                    </div>
                  </div>

                  {/* Heart */}
                  <div className="pyramid-tier-card">
                    <span className="pyramid-badge tier-heart">Heart Notes (2-4h)</span>
                    <div className="pyramid-notes-list">
                      {product.pyramid.heartNotes?.map((n, i) => (
                        <span key={i} className="pyramid-note-pill">{n}</span>
                      ))}
                    </div>
                  </div>

                  {/* Base */}
                  <div className="pyramid-tier-card">
                    <span className="pyramid-badge tier-base">Base Trail (6-16h+)</span>
                    <div className="pyramid-notes-list">
                      {product.pyramid.baseNotes?.map((n, i) => (
                        <span key={i} className="pyramid-note-pill">{n}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Flacon Sizing Selector */}
            <div style={{ margin: '20px 0 16px' }}>
              <div className="couture-sub" style={{ color: '#ffffff', marginBottom: '8px' }}>
                Select Flacon Format
              </div>
              <div className="flacon-size-group">
                {sizes.map((s, idx) => (
                  <div
                    key={idx}
                    className={`flacon-size-chip ${selectedSizeIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedSizeIndex(idx)}
                  >
                    <div className="flacon-chip-label">{s.label}</div>
                    <div className="flacon-chip-price">${Math.round(product.price * s.priceMultiplier).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bespoke Gold Flacon Engraving Accordion */}
            <div 
              style={{
                background: 'rgba(226, 135, 67, 0.08)',
                border: '1px solid rgba(226, 135, 67, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-copper-light)', fontFamily: 'var(--font-couture)', letterSpacing: '0.08em' }}>
                  <Feather size={15} />
                  <span>Complimentary Flacon Engraving Atelier</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEngravingInput(!showEngravingInput)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', textDecoration: 'underline', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  {showEngravingInput ? 'Cancel' : '+ Add Initials'}
                </button>
              </div>

              {showEngravingInput && (
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    maxLength={24}
                    placeholder="e.g. C.D. • PARIS"
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: '0.85rem', letterSpacing: '0.15em' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Personalized in hand-engraved gold lettering by our master engraver.
                  </div>
                </div>
              )}
            </div>

            {/* Price & Add to Bag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Price</div>
                <div className="product-price" style={{ fontSize: '1.8rem' }}>
                  ${(dynamicPrice * quantity).toFixed(2)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-dior-solid"
                  onClick={handleAddToCart}
                  style={{ padding: '14px 28px', fontSize: '0.88rem' }}
                >
                  <ShoppingBag size={16} />
                  <span>Add To Bag</span>
                </button>

                <button
                  className={`btn-icon ${isFav ? 'active' : ''}`}
                  onClick={() => toggleFavorite(product.id)}
                  aria-label="Wishlist"
                  style={{ width: '48px', height: '48px' }}
                >
                  <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
