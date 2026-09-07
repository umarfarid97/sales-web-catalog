import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  RefreshCw, 
  Feather
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

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1);
  const [quantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [engravingText, setEngravingText] = useState('');
  const [showEngraving, setShowEngraving] = useState(false);

  if (!product) return null;

  const isFav = favorites.includes(product.id);
  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : [
        { label: '60 ml', ml: 60, priceMultiplier: 0.75, isRefillable: true },
        { label: '100 ml', ml: 100, priceMultiplier: 1.0, isRefillable: true },
        { label: '200 ml Refillable', ml: 200, priceMultiplier: 1.68, isRefillable: true }
      ];

  const currentSizeObj = sizes[selectedSizeIndex] || sizes[0];
  const dynamicPrice = Math.round((Number(product.price) || 45) * (Number(currentSizeObj?.priceMultiplier) || 1.0));

  const handleAddToCart = () => {
    addToCart(
      product, 
      quantity, 
      currentSizeObj.label, 
      showEngraving && engravingText.trim() ? engravingText.trim() : null,
      dynamicPrice
    );

    const engMsg = showEngraving && engravingText.trim() ? ` with custom engraving "${engravingText}"` : '';
    showToast(`Added ${quantity}x ${product.name} (${currentSizeObj.label})${engMsg} to your Bag!`, 'success');
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
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '90dvh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
          margin: 'auto'
        }}
      >
        <button
          className="modal-close-btn"
          onClick={() => setSelectedProductModal(null)}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', padding: 'clamp(20px, 3vw, 36px)' }}>
          
          {/* Left: Product Images */}
          <div>
            <div 
              style={{
                width: '100%',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: '#fbfbfb',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
                position: 'relative'
              }}
            >
              <img 
                src={product.images[activeImageIndex] || product.images[0]} 
                alt={product.name}
                style={{ width: '100%', height: 'clamp(260px, 38vh, 400px)', objectFit: 'cover' }}
              />

              {product.refillable && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-couture)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#047857',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Refillable Flacon</span>
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
                      border: activeImageIndex === idx ? '2px solid #000000' : '1px solid var(--border-subtle)',
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
          </div>

          {/* Right: Olfactory Details & Sizing */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-couture)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>
                {product.gender ? `${product.gender.toUpperCase()} · ` : ''}{product.category}
              </div>
              {product.tier && (
                <span 
                  style={{
                    background: product.tier === 'S' ? '#000000' : '#1f2937',
                    color: product.tier === 'S' ? '#f59e0b' : '#ffffff',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '2px',
                    letterSpacing: '0.08em'
                  }}
                >
                  {product.tier === 'S' ? '★ TIER S ICON' : `TIER ${product.tier}`}
                </span>
              )}
            </div>

            <h2 className="couture-title" style={{ fontSize: '1.9rem', marginBottom: '4px', color: '#000000' }}>
              {product.displayName || product.name}
            </h2>

            {product.brandInspiration && (
              <div style={{ fontSize: '0.82rem', color: '#926917', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '10px' }}>
                Inspired by {product.brandInspiration} &bull; Catalog No. {product.catalogNo}
              </div>
            )}

            {/* Structured Characteristic Facet Pills */}
            {product.traits && product.traits.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {product.traits.map((trait, tIdx) => (
                  <span 
                    key={tIdx} 
                    style={{
                      background: '#f4f4f5',
                      color: '#27272a',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      border: '1px solid #e4e4e7'
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}

            <p style={{ fontStyle: 'italic', color: '#6b7280', fontSize: '0.92rem', marginBottom: '14px' }}>
              &ldquo;{product.tagline}&rdquo;
            </p>

            <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.65', marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Olfactory Notes Architecture */}
            {product.pyramid && (
              <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-couture)', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000000', marginBottom: '10px' }}>
                  Olfactory Notes
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                  <div>
                    <strong>Top Notes:</strong> <span style={{ color: '#4b5563' }}>{product.pyramid.topNotes?.join(', ')}</span>
                  </div>
                  <div>
                    <strong>Heart Notes:</strong> <span style={{ color: '#4b5563' }}>{product.pyramid.heartNotes?.join(', ')}</span>
                  </div>
                  <div>
                    <strong>Base Notes:</strong> <span style={{ color: '#4b5563' }}>{product.pyramid.baseNotes?.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-couture)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Select Format
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {sizes.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSizeIndex(idx)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedSizeIndex === idx ? '#000000' : '#ffffff',
                      color: selectedSizeIndex === idx ? '#ffffff' : '#000000',
                      border: selectedSizeIndex === idx ? '1px solid #000000' : '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-couture)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>{s.label}</span>
                    <span style={{ fontSize: '0.72rem', opacity: selectedSizeIndex === idx ? 0.9 : 0.6 }}>
                      RM {Math.round(product.price * s.priceMultiplier).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Complimentary Engraving */}
            <div style={{ padding: '12px 16px', background: '#fdf8eb', border: '1px solid #f3d99d', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#926917', fontFamily: 'var(--font-couture)', letterSpacing: '0.08em' }}>
                  <Feather size={14} />
                  <span>Complimentary Flacon Engraving</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEngraving(!showEngraving)}
                  style={{ background: 'none', border: 'none', color: '#000000', textDecoration: 'underline', fontSize: '0.76rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  {showEngraving ? 'Cancel' : '+ Add Initials'}
                </button>
              </div>

              {showEngraving && (
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="e.g. C.D. • PARIS"
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase' }}>Price</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.7rem', fontWeight: 800, color: '#000000' }}>
                  RM {(dynamicPrice * quantity).toFixed(2)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-dior-black"
                  onClick={handleAddToCart}
                  style={{ padding: '14px 32px' }}
                >
                  <ShoppingBag size={16} />
                  <span>Order Now</span>
                </button>

                <button
                  className="btn-icon"
                  onClick={() => toggleFavorite(product.id)}
                  aria-label="Wishlist"
                  style={{ width: '48px', height: '48px', color: isFav ? '#ef4444' : '#000000' }}
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
