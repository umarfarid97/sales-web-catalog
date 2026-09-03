import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  SlidersHorizontal, 
  Search, 
  X, 
  RotateCcw, 
  Sparkles, 
  Flame,
  Feather
} from 'lucide-react';

export const ProductCatalog = () => {
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    maxPrice,
    setMaxPrice,
    products
  } = useStore();

  const [showFilters, setShowFilters] = useState(false);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
    setMaxPrice(600);
  };

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    searchQuery.trim() !== '' || 
    inStockOnly || 
    maxPrice < 600 || 
    sortBy !== 'featured';

  return (
    <section id="product-catalog-section" className="catalog-section">
      <div className="container">
        
        {/* Catalog Header Toolbar */}
        <div className="catalog-header">
          
          <div>
            <h2 className="font-serif-title" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {selectedCategory === 'All' ? 'Artisanal Fragrance Vault' : selectedCategory}
              <span className="catalog-count-badge" style={{ fontSize: '0.95rem', fontWeight: 600, marginLeft: '12px' }}>
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'creation' : 'creations'})
              </span>
            </h2>
            {searchQuery && (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Olfactory notes matching <strong style={{ color: 'var(--accent-gold)' }}>&quot;{searchQuery}&quot;</strong>
              </p>
            )}
          </div>

          <div className="catalog-controls">
            
            {/* Filter Toggle Button */}
            <button
              className={`btn ${showFilters ? 'btn-gold' : 'btn-secondary'}`}
              style={{ padding: '9px 16px', fontSize: '0.88rem' }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={15} />
              <span>Scent Filters</span>
              {hasActiveFilters && (
                <span 
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#0b0c10'
                  }}
                />
              )}
            </button>

            {/* Sort Select */}
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort fragrances"
            >
              <option value="featured">Featured Masterpieces</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated Sillage</option>
              <option value="name">Fragrance Name (A - Z)</option>
            </select>

          </div>

        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div style={{
            padding: '24px',
            marginBottom: '32px',
            background: 'rgba(15, 17, 25, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', alignItems: 'center' }}>
              
              {/* Max Price Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--accent-gold-light)', textTransform: 'uppercase' }}>Maximum Price</span>
                  <span style={{ color: '#fce08b', fontFamily: 'var(--font-mono)' }}>${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                />
              </div>

              {/* Stock Toggle */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ accentColor: 'var(--accent-gold)', width: '17px', height: '17px' }}
                  />
                  <span>In Stock Flacons Only</span>
                </label>
              </div>

              {/* Reset Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  onClick={resetAllFilters}
                >
                  <RotateCcw size={14} />
                  <span>Reset All Filters</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'rgba(15, 17, 24, 0.6)',
            border: '1px dashed rgba(212, 175, 55, 0.3)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-gold)' }}>
              <Feather size={28} />
            </div>
            <h3 className="font-serif-title" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Fragrances Found</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              No scent profiles matched your selected olfactory family or filter criteria.
            </p>
            <button className="btn btn-gold" onClick={resetAllFilters}>
              <span>Clear Scent Filters</span>
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
