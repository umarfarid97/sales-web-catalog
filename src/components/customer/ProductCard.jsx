import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    openProductDetail,
    setSelectedProductModal
  } = useStore();

  if (!product || !product.id) return null;

  const handleOpen = () => {
    if (openProductDetail) {
      openProductDetail(product);
    } else if (setSelectedProductModal) {
      setSelectedProductModal(product);
    }
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
        position: 'relative',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(44, 26, 17, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(44, 26, 17, 0.05)';
      }}
    >
      {/* 1. Neutral Crisp Product Image Wrap */}
      <div 
        style={{
          background: '#ffffff',
          border: '1px solid #ede8e1',
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
          margin: '0',
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {product.brandInspiration ? `Inspired by ${product.brandInspiration}` : product.tagline || 'Extrait de Parfum • High Longevity'}
      </p>

    </div>
  );
};
