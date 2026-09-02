import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  SlidersHorizontal, 
  Search, 
  X, 
  RotateCcw,
  Sparkles,
  PackageX
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
    setMaxPrice(500);
  };

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    searchQuery.trim() !== '' || 
    inStockOnly || 
    maxPrice < 500 || 
    sortBy !== 'featured';

  return (
    <section id="product-catalog-section" style={{ padding: '20px 0 60px' }}>
      <div className="container">
        
        {/* Catalog Header Toolbar */}
        <div className="catalog-header">
          
          <div className="catalog-title-wrap">
            <h2>
              {selectedCategory === 'All' ? 'Curated Collection' : selectedCategory}
              <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 500, marginLeft: '10px' }}>
                ({filteredProducts.length} items)
              </span>
            </h2>
            {searchQuery && (
              <p>
                Showing search results for <span style={{ color: '#818cf8', fontWeight: 600 }}>"{searchQuery}"</span>
              </p>
            )}
          </div>

          <div className="catalog-controls">
            
            {/* Filter Drawer / Panel Toggle */}
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)'
                  }}
                />
              )}
            </button>

            {/* Sort Select */}
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured & Best Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                className="btn btn-secondary"
                onClick={resetAllFilters}
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                title="Reset all filters"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}

          </div>

        </div>

        {/* Expandable Advanced Filters Bar */}
        {showFilters && (
          <div 
            className="glass-panel"
            style={{
              padding: '20px 24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
              animation: 'scaleUp 0.2s ease'
            }}
          >
            {/* Price Slider Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-muted)' }}>Max Price:</span>
                <span style={{ color: '#ffffff' }}>${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)', width: '100%' }}
              />
            </div>

            {/* In Stock Only Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span>In Stock Items Only</span>
            </label>

            {/* Clear Button */}
            <button
              className="btn btn-secondary"
              onClick={resetAllFilters}
              style={{ padding: '6px 14px', fontSize: '0.82rem', marginLeft: 'auto' }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div 
            className="glass-panel"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '40px auto'
            }}
          >
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'var(--text-muted)'
              }}
            >
              <PackageX size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No products found</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
              We couldn't find any products matching your current filters or search terms.
            </p>
            <button
              className="btn btn-primary"
              onClick={resetAllFilters}
            >
              <RotateCcw size={16} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
