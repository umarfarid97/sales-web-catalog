import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Heart, 
  ShoppingBag, 
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
  Check
} from 'lucide-react';
import '../../styles/pdp.css';

// Helper for note photography swatches
const getNotePhoto = (noteName = '') => {
  const lower = noteName.toLowerCase();
  if (lower.includes('bergamot') || lower.includes('lime') || lower.includes('citrus') || lower.includes('lemon')) {
    return 'https://images.unsplash.com/photo-1597714026733-4700d1c9fa9c?w=400&auto=format&fit=crop&q=80';
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
    closeProductDetail,
    navigateToCatalog,
    selectGenderCollection,
    addToCart,
    favorites,
    toggleFavorite,
    cartSubtotal,
    cartTotalItems,
    setIsCartOpen,
    showToast
  } = useStore();

  // Fallback if accessed directly with no product
  const product = activeProduct || products[0] || null;

  // Selected Size
  const [selectedSize, setSelectedSize] = useState('30ml');
  const [quantity, setQuantity] = useState(1);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('scent-profile');
  const [showAllAccords, setShowAllAccords] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isUpsellDrawerOpen, setIsUpsellDrawerOpen] = useState(false);

  if (!product) {
    return (
      <div className="pdp-page-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>Fragrance Not Found</h2>
        <p style={{ color: '#6b7280', margin: '1rem 0 2rem' }}>The requested creation may have been archived or is temporarily unavailable.</p>
        <button 
          className="dior-btn dior-btn-primary" 
          onClick={() => navigateToCatalog()}
          style={{ background: '#000', color: '#fff', padding: '12px 24px' }}
        >
          Return to Boutique Catalog
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(product.id);

  // Price calculations based on selected size
  const priceBySize = useMemo(() => {
    const base = Number(product.price) || 189;
    return {
      '30ml': Math.round(base * 0.63),
      '50ml': Math.round(base * 0.82),
      '100ml': base
    };
  }, [product.price]);

  const currentUnitPrice = priceBySize[selectedSize] || product.price;
  const totalPrice = currentUnitPrice * quantity;

  // 5 Gallery Images matching the mockup (Bottle, Slate scene, Macro detail, Video still, Luxury box)
  const galleryItems = useMemo(() => {
    const primary = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80';
    return [
      { type: 'image', url: primary, label: 'Flacon Front' },
      { type: 'image', url: product.images?.[1] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&auto=format&fit=crop&q=80', label: 'Dark Slate Atmosphere' },
      { type: 'image', url: product.images?.[2] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&auto=format&fit=crop&q=80', label: 'Artisanal Detail' },
      { type: 'video', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=900&auto=format&fit=crop&q=80', label: 'Cinematic Visual' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=900&auto=format&fit=crop&q=80', label: 'Collector Coffret' }
    ];
  }, [product]);

  // Dynamic Accords Intensity Profile
  const accords = useMemo(() => {
    const traits = Array.isArray(product.traits) ? product.traits : [];
    const family = product.olfactoryFamily || '';
    const name = product.name || '';

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

  // Visible accords (first 5 on mobile unless expanded)
  const visibleAccords = showAllAccords ? accords : accords.slice(0, 5);

  // Key Notes extracted from pyramid
  const topNote = product.pyramid?.topNotes?.[0] || 'Calabrian Bergamot';
  const heartNote = product.pyramid?.heartNotes?.[0] || 'French Lavender';
  const baseNote = product.pyramid?.baseNotes?.[0] || 'Precious Amber';

  // 4 Curated Fragrance Layering Suggestions ("Pairs Well With")
  const layeringSuggestions = useMemo(() => {
    if (!products || products.length === 0) return [];
    // Select 4 other fragrances with different traits
    return products
      .filter(p => p.id !== product.id)
      .slice(0, 4)
      .map((p, idx) => {
        // Luxury curated titles if available, or product displayName
        const facets = p.traits && p.traits.length >= 2 
          ? `${p.traits[0]} • ${p.traits[1]}` 
          : p.olfactoryFamily?.split('/')?.slice(0, 2)?.join(' • ') || 'Citrus • Fresh';

        return {
          id: p.id,
          name: p.displayName || p.name,
          facets: facets,
          image: p.images?.[0] || p.image,
          fullProduct: p
        };
      });
  }, [products, product]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, null, currentUnitPrice);
    setIsUpsellDrawerOpen(true);
    showToast(`Added ${quantity}x ${product.displayName || product.name} (${selectedSize}) to your Bag!`, 'success');
  };

  const handleQuickAddLayer = (e, item) => {
    e.stopPropagation();
    const defaultPrice = item.fullProduct.price || 150;
    addToCart(item.fullProduct, 1, '30ml', null, Math.round(defaultPrice * 0.63));
    showToast(`Added ${item.name} to your Layering Bag!`, 'success');
  };

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
        <button className="pdp-breadcrumb-item" onClick={() => navigateToCatalog()}>
          Home
        </button>
        <span className="pdp-breadcrumb-separator"><ChevronRight size={12} /></span>
        
        <button 
          className="pdp-breadcrumb-item" 
          onClick={() => selectGenderCollection(product.gender || 'Men')}
        >
          {product.gender === 'Women' ? 'Women' : 'Men'}
        </button>
        <span className="pdp-breadcrumb-separator"><ChevronRight size={12} /></span>

        <button 
          className="pdp-breadcrumb-item"
          onClick={() => navigateToCatalog(product.olfactoryFamily || "All Men's Creations", product.gender)}
        >
          {product.olfactoryFamily?.split('/')?.[0]?.trim() || 'Woody'}
        </button>
        <span className="pdp-breadcrumb-separator"><ChevronRight size={12} /></span>

        <span className="pdp-breadcrumb-current">
          {product.displayName || product.name}
        </span>
      </nav>

      {/* ================= 2. HERO SECTION: GALLERY & PURCHASE ================= */}
      <section className="pdp-hero-grid">
        
        {/* Gallery Showcase */}
        <div className="pdp-gallery-wrapper">
          
          {/* Thumbnail Rail */}
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

          {/* Main Stage Presentation */}
          <div className="pdp-main-stage">
            {/* Mobile Wishlist Heart */}
            <button 
              className="pdp-mobile-heart-btn"
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} fill={isFav ? "#111827" : "none"} color="#111827" />
            </button>

            {/* Mobile Image Counter Pill */}
            <div className="pdp-mobile-counter-pill">
              {activeThumbIndex + 1}/{galleryItems.length}
            </div>

            {/* Flacon Imagery */}
            <img 
              src={galleryItems[activeThumbIndex]?.url || galleryItems[0].url} 
              alt={product.displayName || product.name}
              className="pdp-main-flacon-img"
            />

            {/* Signature Slogan Overlay */}
            <div className="pdp-stage-slogan">
              BOLD. REFINED. UNFORGETTABLE.
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

            <button 
              className="pdp-desktop-heart-btn"
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={22} fill={isFav ? "#111827" : "none"} color="#111827" />
            </button>
          </div>

          <h1 className="pdp-product-title">
            {product.displayName || product.name}
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

          {/* Quantity Stepper & Add to Cart */}
          <div className="pdp-cta-row">
            <div className="pdp-stepper">
              <button 
                type="button" 
                className="pdp-stepper-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <div className="pdp-stepper-value">{quantity}</div>
              <button 
                type="button" 
                className="pdp-stepper-btn"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button 
              type="button" 
              className="pdp-add-to-cart-btn"
              onClick={handleAddToCart}
            >
              ADD TO CART — RM{totalPrice}
            </button>
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
                      <img src={getNotePhoto(topNote)} alt={topNote} />
                    </div>
                    <span className="pdp-swatch-name">{topNote.split(' ')?.[0] || 'Bergamot'}</span>
                    <span className="pdp-swatch-stage">(Top)</span>
                  </div>

                  <div className="pdp-swatch-box">
                    <div className="pdp-swatch-image-frame">
                      <img src={getNotePhoto(heartNote)} alt={heartNote} />
                    </div>
                    <span className="pdp-swatch-name">{heartNote.split(' ')?.[0] || 'Lavender'}</span>
                    <span className="pdp-swatch-stage">(Heart)</span>
                  </div>

                  <div className="pdp-swatch-box">
                    <div className="pdp-swatch-image-frame">
                      <img src={getNotePhoto(baseNote)} alt={baseNote} />
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
                        {product.category === 'Pour Femme' ? 'Evening, Gala, Dates' : 'Night Out, Special Events'}
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
                      {product.displayName || product.name}. For what's next.
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
                <p className="timing">Eternal Sillage (4 - 16+ Hours)</p>
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
                Hand-blended and cold-macerated for 60 days to allow every olfactory facet to achieve maximum richness, depth, and projection.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem', background: '#faf9f6', padding: '1.5rem', borderRadius: '6px' }}>
                <div>
                  <strong>Atelier:</strong> Grasse / Kuala Lumpur
                </div>
                <div>
                  <strong>Maceration:</strong> 60 Days Minimum
                </div>
                <div>
                  <strong>Atomizer:</strong> High-Dispersion Micro-Mist
                </div>
                <div>
                  <strong>Refillable:</strong> Yes (Maison Eco-Pledge)
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYERING RITUAL */}
          {activeTab === 'layering' && (
            <div style={{ maxWidth: '820px', lineHeight: 1.7, color: '#374151' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>The Art of Bespoke Layering</h4>
              <p style={{ marginBottom: '1rem' }}>
                In French haute parfumerie, layering is the ultimate expression of personal individuality. By combining contrasting accords, you craft an unmistakable sillage that belongs solely to you.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <strong>Step 1: The Anchor Base</strong>
                  <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '4px 0 0' }}>Apply 2 sprays of {product.displayName || product.name} to warm pulse points (collarbones and wrists).</p>
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
              <button 
                type="button" 
                className="pdp-layer-add-btn"
                onClick={(e) => handleQuickAddLayer(e, item)}
                aria-label={`Add ${item.name} to bag`}
              >
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. MOBILE STICKY BOTTOM PURCHASE BAR ================= */}
      <div className="pdp-mobile-sticky-bar">
        <div className="pdp-sticky-bar-inner">
          <button 
            type="button" 
            className="pdp-sticky-heart-btn"
            onClick={() => toggleFavorite(product.id)}
            aria-label="Wishlist"
          >
            <Heart size={20} fill={isFav ? "#111827" : "none"} color="#111827" />
          </button>

          <button 
            type="button" 
            className="pdp-sticky-add-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart — RM{totalPrice}
          </button>
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
            alt="Enlarged flacon view" 
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
                  {product.displayName || product.name}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  Cinematic Haute Parfumerie Experience · Maceration & Atomization
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

      {/* ================= 8. POST-ADD UPSELL DRAWER (SCENT WARDROBE) ================= */}
      {isUpsellDrawerOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsUpsellDrawerOpen(false)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '100%',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 30px rgba(0,0,0,0.15)',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                  Added to Cart!
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUpsellDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Recently Added Item Card */}
              <div style={{ display: 'flex', gap: '14px', background: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                <img
                  src={galleryItems[0].url}
                  alt={product.displayName || product.name}
                  style={{ width: '64px', height: '74px', objectFit: 'contain', background: '#ffffff', borderRadius: '4px', padding: '4px', border: '1px solid #e5e7eb' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    {product.displayName || product.name}
                  </h4>
                  <div style={{ fontSize: '0.74rem', color: '#6b7280', margin: '2px 0 6px' }}>
                    {product.brandInspiration ? `Inspired by ${product.brandInspiration}` : 'Extrait de Parfum'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                    <span style={{ color: '#4b5563' }}>Size: {selectedSize} &bull; Qty: {quantity}</span>
                    <span style={{ fontWeight: 800, color: '#111827' }}>RM{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Complete Your Scent Wardrobe (Frequently Bought Together) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Sparkles size={14} color="#c5a059" />
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Complete Your Scent Wardrobe
                  </h4>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0 0 12px' }}>
                  Frequently layered together for unforgettable presence and 16+ hours longevity:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {layeringSuggestions.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '42px', height: '50px', objectFit: 'contain' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>
                            {item.facets}
                          </div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c5a059', marginTop: '2px' }}>
                            +RM45
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAddLayer(e, item)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: '1px solid #000000',
                          background: '#ffffff',
                          color: '#000000',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade to Bundle Callout Banner */}
              <div style={{ background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)', color: '#ffffff', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#c5a059', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Bundle Privilege
                  </span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(197, 160, 89, 0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    SAVE UP TO 25%
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                  Curate a 3 or 5-Bottle Scent Wardrobe
                </div>
                <p style={{ fontSize: '0.74rem', color: '#9ca3af', margin: 0 }}>
                  Pick your favorite fragrances, save up to 25%, and receive free luxury discovery coffret packaging.
                </p>
                <a
                  href="/bundle.html"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '4px',
                    padding: '8px 14px',
                    borderRadius: '4px',
                    background: '#c5a059',
                    color: '#000000',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}
                >
                  <span>Build Custom Bundle (From RM115)</span>
                  <ChevronRight size={14} />
                </a>
              </div>

            </div>

            {/* Drawer Sticky Bottom Actions */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f3f4f6', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Estimated Subtotal</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#111827' }}>
                  RM{cartSubtotal > 0 ? cartSubtotal : totalPrice}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href="/checkout.html"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '4px',
                    background: '#000000',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  Proceed to Checkout
                </a>

                <button
                  type="button"
                  onClick={() => setIsUpsellDrawerOpen(false)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    background: 'transparent',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
