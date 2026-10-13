import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    openProductDetail,
    setSelectedProductModal,
    addToCart,
    setIsCartOpen
  } = useStore();

  if (!product || !product.id) return null;

  const handleOpen = () => {
    if (openProductDetail) {
      openProductDetail(product);
    } else if (setSelectedProductModal) {
      setSelectedProductModal(product);
    }
  };

  const displayName = product.name || 'Perfume';

  return (
    <div 
      className="artisan-product-card"
      onClick={handleOpen}
      tabIndex={0}
      role="button"
      aria-label={`View ${displayName} details`}
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
          background: 'radial-gradient(circle, #ffffff 60%, #f7f4ef 100%)',
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
          alt={displayName} 
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
                fontFamily: 'var(--font-couture)',
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

      {/* 2. Perfume Name First (Simple font, highly visible) */}
      <h3 
        style={{ 
          fontSize: '0.98rem', 
          fontWeight: 700, 
          fontFamily: 'var(--font-sans, "Plus Jakarta Sans", system-ui, -apple-system, sans-serif)',
          color: '#1a1410', 
          margin: '0 0 4px',
          lineHeight: 1.3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          letterSpacing: '0.01em'
        }}
        title={displayName}
      >
        {displayName}
      </h3>

      {/* 3. Subtitle / Inspired By */}
      <p 
        style={{ 
          fontSize: '0.80rem', 
          color: '#786558', 
          margin: '0',
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'var(--font-sans, "Plus Jakarta Sans", system-ui, -apple-system, sans-serif)'
        }}
        title={(product.brand || product.brandInspiration) ? `Inspired by ${product.brand || product.brandInspiration}` : ''}
      >
        {(product.brand || product.brandInspiration) ? `Inspired by ${product.brand || product.brandInspiration}` : (product.tagline || 'Extrait de Parfum • High Longevity')}
      </p>

      {/* 4. Format & Starting Price Micro-label with Quick Add */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '8px',
          paddingTop: '6px',
          borderTop: '1px solid #f2ede7',
          fontSize: '0.74rem',
          color: '#8a776a'
        }}
      >
        <span style={{ letterSpacing: '0.02em', fontWeight: 500 }}>
          30ml • 50ml • 100ml
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, color: '#2b1810', fontFamily: 'var(--font-mono)' }}>
            From RM{product.price_30ml ? Number(product.price_30ml).toFixed(0) : '45'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1, '50ml');
              if (setIsCartOpen) setIsCartOpen(true);
            }}
            aria-label={`Add ${displayName} to bag`}
            title="Quick add 50ml to bag"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#f5f0eb',
              border: '1px solid #e5ded7',
              color: '#2b1810',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2b1810';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f5f0eb';
              e.currentTarget.style.color = '#2b1810';
            }}
          >
            <ShoppingBag size={13} />
          </button>
        </div>
      </div>

    </div>
  );
};

