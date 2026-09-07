import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight 
} from 'lucide-react';

// Default flagship creations curated for the Steam-inspired showcase
const CURATED_FEATURED_SLIDES = [
  {
    id: 'vlz-men-01',
    sku: 'VLZ-M-063',
    catalogNo: 63,
    title: 'VALENSZO SAUVAGE ABSOLU',
    inspiration: 'Inspired by Sauvage Elixir',
    tier: 'Tier S Launch Icon',
    category: 'Pour Homme',
    concentration: 'Extrait de Parfum (30%)',
    olfactoryFamily: 'Fresh / Spicy / Woody Amber',
    price: 45,
    originalPrice: 60,
    status: 'Now Available',
    badge: 'Top Seller',
    tagline: 'Ultra-concentrated raw spices, noble lavender, and deep liquor woods.',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597714026733-4700d1c9fa9c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80'
    ],
    imageLabels: ['Flagship Flacon', 'Noir Twilight', 'Calabrian Bergamot', 'Ambergris & Woods']
  },
  {
    id: 'vlz-wom-01',
    sku: 'VLZ-W-172',
    catalogNo: 172,
    title: 'VALENSZO DELINA IMPÉRIALE',
    inspiration: 'Inspired by Parfums de Marly Delina',
    tier: 'Tier S Launch Icon',
    category: 'Pour Femme',
    concentration: 'Extrait de Parfum (30%)',
    olfactoryFamily: 'Fruity-Floral / Damask Rose',
    price: 45,
    originalPrice: 60,
    status: 'Now Available',
    badge: 'Boutique Favorite',
    tagline: 'Sensual Turkish rose enveloped in velvety lychee and incandescent vanilla.',
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
    ],
    imageLabels: ['Rose Couture', 'Damask Petals', 'Lychee & Amber', 'Night Essence']
  },
  {
    id: 'vlz-uni-01',
    sku: 'VLZ-U-068',
    catalogNo: 68,
    title: 'VALENSZO BACCARAT ROYALE',
    inspiration: 'Inspired by Baccarat Rouge 540',
    tier: 'Tier S Launch Icon',
    category: 'Unisex Niche',
    concentration: 'Extrait de Parfum (30%)',
    olfactoryFamily: 'Sweet / Amber / Crystal Woods',
    price: 45,
    originalPrice: 65,
    status: 'High Demand',
    badge: 'Trending Scent',
    tagline: 'Poetic alchemy of radiant saffron, Egyptian jasmine, and warm ambergris.',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80'
    ],
    imageLabels: ['Crystal Flacon', 'Liquid Gold', 'Warm Ambergris', 'Atelier Craft']
  },
  {
    id: 'vlz-men-02',
    sku: 'VLZ-M-001',
    catalogNo: 1,
    title: 'VALENSZO AVENTUS MILLÉSIME',
    inspiration: 'Inspired by Creed Aventus',
    tier: 'Tier S Launch Icon',
    category: 'Pour Homme',
    concentration: 'Extrait de Parfum (30%)',
    olfactoryFamily: 'Smoky Birch / Fruity Chypre',
    price: 45,
    originalPrice: 60,
    status: 'Now Available',
    badge: 'Iconic Creed',
    tagline: 'Celebration of strength and success with smoky birch, blackcurrant, and oakmoss.',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597714026733-4700d1c9fa9c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80'
    ],
    imageLabels: ['Heritage Flacon', 'Smoky Birch', 'Italian Bergamot', 'Sensual Oakmoss']
  },
  {
    id: 'vlz-uni-02',
    sku: 'VLZ-U-227',
    catalogNo: 227,
    title: "VALENSZO ANGELS' RESERVE",
    inspiration: "Inspired by Kilian Angels' Share",
    tier: 'Tier S Launch Icon',
    category: 'Unisex Niche',
    concentration: 'Extrait de Parfum (30%)',
    olfactoryFamily: 'Cognac / Warm Praline / Cinnamon',
    price: 45,
    originalPrice: 65,
    status: 'Now Available',
    badge: 'Winter Seduction',
    tagline: 'Distilled liquor essence combined with oak wood, hazelnut, and gourmet vanilla.',
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
    ],
    imageLabels: ['Oak Barrel Glow', 'Warm Cinnamon', 'Bourbon Vanilla', 'Midnight Amber']
  }
];

