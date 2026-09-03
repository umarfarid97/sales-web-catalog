import React from 'react';

/**
 * ValenszoLogo component
 * Renders the official VALENSZO luxury brand mark matching the physical perfume bottle:
 * 1. Interlocking VL Monogram Emblem (Didone serif with high contrast)
 * 2. "VALENSZO" brand name in Bodoni Moda luxury Didone typeface
 * 3. "FRAGRANCE MALAYSIA" subtitle with couture wide letter spacing
 */
export const ValenszoLogo = ({ 
  size = 'md', 
  layout = 'stacked', 
  showMonogram = true, 
  showSubtitle = true, 
  subtitle = 'FRAGRANCE MALAYSIA',
  inverted = false,
  className = '',
  style = {}
}) => {
  const sizeConfig = {
    sm: {
      monogramSize: '1.1rem',
      brandSize: '1.1rem',
      subSize: '0.52rem',
      gap: '2px',
      subTracking: '0.3em'
    },
    md: {
      monogramSize: '1.45rem',
      brandSize: '1.45rem',
      subSize: '0.56rem',
      gap: '2px',
      subTracking: '0.34em'
    },
    lg: {
      monogramSize: '1.9rem',
      brandSize: '1.85rem',
      subSize: '0.62rem',
      gap: '4px',
      subTracking: '0.38em'
    },
    hero: {
      monogramSize: '3rem',
      brandSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
      subSize: '0.72rem',
      gap: '8px',
      subTracking: '0.42em'
    }
  };

  const cfg = sizeConfig[size] || sizeConfig.md;
  const textColor = inverted ? '#ffffff' : '#000000';
  const subColor = inverted ? 'rgba(255, 255, 255, 0.72)' : 'var(--text-muted, #6b7280)';

  return (
    <div 
      className={`valenszo-brand-block ${className}`}
      style={{
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: cfg.gap,
        color: textColor,
        ...style
      }}
    >
      {/* 1. Intertwined VL Monogram (Matching Bottle Prototype) */}
      {showMonogram && (
        <div 
          className="valenszo-monogram-mark"
          style={{ 
            fontSize: cfg.monogramSize,
            marginBottom: layout === 'stacked' ? '-2px' : 0,
            marginRight: layout === 'horizontal' ? '10px' : 0
          }}
          aria-hidden="true"
        >
          <span className="vl-v">V</span>
          <span className="vl-l">L</span>
        </div>
      )}

      {/* 2. Text Container: VALENSZO & Subtitle */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span 
          className="valenszo-brand-name" 
          style={{ 
            fontSize: cfg.brandSize,
            color: textColor
          }}
        >
          VALENSZO
        </span>

        {showSubtitle && (
          <span 
            className="valenszo-brand-sub"
            style={{ 
              fontSize: cfg.subSize,
              letterSpacing: cfg.subTracking,
              color: subColor
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
