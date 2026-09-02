import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Check, 
  Shield, 
  Truck, 
  RotateCcw,
  AlertTriangle
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
  const [selectedColor, setSelectedColor] = useState(() => product?.colors?.[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isFav = isFavorite(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const handleAddToCart = () => {
    const success = addToCart(product, selectedColor, quantity);
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
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setSelectedProductModal(null)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="product-modal-grid">
          
          {/* Left Column: Image Gallery */}
          <div>
            <div className="modal-gallery-main">
              <img
                src={product.images[activeImgIndex] || product.images[0]}
                alt={product.name}
              />
            </div>

            {product.images.length > 1 && (
              <div className="modal-gallery-thumbs">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`modal-gallery-thumb ${activeImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Value Guarantees Box */}
            <div 
              style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Truck size={16} color="#818cf8" />
                <span>Free Insured Delivery on orders over $150</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Shield size={16} color="#34d399" />
                <span>2-Year Full Hardware Coverage Warranty</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <RotateCcw size={16} color="#fbbf24" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Form */}
          <div className="modal-detail-info">
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="product-category-tag">{product.category}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                SKU: {product.sku}
              </span>
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '10px', lineHeight: 1.25 }}>
              {product.name}
            </h2>

            {/* Ratings & Stock Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="product-rating-box">
                <Star size={15} fill="currentColor" color="#fbbf24" />
                <span style={{ fontSize: '0.95rem' }}>{product.rating}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                  ({product.reviewsCount} customer reviews)
                </span>
              </div>

              <span style={{ color: 'var(--border-card)' }}>|</span>

              {isOutOfStock ? (
                <span className="badge badge-danger">Out of Stock</span>
              ) : isLowStock ? (
                <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={12} />
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="badge badge-success">In Stock ({product.stock} available)</span>
              )}
            </div>

            {/* Price */}
            <div className="product-price-row" style={{ marginBottom: '20px' }}>
              <span className="current-price" style={{ fontSize: '1.85rem' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="original-price" style={{ fontSize: '1.15rem' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="badge badge-danger">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Color Variant Selector */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Select Finish: <span style={{ color: '#818cf8' }}>{selectedColor}</span>
                </div>
                <div className="variant-color-select">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      className={`color-circle-btn ${selectedColor === c.name ? 'active' : ''}`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '28px' }}>
              <div className="quantity-stepper">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px 24px', fontSize: '1rem' }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingBag size={18} />
                <span>{isOutOfStock ? 'Sold Out' : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}</span>
              </button>

              <button
                className={`btn-icon ${isFav ? 'active' : ''}`}
                onClick={() => toggleFavorite(product.id)}
                style={{
                  width: '46px',
                  height: '46px',
                  color: isFav ? '#f43f5e' : 'var(--text-muted)'
                }}
                aria-label="Toggle Wishlist"
              >
                <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Key Features List */}
            {product.features && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>
                  Highlights & Features
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.features.map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Check size={15} color="#34d399" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
