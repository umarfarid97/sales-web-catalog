import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Heart, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight, 
  Maximize2, 
  X, 
  Play, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Radio, 
  Sparkles, 
  Calendar, 
  GlassWater,
  Check,
  MessageCircle
} from 'lucide-react';
import '../../styles/pdp.css';

// Helper for note photography swatches
const getNotePhoto = (noteName = '') => {
  const lower = noteName.toLowerCase();
  if (lower.includes('bergamot') || lower.includes('lime') || lower.includes('citrus') || lower.includes('lemon')) {
    return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop&q=80';
  }
  if (lower.includes('lavender') || lower.includes('violet') || lower.includes('iris')) {
    return 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=400&auto=format&fit=crop&q=80';
  }
  if (lower.includes('amber') || lower.includes('ambroxan') || lower.includes('resin') || lower.includes('benzoin')) {
    return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop&q=80';
  }
  if (lower.includes('rose') || lower.includes('peony') || lower.includes('floral')) {
    return 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&auto=format&fit=crop&q=80';
  }
  if (lower.includes('vanilla') || lower.includes('tonka') || lower.includes('gourmand')) {
    return 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80';
  }
  if (lower.includes('oud') || lower.includes('wood') || lower.includes('cedar') || lower.includes('sandalwood') || lower.includes('vetiver')) {
    return 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=400&auto=format&fit=crop&q=80';
  }
  if (lower.includes('pepper') || lower.includes('cardamom') || lower.includes('spice') || lower.includes('cinnamon')) {
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80';
  }
  if (lower.includes('leather') || lower.includes('suede') || lower.includes('tobacco')) {
    return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80';
  }
  // Default luxury macro botanical
  return 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&auto=format&fit=crop&q=80';
};

