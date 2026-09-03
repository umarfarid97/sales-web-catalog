import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Sparkles, 
  RefreshCw,
  Droplets
} from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    setSelectedProductModal, 
    addToCart, 
    favorites, 
    toggleFavorite,
    showToast
  } = useStore();

  const isFav = favorites.includes(product.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    const defaultSize = product.sizes?.[1]?.label || product.sizes?.[0]?.label || '100 ml Grand Flacon';
    const finalPrice = product.price;

    addToCart(product, 1, defaultSize, null, finalPrice);
    showToast(`Added ${product.name} (${defaultSize}) to your Shopping Bag!`, 'success');
  };

  const intensityScore = product.intensityScore || 4;
  const maxDots = 5;

  return (
    <div 
      className="product-card"
      onClick={() => setSelectedProductModal(product)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedProductModal(product);
        }
      }}
      aria-label={`View ${product.name} details`}
    >
      {/* Flacon Visual Stage */}
      <div className="product-img-wrapper">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="product-img"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="product-badge-float" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {product.badge && (
            <span className="badge badge-copper">
              <Sparkles size={11} />
              <span>{product.badge}</span>
            </span>
          )}
          {product.refillable && (
            <span className="badge badge-refillable" style={{ fontSize: '0.65rem' }}>
              <RefreshCw size={10} />
              <span>Refillable</span>
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          className={`product-fav-btn ${isFav ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Details Body */}
      <div className="product-info">
        
        {/* Concentration Label */}
        <div className="product-concentration-label">
          {product.concentration || 'Extrait de Parfum'}
        </div>

        {/* Perfume Name */}
        <h3 className="product-name">
          {product.name}
        </h3>

        {/* Poetic Tagline */}
        <p className="product-tagline">
          {product.tagline}
        </p>

        {/* Intensity Meter Dots */}
        <div className="product-intensity-row">
          <span>Intensity &bull; {product.olfactoryFamily}</span>
          <div className="intensity-dots" title={`Intensity: ${intensityScore}/5`}>
            {Array.from({ length: maxDots }).map((_, i) => (
              <div 
                key={i} 
                className={`intensity-dot ${i < Math.round(intensityScore) ? 'filled' : ''}`} 
              />
            ))}
          </div>
        </div>

        {/* Notes Preview Pills */}
        {product.pyramid && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
            {[...(product.pyramid.topNotes || []), ...(product.pyramid.baseNotes || [])].slice(0, 3).map((note, idx) => (
              <span 
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}
              >
                {note}
              </span>
            ))}
          </div>
        )}

        {/* Price & Actions */}
        <div style={{ marginTop: 'auto' }}>
          <div className="product-price-row">
            <span className="product-price">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="product-original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="badge badge-copper" style={{ marginLeft: 'auto', fontSize: '0.68rem' }}>
                -{product.discountPercent}%
              </span>
            )}
          </div>

          <div className="product-card-actions">
            <button
              className="btn btn-dior-solid"
              onClick={handleQuickAdd}
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.78rem' }}
            >
              <ShoppingBag size={14} />
              <span>Quick Buy</span>
            </button>

            <button
              className="btn-icon"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProductModal(product);
              }}
              title="Explore Scent Pyramid"
              aria-label="Explore Scent Pyramid"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
