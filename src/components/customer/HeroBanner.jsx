import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Default flagship creations curated for the Steam-inspired showcase
const CURATED_FEATURED_SLIDES = [
  {
    id: 'vlz-men-63',
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
    id: 'vlz-women-172',
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
    id: 'vlz-men-68',
    sku: 'VLZ-M-068',
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
    id: 'vlz-men-12',
    sku: 'VLZ-M-012',
    catalogNo: 12,
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
    id: 'vlz-women-227',
    sku: 'VLZ-W-227',
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
    const FALLBACK_HERO_IMAGES = [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1400&auto=format&fit=crop&q=80'
    ];

    if (!products || products.length === 0) {
      return CURATED_FEATURED_SLIDES.map((s, idx) => ({
        ...s,
        image: s.images?.[0] || FALLBACK_HERO_IMAGES[idx % FALLBACK_HERO_IMAGES.length],
        fallbackImage: FALLBACK_HERO_IMAGES[idx % FALLBACK_HERO_IMAGES.length]
      }));
    }

    // Pick featured or Tier S products
    const liveFeatured = products.filter(
      (p) => p.isFeatured || p.tier === 'S' || p.badge?.includes('Tier S')
    );

    const sourceList = liveFeatured.length > 0 ? liveFeatured : products.slice(0, 6);

    return sourceList.slice(0, 6).map((p, idx) => {
      const fallback = CURATED_FEATURED_SLIDES[idx % CURATED_FEATURED_SLIDES.length];
      const fallbackImg = FALLBACK_HERO_IMAGES[idx % FALLBACK_HERO_IMAGES.length];
      
      const pFirstImg = Array.isArray(p.images) && p.images[0] ? p.images[0] : p.image;
      const validImg = (typeof pFirstImg === 'string' && pFirstImg.startsWith('http')) 
        ? pFirstImg 
        : fallbackImg;

      return {
        id: p.id || fallback.id,
        sku: p.sku || fallback.sku,
        catalogNo: p.catalogNo || fallback.catalogNo,
        title: p.name || fallback.title,
        inspiration: p.brandInspiration ? `Inspired by ${p.brandInspiration}` : fallback.inspiration,
        tier: p.tier === 'S' ? 'Tier S Launch Icon' : (p.tier || fallback.tier),
        category: p.category || fallback.category,
        concentration: p.concentration || fallback.concentration,
        price: p.price || fallback.price,
        originalPrice: p.originalPrice || fallback.originalPrice,
        badge: p.badge || fallback.badge,
        image: validImg,
        fallbackImage: fallbackImg
      };
    });
  }, [products]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Gesture tracking refs
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const mouseStartXRef = useRef(null);
  const hasDraggedRef = useRef(false);
  const SWIPE_THRESHOLD = 40;

  // Auto-advance slider every 5s, pausing when hovered or dragging
  useEffect(() => {
    if (isHovered || isDragging || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, isDragging, slides.length]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSelectSlide = (idx) => {
    setCurrentSlideIndex(idx);
  };

  // Touch Swipe handlers (Mobile & Tablets)
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsDragging(true);
    setDragOffset(0);
    hasDraggedRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (touchStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;

    // Only drag horizontally if motion is more horizontal than vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Elastic rubber-band resistance at the ends
      let damped = diffX;
      if (
        (currentSlideIndex === 0 && diffX > 0) ||
        (currentSlideIndex === slides.length - 1 && diffX < 0)
      ) {
        damped = diffX * 0.3;
      }
      setDragOffset(damped);
      if (Math.abs(diffX) > 10) {
        hasDraggedRef.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset < -SWIPE_THRESHOLD) {
      handleNext();
    } else if (dragOffset > SWIPE_THRESHOLD) {
      handlePrev();
    }
    setDragOffset(0);
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 80);
  };

  // Mouse Drag handlers (Desktop)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    mouseStartXRef.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
    hasDraggedRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (mouseStartXRef.current === null) return;
    const diffX = e.clientX - mouseStartXRef.current;
    let damped = diffX;
    if (
      (currentSlideIndex === 0 && diffX > 0) ||
      (currentSlideIndex === slides.length - 1 && diffX < 0)
    ) {
      damped = diffX * 0.3;
    }
    setDragOffset(damped);
    if (Math.abs(diffX) > 8) {
      hasDraggedRef.current = true;
    }
  };

  const handleMouseUp = () => {
    if (mouseStartXRef.current === null) return;
    setIsDragging(false);
    if (dragOffset < -SWIPE_THRESHOLD) {
      handleNext();
    } else if (dragOffset > SWIPE_THRESHOLD) {
      handlePrev();
    }
    setDragOffset(0);
    mouseStartXRef.current = null;
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 80);
  };

  const handleProductNavigate = (slideId) => {
    if (hasDraggedRef.current) {
      return; // Ignore click navigation if user was swiping or dragging
    }
    const targetId = slideId || slides[currentSlideIndex]?.id;
    if (!targetId) return;

    if (typeof window !== 'undefined') {
      window.location.assign(`/product?product=${encodeURIComponent(targetId)}`);
    } else if (openProductDetail) {
      openProductDetail(targetId);
    }
  };

  return (
    <section 
      style={{
        background: 'linear-gradient(180deg, #090b10 0%, #0d0f17 50%, #08090e 100%)',
        color: '#ffffff',
        padding: 'clamp(1rem, 2.5vw, 1.8rem) clamp(10px, 2.5vw, 20px) 0.85rem',
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
            className="hero-nav-arrow hero-nav-arrow-left"
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
            className="hero-nav-arrow hero-nav-arrow-right"
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

          {/* THE IMMERSIVE SHOWCASE CAROUSEL (Full Swipe Transition Track) */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              width: '100%',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative',
              background: '#090b10',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
              userSelect: 'none',
              touchAction: 'pan-y',
              cursor: isDragging ? 'grabbing' : 'pointer'
            }}
          >
            {/* Top Right Click to View Pill (Anchored over sliding track) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleProductNavigate(slides[currentSlideIndex]?.id);
              }}
              style={{
                position: 'absolute',
                top: 'clamp(12px, 2.5vw, 20px)',
                right: 'clamp(12px, 2.5vw, 20px)',
                zIndex: 6,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '6px 14px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#ffffff',
                cursor: 'pointer',
                pointerEvents: 'auto',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
              }}
            >
              <Sparkles size={13} color="var(--dior-gold, #c5a059)" />
              <span>CLICK TO VIEW PRODUCT</span>
            </div>

            {/* HORIZONTAL SWIPE TRANSITION TRACK */}
            <div 
              style={{
                display: 'flex',
                width: '100%',
                transform: `translateX(calc(-${currentSlideIndex * 100}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform'
              }}
            >
              {slides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  onClick={() => handleProductNavigate(slide.id)}
                  style={{
                    width: '100%',
                    minWidth: '100%',
                    flexShrink: 0,
                    position: 'relative',
                    cursor: isDragging ? 'grabbing' : 'pointer',
                    minHeight: 'clamp(340px, 46vw, 520px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    overflow: 'hidden'
                  }}
                  title={`View ${slide.title}`}
                >
                  {/* The Main High-Res Picture */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = slide.fallbackImage || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1400&auto=format&fit=crop&q=80';
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Cinematic Multi-Stop Dark Gradient Overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(7,9,13,0.98) 0%, rgba(7,9,13,0.72) 42%, rgba(7,9,13,0.2) 72%, transparent 100%)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Overlaid Product Details & Direct Action */}
                  <div 
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      padding: 'clamp(1.25rem, 3.5vw, 2.5rem)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '18px'
                    }}
                  >
                    {/* Product Info */}
                    <div style={{ maxWidth: '680px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          fontSize: '0.68rem', 
                          fontWeight: 800, 
                          letterSpacing: '0.12em', 
                          textTransform: 'uppercase', 
                          color: 'var(--dior-gold, #c5a059)',
                          background: 'rgba(0,0,0,0.75)',
                          padding: '3px 10px',
                          borderRadius: '3px',
                          border: '1px solid rgba(197, 160, 89, 0.4)'
                        }}>
                          {slide.tier}
                        </span>
                        <span style={{ 
                          fontSize: '0.72rem', 
                          color: '#e5e7eb', 
                          fontWeight: 700,
                          background: 'rgba(255, 255, 255, 0.14)',
                          padding: '3px 10px',
                          borderRadius: '3px'
                        }}>
                          {slide.category}
                        </span>
                        {slide.badge && (
                          <span style={{ 
                            fontSize: '0.7rem', 
                            color: 'var(--dior-gold, #c5a059)', 
                            fontWeight: 700,
                            background: 'rgba(197, 160, 89, 0.18)',
                            padding: '3px 8px',
                            borderRadius: '3px'
                          }}>
                            {slide.badge}
                          </span>
                        )}
                      </div>

                      <h2 style={{ 
                        fontFamily: 'var(--font-brand, serif)', 
                        fontSize: 'clamp(1.5rem, 3.8vw, 2.6rem)', 
                        fontWeight: 800, 
                        margin: '0 0 6px', 
                        letterSpacing: '0.02em', 
                        color: '#ffffff', 
                        textShadow: '0 2px 14px rgba(0,0,0,0.95)',
                        lineHeight: 1.15
                      }}>
                        {slide.title}
                      </h2>

                      <p style={{ 
                        fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)', 
                        color: '#f3f4f6', 
                        fontWeight: 600, 
                        margin: 0, 
                        textShadow: '0 1px 8px rgba(0,0,0,0.95)' 
                      }}>
                        {slide.inspiration} &bull; {slide.concentration}
                      </p>
                    </div>

                    {/* Price & Shop CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                            RM {Number(slide.price).toFixed(2)}
                          </span>
                          {slide.originalPrice > slide.price && (
                            <span style={{ fontSize: '0.88rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                              RM {Number(slide.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--dior-gold, #c5a059)', fontWeight: 700, letterSpacing: '0.04em' }}>
                          Extrait de Parfum (30%)
                        </div>
                      </div>

                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductNavigate(slide.id);
                        }}
                        style={{
                          background: '#ffffff',
                          color: '#000000',
                          padding: 'clamp(10px, 2vw, 14px) clamp(16px, 2.5vw, 22px)',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-couture, sans-serif)',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease, background 0.15s ease'
                        }}
                      >
                        <span>Shop Creation</span>
                        <ArrowRight size={16} strokeWidth={2.4} />
                      </div>
                    </div>

                  </div>
                </div>
              ))}
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
            marginTop: '10px'
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
                  background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s ease'
                }}
              />
            );
          })}
        </div>

      </div>

      {/* Responsive Arrow & Layout Styling */}
      <style>{`
        @media (max-width: 860px) {
          .hero-nav-arrow-left {
            left: 8px !important;
            width: 36px !important;
            height: 52px !important;
          }
          .hero-nav-arrow-right {
            right: 8px !important;
            width: 36px !important;
            height: 52px !important;
          }
        }
      `}</style>
    </section>
  );
};
