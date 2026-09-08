import React, { useState, useMemo } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrandValuesFooter } from './components/common/BrandValuesFooter';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { AuthModal } from './components/common/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProductCard } from './components/customer/ProductCard';
import { 
  SlidersHorizontal, 
  ChevronRight, 
  Heart, 
  Star, 
  X, 
  Check, 
  ChevronDown,
  Search
} from 'lucide-react';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/pdp.css';
import './styles/admin.css';

const PRIMARY_ACCORDS = ['Fresh', 'Woody', 'Spicy', 'Leather'];
const MORE_ACCORDS = ['Citrus', 'Amber', 'Aromatic', 'Oud', 'Aquatic', 'Sweet'];

export const MenCollectionContent = () => {
  const { products, favorites, toggleFavorite } = useStore();

  const [selectedChip, setSelectedChip] = useState('All');
  const [isMoreAccordsOpen, setIsMoreAccordsOpen] = useState(false);
  const [sortBy, setSortBy] = useState('best-sellers');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter Drawer States
  const [priceMax, setPriceMax] = useState(250);
  const [selectedAccords, setSelectedAccords] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedIntensities, setSelectedIntensities] = useState([]);

  // STRICT MEN'S FILTERING
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((p) => {
      if (!p || typeof p !== 'object' || !p.id) return false;

      // Exclusively Men's Fragrances
      const pId = String(p.id || '');
      const pSku = String(p.sku || '');
      const isMen = pId.startsWith('vlz-men') || pSku.startsWith('VLZ-M') || p.category === 'Pour Homme' || p.gender === 'Men';
      if (!isMen) return false;

      // Real-time Search Query Filter
      if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = String(p.name || '').toLowerCase();
        const inspiration = String(p.brandInspiration || '').toLowerCase();
        const family = String(p.olfactoryFamily || '').toLowerCase();
        const character = String(p.character || '').toLowerCase();
        const sku = String(p.sku || '').toLowerCase();
        const catalogNo = String(p.catalogNo || '');
        const traits = Array.isArray(p.traits) ? p.traits.join(' ').toLowerCase() : '';
        const topNotes = Array.isArray(p.pyramid?.topNotes) ? p.pyramid.topNotes.join(' ').toLowerCase() : '';
        const heartNotes = Array.isArray(p.pyramid?.heartNotes) ? p.pyramid.heartNotes.join(' ').toLowerCase() : '';
        const baseNotes = Array.isArray(p.pyramid?.baseNotes) ? p.pyramid.baseNotes.join(' ').toLowerCase() : '';

        const matchesSearch =
          name.includes(q) ||
          inspiration.includes(q) ||
          family.includes(q) ||
          character.includes(q) ||
          sku.includes(q) ||
          catalogNo.includes(q) ||
          traits.includes(q) ||
          topNotes.includes(q) ||
          heartNotes.includes(q) ||
          baseNotes.includes(q);

        if (!matchesSearch) return false;
      }

      // Quick chip accord filter
      if (selectedChip !== 'All') {
        const traits = Array.isArray(p.traits) ? p.traits.join(' ').toLowerCase() : '';
        const family = String(p.olfactoryFamily || '').toLowerCase();
        const chipLower = selectedChip.toLowerCase();
        if (!traits.includes(chipLower) && !family.includes(chipLower)) {
          return false;
        }
      }

      // Drawer Accord Filters
      if (selectedAccords.length > 0) {
        const traits = Array.isArray(p.traits) ? p.traits.join(' ').toLowerCase() : '';
        const family = String(p.olfactoryFamily || '').toLowerCase();
        const matchesAny = selectedAccords.some((acc) => {
          const accLower = acc.toLowerCase();
          return traits.includes(accLower) || family.includes(accLower);
        });
        if (!matchesAny) return false;
      }

      // Price filter
      const pPrice = Number(p.price) || 45;
      if (pPrice > priceMax) return false;

      return true;
    }).sort((a, b) => {
      if (!a || !b) return 0;
      const priceA = Number(a.price) || 45;
      const priceB = Number(b.price) || 45;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (Number(b.rating) || 5) - (Number(a.rating) || 5);
      // Default: best sellers (Tier S first)
      const tierRank = { 'S': 3, 'A': 2, 'B': 1, 'C': 0 };
      const rankDiff = (tierRank[b.tier] || 0) - (tierRank[a.tier] || 0);
      if (rankDiff !== 0) return rankDiff;
      return (Number(b.reviewsCount) || 0) - (Number(a.reviewsCount) || 0);
    });
  }, [products, searchQuery, selectedChip, selectedAccords, priceMax, sortBy]);

  const toggleAccord = (accord) => {
    setSelectedAccords((prev) => 
      prev.includes(accord) ? prev.filter((a) => a !== accord) : [...prev, accord]
    );
  };

  const handleClearFilters = () => {
    setSelectedAccords([]);
    setSelectedOccasions([]);
    setSelectedIntensities([]);
    setPriceMax(250);
    setSelectedChip('All');
    setSearchQuery('');
  };

  const activeFiltersCount = selectedAccords.length + selectedOccasions.length + selectedIntensities.length + (priceMax < 250 ? 1 : 0) + (searchQuery.trim() ? 1 : 0);

  return (
    <>
      <main style={{ flex: 1, paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem clamp(12px, 3.5vw, 24px)' }}>
          
          {/* Breadcrumbs (Matching Picture 2) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.25rem' }}>
            <a href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</a>
            <ChevronRight size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Men</span>
          </div>

          {/* Men's Collection Hero Banner (Matching Picture 2) */}
          <div className="editorial-hero-banner">
            {/* Deep dark protective scrim preventing any camouflage with model portrait */}
            <div className="editorial-hero-scrim" />

            {/* Ambient warm glow */}
            <div 
              style={{
                position: 'absolute',
                left: '5%',
                top: '20%',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(197, 160, 89, 0.12) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />

            {/* Left Editorial Text Column (Matching Picture 2) */}
            <div className="editorial-hero-text">
              <h1 className="editorial-hero-title">
                Men&apos;s
                <br />
                Collection
              </h1>
              <p className="editorial-hero-subtitle">
                Bold. Refined. Confident.
              </p>
            </div>

            {/* Right Visual: Male Model with smooth left fade (Matching Picture 2) */}
            <div 
              className="editorial-hero-media"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=80)',
                backgroundPosition: 'center 15%'
              }}
            />
          </div>

          {/* Quick Accord Pill Filter Chips (Matching Picture 2: All, Fresh, Woody, Spicy, Leather, More v) */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
              {/* All Chip */}
              <button
                type="button"
                onClick={() => {
                  setSelectedChip('All');
                  setIsMoreAccordsOpen(false);
                }}
                style={{
                  padding: '7px 20px',
                  borderRadius: '999px',
                  border: '1.5px solid',
                  borderColor: selectedChip === 'All' ? '#000000' : '#e5e7eb',
                  background: selectedChip === 'All' ? '#000000' : '#ffffff',
                  color: selectedChip === 'All' ? '#ffffff' : '#111827',
                  fontSize: '0.82rem',
                  fontWeight: selectedChip === 'All' ? 700 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                All
              </button>

              {/* Primary Accords */}
              {PRIMARY_ACCORDS.map((accord) => {
                const isActive = selectedChip === accord;
                return (
                  <button
                    key={accord}
                    type="button"
                    onClick={() => {
                      setSelectedChip(accord);
                      setIsMoreAccordsOpen(false);
                    }}
                    style={{
                      padding: '7px 20px',
                      borderRadius: '999px',
                      border: '1.5px solid',
                      borderColor: isActive ? '#000000' : '#e5e7eb',
                      background: isActive ? '#000000' : '#ffffff',
                      color: isActive ? '#ffffff' : '#374151',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                  >
                    {accord}
                  </button>
                );
              })}

              {/* More v Dropdown Chip */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsMoreAccordsOpen(prev => !prev)}
                  style={{
                    padding: '7px 18px',
                    borderRadius: '999px',
                    border: '1.5px solid',
                    borderColor: MORE_ACCORDS.includes(selectedChip) ? '#000000' : '#e5e7eb',
                    background: MORE_ACCORDS.includes(selectedChip) ? '#000000' : '#ffffff',
                    color: MORE_ACCORDS.includes(selectedChip) ? '#ffffff' : '#374151',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{MORE_ACCORDS.includes(selectedChip) ? selectedChip : 'More'}</span>
                  <ChevronDown size={14} style={{ transform: isMoreAccordsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Dropdown Menu */}
                {isMoreAccordsOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      background: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                      border: '1px solid #e5e7eb',
                      padding: '6px',
                      zIndex: 50,
                      minWidth: '150px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    {MORE_ACCORDS.map((acc) => (
                      <button
                        key={acc}
                        type="button"
                        onClick={() => {
                          setSelectedChip(acc);
                          setIsMoreAccordsOpen(false);
                        }}
                        style={{
                          padding: '8px 14px',
                          border: 'none',
                          borderRadius: '4px',
                          background: selectedChip === acc ? '#f3f4f6' : 'transparent',
                          color: selectedChip === acc ? '#000000' : '#374151',
                          fontWeight: selectedChip === acc ? 700 : 500,
                          fontSize: '0.82rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{acc}</span>
                        {selectedChip === acc && <Check size={14} color="#000000" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls Bar: Sort & Filter Toggle (Matching Picture 2) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="best-sellers">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Search Button near Filter */}
              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                aria-label="Search Fragrance Collection"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '4px',
                  border: isSearchOpen || searchQuery ? '1px solid #111827' : '1px solid #d1d5db',
                  background: isSearchOpen || searchQuery ? '#f9fafb' : '#ffffff',
                  color: '#111827',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Search size={14} />
                <span>Search</span>
                {searchQuery.trim() && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#000000' }} />
                )}
              </button>

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  background: activeFiltersCount > 0 ? '#faf9f6' : '#ffffff',
                  color: '#111827',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
                {activeFiltersCount > 0 && (
                  <span style={{ background: '#000', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Luxury Search Input Bar */}
          {isSearchOpen && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <Search size={16} color="#6b7280" />
              <input
                type="text"
                autoFocus
                placeholder="Search men's creations by name, brand inspiration, notes (e.g. Sauvage, Bergamot)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.86rem',
                  color: '#111827',
                  fontFamily: 'inherit'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#6b7280',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '2px 4px'
                }}
              >
                Close
              </button>
            </div>
          )}

          {/* Product Grid (Matching Picture 2: 2 columns mobile, 4 columns desktop) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(145px, 22vw, 260px), 1fr))',
              gap: 'clamp(0.85rem, 2.5vw, 1.75rem)'
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>No creations match your selected filters.</p>
              <button
                type="button"
                className="dior-btn"
                onClick={handleClearFilters}
                style={{ marginTop: '1rem', background: '#000', color: '#fff', padding: '10px 20px', borderRadius: '4px' }}
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* FILTER DRAWER / SLIDE-OVER */}
      {isFilterDrawerOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '100%',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Filters</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: '#6b7280', textDecoration: 'underline' }}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111827' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Price Filter */}
            <div style={{ padding: '1.25rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Max Price</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>RM{priceMax}</span>
              </div>
              <input
                type="range"
                min="45"
                max="250"
                step="5"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#000000' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6b7280', marginTop: '4px' }}>
                <span>RM45</span>
                <span>RM250</span>
              </div>
            </div>

            {/* Accords Filter */}
            <div style={{ padding: '1.25rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 10px' }}>Olfactory Accords</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[...PRIMARY_ACCORDS, ...MORE_ACCORDS].map((acc) => {
                  const isChecked = selectedAccords.includes(acc);
                  return (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => toggleAccord(acc)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: isChecked ? '#000' : '#d1d5db',
                        background: isChecked ? '#000' : '#fff',
                        color: isChecked ? '#fff' : '#374151',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {acc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply Button */}
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  letterSpacing: '0.04em',
                  cursor: 'pointer'
                }}
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MenCollectionLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', color: '#111827' }}>
      <Navbar />
      <MenCollectionContent />
      <BrandValuesFooter />
      <Footer />
      <MobileBottomNav />

      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function MenApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <MenCollectionLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
