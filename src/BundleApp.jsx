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
  Check, 
  Plus, 
  X, 
  ShoppingBag, 
  ChevronRight, 
  Search, 
  Gift, 
  ShieldCheck, 
  Truck, 
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/pdp.css';

const BUNDLE_TIERS = {
  '3-bottle': {
    id: '3-bottle',
    name: '3-Bottle Scent Wardrobe',
    subtitle: 'Base anchor scent + 2 harmonious layering companions',
    bottleCount: 3,
    originalPrice: 135,
    bundlePrice: 115,
    discountPercent: 15,
    savingsAmount: 20,
    slotLabels: [
      { id: 0, title: 'Anchor Fragrance', role: 'Your signature daily base' },
      { id: 1, title: 'Day Companion', role: 'Fresh & uplifting daytime contrast' },
      { id: 2, title: 'Evening Accent', role: 'Deep, sensual night-time aura' },
    ]
  },
  '5-bottle': {
    id: '5-bottle',
    name: '5-Bottle Master Collector',
    subtitle: 'The full olfactory spectrum for every mood, season & affair',
    bottleCount: 5,
    originalPrice: 225,
    bundlePrice: 169,
    discountPercent: 25,
    savingsAmount: 56,
    slotLabels: [
      { id: 0, title: 'Anchor Fragrance', role: 'Primary signature core' },
      { id: 1, title: 'Fresh Citrus / Aquatic', role: 'High-energy morning boost' },
      { id: 2, title: 'Woody / Amber Companion', role: 'Sophisticated boardroom presence' },
      { id: 3, title: 'Sensual Date Night', role: 'Intimate evening warmth' },
      { id: 4, title: 'Avant-Garde Wildcard', role: 'Exotic & head-turning scent trail' },
    ]
  }
};

const ACCORD_FILTERS = ['All', 'Fresh', 'Woody', 'Spicy', 'Amber', 'Citrus', 'Floral', 'Leather', 'Sweet'];

