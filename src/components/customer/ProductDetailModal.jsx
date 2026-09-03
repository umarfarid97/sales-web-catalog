import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Check, 
  Gift, 
  Truck, 
  Sparkles,
  Flame,
  Feather,
  Clock,
  Wind
} from 'lucide-react';

export const ProductDetailModal = () => {
  const { 
    selectedProductModal, 
    setSelectedProductModal, 
    addToCart, 
    isFavorite, 
    toggleFavorite 
  } = useStore();

  const product = selectedProductModal;
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(() => product?.colors?.[0]?.name || 'Standard');
  const [engravingText, setEngravingText] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isFav = isFavorite(product.id);
  const isOutOfStock = product.stock <= 0;
  
  // Calculate price based on selected size
  const sizesList = product.sizes && product.sizes.length > 0
    ? product.sizes
    : [
        { label: '50 ml Classic Flacon', ml: 50, priceMultiplier: 0.72 },
        { label: '100 ml Grand Flacon', ml: 100, priceMultiplier: 1.0 },
        { label: '10 ml Travel Atomizer', ml: 10, priceMultiplier: 0.28 }
      ];

  const currentSizeObj = sizesList[selectedSizeIndex] || sizesList[0];
  const calculatedPrice = product.price * (currentSizeObj.priceMultiplier || 1.0);
  const calculatedOriginalPrice = (product.originalPrice || product.price) * (currentSizeObj.priceMultiplier || 1.0);

  const handleAddToCart = () => {
    const customizedProduct = {
      ...product,
      price: calculatedPrice,
      originalPrice: calculatedOriginalPrice,
      selectedSize: currentSizeObj.label,
      engravingText: engravingText.trim()
    };

    const success = addToCart(customizedProduct, selectedColor, quantity);
    if (success) {
      setSelectedProductModal(null);
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={() => setSelectedProductModal(null)}
    >
      <div 
        className="product-detail-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="product-detail-close-btn"
          onClick={() => setSelectedProductModal(null)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Left Column: Media & Visuals */}
        <div className="product-detail-media">
          <div>
            <img
              src={product.images[activeImgIndex] || product.images[0]}
              alt={product.name}
              className="product-detail-main-img"
            />

            {product.images.length > 1 && (
              <div className="product-detail-thumbs">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`product-detail-thumb ${activeImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Maison Value Badges */}
          <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#f3e5ab', marginBottom: '8px' }}>
              <Gift size={16} color="var(--accent-gold)" />
              <span>Includes 2 complimentary 2ml deluxe samples</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#f3e5ab' }}>
              <Truck size={16} color="var(--accent-gold)" />
              <span>Complimentary insured climate-safe delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Perfume Pyramid & Customization */}
        <div className="product-detail-content">
          
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="perfume-card-family">{product.category}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fcd34d' }}>
                <Star size={14} fill="currentColor" color="#fcd34d" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.rating}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h2 className="font-serif-title" style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '6px' }}>
              {product.name}
            </h2>

            <div style={{ fontSize: '0.88rem', color: 'var(--accent-gold-light)', fontStyle: 'italic', marginBottom: '12px' }}>
              {product.concentration || 'Extrait de Parfum (32% Concentration)'}
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {product.description}
            </p>
          </div>

          {/* Fragrance Pyramid Breakdown */}
          {product.pyramid && (
            <div className="fragrance-pyramid-container">
              <div className="pyramid-header">
                <span className="pyramid-title">Olfactory Pyramid</span>
                <Sparkles size={15} color="var(--accent-gold)" />
              </div>

              {/* Top Notes */}
              <div className="pyramid-tier">
                <div className="pyramid-tier-label">
                  <span>Top Notes</span>
                  <span className="pyramid-tier-time">0 - 15 min &bull; First Impression</span>
                </div>
                <div className="pyramid-notes-list">
                  {product.pyramid.topNotes?.map((note, i) => (
                    <span key={i} className="pyramid-note-pill">{note}</span>
                  ))}
                </div>
              </div>

              {/* Heart Notes */}
              <div className="pyramid-tier">
                <div className="pyramid-tier-label">
                  <span>Heart &amp; Soul Notes</span>
                  <span className="pyramid-tier-time">2 - 4 hrs &bull; Signature Core</span>
                </div>
                <div className="pyramid-notes-list">
                  {product.pyramid.heartNotes?.map((note, i) => (
                    <span key={i} className="pyramid-note-pill">{note}</span>
                  ))}
                </div>
              </div>

              {/* Base Notes */}
              <div className="pyramid-tier">
                <div className="pyramid-tier-label">
                  <span>Base &amp; Sillage Notes</span>
                  <span className="pyramid-tier-time">6 - 16+ hrs &bull; Enduring Memory</span>
                </div>
                <div className="pyramid-notes-list">
                  {product.pyramid.baseNotes?.map((note, i) => (
                    <span key={i} className="pyramid-note-pill">{note}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Performance Gauges */}
          <div className="scent-metrics-row">
            <div className="scent-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Clock size={14} color="var(--accent-gold)" />
                <span className="scent-metric-label">Longevity</span>
              </div>
              <div className="scent-metric-value">{product.longevity || '14+ Hours (Eternal)'}</div>
            </div>

            <div className="scent-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Wind size={14} color="var(--accent-gold)" />
                <span className="scent-metric-label">Sillage &amp; Projection</span>
              </div>
              <div className="scent-metric-value">{product.sillage || 'Enveloping & Magnetic'}</div>
            </div>
          </div>

          {/* Bottle Size Selector */}
          <div>
            <div className="size-selector-label">Select Flacon Size</div>
            <div className="size-selector-options">
              {sizesList.map((sz, idx) => {
                const isSelected = selectedSizeIndex === idx;
                const szPrice = product.price * (sz.priceMultiplier || 1.0);
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`size-option-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedSizeIndex(idx)}
                  >
                    <span className="size-option-name">{sz.label}</span>
                    <span className="size-option-price">${szPrice.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Complimentary Flacon Engraving */}
          <div className="engraving-box">
            <div className="engraving-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Feather size={14} color="var(--accent-gold)" />
                <span>Complimentary Flacon Engraving</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>FREE</span>
            </div>
            <input
              type="text"
              placeholder="e.g. E.R. • Paris 2026 or With Love"
              maxLength={26}
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value)}
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Price & Add to Shopping Bag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Price</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="perfume-price" style={{ fontSize: '1.75rem' }}>${calculatedPrice.toFixed(2)}</span>
                {calculatedOriginalPrice > calculatedPrice && (
                  <span className="perfume-price-original" style={{ fontSize: '1rem' }}>${calculatedOriginalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className={`btn-icon ${isFav ? 'active' : ''}`}
                onClick={() => toggleFavorite(product.id)}
                title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
                style={{ width: '48px', height: '48px' }}
              >
                <Heart size={20} fill={isFav ? '#fb7185' : 'none'} color={isFav ? '#fb7185' : 'currentColor'} />
              </button>

              <button
                className="btn btn-gold"
                style={{ padding: '12px 28px', fontSize: '1rem' }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingBag size={18} />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
