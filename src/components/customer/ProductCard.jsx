import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Eye, 
  Sparkles,
  Flame,
  Feather
} from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    addToCart, 
    toggleFavorite, 
    isFavorite, 
    setSelectedProductModal,
    cart
  } = useStore();

  const isFav = isFavorite(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultColor = product.colors && product.colors[0]?.name ? product.colors[0].name : 'Standard';
    addToCart(product, defaultColor, 1);
  };

  return (
    <article className="perfume-card">
      
      {/* Top Image & Overlays */}
      <div 
        className="perfume-card-image-wrap"
        onClick={() => setSelectedProductModal(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="perfume-card-image"
        />

        {/* Top Badges */}
        <div className="perfume-badge-top">
          {product.badge && (
            <span className={`badge ${
              product.badge === 'Iconic Signature' ? 'badge-gold' :
              product.badge === 'Best Seller' ? 'badge-amber' :
              product.badge === 'Low Stock' ? 'badge-danger' : 'badge-gold'
            }`}>
              <Sparkles size={11} />
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`perfume-wishlist-btn ${isFav ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Body */}
      <div className="perfume-card-body">
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span className="perfume-card-family">{product.category}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#fcd34d' }}>
            <Star size={12} fill="currentColor" color="#fcd34d" />
            <span style={{ fontWeight: 700 }}>{product.rating}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>({product.reviewsCount})</span>
          </div>
        </div>

        <h3 
          className="perfume-card-title"
          onClick={() => setSelectedProductModal(product)}
        >
          {product.name}
        </h3>

        <div className="perfume-card-concentration">
          {product.concentration || 'Extrait de Parfum'}
        </div>

        {/* Top Notes Preview Tags */}
        {product.pyramid?.topNotes && (
          <div className="perfume-notes-preview">
            {product.pyramid.topNotes.slice(0, 3).map((note, idx) => (
              <span key={idx} className="perfume-note-tag">
                {note}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer: Price & Action */}
        <div className="perfume-card-footer">
          <div className="perfume-price-wrap">
            <span className="perfume-price">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="perfume-price-original">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="perfume-card-actions">
            <button 
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              onClick={() => setSelectedProductModal(product)}
              title="Explore Fragrance Pyramid"
            >
              <Eye size={14} color="var(--accent-gold)" />
              <span>Notes</span>
            </button>

            <button
              className="btn btn-gold"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
            >
              <ShoppingBag size={14} />
              <span>{isOutOfStock ? 'Sold Out' : 'Bag'}</span>
            </button>
          </div>
        </div>

      </div>

    </article>
  );
};
