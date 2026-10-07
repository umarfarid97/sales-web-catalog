import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Heart, 
  ChevronRight, 
  Maximize2, 
  X, 
  Play, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Check,
  MessageCircle
} from 'lucide-react';
import { cleanPerfumeName } from '../../utils/taxonomy';
import '../../styles/pdp.css';

export const ProductDetailPage = () => {
  const {
    activeProduct,
    products,
    favorites = [],
    showToast
  } = useStore();

  // Fallback if accessed directly with no product or during initial load
  const product = useMemo(() => {
    if (activeProduct) return activeProduct;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('product');
      const genderParam = params.get('gender');
      if (urlId && products && products.length > 0) {
        const clean = decodeURIComponent(String(urlId)).trim().toLowerCase();

        // Pass 1: Strict exact ID match across catalog
        let found = products.find((p) => p && p.id && String(p.id).trim().toLowerCase() === clean);
        if (found) return found;

        // Pass 2: Strict exact SKU match across catalog
        found = products.find((p) => p && p.sku && String(p.sku).trim().toLowerCase() === clean);
        if (found) return found;

        // Pass 3: Strict exact Name match
        found = products.find((p) => p && p.name && String(p.name).trim().toLowerCase() === clean);
        if (found) return found;

        // Pass 4: Detect gender hint from query parameter or targetId string
        const detectedGender = genderParam || (
          (clean.includes('men') && !clean.includes('women')) ? 'Men' :
          clean.includes('women') ? 'Women' : null
        );

        if (detectedGender) {
          const genderList = products.filter((p) => p && p.gender && p.gender.toLowerCase() === detectedGender.toLowerCase());
          found = genderList.find((p) => 
            (p.id && String(p.id).trim().toLowerCase() === clean) ||
            (p.sku && String(p.sku).trim().toLowerCase() === clean) ||
            (p.name && String(p.name).trim().toLowerCase() === clean)
          );
          if (found) return found;

          const cleanDigits = clean.replace(/\D/g, '');
          if (cleanDigits) {
            found = genderList.find((p) => 
              (p.catalogNo !== undefined && String(p.catalogNo) === cleanDigits) ||
              (p.specs?.catalogNo !== undefined && String(p.specs.catalogNo) === cleanDigits)
            );
            if (found) return found;
          }
        }

        // Pass 5: Pure numeric digits match ONLY if the query itself is purely numeric (e.g. "79")
        if (/^\d+$/.test(clean)) {
          found = products.find((p) => 
            (p.catalogNo !== undefined && String(p.catalogNo) === clean) ||
            (p.specs?.catalogNo !== undefined && String(p.specs.catalogNo) === clean)
          );
          if (found) return found;
        }

        // Pass 6: Fallback partial name contains
        found = products.find((p) => p && p.name && String(p.name).toLowerCase().includes(clean));
        if (found) return found;
      }
    }
    return products && products.length > 0 ? products[0] : null;
  }, [activeProduct, products]);

  // Selected Size
  const [selectedSize, setSelectedSize] = useState('30ml');
  const [quantity, setQuantity] = useState(1);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('scent-profile');
  const [showAllAccords, setShowAllAccords] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isUpsellDrawerOpen, setIsUpsellDrawerOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainCtaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!mainCtaRef.current) return;
      const rect = mainCtaRef.current.getBoundingClientRect();
      // Only show sticky purchase bar when scrolled past the main purchase CTA
      setShowStickyBar(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    let observer;
    if (typeof IntersectionObserver !== 'undefined' && mainCtaRef.current) {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setShowStickyBar(true);
        } else if (entry.isIntersecting || entry.boundingClientRect.top > 0) {
          setShowStickyBar(false);
        }
      }, { threshold: 0 });
      observer.observe(mainCtaRef.current);
    }

    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  // Standardized prices across all perfumes: 30ml = RM45, 50ml = RM65, 100ml = RM125
  const priceBySize = useMemo(() => ({
    '30ml': 45,
    '50ml': 65,
    '100ml': 125
  }), []);

  const currentUnitPrice = product ? (priceBySize[selectedSize] || product.price) : 0;
  const totalPrice = currentUnitPrice * quantity;

  // Actual Product Imagery (single or multiple) without fake filler perfumes
  const galleryItems = useMemo(() => {
    if (!product) return [];
    const rawList = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : (product.image ? [product.image] : []);

    const uniqueImages = Array.from(new Set(rawList.filter(Boolean)));
    if (uniqueImages.length === 0) {
      return [{ type: 'image', url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80', label: 'Front View' }];
    }

    return uniqueImages.map((imgUrl, idx) => ({
      type: 'image',
      url: imgUrl,
      label: idx === 0 ? 'Front View' : `Gallery View ${idx + 1}`
    }));
  }, [product]);

  // Authentic Accords from DB / Excel
  const dominantAccord = useMemo(() => {
    return product?.dominantAccord || product?.specs?.dominantAccord || product?.character || '';
  }, [product]);

  const mainAccords = useMemo(() => {
    if (!product) return [];
    const list = product.mainAccords || product.specs?.mainAccords || product.traits || [];
    if (Array.isArray(list)) return list.filter(Boolean);
    if (typeof list === 'string') return list.split(/[;,]/).map(s => s.trim()).filter(Boolean);
    return [];
  }, [product]);

  if (!product) {
    if (!products || products.length === 0) {
      return (
        <div className="pdp-page-container" style={{ textAlign: 'center', padding: '8rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '38px', height: '38px', border: '3px solid #ede8e1', borderTopColor: '#d97706', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
          <p style={{ color: '#8c7d72', marginTop: '1.5rem', fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            Preparing Valenszo Fragrance Presentation...
          </p>
        </div>
      );
    }
    return (
      <div className="pdp-page-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>Fragrance Not Found</h2>
        <p style={{ color: '#6b7280', margin: '1rem 0 2rem' }}>The requested perfume is temporarily unavailable.</p>
        <button 
          className="dior-btn dior-btn-primary" 
          onClick={() => { window.location.href = 'collection.html'; }}
          style={{ background: '#000', color: '#fff', padding: '12px 24px', cursor: 'pointer', border: 'none' }}
        >
          Return to All Perfumes
        </button>
      </div>
    );
  }

  const isFav = Array.isArray(favorites) && product?.id ? favorites.includes(product.id) : false;
  const displayName = cleanPerfumeName(product.name || 'Perfume');
  const handleSelectThumbnail = (index) => {
    setActiveThumbIndex(index);
    if (galleryItems[index].type === 'video') {
      setIsVideoModalOpen(true);
    }
  };

  return (
    <div className="pdp-page-container">
      
      {/* ================= 1. BREADCRUMBS ================= */}
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <button className="pdp-breadcrumb-item" onClick={() => { window.location.href = 'index.html'; }}>
          Home
        </button>
        <span className="pdp-breadcrumb-separator"><ChevronRight size={12} /></span>
        
        <button 
          className="pdp-breadcrumb-item" 
          onClick={() => { 
            const isWomen = (product.gender || '').toLowerCase() === 'women';
            window.location.href = isWomen ? 'women.html' : 'men.html'; 
          }}
        >
          {product.gender === 'Women' ? 'Women' : 'Men'}
        </button>
        <span className="pdp-breadcrumb-separator"><ChevronRight size={12} /></span>

        <button 
          className="pdp-breadcrumb-item"
          onClick={() => { 
            const isWomen = (product.gender || '').toLowerCase() === 'women';
            const fam = product.olfactoryFamily?.split('/')?.[0]?.trim() || 'Woody';
            window.location.href = isWomen 
              ? `women.html?category=${encodeURIComponent(fam)}` 
              : `men.html?category=${encodeURIComponent(fam)}`; 
          }}
        >
          {product.olfactoryFamily?.split('/')?.[0]?.trim() || 'Woody'}
        </button>
        <span className="pdp-breadcrumb-separator"><ChevronRight size={12} /></span>

        <span className="pdp-breadcrumb-current">
          {displayName}
        </span>
      </nav>

      {/* ================= 2. HERO SECTION: GALLERY & PURCHASE ================= */}
      <section className="pdp-hero-grid">
        
        {/* Gallery Showcase */}
        <div className="pdp-gallery-wrapper">
          
          {/* Thumbnail Rail - only displayed when product has multiple views */}
          {galleryItems.length > 1 && (
            <div className="pdp-thumbnail-strip">
              {galleryItems.map((item, idx) => (
                <button
                  key={idx}
                  className={`pdp-thumbnail-item ${activeThumbIndex === idx ? 'active' : ''}`}
                  onClick={() => handleSelectThumbnail(idx)}
                  aria-label={`View ${item.label}`}
                >
                  <img src={item.url} alt={item.label} loading="lazy" />
                  {item.type === 'video' && (
                    <div className="pdp-thumbnail-video-overlay">
                      <Play size={16} fill="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Main Stage Presentation */}
          <div className="pdp-main-stage">
            {/* Mobile Image Counter Pill - only when multiple images exist */}
            {galleryItems.length > 1 && (
              <div className="pdp-mobile-counter-pill">
                {activeThumbIndex + 1}/{galleryItems.length}
              </div>
            )}

            {/* Flacon Imagery */}
            <div className="pdp-flacon-inner-canvas">
              <img 
                src={galleryItems[activeThumbIndex]?.url || galleryItems[0]?.url || product.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80'} 
                alt={displayName} 
                className="pdp-main-flacon-img"
              />
            </div>

            {/* Desktop Fullscreen / Zoom Lightbox Button */}
            <button 
              className="pdp-stage-zoom-btn"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Enlarge image"
            >
              <Maximize2 size={18} />
            </button>
          </div>

        </div>

        {/* Purchase Block */}
        <div className="pdp-info-block">
          
          <div className="pdp-top-row">
            <span className="pdp-badge-bestseller">
              {product.badge || 'BEST SELLER'}
            </span>
          </div>

          <h1 className="pdp-product-title">
            {displayName}
          </h1>

          <div className="pdp-product-subtitle">
            {product.concentration || 'Extrait de Parfum'}
          </div>

          {/* Editorial Italic Quote */}
          <div className="pdp-editorial-quote">
            "{product.tagline || 'A deep, magnetic fragrance for the modern connoisseur. Power in silence.'}"
          </div>

          {/* Price Row */}
          <div className="pdp-price-row">
            <span className="pdp-price-current">RM{currentUnitPrice}</span>
            <span className="pdp-price-size-indicator">({selectedSize})</span>
          </div>

          {/* Size Pills */}
          <div className="pdp-size-selection-area">
            <span className="pdp-size-label">Select Size</span>
            <div className="pdp-size-pills-row">
              {['30ml', '50ml', '100ml'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`pdp-size-pill ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Direct WhatsApp Order & Inquiry */}
          <div className="pdp-cta-row" ref={mainCtaRef} style={{ marginTop: '16px' }}>
            <a
              href={`https://wa.me/60182868402?text=${encodeURIComponent(`Hello Valenszo! 🛍️\n\nI am viewing your online catalog and would like to order / inquire about:\n• Perfume: ${displayName}\n• Concentration: ${product.concentration || 'Extrait de Parfum'}\n• Selected Size: ${selectedSize}\n• Price: RM${totalPrice}\n\nCould you please assist me with stock availability & delivery arrangement? Thank you!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '16px 24px',
                borderRadius: '8px',
                background: '#128C7E',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.88rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(18, 140, 126, 0.28)',
                transition: 'background 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#075E54'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#128C7E'; }}
            >
              <MessageCircle size={20} />
              <span>Inquire & Order via WhatsApp</span>
            </a>
          </div>
        </div>

      </section>

      {/* ================= 3. INTERACTIVE OLFACTORY TABS ================= */}
      <section className="pdp-tabs-section">
        <div className="pdp-tabs-nav" role="tablist">
          <button 
            className={`pdp-tab-trigger ${activeTab === 'scent-profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('scent-profile')}
            role="tab"
            aria-selected={activeTab === 'scent-profile'}
          >
            Scent Profile & Notes
          </button>
          <button 
            className={`pdp-tab-trigger ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
            role="tab"
            aria-selected={activeTab === 'description'}
          >
            Description
          </button>
        </div>

        <div className="pdp-tab-body">
          {/* TAB 1: SCENT PROFILE & NOTES (All-in-one section) */}
          {activeTab === 'scent-profile' && (
            <div className="pdp-scent-profile-wrapper">
              <div className="pdp-scent-profile-layout">
                
                {/* Col 1: Dominant Accord & Main Accords (Clean & Unboxed) */}
                <div className="pdp-accords-column">
                  <h3 className="pdp-section-card-title">Accords</h3>
                  
                  {/* Dominant Accord (Unboxed Hero Heading) */}
                  {dominantAccord && (
                    <div className="pdp-dominant-feature">
                      <span className="pdp-meta-label">Dominant Accord</span>
                      <div className="pdp-dominant-heading">{dominantAccord}</div>
                    </div>
                  )}

                  {/* Main Accords Badges / Chips */}
                  {mainAccords.length > 0 && (
                    <div className="pdp-main-accords-section">
                      <span className="pdp-meta-label">Main Accords</span>
                      <div className="pdp-accords-pills-row">
                        {mainAccords.map((accordName, i) => (
                          <span key={i} className="pdp-accord-chip">
                            {accordName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Fragrance Notes Architecture (Sleek Modern Olfactory Pyramid) */}
              <div style={{ marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 className="pdp-section-card-title" style={{ margin: 0 }}>Fragrance Notes Architecture</h3>
                  <span style={{ fontSize: '0.8rem', color: '#78716c' }}>Scent evolution across three distinct stages</span>
                </div>

                <div className="pdp-notes-pyramid-grid">
                  {/* Top Notes */}
                  <div className="pdp-note-tier-card">
                    <div className="pdp-note-tier-header">
                      <span className="pdp-note-tier-pill">01 · Opening</span>
                      <h4 className="pdp-note-tier-name">Top Notes</h4>
                      <span className="pdp-note-tier-timing">Immediate impression (0 – 30 mins)</span>
                    </div>
                    <div className="pdp-note-tags-wrap">
                      {(product.pyramid?.topNotes || ['Calabrian Bergamot', 'Spiced Cardamom', 'Pink Peppercorn']).map((note, i) => (
                        <span key={i} className="pdp-note-pill">
                          {typeof note === 'string' ? note.replace(/\b\w/g, c => c.toUpperCase()) : note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Heart Notes */}
                  <div className="pdp-note-tier-card">
                    <div className="pdp-note-tier-header">
                      <span className="pdp-note-tier-pill">02 · The Heart</span>
                      <h4 className="pdp-note-tier-name">Heart Notes</h4>
                      <span className="pdp-note-tier-timing">Core character (30 mins – 4 hours)</span>
                    </div>
                    <div className="pdp-note-tags-wrap">
                      {(product.pyramid?.heartNotes || ['French Lavender', 'Tailored Damascena', 'Rare Cedar']).map((note, i) => (
                        <span key={i} className="pdp-note-pill">
                          {typeof note === 'string' ? note.replace(/\b\w/g, c => c.toUpperCase()) : note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Base Notes */}
                  <div className="pdp-note-tier-card">
                    <div className="pdp-note-tier-header">
                      <span className="pdp-note-tier-pill">03 · Dry Down</span>
                      <h4 className="pdp-note-tier-name">Base Notes</h4>
                      <span className="pdp-note-tier-timing">Enduring foundation (4 – 16+ hours)</span>
                    </div>
                    <div className="pdp-note-tags-wrap">
                      {(product.pyramid?.baseNotes || ['Rich Ambroxan', 'Lacquered Woods', 'Bourbon Vanilla']).map((note, i) => (
                        <span key={i} className="pdp-note-pill">
                          {typeof note === 'string' ? note.replace(/\b\w/g, c => c.toUpperCase()) : note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESCRIPTION */}
          {activeTab === 'description' && (
            <div style={{ maxWidth: '800px', lineHeight: 1.8, color: '#374151' }}>
              <p style={{ fontSize: '1.05rem', marginBottom: '1.25rem' }}>
                {product.description}
              </p>
              <p style={{ marginBottom: '1.25rem' }}>
                Formulated using {product.concentration || 'Extrait de Parfum (25%)'} grade European oils. 
                Hand-blended and aged for 60 days to allow every scent note to achieve maximum richness, depth, and long-lasting projection.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem', background: '#faf9f6', padding: '1.5rem', borderRadius: '6px' }}>
                <div>
                  <strong>Crafted:</strong> Grasse / Kuala Lumpur
                </div>
                <div>
                  <strong>Aging & Blending:</strong> 60 Days Minimum
                </div>
                <div>
                  <strong>Atomizer:</strong> High-Dispersion Micro-Mist
                </div>
                <div>
                  <strong>Refillable:</strong> Yes (Eco-Friendly Bottle)
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= 5. MOBILE STICKY BOTTOM INQUIRY BAR ================= */}
      <div className={`pdp-mobile-sticky-bar ${showStickyBar ? 'visible' : ''}`}>
        <div className="pdp-sticky-bar-inner">
          <a 
            href={`https://wa.me/60182868402?text=${encodeURIComponent(`Hello Valenszo! 🛍️\n\nI am viewing your online catalog and would like to order / inquire about:\n• Perfume: ${displayName}\n• Concentration: ${product.concentration || 'Extrait de Parfum'}\n• Selected Size: ${selectedSize}\n• Price: RM${totalPrice}\n\nCould you please assist me with stock availability & delivery arrangement? Thank you!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pdp-sticky-add-cart-btn"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#128C7E',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}
          >
            <MessageCircle size={18} />
            <span>Inquire via WhatsApp — RM{totalPrice}</span>
          </a>
        </div>
      </div>

      {/* ================= 6. LIGHTBOX ZOOM MODAL ================= */}
      {isLightboxOpen && (
        <div className="pdp-lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <button 
            className="pdp-lightbox-close" 
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close zoom"
          >
            <X size={24} />
          </button>
          <img 
            src={galleryItems[activeThumbIndex]?.url || galleryItems[0]?.url || product.image || ''} 
            alt="Enlarged bottle view" 
            className="pdp-lightbox-image"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* ================= 7. CINEMATIC VIDEO MODAL ================= */}
      {isVideoModalOpen && (
        <div className="pdp-lightbox-overlay" onClick={() => setIsVideoModalOpen(false)}>
          <button 
            className="pdp-lightbox-close" 
            onClick={() => setIsVideoModalOpen(false)}
            aria-label="Close video"
          >
            <X size={24} />
          </button>
          <div 
            style={{ 
              maxWidth: '800px', 
              width: '90vw', 
              background: '#000', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              padding: '2rem',
              textAlign: 'center',
              color: '#fff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', aspectRatio: '16/9', background: '#111', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1200&auto=format&fit=crop&q=80" 
                alt="Fragrance mist atmosphere" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                <Sparkles size={48} color="#c5a059" style={{ marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
                <h3 style={{ fontFamily: 'var(--font-brand, serif)', letterSpacing: '0.15em', fontSize: '1.4rem' }}>
                  {displayName}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  Cinematic Fragrance Experience · Fine Atomization & Scent Trail
                </p>
              </div>
            </div>
            <button 
              className="dior-btn" 
              style={{ marginTop: '1.5rem', background: '#fff', color: '#000', padding: '10px 24px', borderRadius: '4px', fontWeight: 700 }}
              onClick={() => setIsVideoModalOpen(false)}
            >
              Close Presentation
            </button>
          </div>
        </div>
      )}

      </div>
    );
  };
