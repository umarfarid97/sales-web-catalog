import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { HeroBanner } from './HeroBanner';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';
import { SavoirFaireSection } from './SavoirFaireSection';
import { 
  Gift, 
  RefreshCw, 
  Feather, 
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Search,
  X
} from 'lucide-react';

export const ProductCatalog = () => {
  const { 
    filteredProducts, 
    sortBy, 
    setSortBy, 
    inStockOnly, 
    setInStockOnly,
    maxPrice,
    setMaxPrice,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeGender,
    menCount,
    womenCount
  } = useStore();

  const [visibleCount, setVisibleCount] = useState(24);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, searchQuery, inStockOnly, maxPrice, sortBy, activeGender]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div>
      {/* 1. Cinematic Campaign Hero */}
      <HeroBanner />

      {/* 2. DUAL COLLECTION SPLIT CARDS (MEN & WOMEN) */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem clamp(16px, 3.5vw, 36px) 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Men's Atelier Card */}
          <div 
            onClick={() => { window.location.href = '/collection.html?gender=Men'; }}
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: '260px',
              background: '#09090b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              transition: 'transform 0.25s ease'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '55%',
                backgroundImage: 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                maskImage: 'linear-gradient(to right, transparent, black 40%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
              }}
            />
            <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 2rem', maxWidth: '340px', color: '#ffffff' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c5a059', fontWeight: 800 }}>
                Pour Homme &bull; Atelier
              </span>
              <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.8rem', fontWeight: 800, margin: '6px 0 8px', letterSpacing: '0.02em' }}>
                SHOP MEN
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#d1d5db', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                Bold. Refined. Confident. Smoked woods, wild bergamot & rare ambers.
              </p>
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  borderBottom: '2px solid #c5a059',
                  paddingBottom: '4px'
                }}
              >
                <span>Discover Men&apos;s Collection</span>
                <ArrowRight size={14} color="#c5a059" />
              </span>
            </div>
          </div>

          {/* Women's Atelier Card */}
          <div 
            onClick={() => { window.location.href = '/collection.html?gender=Women'; }}
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: '260px',
              background: '#18181b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              transition: 'transform 0.25s ease'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '55%',
                backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                maskImage: 'linear-gradient(to right, transparent, black 40%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
              }}
            />
            <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 2rem', maxWidth: '340px', color: '#ffffff' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c5a059', fontWeight: 800 }}>
                Pour Femme &bull; Atelier
              </span>
              <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.8rem', fontWeight: 800, margin: '6px 0 8px', letterSpacing: '0.02em' }}>
                SHOP WOMEN
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#d1d5db', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                Elegant. Feminine. Unique. Velvet bourbon vanilla, Turkish rose & white musk.
              </p>
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  borderBottom: '2px solid #c5a059',
                  paddingBottom: '4px'
                }}
              >
                <span>Discover Women&apos;s Collection</span>
                <ArrowRight size={14} color="#c5a059" />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Sticky Category Lineup Tabs */}
      <CategoryFilter />

      {/* 3. Product Catalog Grid */}
      <section id="sauvage-catalog-grid" className="dior-catalog-section">
        <div className="container">
          
          {/* Header & Filter Toolbar */}
          <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Top Row: Title on Left, Search Bar on Right */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="couture-sub" style={{ marginBottom: '4px' }}>
                  {activeGender === 'Men' ? "Men's Fragrance Collection" : "Women's Fragrance Collection"}
                </div>
                <h2 className="couture-title" style={{ fontSize: '1.8rem', color: '#000000', margin: 0 }}>
                  {(!selectedCategory || String(selectedCategory).startsWith('All')) 
                    ? (activeGender === 'Men' ? `Men's Fragrances (${menCount} Creations)` : `Women's Fragrances (${womenCount} Creations)`) 
                    : selectedCategory}
                </h2>
              </div>

              {/* Scent Search Bar */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="Search by name, brand, notes or No..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '8px 36px 8px 38px',
                    fontSize: '0.84rem',
                    fontFamily: 'var(--font-couture)',
                    border: '1px solid #d1d5db',
                    borderRadius: '2px',
                    background: '#ffffff',
                    color: '#000000',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#000000';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.06)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Row: Creation Count & Controls (Price Slider, In Stock, Sort) */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '16px',
              paddingTop: '12px',
              borderTop: '1px solid #f3f4f6'
            }}>
              
              {/* Creation Count */}
              <div style={{ fontSize: '0.82rem', color: '#000000', fontWeight: 800, fontFamily: 'var(--font-couture)', letterSpacing: '0.08em' }}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'CREATION' : 'CREATIONS'}
                {searchQuery.trim() && (
                  <span style={{ fontWeight: 500, color: '#6b7280', marginLeft: '6px', fontSize: '0.78rem' }}>
                    matching &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>

              {/* Controls Group */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* Price Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Price:</span>
                  <input
                    type="range"
                    min="80"
                    max="400"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{ accentColor: '#000000', width: '90px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    &le; RM {maxPrice}
                  </span>
                </div>

                {/* In Stock */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ accentColor: '#000000', cursor: 'pointer' }}
                  />
                  <span>In Stock Only</span>
                </label>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{
                    width: 'auto',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '2px',
                    background: '#ffffff',
                    color: '#000000',
                    fontFamily: 'var(--font-couture)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="featured">Tier S Icons First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name A-Z</option>
                </select>

              </div>
            </div>

          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <>
              <div className="dior-products-grid">
                {displayedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {filteredProducts.length > visibleCount && (
                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                  <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '14px', fontFamily: 'var(--font-couture)', letterSpacing: '0.08em' }}>
                    SHOWING {visibleCount} OF {filteredProducts.length} CREATIONS
                  </p>
                  <button
                    className="btn btn-dior-black"
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    style={{ padding: '13px 36px', fontSize: '0.82rem', letterSpacing: '0.1em' }}
                  >
                    <span>Discover More Creations</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div 
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                background: '#f9f9f9',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <h3 className="couture-title" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Fragrance Found</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '20px' }}>
                No fragrance matching &quot;{searchQuery || selectedCategory}&quot; under ${maxPrice}.
              </p>
              <button
                className="btn btn-dior-black"
                onClick={() => {
                  setSelectedCategory('All Creations');
                  setMaxPrice(400);
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. SIGNATURE BUNDLE & SAVE PROMOTION BANNER */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '1rem clamp(16px, 3.5vw, 36px) 3rem' }}>
        <div 
          style={{
            background: 'linear-gradient(135deg, #111827 0%, #000000 100%)',
            borderRadius: '12px',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(197, 160, 89, 0.2)', color: '#c5a059', padding: '4px 12px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Sparkles size={14} />
              <span>The Maison Scent Wardrobe</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              CURATE YOUR SIGNATURE BUNDLE & SAVE UP TO 25%
            </h3>
            <p style={{ color: '#d1d5db', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.75rem', maxWidth: '480px' }}>
              In French perfumery, signature presence comes from layering. Choose 3 or 5 of your favorite creations to enjoy exclusive bundle pricing and receive complimentary collector gift presentation.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => { window.location.href = '/bundle.html'; }}
                style={{
                  padding: '14px 28px',
                  borderRadius: '4px',
                  background: '#c5a059',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Build Your Bundle</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => { window.location.href = '/diagnostic.html'; }}
                style={{
                  padding: '14px 28px',
                  borderRadius: '4px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Take Scent Quiz
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div 
              onClick={() => { window.location.href = '/bundle.html'; }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#c5a059', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Save 15%
              </div>
              <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 2px' }}>
                RM115
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                Standard RM135
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '8px', color: '#ffffff' }}>
                3-Bottle Wardrobe
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>
                Anchor + 2 Companions
              </div>
            </div>

            <div 
              onClick={() => { window.location.href = '/bundle.html'; }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Save 25% · Best Value
              </div>
              <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 2px' }}>
                RM169
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                Standard RM225
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '8px', color: '#ffffff' }}>
                5-Bottle Master Collector
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>
                Full Olfactory Spectrum
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Savoir-Faire Raw Materials Showcase */}
      <SavoirFaireSection />

      {/* 5. The Valenszo Art of Gifting Experience */}
      <section className="dior-gifting-experience">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <div className="couture-sub" style={{ marginBottom: '6px' }}>
              Online Boutique Privileges
            </div>
            <h2 className="couture-title" style={{ fontSize: '2rem', color: '#000000' }}>
              The Valenszo Art of Gifting
            </h2>
            <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Make each gift unique with personalized engraving, iconic Valenszo presentation boxes, and complimentary deluxe samples.
            </p>
          </div>

          <div className="dior-gifting-grid">
            <div className="dior-gifting-card">
              <div className="dior-gifting-icon">
                <Gift size={24} />
              </div>
              <h3 className="couture-title" style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Iconic Gift Box</h3>
              <p style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                Every order is nestled in the signature Valenszo gift box, tied with a custom ribbon.
              </p>
            </div>

            <div className="dior-gifting-card">
              <div className="dior-gifting-icon">
                <Feather size={24} />
              </div>
              <h3 className="couture-title" style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Personalized Engraving</h3>
              <p style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                Engrave your flacon with initials or a memorable date for a bespoke keepsake.
              </p>
            </div>

            <div className="dior-gifting-card">
              <div className="dior-gifting-icon">
                <RefreshCw size={24} />
              </div>
              <h3 className="couture-title" style={{ fontSize: '0.95rem', marginBottom: '8px' }}>2 Deluxe Samples</h3>
              <p style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                Discover new olfactory creations with 2 complimentary deluxe miniatures.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
