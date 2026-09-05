import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, RefreshCw } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    openProductDetail,
    setSelectedProductModal, 
    addToCart, 
    favorites, 
    toggleFavorite,
    showToast
  } = useStore();

  const isFav = favorites.includes(product.id);

  const handleOpen = () => {
    if (openProductDetail) {
      openProductDetail(product);
    } else {
      setSelectedProductModal(product);
    }
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    const defaultSize = product.sizes?.[1]?.label || product.sizes?.[0]?.label || '100 ml';
    const finalPrice = product.price;

    addToCart(product, 1, defaultSize, null, finalPrice);
    showToast(`Added ${product.name} to your Shopping Bag!`, 'success');
  };

  return (
    <div 
      className="dior-product-card"
      onClick={handleOpen}
      tabIndex={0}
      role="button"
      aria-label={`View ${product.name} details`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
    >
      {/* Flacon Visual */}
      <div className="dior-card-img-wrap">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="dior-card-img"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          className={`dior-card-fav-btn ${isFav ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isFav ? "currentColor" : "none"} />
        </button>

        {/* Floating Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
          {product.tier && (
            <span 
              className="badge"
              style={{
                background: product.tier === 'S' ? '#000000' : product.tier === 'A' ? '#111827' : '#374151',
                color: product.tier === 'S' ? '#f59e0b' : '#ffffff',
                border: product.tier === 'S' ? '1px solid #d97706' : '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.64rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '2px 8px',
                borderRadius: '2px'
              }}
            >
              {product.tier === 'S' ? '★ TIER S · ICON' : product.tier === 'A' ? 'TIER A · PREMIUM' : `TIER ${product.tier}`}
            </span>
          )}
          {product.catalogNo && (
            <span 
              className="badge"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#111827',
                fontSize: '0.64rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '2px',
                border: '1px solid #e5e7eb'
              }}
            >
              NO. {product.catalogNo}
            </span>
          )}
        </div>
      </div>

      {/* Card Info Body */}
      <div className="dior-card-body">
        
        {/* Category & Inspiration Line */}
        <div className="dior-card-category" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ fontSize: '0.66rem' }}>
            {product.gender ? `${product.gender.toUpperCase()}` : ''} {product.character ? `· ${product.character.split('/')[0].trim()}` : ''}
          </span>
          {product.brandInspiration && (
            <span style={{ color: '#926917', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.06em' }}>
              {product.brandInspiration}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="dior-card-title" style={{ fontSize: '1.02rem', lineHeight: '1.3' }}>
          {product.displayName || product.name}
        </h3>

        {/* Short Note Summary */}
        <p className="dior-card-desc">
          {product.tagline}
        </p>

        {/* Size Pills */}
        <div className="dior-card-sizes">
          {product.sizes?.slice(0, 3).map((s, i) => (
            <span key={i} className="dior-size-pill">
              {s.ml ? `${s.ml} ml` : s.label}
            </span>
          ))}
        </div>

        {/* Price & Add to Bag */}
        <div className="dior-card-price-row">
          <div className="dior-card-price">
            ${product.price.toFixed(2)}
          </div>

          <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {product.concentration ? product.concentration.split('(')[0].trim() : 'Extrait'}
          </div>
        </div>

        <button
          className="btn btn-dior-black"
          onClick={handleQuickAdd}
          style={{ width: '100%', padding: '11px 0', fontSize: '0.78rem', marginTop: 'auto' }}
        >
          <ShoppingBag size={14} />
          <span>Add To Bag</span>
        </button>

      </div>
    </div>
  );
};
