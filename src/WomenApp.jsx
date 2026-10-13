import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrandValuesFooter } from './components/common/BrandValuesFooter';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { AuthModal } from './components/common/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProductCard } from './components/customer/ProductCard';
import { Pagination } from './components/common/Pagination';
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

const PRIMARY_ACCORDS = ['Floral', 'Fresh', 'Sweet', 'Woody'];
const MORE_ACCORDS = ['Amber', 'Citrus', 'Gourmand', 'Musky', 'Rose', 'Spicy'];

export const WomenCollectionContent = () => {
  const { products, favorites, toggleFavorite } = useStore();

  const [selectedChip, setSelectedChip] = useState('All');
  const [isMoreAccordsOpen, setIsMoreAccordsOpen] = useState(false);
  const moreDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreAccordsOpen(false);
      }
    };
    if (isMoreAccordsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMoreAccordsOpen]);

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
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');

  // Available Brands in Women's Collection
  const availableBrands = useMemo(() => {
    if (!products) return [];
    const brandMap = new Map();
    products.forEach((p) => {
      if (!p || typeof p !== 'object' || !p.id) return;
      const pId = String(p.id || '');
      const pSku = String(p.sku || '');
      const isWomen = pId.startsWith('vlz-women') || pId.startsWith('vlz-wom') || pSku.startsWith('VLZ-W') || p.category === 'Women' || p.category === 'Pour Femme' || p.gender === 'Women';
      if (!isWomen) return;

      const b = (p.brand || p.brandInspiration || '').trim();
      if (b && b !== 'Unknown' && b !== 'Unknown / catalog reference') {
        brandMap.set(b, (brandMap.get(b) || 0) + 1);
      }
    });
    return Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  // STRICT WOMEN'S FILTERING
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((p) => {
      if (!p || typeof p !== 'object' || !p.id) return false;

      // Exclusively Women's Fragrances (support both vlz-women and vlz-wom prefixes)
      const pId = String(p.id || '');
      const pSku = String(p.sku || '');
      const isWomen = pId.startsWith('vlz-women') || pId.startsWith('vlz-wom') || pSku.startsWith('VLZ-W') || p.category === 'Women' || p.category === 'Pour Femme' || p.gender === 'Women';
      if (!isWomen) return false;

      // Brand filter
      if (selectedBrands.length > 0) {
        const pBrand = (p.brand || p.brandInspiration || '').trim();
        if (!selectedBrands.includes(pBrand)) return false;
      }

      // Real-time Search Query Filter
      if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const cleanDigits = q.replace(/[#\s]/g, '');
        const name = String(p.name || '').toLowerCase();
        const brand = String(p.brand || p.brandInspiration || '').toLowerCase();
        const inspiration = String(p.brandInspiration || '').toLowerCase();
        const family = String(p.olfactoryFamily || p.dominantAccord || '').toLowerCase();
        const character = String(p.character || '').toLowerCase();
        const sku = String(p.sku || '').toLowerCase();
        const catalogNo = String(p.catalogNo || '');
        const traits = Array.isArray(p.traits) ? p.traits.join(' ').toLowerCase() : '';
        const topNotes = Array.isArray(p.pyramid?.topNotes) ? p.pyramid.topNotes.join(' ').toLowerCase() : '';
        const heartNotes = Array.isArray(p.pyramid?.heartNotes) ? p.pyramid.heartNotes.join(' ').toLowerCase() : '';
        const baseNotes = Array.isArray(p.pyramid?.baseNotes) ? p.pyramid.baseNotes.join(' ').toLowerCase() : '';

        const matchesSearch =
          name.includes(q) ||
          brand.includes(q) ||
          inspiration.includes(q) ||
          family.includes(q) ||
          character.includes(q) ||
          sku.includes(q) ||
          (cleanDigits && catalogNo === cleanDigits) ||
          traits.includes(q) ||
          topNotes.includes(q) ||
          heartNotes.includes(q) ||
          baseNotes.includes(q);

        if (!matchesSearch) return false;
      }

      // Quick chip accord filter
      if (selectedChip !== 'All') {
        const traits = Array.isArray(p.traits) ? p.traits.join(' ').toLowerCase() : '';
        const family = String(p.olfactoryFamily || p.dominantAccord || '').toLowerCase();
        const chipLower = selectedChip.toLowerCase();
        if (!traits.includes(chipLower) && !family.includes(chipLower)) {
          return false;
        }
      }

      // Drawer Accord Filters
      if (selectedAccords.length > 0) {
        const traits = Array.isArray(p.traits) ? p.traits.join(' ').toLowerCase() : '';
        const family = String(p.olfactoryFamily || p.dominantAccord || '').toLowerCase();
        const matchesAny = selectedAccords.some((acc) => {
          const accLower = acc.toLowerCase();
          return traits.includes(accLower) || family.includes(accLower);
        });
        if (!matchesAny) return false;
      }

      // Price filter
      const pPrice = Number(p.price_30ml || p.price) || 45;
      if (pPrice > priceMax) return false;

      return true;
    }).sort((a, b) => {
      if (!a || !b) return 0;
      const priceA = Number(a.price_30ml || a.price) || 45;
      const priceB = Number(b.price_30ml || b.price) || 45;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      // Default: best sellers (Tier S first)
      const tierRank = { 'S': 3, 'A': 2, 'B': 1, 'C': 0 };
      const rankDiff = (tierRank[b.tier] || 0) - (tierRank[a.tier] || 0);
      if (rankDiff !== 0) return rankDiff;
      return (Number(a.catalogNo) || 0) - (Number(b.catalogNo) || 0);
    });
  }, [products, selectedBrands, searchQuery, selectedChip, selectedAccords, priceMax, sortBy]);

  const toggleBrand = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  const toggleAccord = (accord) => {
    setSelectedAccords((prev) => 
      prev.includes(accord) ? prev.filter((a) => a !== accord) : [...prev, accord]
    );
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedAccords([]);
    setSelectedOccasions([]);
    setSelectedIntensities([]);
    setPriceMax(250);
    setSelectedChip('All');
    setSearchQuery('');
    setBrandSearch('');
  };

  const activeFiltersCount = selectedBrands.length + selectedAccords.length + selectedOccasions.length + selectedIntensities.length + (priceMax < 250 ? 1 : 0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // Reset to first page when filtering or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrands, searchQuery, selectedChip, selectedAccords, selectedOccasions, selectedIntensities, priceMax, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <main style={{ flex: 1, paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem clamp(12px, 3.5vw, 24px)' }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.25rem' }}>
            <a href="index.html" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</a>
            <ChevronRight size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Women</span>
          </div>

          {/* Women's Collection Hero Banner (No Black Tint) */}
          <div 
            className="editorial-hero-banner"
            style={{
              backgroundImage: 'url(/images/hero-women.jpg)',
              backgroundPosition: 'center 20%'
            }}
          >
            {/* Left Editorial Text */}
            <div className="editorial-hero-content">
              <h1 className="editorial-hero-title">
                Women&apos;s
                <br />
                Collection
              </h1>
              <p className="editorial-hero-subtitle">
                Elegant. Feminine. Unique.
              </p>
            </div>
          </div>

          {/* Quick Accord Pill Filter Chips */}
          <div style={{ position: 'relative', zIndex: 40, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
              <div ref={moreDropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsMoreAccordsOpen(prev => !prev)}
                  aria-haspopup="true"
                  aria-expanded={isMoreAccordsOpen}
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
                      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #e5e7eb',
                      padding: '6px',
                      zIndex: 50,
                      minWidth: '160px',
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
                          borderRadius: '6px',
                          background: selectedChip === acc ? '#f3f4f6' : 'transparent',
                          color: selectedChip === acc ? '#000000' : '#374151',
                          fontWeight: selectedChip === acc ? 700 : 500,
                          fontSize: '0.82rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedChip !== acc) e.currentTarget.style.background = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          if (selectedChip !== acc) e.currentTarget.style.background = 'transparent';
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

          {/* Expandable Luxury Search Input Bar (Placed ABOVE Sort by) */}
          {isSearchOpen && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: '#f9fafb',
              border: '1px solid #111827',
              borderRadius: '6px',
              marginBottom: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <Search size={16} color="#6b7280" />
              <input
                type="text"
                autoFocus
                placeholder="Search women's perfumes by name, brand inspiration, notes (e.g. Delina, Rose, Vanilla)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.92rem',
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

          {/* Controls Bar: Sort & Filter Toggle */}
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

          {/* Active Filter Badges Bar */}
          {(selectedBrands.length > 0 || selectedAccords.length > 0 || priceMax < 250 || (selectedChip !== 'All')) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem', padding: '10px 14px', background: '#f8f6f2', borderRadius: '8px', border: '1px solid #ede8e0' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#786558', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Filters:
              </span>
              {selectedBrands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBrand(b)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#ffffff', border: '1px solid #dcd5ca', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 600, color: '#1a1410', cursor: 'pointer' }}
                >
                  <span>Brand: {b}</span>
                  <X size={12} />
                </button>
              ))}
              {selectedAccords.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAccord(a)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#ffffff', border: '1px solid #dcd5ca', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 600, color: '#1a1410', cursor: 'pointer' }}
                >
                  <span>Accord: {a}</span>
                  <X size={12} />
                </button>
              ))}
              {priceMax < 250 && (
                <button
                  type="button"
                  onClick={() => setPriceMax(250)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#ffffff', border: '1px solid #dcd5ca', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 600, color: '#1a1410', cursor: 'pointer' }}
                >
                  <span>Max RM{priceMax}</span>
                  <X size={12} />
                </button>
              )}
              {selectedChip !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedChip('All')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#ffffff', border: '1px solid #dcd5ca', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 600, color: '#1a1410', cursor: 'pointer' }}
                >
                  <span>Family: {selectedChip}</span>
                  <X size={12} />
                </button>
              )}
              <button
                type="button"
                onClick={handleClearFilters}
                style={{ background: 'none', border: 'none', color: '#8c5e3c', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', marginLeft: 'auto' }}
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid (2 columns mobile, 4 columns desktop) */}
          <div 
            id="women-catalog-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(145px, 22vw, 260px), 1fr))',
              gap: 'clamp(0.85rem, 2.5vw, 1.75rem)'
            }}
          >
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Luxury Pagination Controls */}
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
              itemLabel="women's creations"
              scrollTargetId="women-catalog-grid"
            />
          )}

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4.5rem 1rem', maxWidth: '540px', margin: '0 auto' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f5f3ef', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#8a776a' }}>
                <Search size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px', color: '#1a1410' }}>
                No Fragrance Creations Found
              </h3>
              <p style={{ color: '#786558', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
                We couldn't find perfumes matching your criteria. Try adjusting your search query, or explore our most sought-after icons:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                {['Baccarat Rouge 540', 'Lost Cherry', 'Bombshell', 'Good Girl'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      setSelectedChip('All');
                      setSelectedBrands([]);
                      setSelectedAccords([]);
                      setPriceMax(250);
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: '1px solid #dcd5ca',
                      background: '#ffffff',
                      color: '#2b1810',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    "{term}"
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{ background: '#111111', color: '#ffffff', padding: '10px 22px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Reset All Filters
                </button>
                <a
                  href="diagnostic.html"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0ebe4', color: '#8c5e3c', padding: '10px 20px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  <Sparkles size={14} color="#d97706" />
                  <span>Take Scent Quiz</span>
                </a>
              </div>
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

            {/* Brand Filter */}
            <div style={{ padding: '1.25rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>
                  Brand ({availableBrands.length})
                </h3>
                {selectedBrands.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedBrands([])}
                    style={{ background: 'none', border: 'none', fontSize: '0.74rem', color: '#8c5e3c', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Reset ({selectedBrands.length})
                  </button>
                )}
              </div>

              {availableBrands.length > 6 && (
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search brands (e.g. Chanel, Dior)..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '0.8rem',
                      borderRadius: '4px',
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {brandSearch && (
                    <button
                      type="button"
                      onClick={() => setBrandSearch('')}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px' }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}

              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
                {availableBrands
                  .filter(b => !brandSearch.trim() || b.name.toLowerCase().includes(brandSearch.trim().toLowerCase()))
                  .map(({ name, count }) => {
                    const isChecked = selectedBrands.includes(name);
                    return (
                      <label
                        key={name}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: isChecked ? '#111827' : '#4b5563', cursor: 'pointer', padding: '3px 0', fontWeight: isChecked ? 600 : 400 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBrand(name)}
                            style={{ accentColor: '#000000', cursor: 'pointer' }}
                          />
                          <span>{name}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                          {count}
                        </span>
                      </label>
                    );
                  })}
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

export const WomenCollectionLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fcfbf9', color: '#111827' }}>
      <Navbar />
      <WomenCollectionContent />
      <BrandValuesFooter />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function WomenApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <WomenCollectionLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
