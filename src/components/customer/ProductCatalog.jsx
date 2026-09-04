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

      {/* 2. Sticky Category Lineup Tabs */}
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

      {/* 4. Savoir-Faire Raw Materials Showcase */}
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
