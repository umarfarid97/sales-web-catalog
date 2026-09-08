import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, Star } from 'lucide-react';

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

  const formattedPrice = Number(product.price || 45).toFixed(2);

  return (
    <div 
      className="artisan-product-card"
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
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #ede8e1',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 16px rgba(44, 26, 17, 0.05)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        position: 'relative'
      }}
    >
      {/* 1. Neutral Soft-Tinted Product Image Wrap */}
      <div 
        style={{
          background: '#f7f5f0',
          borderRadius: '12px',
          aspectRatio: '1 / 1.08',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '12px'
        }}
      >
        <img 
          src={product.images?.[0] || product.image} 
          alt={product.name} 
          loading="lazy"
          style={{
            maxWidth: '82%',
            maxHeight: '82%',
            objectFit: 'contain',
            transition: 'transform 0.25s ease'
          }}
        />

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isFav ? '#d97706' : '#786558',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.15s ease'
          }}
        >
          <Heart size={15} fill={isFav ? "currentColor" : "none"} />
        </button>

        {/* Subtle Tier Pill Badge */}
        {product.tier && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '8px', 
              left: '8px', 
              zIndex: 2 
            }}
          >
            <span 
              style={{
                background: product.tier === 'S' ? '#2b1810' : '#4a382e',
                color: product.tier === 'S' ? '#fbbf24' : '#ffffff',
                border: product.tier === 'S' ? '1px solid #d97706' : '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.62rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '3px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase'
              }}
            >
              {product.tier === 'S' ? '★ TIER S' : `TIER ${product.tier}`}
            </span>
          </div>
        )}
      </div>

      {/* 2. Price Row (Bold Price on Left, 5 Stars on Right) */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '6px'
        }}
      >
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f140e', fontFamily: 'var(--font-brand, serif)' }}>
          RM{formattedPrice}
        </div>

        {/* 5 Warm Amber Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title="5.0 Rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} fill="#d97706" color="#d97706" strokeWidth={1} />
          ))}
        </div>
      </div>

      {/* 3. Product Title */}
      <h3 
        style={{ 
          fontSize: '0.98rem', 
          fontWeight: 800, 
          color: '#1f140e', 
          margin: '0 0 3px',
          lineHeight: 1.28,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        title={product.name}
      >
        {product.name}
      </h3>

      {/* 4. Subtitle / Inspiration */}
      <p 
        style={{ 
          fontSize: '0.78rem', 
          color: '#786558', 
          margin: '0 0 12px',
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {product.brandInspiration ? `Inspired by ${product.brandInspiration}` : product.tagline || 'Extrait de Parfum • High Longevity'}
      </p>

      {/* 5. Dual Action Pill Buttons (Craft & Cafe Style) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '8px', 
          marginTop: 'auto' 
        }}
      >
        {/* Left: Warm Sand Pill Button (Quick View) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          style={{
            background: '#ebe5dc',
            color: '#2b1810',
            border: 'none',
            borderRadius: '9999px',
            padding: '9px 8px',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'background 0.15s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#dfd7cc'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#ebe5dc'; }}
        >
          Quick View
        </button>

        {/* Right: Rich Espresso Pill Button (Add to Bag) */}
        <button
          type="button"
          onClick={handleQuickAdd}
          style={{
            background: '#2b1810',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '9px 8px',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'background 0.15s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#3e271e'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#2b1810'; }}
        >
          Add to Bag
        </button>
      </div>

    </div>
  );
};
