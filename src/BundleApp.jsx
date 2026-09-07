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
  Star
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
      { id: 4, title: 'Avant-Garde Wildcard', role: 'Exotic & head-turning sillage' },
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
    // Pick first unfilled slot or 0
    setActiveSlotIndex(0);
  };

  // Prepopulate slots with flagship scents if empty
  useEffect(() => {
    if (!products || products.length === 0) return;
    setSelectedSlots((prev) => {
      if (prev.some(slot => slot !== null)) return prev;
      const initial = [...prev];
      // Pick 3 popular defaults
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
        const matchName = String(p.name || p.displayName || '').toLowerCase().includes(q);
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
      // Jump to first empty slot
      const emptyIdx = selectedSlots.findIndex(s => s === null);
      if (emptyIdx !== -1) setActiveSlotIndex(emptyIdx);
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
    showToast(`Curated ${currentTier.name} added to your bag!`, 'success');
  };

  return (
    <>
      <main style={{ flex: 1, paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem clamp(12px, 3.5vw, 24px)' }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.25rem' }}>
            <a href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</a>
            <ChevronRight size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Bundles</span>
          </div>

          {/* Bundle Hero Banner */}
          <div className="editorial-hero-banner">
            {/* Deep dark protective scrim preventing any camouflage with photo */}
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

            {/* Left Editorial Text */}
            <div className="editorial-hero-text">
              <h1 className="editorial-hero-title">
                Signature
                <br />
                Bundles
              </h1>
              <p className="editorial-hero-subtitle">
                Curate your bespoke scent wardrobe • Save up to 25% with luxury gift presentation
              </p>
            </div>

            {/* Right Visual: Coffret bottles with smooth left fade */}
            <div 
              className="editorial-hero-media"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&auto=format&fit=crop&q=80)',
                backgroundPosition: 'center 30%'
              }}
            />
          </div>

          {/* Tier Selector Navigation Bar */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', background: '#ffffff', padding: '6px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleTierChange('3-bottle')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedTierKey === '3-bottle' ? '#000000' : 'transparent',
                  color: selectedTierKey === '3-bottle' ? '#ffffff' : '#374151',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  transition: 'all 0.2s'
                }}
              >
                <span>3-Bottle Wardrobe</span>
                <span style={{ fontSize: '0.72rem', color: selectedTierKey === '3-bottle' ? '#c5a059' : '#059669', fontWeight: 700 }}>
                  Save 15% • RM115
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTierChange('5-bottle')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedTierKey === '5-bottle' ? '#000000' : 'transparent',
                  color: selectedTierKey === '5-bottle' ? '#ffffff' : '#374151',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  transition: 'all 0.2s'
                }}
              >
                <span>5-Bottle Collector</span>
                <span style={{ fontSize: '0.72rem', color: selectedTierKey === '5-bottle' ? '#c5a059' : '#059669', fontWeight: 700 }}>
                  Save 25% • RM169
                </span>
              </button>
            </div>
          </div>

          {/* Builder Layout: Slots Tray + Catalog Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left Column: Interactive Slot Pedestals & Perfume Catalog */}
            <div>
              {/* SLOTS TRAY */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                      Step 1: Fill Your {currentTier.bottleCount} Slots ({filledSlotsCount}/{currentTier.bottleCount} selected)
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '4px 0 0' }}>
                      Click any slot below to select which position to fill from the catalog.
                    </p>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isComplete ? '#059669' : '#c5a059' }}>
                    {isComplete ? '✓ Bundle Complete' : `${currentTier.bottleCount - filledSlotsCount} More Required`}
                  </div>
                </div>

                {/* Slots Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentTier.bottleCount}, 1fr)`, gap: '1rem' }}>
                  {selectedSlots.map((item, idx) => {
                    const isActive = activeSlotIndex === idx;
                    const slotInfo = currentTier.slotLabels[idx] || { title: `Fragrance ${idx + 1}`, role: 'Complementary note' };

                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveSlotIndex(idx)}
                        style={{
                          borderRadius: '10px',
                          border: `2px ${isActive ? 'solid #000000' : item ? 'solid #e5e7eb' : 'dashed #d1d5db'}`,
                          background: isActive ? '#fbfbfa' : item ? '#ffffff' : '#f9fafb',
                          padding: '1rem 0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s',
                          boxShadow: isActive ? '0 0 0 3px rgba(0,0,0,0.08)' : 'none'
                        }}
                      >
                        {/* Slot Badge */}
                        <div style={{ 
                          fontSize: '0.68rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          color: isActive ? '#000000' : '#6b7280',
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>Slot {idx + 1}</span>
                          {isActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c5a059' }} />}
                        </div>

                        {/* Flacon Visual */}
                        <div style={{ width: '80px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '0.5rem 0' }}>
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
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '50%',
                                  background: '#111827',
                                  color: '#ffffff',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <X size={12} />
                              </button>
                            </>
                          ) : (
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                              <Plus size={20} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        {item ? (
                          <div style={{ marginTop: '0.25rem' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                              {item.displayName || item.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                              {item.brandInspiration ? `Inspired by ${item.brandInspiration}` : 'Extrait de Parfum'}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
                              {slotInfo.title}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '2px' }}>
                              {slotInfo.role}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: PERFUME SELECTOR CATALOG */}
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                      Step 2: Choose Fragrance for Slot {activeSlotIndex + 1}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '4px 0 0' }}>
                      Currently filling: <strong>{currentTier.slotLabels[activeSlotIndex]?.title}</strong>
                    </p>
                  </div>

                  {/* Gender Selector */}
                  <div style={{ display: 'flex', background: '#f3f4f6', padding: '4px', borderRadius: '8px', gap: '4px' }}>
                    {['All', 'Men', 'Women'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenderFilter(g)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          background: genderFilter === g ? '#ffffff' : 'transparent',
                          color: genderFilter === g ? '#111827' : '#6b7280',
                          fontWeight: genderFilter === g ? 700 : 500,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          boxShadow: genderFilter === g ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                        }}
                      >
                        {g === 'All' ? 'All Collections' : g === 'Men' ? "Men's" : "Women's"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar & Filter Chips */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search by name, accord, or inspiration (e.g. Sauvage, Baccarat, Vanilla)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Accord Chips */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
                  {ACCORD_FILTERS.map((acc) => {
                    const isActive = accordFilter === acc;
                    return (
                      <button
                        key={acc}
                        type="button"
                        onClick={() => setAccordFilter(acc)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '999px',
                          border: `1.5px solid ${isActive ? '#000' : '#e5e7eb'}`,
                          background: isActive ? '#000' : '#fff',
                          color: isActive ? '#fff' : '#4b5563',
                          fontSize: '0.78rem',
                          fontWeight: isActive ? 700 : 500,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {acc}
                      </button>
                    );
                  })}
                </div>

                {/* Perfumes Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  {filteredProducts.slice(0, 24).map((prod) => {
                    const isSelectedInActive = selectedSlots[activeSlotIndex]?.id === prod.id;
                    const slotAssigned = selectedSlots.findIndex(s => s?.id === prod.id);

                    return (
                      <div
                        key={prod.id}
                        style={{
                          border: `1.5px solid ${isSelectedInActive ? '#000000' : '#f0f0f0'}`,
                          borderRadius: '8px',
                          background: '#ffffff',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative'
                        }}
                      >
                        {slotAssigned !== -1 && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            background: '#111827',
                            color: '#ffffff',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            zIndex: 2
                          }}>
                            In Slot {slotAssigned + 1}
                          </div>
                        )}

                        {/* Image */}
                        <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                          <img
                            src={prod.images?.[0] || prod.image}
                            alt={prod.name}
                            loading="lazy"
                            style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
                          />
                        </div>

                        {/* Title & Notes */}
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', lineHeight: 1.25 }}>
                            {prod.displayName || prod.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', margin: '3px 0 8px' }}>
                            {prod.brandInspiration ? `Inspired by ${prod.brandInspiration}` : 'Extrait de Parfum'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '0.75rem' }}>
                            <Star size={11} fill="#f59e0b" color="#f59e0b" />
                            <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{prod.rating || '4.9'}</span>
                          </div>
                        </div>

                        {/* Select Button */}
                        <button
                          type="button"
                          onClick={() => selectProductForSlot(prod)}
                          style={{
                            width: '100%',
                            padding: '9px 0',
                            borderRadius: '6px',
                            border: 'none',
                            background: isSelectedInActive ? '#059669' : '#111827',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.15s'
                          }}
                        >
                          {isSelectedInActive ? (
                            <>
                              <Check size={14} />
                              <span>Selected for Slot {activeSlotIndex + 1}</span>
                            </>
                          ) : (
                            <>
                              <Plus size={14} />
                              <span>Select for Slot {activeSlotIndex + 1}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Bundle Summary Card */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e5e7eb', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                    Bundle Summary
                  </h3>
                  <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: '0.72rem', fontWeight: 700, padding: '4px 8px', borderRadius: '999px' }}>
                    SAVE {currentTier.discountPercent}%
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                  {currentTier.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1.25rem' }}>
                  {currentTier.subtitle}
                </div>

                {/* Selected Fragrances List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1.25rem' }}>
                  {selectedSlots.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: item ? '#111827' : '#f3f4f6', color: item ? '#ffffff' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                        {idx + 1}
                      </span>
                      {item ? (
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.displayName || item.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                            {item.brandInspiration ? `Inspired by ${item.brandInspiration}` : 'Extrait de Parfum'}
                          </div>
                        </div>
                      ) : (
                        <div style={{ flex: 1, color: '#9ca3af', fontStyle: 'italic' }}>
                          Empty — click to select
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Perks Included */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#4b5563', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={14} color="#059669" />
                    <span>Free Express Shipping across Malaysia</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gift size={14} color="#059669" />
                    <span>Complimentary Discovery Box & 2 Free Vials</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} color="#059669" />
                    <span>100% Satisfaction & Authenticity Guarantee</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>
                    <span>Standard Value</span>
                    <span style={{ textDecoration: 'line-through' }}>RM{currentTier.originalPrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#059669', fontWeight: 700, marginBottom: '8px' }}>
                    <span>Bundle Discount ({currentTier.discountPercent}%)</span>
                    <span>-RM{currentTier.savingsAmount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800 }}>Total</span>
                    <div>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827' }}>
                        RM{currentTier.bundlePrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddBundleToBag}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isComplete ? '#000000' : '#e5e7eb',
                    color: isComplete ? '#ffffff' : '#9ca3af',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: isComplete ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: isComplete ? '0 4px 14px rgba(0,0,0,0.18)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>
                    {isComplete ? `Add Bundle to Bag (RM${currentTier.bundlePrice})` : `Select ${currentTier.bottleCount - filledSlotsCount} More`}
                  </span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <a href="/checkout.html" style={{ fontSize: '0.78rem', color: '#6b7280', textDecoration: 'underline' }}>
                    Skip directly to white-glove checkout
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </>
  );
};

export const BundleBuilderLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf9f6', color: '#111827' }}>
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
