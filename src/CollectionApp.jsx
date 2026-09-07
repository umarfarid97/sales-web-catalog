import React, { useState, useMemo, useEffect } from 'react';
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
import { 
  SlidersHorizontal, 
  ChevronRight, 
  Heart, 
  Star, 
  X, 
  Check, 
  ChevronDown
} from 'lucide-react';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/pdp.css';
import './styles/admin.css';

const ACCORD_OPTIONS = ['Fresh', 'Woody', 'Spicy', 'Leather', 'Citrus', 'Amber', 'Aromatic', 'Oud'];
const OCCASION_OPTIONS = ['Daily', 'Work', 'Night Out', 'Special Occasion'];

export const CollectionPageContent = () => {
  const { products, favorites, toggleFavorite } = useStore();

  // Read URL query params on mount
  const [activeGender, setActiveGender] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('gender') || localStorage.getItem('valenszo_active_gender') || 'Men';
    }
    return 'Men';
  });

  const [selectedChip, setSelectedChip] = useState('All');
  const [sortBy, setSortBy] = useState('best-sellers');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter Drawer States
  const [priceMax, setPriceMax] = useState(250);
  const [selectedAccords, setSelectedAccords] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedIntensities, setSelectedIntensities] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const g = params.get('gender');
      if (g) setActiveGender(g);
      const cat = params.get('category');
      if (cat) setSelectedChip(cat);
    }
  }, []);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((p) => {
      if (!p || typeof p !== 'object' || !p.id) return false;

      // Gender filter
      const pId = String(p.id || '');
      const pGender = p.gender || (p.category === 'Pour Femme' || pId.startsWith('vlz-women') || pId.startsWith('vlz-wom') ? 'Women' : 'Men');
      if (activeGender && pGender !== activeGender) return false;

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
  }, [products, activeGender, selectedChip, selectedAccords, priceMax, sortBy]);

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
  };

  const activeFiltersCount = selectedAccords.length + selectedOccasions.length + selectedIntensities.length + (priceMax < 250 ? 1 : 0);

  const bannerData = activeGender === 'Women' ? {
    title1: "Women's",
    title2: "Collection",
    subtitle: "Elegant. Feminine. Unique.",
    bgImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80"
  } : {
    title1: "Men's",
    title2: "Collection",
    subtitle: "Bold. Refined. Confident.",
    bgImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=80"
  };

  const [isMoreAccordsOpen, setIsMoreAccordsOpen] = useState(false);
  const PRIMARY_ACCORDS = ['Fresh', 'Woody', 'Spicy', 'Leather'];
  const MORE_ACCORDS = ['Citrus', 'Amber', 'Aromatic', 'Oud', 'Floral', 'Sweet', 'Aquatic'];

  return (
    <>
      <main style={{ flex: 1, paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem clamp(12px, 3.5vw, 24px)' }}>
          
          {/* Breadcrumbs (Matching Picture 2) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.25rem' }}>
            <a href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</a>
            <ChevronRight size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>{activeGender}</span>
          </div>

          {/* Collection Hero Banner (Matching Picture 2) */}
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
                {bannerData.title1}
                <br />
                {bannerData.title2}
              </h1>
              <p className="editorial-hero-subtitle">
                {bannerData.subtitle}
              </p>
            </div>

            {/* Right Visual: Model with smooth left fade (Matching Picture 2) */}
            <div 
              className="editorial-hero-media"
              style={{
                backgroundImage: `url(${bannerData.bgImage})`,
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

              {/* Primary Accords (Fresh, Woody, Spicy, Leather) */}
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

                {/* Dropdown Menu for Additional Accords */}
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

          {/* Product Grid (4 columns desktop, 2 columns mobile) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(145px, 22vw, 260px), 1fr))',
              gap: 'clamp(0.85rem, 2.5vw, 1.75rem)'
            }}
          >
            {filteredProducts.map((product) => {
              const isFav = Array.isArray(favorites) ? favorites.includes(product.id) : false;
              const price = product.price || 45;

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    window.location.href = `/product.html?product=${encodeURIComponent(product.id)}`;
                  }}
                  style={{
                    background: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    position: 'relative'
                  }}
                >
                  {/* Flacon Container */}
                  <div 
                    style={{
                      position: 'relative',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      background: '#f8f9fa',
                      aspectRatio: '1 / 1.15',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.75rem',
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <img 
                      src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80'} 
                      alt={product.name}
                      loading="lazy"
                      style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                    />

                    {/* Wishlist Heart */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isFav ? '#000000' : '#6b7280'
                      }}
                    >
                      <Heart size={16} fill={isFav ? '#000000' : 'none'} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>
                      {product.displayName || product.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', margin: '3px 0 6px' }}>
                      {product.brandInspiration ? `Inspired by ${product.brandInspiration}` : 'Extrait de Parfum'}
                    </div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827' }}>
                      RM{price}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />
                      ))}
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', marginLeft: '4px' }}>
                        ({product.reviewsCount || 124})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Price Range Slider */}
            <div style={{ padding: '1.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                <span>Price Range</span>
                <span style={{ color: '#c5a059' }}>RM0 — RM{priceMax}</span>
              </div>
              <input
                type="range"
                min="30"
                max="250"
                step="5"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#000000', cursor: 'pointer' }}
              />
            </div>

            {/* Accords Checkboxes */}
            <div style={{ padding: '1.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem' }}>Accords</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ACCORD_OPTIONS.map((accord) => {
                  const isChecked = selectedAccords.includes(accord);
                  return (
                    <label 
                      key={accord} 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', color: '#374151', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAccord(accord)}
                          style={{ accentColor: '#000000' }}
                        />
                        <span>{accord}</span>
                      </div>
                      <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>(30)</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Occasions */}
            <div style={{ padding: '1.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem' }}>Occasion</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {OCCASION_OPTIONS.map((occ) => (
                  <label key={occ} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', color: '#374151', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" style={{ accentColor: '#000000' }} />
                      <span>{occ}</span>
                    </div>
                    <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>(25)</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
              <button
                type="button"
                className="dior-btn"
                onClick={() => setIsFilterDrawerOpen(false)}
                style={{
                  width: '100%',
                  background: '#000000',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const CollectionPageLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', color: '#111827' }}>
      <Navbar />
      <CollectionPageContent />
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

export default function CollectionApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <CollectionPageLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
