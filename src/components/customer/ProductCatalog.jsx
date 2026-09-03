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
  ArrowRight
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
    selectedCategory,
    setSelectedCategory,
    activeGender
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
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="couture-sub" style={{ marginBottom: '4px' }}>
                {activeGender === 'Men' ? "Men's Fragrance Collection" : "Women's Fragrance Collection"}
              </div>
              <h2 className="couture-title" style={{ fontSize: '1.8rem', color: '#000000' }}>
                {selectedCategory.startsWith('All') ? (activeGender === 'Men' ? "Men's Fragrances (116 Creations)" : "Women's Fragrances (229 Creations)") : selectedCategory}
              </h2>
            </div>

            {/* Filter & Sort Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              
              <div style={{ fontSize: '0.82rem', color: '#000000', fontWeight: 700, fontFamily: 'var(--font-couture)', letterSpacing: '0.08em' }}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'CREATION' : 'CREATIONS'}
              </div>

              {/* Price Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase' }}>Price:</span>
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
                  &le; ${maxPrice}
                </span>
              </div>

              {/* In Stock */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#374151' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: '#000000', cursor: 'pointer' }}
                />
                <span>In Stock Only</span>
              </label>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem', border: '1px solid #e5e7eb' }}
              >
                <option value="featured">Tier S Icons First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name A-Z</option>
              </select>

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
