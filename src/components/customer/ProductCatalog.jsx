import React from 'react';
import { useStore } from '../../context/StoreContext';
import { HeroBanner } from './HeroBanner';
import { SavoirFaireSection } from './SavoirFaireSection';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';
import { 
  SlidersHorizontal, 
  Sparkles, 
  Gift, 
  RefreshCw, 
  Feather,
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
    setSelectedCategory
  } = useStore();

  return (
    <div>
      {/* 1. Cinematic Full-Bleed Hero Stage */}
      <HeroBanner />

      {/* 2. Savoir-Faire Raw Materials Gallery */}
      <SavoirFaireSection />

      {/* 3. The Olfactory Vault / Catalog Section */}
      <section id="vault-catalog" style={{ padding: '80px 0 100px' }}>
        <div className="container">
          
          {/* Section Heading */}
          <div className="vault-header-row">
            <div>
              <div className="couture-sub" style={{ color: 'var(--accent-copper-light)', marginBottom: '6px' }}>
                Haute Parfumerie &bull; Collection Vault
              </div>
              <h2 className="couture-title" style={{ fontSize: '2rem' }}>
                {selectedCategory === 'All Creations' ? 'The Complete Sauvage & Privée Range' : selectedCategory}
              </h2>
            </div>

            {/* Filter Pills */}
            <CategoryFilter />
          </div>

          {/* Filter & Sort Controls Bar */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(11, 17, 34, 0.7)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 22px',
              marginBottom: '36px',
              gap: '20px',
              flexWrap: 'wrap'
            }}
          >
            {/* Left Count */}
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontFamily: 'var(--font-couture)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Showing <span style={{ color: '#ffffff', fontWeight: 700 }}>{filteredProducts.length}</span> Masterpieces
            </div>

            {/* Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              
              {/* Max Price Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price:</span>
                <input
                  type="range"
                  min="100"
                  max="400"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ accentColor: 'var(--accent-copper)', width: '100px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-copper-light)' }}>
                  &le; ${maxPrice}
                </span>
              </div>

              {/* In Stock Only Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: 'var(--accent-copper)', cursor: 'pointer' }}
                />
                <span>Available Reserve</span>
              </label>

              {/* Sort Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem', background: 'rgba(4, 7, 17, 0.9)' }}
                >
                  <option value="featured">Featured Masterpieces</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Connoisseur Rating</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div 
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                background: 'rgba(11, 17, 34, 0.5)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Sparkles size={36} color="var(--accent-copper)" style={{ marginBottom: '16px' }} />
              <h3 className="couture-title" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Fragrance Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                No fragrance matching &quot;{searchQuery || selectedCategory}&quot; under ${maxPrice}.
              </p>
              <button
                className="btn btn-dior-solid"
                onClick={() => {
                  setSelectedCategory('All Creations');
                  setMaxPrice(400);
                }}
              >
                Reset Catalog Filters
              </button>
            </div>
          )}

          {/* 4. Dior Art of Gifting Signature Banner */}
          <div className="dior-gifting-banner">
            <div className="dior-gifting-content">
              <div className="couture-sub">The Dior Art of Gifting &bull; Signature Presentation</div>
              <h3 className="couture-title">An Unforgettable Couture Experience</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Every fragrance creation is packaged with extreme care in an iconic midnight blue gift box, sealed with a gold-embossed ribbon, and accompanied by your complimentary custom flacon engraving and 2 deluxe travel samples.
              </p>
            </div>
            <div>
              <button 
                className="btn btn-copper"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>Discover The Range</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
