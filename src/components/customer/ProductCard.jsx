import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, RefreshCw } from 'lucide-react';

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
    const defaultSize = product.sizes?.[1]?.label || product.sizes?.[0]?.label || '100 ml';
    const finalPrice = product.price;

    addToCart(product, 1, defaultSize, null, finalPrice);
    showToast(`Added ${product.name} to your Shopping Bag!`, 'success');
  };

  return (
    <div 
      className="dior-product-card"
      onClick={() => setSelectedProductModal(product)}
      tabIndex={0}
      role="button"
      aria-label={`View ${product.name} details`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedProductModal(product);
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
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
          {product.badge && (
            <span className="badge badge-black">
              {product.badge}
            </span>
          )}
          {product.refillable && (
            <span className="badge badge-refillable">
              <RefreshCw size={10} />
              <span>Refillable</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Info Body */}
      <div className="dior-card-body">
        
        {/* Category */}
        <div className="dior-card-category">
          {product.category === 'Sauvage Spectrum' ? `FRAGRANCE - ${product.concentration}` : product.category}
        </div>

        {/* Title */}
        <h3 className="dior-card-title">
          {product.name}
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

          <div style={{ fontSize: '0.74rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Engraving Available
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
