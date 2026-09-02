import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Eye, 
  Check, 
  AlertTriangle 
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

  // Check if item is already in cart
  const inCartItem = cart.find((i) => i.id === product.id);

  return (
    <article className="product-card">
      
      {/* Top Image & Overlays */}
      <div 
        className="product-card-img-wrap"
        onClick={() => setSelectedProductModal(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="product-card-img"
        />

        {/* Top Badges */}
        <div className="product-badges-top">
          {product.badge && (
            <span className={`badge ${
              product.badge === 'Sale' ? 'badge-danger' :
              product.badge === 'Best Seller' ? 'badge-primary' :
              product.badge === 'Low Stock' ? 'badge-warning' : 'badge-neutral'
            }`}>
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="badge badge-danger">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`product-fav-btn ${isFav ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="product-quick-view-overlay">
          <button 
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductModal(product);
            }}
          >
            <Eye size={15} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Body */}
      <div className="product-card-body">
        
        <div className="product-meta-row">
          <span className="product-category-tag">{product.category}</span>
          <div className="product-rating-box">
            <Star size={13} fill="currentColor" color="#fbbf24" />
            <span>{product.rating}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        <h3 
          className="product-card-title"
          onClick={() => setSelectedProductModal(product)}
        >
          {product.name}
        </h3>

        <p className="product-card-tagline">
          {product.tagline || product.description}
        </p>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="current-price">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="original-price">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          
          {isLowStock && (
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
              <AlertTriangle size={12} />
              Only {product.stock} left!
            </span>
          )}
          {isOutOfStock && (
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#fb7185', fontWeight: 700 }}>
              Sold Out
            </span>
          )}
        </div>

        {/* Card Actions */}
        <div className="product-card-footer">
          <button
            className="add-cart-btn"
            onClick={() => addToCart(product, null, 1)}
            disabled={isOutOfStock}
          >
            {inCartItem ? (
              <>
                <Check size={16} />
                <span>In Cart ({inCartItem.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </article>
  );
};