export const BundleBuilderContent = () => {
  const { products, addToCart, setIsCartOpen, showToast } = useStore();

  const [selectedTierKey, setSelectedTierKey] = useState('3-bottle');
  const currentTier = BUNDLE_TIERS[selectedTierKey];

  // Array of selected product objects or null: length = currentTier.bottleCount
  const [selectedSlots, setSelectedSlots] = useState([null, null, null]);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  // Filter & Search states for perfume catalog
  const [genderFilter, setGenderFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [accordFilter, setAccordFilter] = useState('All');

  // Handle tier change: resize slot array preserving existing choices
  const handleTierChange = (newTierKey) => {
    setSelectedTierKey(newTierKey);
    const newCount = BUNDLE_TIERS[newTierKey].bottleCount;
    setSelectedSlots((prev) => {
      const next = new Array(newCount).fill(null);
      for (let i = 0; i < Math.min(prev.length, newCount); i++) {
        next[i] = prev[i];
      }
      return next;
    });
    setActiveSlotIndex(0);
  };

  // Prepopulate slots with flagship scents if empty
  useEffect(() => {
    if (!products || products.length === 0) return;
    setSelectedSlots((prev) => {
      if (prev.some(slot => slot !== null)) return prev;
      const initial = [...prev];
      if (products[0]) initial[0] = products[0];
      if (products[1]) initial[1] = products[1];
      if (products[2]) initial[2] = products[2];
      return initial;
    });
  }, [products]);

  // Catalog filtered items
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      if (!p || typeof p !== 'object' || !p.id) return false;

      // Gender filter
      const pId = String(p.id || '');
      const pGender = p.gender || (p.category === 'Pour Femme' || pId.startsWith('vlz-women') || pId.startsWith('vlz-wom') ? 'Women' : 'Men');
      if (genderFilter !== 'All' && pGender !== genderFilter) return false;

      // Accord filter
      if (accordFilter !== 'All') {
        const traits = Array.isArray(p.traits) ? p.traits.join(' ').toLowerCase() : '';
        const family = String(p.olfactoryFamily || '').toLowerCase();
        const filtLower = accordFilter.toLowerCase();
        if (!traits.includes(filtLower) && !family.includes(filtLower)) {
          return false;
        }
      }

      // Search Query
      if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = String(p.name || '').toLowerCase().includes(q);
        const matchInspiration = String(p.brandInspiration || '').toLowerCase().includes(q);
        const matchNotes = String(p.description || '').toLowerCase().includes(q);
        if (!matchName && !matchInspiration && !matchNotes) return false;
      }

      return true;
    });
  }, [products, genderFilter, accordFilter, searchQuery]);

  // Assign product to active slot
  const selectProductForSlot = (product) => {
    setSelectedSlots((prev) => {
      const next = [...prev];
      next[activeSlotIndex] = product;
      return next;
    });

    // Advance to next empty slot if available
    const nextEmptyIndex = selectedSlots.findIndex((item, idx) => idx !== activeSlotIndex && item === null);
    if (nextEmptyIndex !== -1) {
      setActiveSlotIndex(nextEmptyIndex);
    }

    showToast(`Added "${product.name}" to Slot ${activeSlotIndex + 1}`, 'success');
  };

  // Remove from slot
  const clearSlot = (slotIdx, e) => {
    e.stopPropagation();
    setSelectedSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
    setActiveSlotIndex(slotIdx);
  };

  const filledSlotsCount = selectedSlots.filter(Boolean).length;
  const isComplete = filledSlotsCount === currentTier.bottleCount;

  // Add bundle to cart
  const handleAddBundleToBag = () => {
    if (!isComplete) {
      showToast(`Please select all ${currentTier.bottleCount} fragrances to complete your bundle!`, 'error');
      const emptyIdx = selectedSlots.findIndex(s => s === null);
      if (emptyIdx !== -1) setActiveSlotIndex(emptyIdx);
      // Smooth scroll up to slots tray on mobile
      const slotsEl = document.getElementById('bundle-slots-section');
      if (slotsEl) slotsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const itemsSummary = selectedSlots.map(s => s.name).join(' + ');
    const bundleProduct = {
      id: `bundle-${selectedTierKey}-${Date.now()}`,
      name: `${currentTier.name}`,
      category: 'Signature Bundles',
      price: currentTier.bundlePrice,
      originalPrice: currentTier.originalPrice,
      image: selectedSlots[0]?.images?.[0] || selectedSlots[0]?.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
      images: selectedSlots.map(s => s.images?.[0] || s.image).filter(Boolean),
      description: `Custom curated set: ${itemsSummary}. Includes luxury packaging & discovery samples.`,
      brandInspiration: `${currentTier.bottleCount}-Bottle Bespoke Set`,
      stock: 50,
      sizes: [{ label: `${currentTier.bottleCount}x Bottles`, price: currentTier.bundlePrice }]
    };

    addToCart(bundleProduct, 1, `${currentTier.bottleCount}x Set`, null, currentTier.bundlePrice);
    setIsCartOpen(true);
  };

  return (
    <>
      <main style={{ flex: 1, paddingBottom: '140px', background: '#faf8f5' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem clamp(12px, 3vw, 24px)' }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#786558', marginBottom: '1rem' }}>
            <a href="/" style={{ color: '#786558', textDecoration: 'none' }}>Home</a>
            <ChevronRight size={12} />
            <span style={{ color: '#2b1810', fontWeight: 700 }}>Curated Bundles</span>
          </div>

          {/* Artisanal Luxury Hero Banner */}
          <div 
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #231710 0%, #2b1810 50%, #1e130c 100%)',
              color: '#ffffff',
              padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 24px rgba(35, 23, 16, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', width: 'fit-content', marginBottom: '0.75rem' }}>
              <Sparkles size={13} />
              <span>PERFUME WARDROBE BUNDLE</span>
            </div>
            <h1 
              style={{ 
                fontFamily: 'var(--font-brand, serif)', 
                fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', 
                fontWeight: 800, 
                margin: '0 0 0.5rem',
                color: '#ffffff',
                lineHeight: 1.2
              }}
            >
              Curate Your Scent Wardrobe
            </h1>
            <p style={{ color: '#ede8e1', fontSize: 'clamp(0.82rem, 1.8vw, 0.95rem)', margin: 0, maxWidth: '560px', lineHeight: 1.45 }}>
              Layer complimentary notes to create your signature scent. Save up to 25% with a complimentary luxury gift box.
            </p>
          </div>

          {/* Tier Switcher (Artisanal Pill Design) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div 
              style={{ 
                display: 'inline-flex', 
                background: '#ede8e1', 
                padding: '4px', 
                borderRadius: '9999px', 
                gap: '4px',
                width: '100%',
                maxWidth: '460px'
              }}
            >
              <button
                type="button"
                onClick={() => handleTierChange('3-bottle')}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: selectedTierKey === '3-bottle' ? '#2b1810' : 'transparent',
                  color: selectedTierKey === '3-bottle' ? '#ffffff' : '#54433a',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedTierKey === '3-bottle' ? '0 4px 12px rgba(43, 24, 16, 0.2)' : 'none'
                }}
              >
                <span>3-Bottle Wardrobe</span>
                <span style={{ fontSize: '0.68rem', color: selectedTierKey === '3-bottle' ? '#fbbf24' : '#d97706', fontWeight: 800 }}>
                  Save 15% • RM115
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTierChange('5-bottle')}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: selectedTierKey === '5-bottle' ? '#2b1810' : 'transparent',
                  color: selectedTierKey === '5-bottle' ? '#ffffff' : '#54433a',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedTierKey === '5-bottle' ? '0 4px 12px rgba(43, 24, 16, 0.2)' : 'none'
                }}
              >
                <span>5-Bottle Collector</span>
                <span style={{ fontSize: '0.68rem', color: selectedTierKey === '5-bottle' ? '#fbbf24' : '#d97706', fontWeight: 800 }}>
                  Save 25% • RM169
                </span>
              </button>
            </div>
          </div>

          {/* Builder Responsive Layout: Left Catalog / Right Sticky Summary on Desktop */}
          <div className="bundle-builder-grid">
            
            {/* Left Column: Interactive Slot Pedestals & Perfume Catalog */}
            <div style={{ minWidth: 0, width: '100%' }}>
              
              {/* STEP 1: SLOTS TRAY */}
              <div 
                id="bundle-slots-section"
                className="bundle-card-panel"
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '16px', 
                  padding: 'clamp(1rem, 2.5vw, 1.5rem)', 
                  border: '1px solid #ede8e1', 
                  boxShadow: '0 4px 16px rgba(44, 26, 17, 0.04)', 
                  marginBottom: '1.5rem' 
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.05rem', fontWeight: 800, color: '#2b1810', margin: 0 }}>
                      Step 1: Fill Your {currentTier.bottleCount} Slots ({filledSlotsCount}/{currentTier.bottleCount} selected)
                    </h2>
                    <p style={{ fontSize: '0.78rem', color: '#786558', margin: '3px 0 0' }}>
                      Tap any slot below, then choose your fragrance from the collection.
                    </p>
                  </div>
                  <div 
                    style={{ 
                      fontSize: '0.74rem', 
                      fontWeight: 800, 
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: isComplete ? '#ecfdf5' : '#fef3c7',
                      color: isComplete ? '#065f46' : '#b45309'
                    }}
                  >
                    {isComplete ? '✓ Bundle Ready' : `${currentTier.bottleCount - filledSlotsCount} More Required`}
                  </div>
                </div>

                {/* Slots Pedestals Container (Responsive: Grid on Desktop, 3-col compact or swipable on Mobile) */}
                <div className={`bundle-slots-track ${currentTier.bottleCount <= 3 ? 'track-compact' : 'track-scroll'}`}>
                  {selectedSlots.map((item, idx) => {
                    const isActive = activeSlotIndex === idx;
                    const slotInfo = currentTier.slotLabels[idx] || { title: `Fragrance ${idx + 1}`, role: 'Complementary note' };

                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveSlotIndex(idx)}
                        className={`bundle-slot-item ${isActive ? 'active-slot' : ''}`}
                        style={{
                          borderRadius: '12px',
                          border: isActive 
                            ? '2px solid #d97706' 
                            : item 
                              ? '1.5px solid #ede8e1' 
                              : '1.5px dashed #d5cbbf',
                          background: isActive 
                            ? '#fffcf7' 
                            : item 
                              ? '#ffffff' 
                              : '#faf8f5',
                          padding: '0.75rem 0.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                          boxShadow: isActive ? '0 0 0 3px rgba(217, 119, 6, 0.18)' : 'none',
                          minWidth: 0,
                          overflow: 'hidden'
                        }}
                      >
                        {/* Slot Badge */}
                        <div style={{ 
                          fontSize: '0.64rem', 
                          fontWeight: 800, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.04em',
                          color: isActive ? '#d97706' : '#786558',
                          marginBottom: '0.35rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>Slot {idx + 1}</span>
                          {isActive && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d97706' }} />}
                        </div>

                        {/* Bottle Visual */}
                        <div className="bundle-slot-visual" style={{ width: '64px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '0.25rem 0' }}>
                          {item ? (
                            <>
                              <img
                                src={item.images?.[0] || item.image}
                                alt={item.name}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              />
                              <button
                                type="button"
                                onClick={(e) => clearSlot(idx, e)}
                                title="Remove fragrance"
                                style={{
                                  position: 'absolute',
                                  top: '-6px',
                                  right: '-6px',
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '50%',
                                  background: '#2b1810',
                                  color: '#ffffff',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                }}
                              >
                                <X size={11} />
                              </button>
                            </>
                          ) : (
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ebe5dc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#786558' }}>
                              <Plus size={16} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        {item ? (
                          <div style={{ marginTop: '0.25rem', width: '100%', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2b1810', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.62rem', color: '#786558', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.brandInspiration ? `Inspired by ${item.brandInspiration}` : 'Extrait'}
                            </div>
                          </div>
                        ) : (
                          <div style={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4a382e', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {slotInfo.title}
                            </div>
                            <div style={{ fontSize: '0.62rem', color: '#8c7d72', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {slotInfo.role}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {currentTier.bottleCount > 3 && (
                  <div className="bundle-slots-hint" style={{ fontSize: '0.68rem', color: '#8c7d72', textAlign: 'right', marginTop: '6px' }}>
                    Swipe horizontally to view all {currentTier.bottleCount} slots →
                  </div>
                )}
              </div>

              {/* STEP 2: PERFUME SELECTOR CATALOG */}
              <div 
                className="bundle-card-panel"
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '16px', 
                  padding: 'clamp(1rem, 2.5vw, 1.5rem)', 
                  border: '1px solid #ede8e1', 
                  boxShadow: '0 4px 16px rgba(44, 26, 17, 0.04)' 
                }}
              >
                {/* Step 2 Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.05rem', fontWeight: 800, color: '#2b1810', margin: 0 }}>
                      Step 2: Choose Fragrance for Slot {activeSlotIndex + 1}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#786558', margin: '3px 0 0' }}>
                      Filling: <strong style={{ color: '#d97706' }}>{currentTier.slotLabels[activeSlotIndex]?.title || `Slot ${activeSlotIndex + 1}`}</strong>
                    </p>
                  </div>

                  {/* Gender Filter Pills */}
                  <div style={{ display: 'flex', background: '#ede8e1', padding: '3px', borderRadius: '9999px', gap: '2px' }}>
                    {['All', 'Men', 'Women'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenderFilter(g)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          border: 'none',
                          background: genderFilter === g ? '#2b1810' : 'transparent',
                          color: genderFilter === g ? '#ffffff' : '#54433a',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {g === 'All' ? 'All' : g === 'Men' ? "Men's" : "Women's"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
                  <Search size={15} color="#786558" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search perfumes by name, inspiration, or accord..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '9999px',
                      border: '1px solid #dfd7cc',
                      background: '#faf8f5',
                      fontSize: '1rem',
                      color: '#2b1810',
                      outline: 'none'
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#786558',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Accord Filter Pills */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '1.25rem', scrollbarWidth: 'none' }}>
                  {ACCORD_FILTERS.map((acc) => {
                    const isActive = accordFilter === acc;
                    return (
                      <button
                        key={acc}
                        type="button"
                        onClick={() => setAccordFilter(acc)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          border: '1px solid',
                          borderColor: isActive ? '#2b1810' : '#e4dcd2',
                          background: isActive ? '#2b1810' : '#ffffff',
                          color: isActive ? '#ffffff' : '#54433a',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {acc}
                      </button>
                    );
                  })}
                </div>

                {/* Perfumes Responsive Grid (2 columns on mobile, 3 columns on desktop) */}
                <div className="bundle-catalog-grid">
                  {filteredProducts.slice(0, 30).map((prod) => {
                    const isSelectedInActive = selectedSlots[activeSlotIndex]?.id === prod.id;
                    const slotAssigned = selectedSlots.findIndex(s => s?.id === prod.id);

                    return (
                      <div
                        key={prod.id}
                        className="bundle-card-item"
                        style={{
                          border: isSelectedInActive 
                            ? '1.5px solid #d97706' 
                            : slotAssigned !== -1 
                              ? '1.5px solid #2b1810' 
                              : '1px solid #ede8e1',
                          borderRadius: '12px',
                          background: '#ffffff',
                          padding: 'clamp(8px, 1.5vw, 12px)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative',
                          boxShadow: '0 2px 8px rgba(44, 26, 17, 0.04)'
                        }}
                      >
                        {/* Slot Assigned Badge */}
                        {slotAssigned !== -1 && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            background: '#2b1810',
                            color: '#ffffff',
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            zIndex: 2
                          }}>
                            In Slot {slotAssigned + 1}
                          </div>
                        )}

                        {/* Image Container */}
                        <div 
                          style={{ 
                            background: '#f7f5f0',
                            borderRadius: '8px',
                            aspectRatio: '1 / 1.05',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            marginBottom: '8px',
                            padding: '6px'
                          }}
                        >
                          <img
                            src={prod.images?.[0] || prod.image}
                            alt={prod.name}
                            loading="lazy"
                            style={{ maxWidth: '82%', maxHeight: '82%', objectFit: 'contain' }}
                          />
                        </div>

                        {/* Title & Notes */}
                        <div style={{ marginBottom: '8px' }}>
                          <div 
                            style={{ 
                              fontSize: 'clamp(0.78rem, 1.6vw, 0.88rem)', 
                              fontWeight: 800, 
                              color: '#2b1810', 
                              lineHeight: 1.25,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={prod.name}
                          >
                            {prod.name}
                          </div>
                          <div 
                            style={{ 
                              fontSize: '0.68rem', 
                              color: '#786558', 
                              margin: '2px 0 4px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {prod.brandInspiration ? `Inspired by ${prod.brandInspiration}` : 'Extrait de Parfum'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill="#d97706" color="#d97706" />
                            ))}
                          </div>
                        </div>

                        {/* Select Button */}
                        <button
                          type="button"
                          onClick={() => selectProductForSlot(prod)}
                          style={{
                            width: '100%',
                            minWidth: 0,
                            padding: '7px 4px',
                            borderRadius: '9999px',
                            border: 'none',
                            background: isSelectedInActive 
                              ? '#d97706' 
                              : slotAssigned !== -1 
                                ? '#ebe5dc' 
                                : '#2b1810',
                            color: isSelectedInActive 
                              ? '#ffffff' 
                              : slotAssigned !== -1 
                                ? '#2b1810' 
                                : '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                            boxSizing: 'border-box'
                          }}
                        >
                          {isSelectedInActive ? (
                            <>
                              <Check size={12} />
                              <span>Slot {activeSlotIndex + 1} Filled</span>
                            </>
                          ) : slotAssigned !== -1 ? (
                            <span>Move to S{activeSlotIndex + 1}</span>
                          ) : (
                            <>
                              <Plus size={12} />
                              <span>Add to S{activeSlotIndex + 1}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Bundle Summary Card (Desktop Only) */}
            <div className="bundle-desktop-summary" style={{ position: 'sticky', top: '90px' }}>
              <div 
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  border: '1px solid #ede8e1', 
                  boxShadow: '0 8px 24px rgba(44, 26, 17, 0.06)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f2ece4', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.05rem', fontWeight: 800, color: '#2b1810', margin: 0 }}>
                    Bundle Summary
                  </h3>
                  <span style={{ background: '#d97706', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '9999px', letterSpacing: '0.04em' }}>
                    SAVE {currentTier.discountPercent}%
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2b1810', marginBottom: '0.25rem' }}>
                  {currentTier.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#786558', marginBottom: '1rem', lineHeight: 1.4 }}>
                  {currentTier.subtitle}
                </div>

                {/* Selected Fragrances List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid #f2ece4', paddingBottom: '1rem' }}>
                  {selectedSlots.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: item ? '#2b1810' : '#ede8e1', color: item ? '#ffffff' : '#786558', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, flexShrink: 0 }}>
                        {idx + 1}
                      </span>
                      {item ? (
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: '#2b1810', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#786558' }}>
                            {item.brandInspiration ? `Inspired by ${item.brandInspiration}` : 'Extrait de Parfum'}
                          </div>
                        </div>
                      ) : (
                        <div style={{ flex: 1, color: '#a8978b', fontStyle: 'italic', fontSize: '0.74rem' }}>
                          Empty — tap slot to choose
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Perks Included */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#54433a', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={14} color="#d97706" />
                    <span>Free Express Shipping Across Malaysia</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gift size={14} color="#d97706" />
                    <span>Complimentary Discovery Box & Ribbon</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} color="#d97706" />
                    <span>Authentic French Oil Concentration (35%)</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{ borderTop: '1px solid #f2ece4', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#786558', marginBottom: '4px' }}>
                    <span>Standard Value</span>
                    <span style={{ textDecoration: 'line-through' }}>RM{currentTier.originalPrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#d97706', fontWeight: 800, marginBottom: '6px' }}>
                    <span>Bundle Savings ({currentTier.discountPercent}%)</span>
                    <span>-RM{currentTier.savingsAmount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '6px', borderTop: '1px solid #f2ece4' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2b1810' }}>Total</span>
                    <div>
                      <span style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.35rem', fontWeight: 800, color: '#2b1810' }}>
                        RM{currentTier.bundlePrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddBundleToBag}
                  className="btn-pill btn-pill-espresso"
                  style={{
                    width: '100%',
                    padding: '13px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: isComplete ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: isComplete ? '0 4px 16px rgba(43, 24, 16, 0.25)' : 'none',
                    opacity: isComplete ? 1 : 0.6
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>
                    {isComplete ? `Add Bundle to Bag (RM${currentTier.bundlePrice})` : `Select ${currentTier.bottleCount - filledSlotsCount} More`}
                  </span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* STICKY MOBILE BOTTOM BUNDLE ACTION BAR */}
      <div className="bundle-mobile-floating-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          {/* Progress Circles */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {selectedSlots.map((item, i) => (
              <span 
                key={i} 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: item ? '#d97706' : '#dfd7cc',
                  transition: 'background 0.2s'
                }} 
              />
            ))}
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#786558', lineHeight: 1.1 }}>
              {isComplete ? 'Complete!' : `${filledSlotsCount}/${currentTier.bottleCount} Selected`}
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#2b1810', fontFamily: 'var(--font-brand, serif)' }}>
              RM{currentTier.bundlePrice}
              <span style={{ fontSize: '0.68rem', color: '#d97706', fontWeight: 700, marginLeft: '4px' }}>
                (-{currentTier.discountPercent}%)
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddBundleToBag}
          className="btn-pill btn-pill-espresso"
          style={{
            padding: '10px 18px',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(43, 24, 16, 0.25)'
          }}
        >
          {isComplete ? (
            <>
              <ShoppingBag size={14} />
              <span>Add to Bag</span>
            </>
          ) : (
            <>
              <span>Fill Slot {activeSlotIndex + 1}</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* Component Styles for Responsive Layout */}
      <style>{`
        .bundle-builder-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
          align-items: start;
        }

        .bundle-slots-track {
          display: grid;
          grid-template-columns: repeat(${currentTier.bottleCount}, 1fr);
          gap: 0.85rem;
        }

        .bundle-slots-hint {
          display: none;
        }

        .bundle-catalog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .bundle-desktop-summary {
          display: block;
        }

        .bundle-mobile-floating-bar {
          display: none;
        }

        @media (max-width: 960px) {
          .bundle-builder-grid {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .bundle-desktop-summary {
            display: block;
            width: 100%;
            position: static !important;
          }

          .bundle-card-panel {
            padding: 0.85rem 0.65rem !important;
          }

          .bundle-slots-hint {
            display: block;
          }

          /* For 3 bottles: fit all 3 side-by-side neatly on mobile */
          .bundle-slots-track.track-compact {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 6px !important;
            width: 100% !important;
          }

          .bundle-slots-track.track-compact .bundle-slot-item {
            flex: none !important;
            width: 100% !important;
            min-width: 0 !important;
            padding: 0.5rem 0.25rem !important;
            box-sizing: border-box !important;
          }

          .bundle-slots-track.track-compact .bundle-slot-visual {
            width: 52px !important;
            height: 64px !important;
          }

          /* For 5 bottles: smooth swipe carousel with peek */
          .bundle-slots-track.track-scroll {
            display: flex !important;
            gap: 8px !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 6px;
            scrollbar-width: none;
          }

          .bundle-slots-track.track-scroll::-webkit-scrollbar {
            display: none;
          }

          .bundle-slots-track.track-scroll .bundle-slot-item {
            flex: 0 0 112px !important;
            scroll-snap-align: start;
            padding: 0.6rem 0.35rem !important;
          }

          .bundle-slots-track.track-scroll .bundle-slot-visual {
            width: 58px !important;
            height: 70px !important;
          }

          .bundle-catalog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
            width: 100% !important;
          }

          .bundle-mobile-floating-bar {
            display: flex !important;
            position: fixed;
            bottom: 50px;
            left: 0;
            right: 0;
            background: rgba(250, 248, 245, 0.98);
            backdrop-filter: blur(16px);
            border-top: 1px solid #ede8e1;
            padding: 8px 16px;
            z-index: 996;
            box-shadow: 0 -4px 16px rgba(44, 26, 17, 0.08);
            align-items: center;
            justifyContent: space-between;
          }
        }
      `}</style>
    </>
  );
};

export const BundleBuilderLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf8f5', color: '#2b1810' }}>
      <Navbar />
      <BundleBuilderContent />
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

export default function BundleApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <BundleBuilderLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