export const HeroBanner = () => {
  const { products, openProductDetail } = useStore();

  // Merge live Supabase products if available
  const slides = useMemo(() => {
    if (!products || products.length === 0) return CURATED_FEATURED_SLIDES;

    // Pick featured or Tier S products
    const liveFeatured = products.filter(
      (p) => p.isFeatured || p.tier === 'S' || p.badge?.includes('Tier S')
    );

    if (liveFeatured.length === 0) return CURATED_FEATURED_SLIDES;

    // Format top 5-6 live products into slide data
    return liveFeatured.slice(0, 6).map((p, idx) => {
      const fallback = CURATED_FEATURED_SLIDES[idx % CURATED_FEATURED_SLIDES.length];
      const pImages = Array.isArray(p.images) && p.images.length > 0 
        ? p.images 
        : (p.image ? [p.image, ...fallback.images.slice(1)] : fallback.images);

      // Ensure at least 4 preview images for the 2x2 grid
      const filledImages = [...pImages];
      while (filledImages.length < 4) {
        filledImages.push(fallback.images[filledImages.length % fallback.images.length]);
      }

      return {
        id: p.id || fallback.id,
        sku: p.sku || fallback.sku,
        catalogNo: p.catalogNo || fallback.catalogNo,
        title: p.displayName || p.name || fallback.title,
        inspiration: p.brandInspiration ? `Inspired by ${p.brandInspiration}` : fallback.inspiration,
        tier: p.tier === 'S' ? 'Tier S Launch Icon' : (p.tier || fallback.tier),
        category: p.category || fallback.category,
        concentration: p.concentration || fallback.concentration,
        olfactoryFamily: p.olfactoryFamily || p.character || fallback.olfactoryFamily,
        price: p.price || fallback.price,
        originalPrice: p.originalPrice || fallback.originalPrice,
        status: p.stock > 0 ? 'Now Available' : 'Limited Allocation',
        badge: p.badge || fallback.badge,
        tagline: p.tagline || p.description?.slice(0, 90) || fallback.tagline,
        images: filledImages.slice(0, 4),
        imageLabels: fallback.imageLabels
      };
    });
  }, [products]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeSlide = slides[currentSlideIndex] || CURATED_FEATURED_SLIDES[0];

  // Auto-advance slider every 5.5s, pausing when hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      setActiveThumbIndex(0);
    }, 5500);

    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setActiveThumbIndex(0);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    setActiveThumbIndex(0);
  };

  const handleSelectSlide = (idx) => {
    setCurrentSlideIndex(idx);
    setActiveThumbIndex(0);
  };

  const handleProductNavigate = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `/product.html?product=${encodeURIComponent(activeSlide.id)}`;
    } else if (openProductDetail) {
      openProductDetail(activeSlide.id);
    }
  };

  // Main displayed spotlight picture (swaps smoothly on thumbnail hover!)
  const spotlightImage = activeSlide.images[activeThumbIndex] || activeSlide.images[0];

  return (
    <section 
      style={{
        background: 'linear-gradient(180deg, #090b10 0%, #0d0f17 50%, #08090e 100%)',
        color: '#ffffff',
        padding: 'clamp(1.5rem, 3.5vw, 2.5rem) clamp(12px, 3.5vw, 24px) clamp(2rem, 4vw, 3rem)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Featured and Recommended Fragrances"
    >
      {/* Subtle ambient luxury backlight */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          left: '25%',
          width: '500px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.12) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* 1. Header: 'FEATURED & RECOMMENDED' */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '12px',
          padding: '0 4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: 'clamp(0.74rem, 1.6vw, 0.84rem)',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#f3f4f6',
              fontFamily: 'var(--font-couture, sans-serif)'
            }}>
              Featured & Recommended
            </span>
            <span style={{ 
              fontSize: '0.68rem', 
              color: 'var(--dior-gold, #c5a059)', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'rgba(197, 160, 89, 0.15)',
              padding: '2px 8px',
              borderRadius: '2px',
              border: '1px solid rgba(197, 160, 89, 0.4)'
            }}>
              Maison Icons
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>
            {currentSlideIndex + 1} / {slides.length}
          </div>
        </div>

        {/* 2. Main Carousel Card with Outer Navigation Arrows */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Featured Creation"
            style={{
              position: 'absolute',
              left: '-20px',
              zIndex: 10,
              width: '42px',
              height: '72px',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'var(--dior-gold, #c5a059)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <ChevronLeft size={24} strokeWidth={2.2} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Featured Creation"
            style={{
              position: 'absolute',
              right: '-20px',
              zIndex: 10,
              width: '42px',
              height: '72px',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'var(--dior-gold, #c5a059)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <ChevronRight size={24} strokeWidth={2.2} />
          </button>

          {/* The Showcase Card (Divided: Left 62% Spotlight / Right 38% Details & Thumbnails) */}
          <div 
            style={{
              width: '100%',
              background: '#0c0e14',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)'
            }}
            className="steam-hero-card"
          >
            {/* LEFT PANEL: Massive Spotlight Artwork (Clickable to PDP) */}
            <div
              onClick={handleProductNavigate}
              style={{
                position: 'relative',
                minHeight: 'clamp(320px, 42vw, 470px)',
                cursor: 'pointer',
                overflow: 'hidden',
                background: '#05070b'
              }}
              title={`View ${activeSlide.title}`}
            >
              <img
                src={spotlightImage}
                alt={activeSlide.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  transition: 'transform 0.4s ease, opacity 0.25s ease'
                }}
              />

              {/* Cinematic Vignette Gradient Overlay */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(5,7,11,0.95) 0%, rgba(5,7,11,0.4) 35%, transparent 65%), linear-gradient(to right, rgba(5,7,11,0.6) 0%, transparent 40%)',
                  pointerEvents: 'none'
                }}
              />

              {/* Bottom Spotlight Info Badge */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 'clamp(14px, 3vw, 24px)',
                  left: 'clamp(16px, 3vw, 28px)',
                  right: 'clamp(16px, 3vw, 28px)',
                  zIndex: 3,
                  pointerEvents: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 800, 
                    letterSpacing: '0.12em', 
                    textTransform: 'uppercase', 
                    color: 'var(--dior-gold, #c5a059)',
                    background: 'rgba(0,0,0,0.65)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    border: '1px solid rgba(197, 160, 89, 0.4)'
                  }}>
                    {activeSlide.tier}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#e5e7eb', fontWeight: 600 }}>
                    {activeSlide.category}
                  </span>
                </div>

                <h2 
                  style={{
                    fontFamily: 'var(--font-brand, serif)',
                    fontSize: 'clamp(1.25rem, 2.8vw, 1.85rem)',
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: '0.02em',
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.95)'
                  }}
                >
                  {activeSlide.title}
                </h2>

                <p style={{
                  fontSize: 'clamp(0.78rem, 1.5vw, 0.88rem)',
                  color: '#d1d5db',
                  margin: '4px 0 0',
                  fontWeight: 500,
                  textShadow: '0 1px 6px rgba(0,0,0,0.95)'
                }}>
                  {activeSlide.inspiration}
                </p>
              </div>

              {/* Click indicator icon on top right */}
              <div 
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <ArrowUpRight size={16} />
              </div>
            </div>

            {/* RIGHT PANEL: Details, 2x2 Interactive Thumbnails, Status & Price */}
            <div 
              style={{
                padding: 'clamp(16px, 2.5vw, 24px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#0d1017',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {/* Top Title & Tagline */}
              <div>
                <h3 
                  onClick={handleProductNavigate}
                  style={{
                    fontFamily: 'var(--font-brand, serif)',
                    fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
                    fontWeight: 800,
                    color: '#ffffff',
                    margin: '0 0 4px',
                    letterSpacing: '0.01em',
                    cursor: 'pointer',
                    lineHeight: 1.25
                  }}
                >
                  {activeSlide.title}
                </h3>

                <div style={{ fontSize: '0.78rem', color: 'var(--dior-gold, #c5a059)', fontWeight: 600, marginBottom: '14px' }}>
                  {activeSlide.inspiration}
                </div>

                {/* 2x2 PREVIEW THUMBNAIL GRID (Hover swaps the main picture!) */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    fontSize: '0.68rem', 
                    color: '#9ca3af', 
                    letterSpacing: '0.08em', 
                    textTransform: 'uppercase', 
                    fontWeight: 700,
                    marginBottom: '8px' 
                  }}>
                    Visual Showcase & Accords:
                  </div>

                  <div 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px'
                    }}
                  >
                    {activeSlide.images.map((imgUrl, thumbIdx) => {
                      const isSelected = activeThumbIndex === thumbIdx;
                      return (
                        <div
                          key={thumbIdx}
                          onMouseEnter={() => setActiveThumbIndex(thumbIdx)}
                          onClick={handleProductNavigate}
                          style={{
                            position: 'relative',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            aspectRatio: '16 / 10',
                            background: '#05070a',
                            cursor: 'pointer',
                            border: isSelected ? '2px solid var(--dior-gold, #c5a059)' : '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: isSelected ? '0 0 10px rgba(197, 160, 89, 0.4)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          title={`Preview ${activeSlide.imageLabels?.[thumbIdx] || 'angle'}`}
                        >
                          <img
                            src={imgUrl}
                            alt=""
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              opacity: isSelected ? 1 : 0.72,
                              transition: 'opacity 0.2s ease, transform 0.2s ease'
                            }}
                          />
                          <div 
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'rgba(0,0,0,0.7)',
                              fontSize: '0.62rem',
                              fontWeight: 600,
                              padding: '2px 4px',
                              textAlign: 'center',
                              color: isSelected ? '#ffffff' : '#9ca3af',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {activeSlide.imageLabels?.[thumbIdx] || `Photo ${thumbIdx + 1}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scent Accords & Tagline */}
                <div style={{
                  fontSize: '0.76rem',
                  color: '#9ca3af',
                  lineHeight: 1.4,
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginBottom: '14px'
                }}>
                  <div style={{ color: '#d1d5db', fontWeight: 600, marginBottom: '2px' }}>
                    {activeSlide.olfactoryFamily}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                    {activeSlide.tagline}
                  </div>
                </div>
              </div>

              {/* Bottom: Status, Price & Quick Action */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.76rem', color: '#9ca3af' }}>
                    {activeSlide.status}
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: '2px'
                  }}>
                    {activeSlide.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                        RM {Number(activeSlide.price).toFixed(2)}
                      </span>
                      {activeSlide.originalPrice > activeSlide.price && (
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', textDecoration: 'line-through' }}>
                          RM {Number(activeSlide.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--dior-gold, #c5a059)', fontWeight: 600 }}>
                      {activeSlide.concentration}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProductNavigate}
                    style={{
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-couture, sans-serif)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'background 0.2s ease, transform 0.1s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                  >
                    <span>Discover</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 3. Pagination Capsule Pills */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px'
          }}
        >
          {slides.map((_, idx) => {
            const isActive = currentSlideIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: isActive ? '32px' : '14px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s ease'
                }}
              />
            );
          })}
        </div>

      </div>

      {/* Responsive Stacking CSS for mobile */}
      <style>{`
        @media (max-width: 860px) {
          .steam-hero-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