export const ProductDetailPage = () => {
  const {
    activeProduct,
    products,
    openProductDetail,
    navigateToCatalog,
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

  // Price calculations based on selected size
  const priceBySize = useMemo(() => {
    if (!product) return { '30ml': 0, '50ml': 0, '100ml': 0 };
    const base = Number(product.price) || 189;
    return {
      '30ml': Math.round(base * 0.63),
      '50ml': Math.round(base * 0.82),
      '100ml': base
    };
  }, [product]);

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

  // Dynamic Accords Intensity Profile
  const accords = useMemo(() => {
    if (!product) return [];
    const traits = Array.isArray(product.traits) ? product.traits : [];
    const family = product.olfactoryFamily || '';

    // Check key facets
    const isWoody = traits.some(t => /wood|vetiver|cedar|oud/i.test(t)) || /wood|oud/i.test(family);
    const isAmber = traits.some(t => /amber|oriental|balsam/i.test(t)) || /amber|oriental/i.test(family);
    const isSpicy = traits.some(t => /spic|pepper|warm/i.test(t)) || /spic/i.test(family);
    const isLeather = traits.some(t => /leather|smoke|smoky/i.test(t)) || /leather/i.test(family);
    const isAromatic = traits.some(t => /aromatic|fougere|lavender/i.test(t)) || /blue|aromatic/i.test(family);
    const isCitrus = traits.some(t => /citrus|bergamot|lemon/i.test(t)) || /citrus/i.test(family);
    const isSweet = traits.some(t => /sweet|vanilla|gourmand/i.test(t)) || /sweet/i.test(family);
    const isFresh = traits.some(t => /fresh|aquatic|clean/i.test(t)) || /fresh|aquatic/i.test(family);

    return [
      { name: 'Woody', score: isWoody ? 9 : 6, pct: isWoody ? '90%' : '60%' },
      { name: 'Amber', score: isAmber ? 9 : isWoody ? 8 : 5, pct: isAmber ? '90%' : isWoody ? '80%' : '50%' },
      { name: 'Spicy', score: isSpicy ? 9 : 8, pct: isSpicy ? '90%' : '80%' },
      { name: 'Leather', score: isLeather ? 9 : 7, pct: isLeather ? '90%' : '70%' },
      { name: 'Aromatic', score: isAromatic ? 8 : 6, pct: isAromatic ? '80%' : '60%' },
      { name: 'Citrus', score: isCitrus ? 8 : 4, pct: isCitrus ? '80%' : '40%' },
      { name: 'Sweet', score: isSweet ? 8 : 4, pct: isSweet ? '80%' : '40%' },
      { name: 'Fresh', score: isFresh ? 8 : 3, pct: isFresh ? '80%' : '30%' }
    ];
  }, [product]);

  // 4 Curated Fragrance Layering Suggestions ("Pairs Well With")
  const layeringSuggestions = useMemo(() => {
    if (!product || !products || products.length === 0) return [];
    // Select 4 other fragrances with different traits
    return products
      .filter(p => p.id !== product.id)
      .slice(0, 4)
      .map((p) => {
        // Curated fragrance layering companion title
        const facets = p.traits && p.traits.length >= 2 
          ? `${p.traits[0]} • ${p.traits[1]}` 
          : p.olfactoryFamily?.split('/')?.slice(0, 2)?.join(' • ') || 'Citrus • Fresh';

        return {
          id: p.id,
          name: p.name,
          facets: facets,
          image: p.images?.[0] || p.image,
          fullProduct: p
        };
      });
  }, [products, product]);

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

  const isFav = Array.isArray(favorites) ? favorites.includes(product.id) : false;

  // Safe pyramid notes for visual swatches
  const topNote = String(product.pyramid?.topNotes?.[0] || 'Calabrian Bergamot');
  const heartNote = String(product.pyramid?.heartNotes?.[0] || 'Damascena Rose');
  const baseNote = String(product.pyramid?.baseNotes?.[0] || 'Royal Woods');

  // Visible accords based on accordion toggle
  const visibleAccords = showAllAccords ? accords : accords.slice(0, 5);



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
          {product.name}
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
                src={galleryItems[activeThumbIndex]?.url || galleryItems[0].url} 
                alt={product.name} 
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
            {product.name}
          </h1>

          <div className="pdp-product-subtitle">
            {product.concentration || 'Extrait de Parfum'}
          </div>

          {/* Star Rating */}
          <div className="pdp-rating-row">
            <div className="pdp-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span className="pdp-rating-number">{product.rating || '4.8'}</span>
            <span className="pdp-rating-reviews">({product.reviewsCount || 124} reviews)</span>
          </div>

          {/* Editorial Italic Quote */}
          <div className="pdp-editorial-quote">
            "{product.tagline || 'A deep, magnetic fragrance for the modern connoisseur. Power in silence.'}"
          </div>

          {/* Price Row */}
          <div className="pdp-price-row">
            <span className="pdp-price-current">RM{currentUnitPrice}</span>
            <span className="pdp-price-size-indicator">({selectedSize})</span>
            {product.originalPrice && (
              <span className="pdp-price-original">
                RM{Math.round(product.originalPrice * (selectedSize === '30ml' ? 0.63 : selectedSize === '50ml' ? 0.82 : 1))}
              </span>
            )}
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

          {/* Direct WhatsApp Concierge Order & Inquiry */}
          <div className="pdp-cta-row" ref={mainCtaRef} style={{ marginTop: '16px' }}>
            <a
              href={`https://wa.me/60182868402?text=${encodeURIComponent(`Hello Valenszo Fragrance Concierge! 🛍️\n\nI am viewing your online catalog and would like to order / inquire about:\n• Perfume: ${product.name}\n• Concentration: ${product.concentration || 'Extrait de Parfum'}\n• Selected Size: ${selectedSize}\n• Price: RM${totalPrice}\n\nCould you please assist me with stock availability & delivery arrangement? Thank you!`)}`}
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

          {/* Trust Badges */}
          <div className="pdp-trust-row">
            <div className="pdp-trust-badge">
              <Truck size={20} className="pdp-trust-icon" />
              <div className="pdp-trust-text-col">
                <span className="pdp-trust-head">Free Shipping</span>
                <span className="pdp-trust-sub">Orders RM150+</span>
              </div>
            </div>

            <div className="pdp-trust-badge">
              <ShieldCheck size={20} className="pdp-trust-icon" />
              <div className="pdp-trust-text-col">
                <span className="pdp-trust-head">100% Authentic</span>
                <span className="pdp-trust-sub">Quality Assured</span>
              </div>
            </div>

            <div className="pdp-trust-badge">
              <RotateCcw size={20} className="pdp-trust-icon" />
              <div className="pdp-trust-text-col">
                <span className="pdp-trust-head">Easy Returns</span>
                <span className="pdp-trust-sub">30-Day Policy</span>
              </div>
            </div>
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
            Scent Profile
          </button>
          <button 
            className={`pdp-tab-trigger ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
            role="tab"
            aria-selected={activeTab === 'notes'}
          >
            Notes
          </button>
          <button 
            className={`pdp-tab-trigger ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
            role="tab"
            aria-selected={activeTab === 'description'}
          >
            Description
          </button>
          <button 
            className={`pdp-tab-trigger ${activeTab === 'layering' ? 'active' : ''}`}
            onClick={() => setActiveTab('layering')}
            role="tab"
            aria-selected={activeTab === 'layering'}
          >
            Layering
          </button>
          <button 
            className={`pdp-tab-trigger ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
            role="tab"
            aria-selected={activeTab === 'reviews'}
          >
            Reviews ({product.reviewsCount || 124})
          </button>
        </div>

        <div className="pdp-tab-body">
          {/* TAB 1: SCENT PROFILE (Flagship 3-block view from mockup) */}
          {activeTab === 'scent-profile' && (
            <div className="pdp-scent-profile-layout">
              
              {/* Col 1: Fragrance Profile (Accord Bars) */}
              <div>
                <h3 className="pdp-section-card-title">Fragrance Profile</h3>
                <div className="pdp-accords-list">
                  {visibleAccords.map((accord, i) => (
                    <div key={i} className="pdp-accord-row">
                      <span className="pdp-accord-name">{accord.name}</span>
                      <div className="pdp-accord-track">
                        <div 
                          className="pdp-accord-fill" 
                          style={{ width: accord.pct }}
                        />
                      </div>
                      <span className="pdp-accord-score">{accord.score}/10</span>
                    </div>
                  ))}
                </div>

                {accords.length > 5 && (
                  <button 
                    type="button"
                    className="pdp-accord-expand-btn"
                    onClick={() => setShowAllAccords(!showAllAccords)}
                  >
                    {showAllAccords ? (
                      <>View Less <ChevronUp size={14} /></>
                    ) : (
                      <>View More <ChevronDown size={14} /></>
                    )}
                  </button>
                )}
              </div>

              {/* Col 2: Key Notes & Performance Specs */}
              <div>
                <h3 className="pdp-section-card-title">Key Notes</h3>
                
                {/* 3 Visual Swatches */}
                <div className="pdp-note-swatches-row">
                  <div className="pdp-swatch-box">
                    <div className="pdp-swatch-image-frame">
                      <img 
                        src={getNotePhoto(topNote)} 
                        alt={topNote} 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&auto=format&fit=crop&q=80'; }}
                      />
                    </div>
                    <span className="pdp-swatch-name">{topNote.split(' ')?.[0] || 'Bergamot'}</span>
                    <span className="pdp-swatch-stage">(Top)</span>
                  </div>

                  <div className="pdp-swatch-box">
                    <div className="pdp-swatch-image-frame">
                      <img 
                        src={getNotePhoto(heartNote)} 
                        alt={heartNote} 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&auto=format&fit=crop&q=80'; }}
                      />
                    </div>
                    <span className="pdp-swatch-name">{heartNote.split(' ')?.[0] || 'Lavender'}</span>
                    <span className="pdp-swatch-stage">(Heart)</span>
                  </div>

                  <div className="pdp-swatch-box">
                    <div className="pdp-swatch-image-frame">
                      <img 
                        src={getNotePhoto(baseNote)} 
                        alt={baseNote} 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&auto=format&fit=crop&q=80'; }}
                      />
                    </div>
                    <span className="pdp-swatch-name">{baseNote.split(' ')?.[0] || 'Amber'}</span>
                    <span className="pdp-swatch-stage">(Base)</span>
                  </div>
                </div>

                {/* 4 Performance Metrics */}
                <div className="pdp-specs-grid">
                  <div className="pdp-spec-cell">
                    <div className="pdp-spec-icon-box">
                      <GlassWater size={17} />
                    </div>
                    <div className="pdp-spec-text-block">
                      <span className="pdp-spec-title">Occasion</span>
                      <span className="pdp-spec-value">
                        {product.category === 'Pour Femme' || product.category === 'Women' ? 'Evening, Gala, Dates' : 'Night Out, Special Events'}
                      </span>
                    </div>
                  </div>

                  <div className="pdp-spec-cell">
                    <div className="pdp-spec-icon-box">
                      <Calendar size={17} />
                    </div>
                    <div className="pdp-spec-text-block">
                      <span className="pdp-spec-title">Season</span>
                      <span className="pdp-spec-value">{product.season || 'Fall, Winter'}</span>
                    </div>
                  </div>

                  <div className="pdp-spec-cell">
                    <div className="pdp-spec-icon-box">
                      <Clock size={17} />
                    </div>
                    <div className="pdp-spec-text-block">
                      <span className="pdp-spec-title">Longevity</span>
                      <span className="pdp-spec-value">{product.longevity || '8–10 Hours'}</span>
                    </div>
                  </div>

                  <div className="pdp-spec-cell">
                    <div className="pdp-spec-icon-box">
                      <Radio size={17} />
                    </div>
                    <div className="pdp-spec-text-block">
                      <span className="pdp-spec-title">Projection</span>
                      <span className="pdp-spec-value">{product.sillage?.split(' ')?.[0] || 'Strong'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Col 3: High Fashion Campaign Card */}
              <div className="pdp-campaign-col">
                <div 
                  className="pdp-campaign-card"
                  style={{
                    backgroundImage: product.gender === 'Women' 
                      ? 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80)'
                      : 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80)'
                  }}
                >
                  <div className="pdp-campaign-overlay" />
                  <div className="pdp-campaign-content">
                    <div className="pdp-campaign-slogan">CONFIDENCE HAS A SCENT</div>
                    <div className="pdp-campaign-caption">
                      {product.name}. For what's next.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: NOTES PYRAMID */}
          {activeTab === 'notes' && (
            <div className="pdp-pyramid-details">
              <div className="pdp-pyramid-col">
                <h4>Top Notes</h4>
                <p className="timing">Immediate Awakening (0 - 30 Mins)</p>
                <ul>
                  {(product.pyramid?.topNotes || ['Calabrian Bergamot', 'Spiced Cardamom', 'Pink Peppercorn']).map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>

              <div className="pdp-pyramid-col">
                <h4>Heart Notes</h4>
                <p className="timing">The Soul (30 Mins - 4 Hours)</p>
                <ul>
                  {(product.pyramid?.heartNotes || ['French Lavender', 'Tailored Damascena', 'Rare Cedar']).map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>

              <div className="pdp-pyramid-col">
                <h4>Base Notes</h4>
                <p className="timing">Long-Lasting Base (4 - 16+ Hours)</p>
                <ul>
                  {(product.pyramid?.baseNotes || ['Rich Ambroxan', 'Lacquered Woods', 'Bourbon Vanilla']).map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
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

          {/* TAB 4: LAYERING RITUAL */}
          {activeTab === 'layering' && (
            <div style={{ maxWidth: '820px', lineHeight: 1.7, color: '#374151' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>The Art of Fragrance Layering</h4>
              <p style={{ marginBottom: '1rem' }}>
                Fragrance layering lets you create a unique signature scent. By combining complementary scents, you craft a long-lasting aroma tailored just for you.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <strong>Step 1: The Anchor Base</strong>
                  <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '4px 0 0' }}>Apply 2 sprays of {product.name} to warm pulse points (collarbones and wrists).</p>
                </div>
                <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <strong>Step 2: The Illuminating Accent</strong>
                  <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '4px 0 0' }}>Mist a brighter citrus or fresh aromatic partner directly over the chest to create radiant diffusion.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div style={{ maxWidth: '820px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', background: '#faf9f6', borderRadius: '6px', marginBottom: '2rem' }}>
                <div>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                    {product.rating || '4.8'}
                  </div>
                  <div className="pdp-stars" style={{ margin: '4px 0' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Based on {product.reviewsCount || 124} reviews</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <span>5 ★</span>
                    <div style={{ flex: 1, height: '6px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', background: '#f59e0b' }} />
                    </div>
                    <span>85%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <span>4 ★</span>
                    <div style={{ flex: 1, height: '6px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '12%', height: '100%', background: '#f59e0b' }} />
                    </div>
                    <span>12%</span>
                  </div>
                </div>
              </div>

              {/* Sample Verified Testimonial */}
              <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>Faris A.</span>
                  <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '3px', fontWeight: 600 }}>Verified Connoisseur</span>
                </div>
                <div className="pdp-stars" style={{ marginBottom: '6px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.5 }}>
                  "Unbelievable longevity. Scent lasted well into the next morning on my suit jacket. The drydown into smoky amber and cedar is pure luxury."
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= 4. PAIRS WELL WITH (LAYERING SUGGESTIONS) ================= */}
      <section className="pdp-layering-container">
        <div className="pdp-layering-header-row">
          <div>
            <h3 className="pdp-layering-heading">Pairs Well With (Layering Suggestions)</h3>
            <p className="pdp-layering-subtitle">Any two can layer beautifully.</p>
          </div>

          <button 
            className="pdp-layering-explore-link"
            onClick={() => navigateToCatalog()}
          >
            View All Layering Combinations <ChevronRight size={15} />
          </button>
        </div>

        <div className="pdp-layering-cards-grid">
          {layeringSuggestions.map((item) => (
            <div 
              key={item.id} 
              className="pdp-layer-card"
              onClick={() => openProductDetail(item.fullProduct)}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="pdp-layer-bottle-thumb" 
                loading="lazy"
              />
              <div className="pdp-layer-info">
                <div className="pdp-layer-title">{item.name}</div>
                <div className="pdp-layer-facets">{item.facets}</div>
              </div>
              <span 
                className="pdp-layer-add-btn"
                aria-label={`Explore ${item.name}`}
                style={{ background: '#f3f4f6', color: '#111827' }}
              >
                <ChevronRight size={16} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. MOBILE STICKY BOTTOM INQUIRY BAR ================= */}
      <div className={`pdp-mobile-sticky-bar ${showStickyBar ? 'visible' : ''}`}>
        <div className="pdp-sticky-bar-inner">
          <a 
            href={`https://wa.me/60182868402?text=${encodeURIComponent(`Hello Valenszo Fragrance Concierge! 🛍️\n\nI am viewing your online catalog and would like to order / inquire about:\n• Perfume: ${product.name}\n• Concentration: ${product.concentration || 'Extrait de Parfum'}\n• Selected Size: ${selectedSize}\n• Price: RM${totalPrice}\n\nCould you please assist me with stock availability & delivery arrangement? Thank you!`)}`}
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
            src={galleryItems[activeThumbIndex]?.url || galleryItems[0].url} 
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
                  {product.name}
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
