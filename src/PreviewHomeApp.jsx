import React, { useState, useMemo } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartDrawer } from './components/customer/CartDrawer';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { ToastContainer } from './components/common/ToastContainer';

import { 
  Search, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Heart,
  MessageCircle
} from 'lucide-react';
import './styles/preview-home.css';

// Fallback high-res photos if DB product image isn't loaded
const FALLBACK_BOTTLE = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80';

const PreviewHomeContent = () => {
  const { 
    products, 
    cart, 
    setIsCartOpen, 
    openProductDetail,
    addToCart,
    showToast 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Cart total items
  const cartCount = useMemo(() => {
    return Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
  }, [cart]);

  // Curated Popular Products (First 4 from Tier S or top catalog)
  const popularProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const tierS = products.filter(p => p.tier === 'S');
    const source = tierS.length >= 4 ? tierS : products;
    return source.slice(0, 4);
  }, [products]);

  // Curated New Products (Next 4 distinct products)
  const newProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.slice(4, 8);
  }, [products]);

  const handleQuickAdd = (e, prod) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart({
        ...prod,
        selectedSize: '30ml',
        price: 45
      }, 1);
    }
  };

  const handleCardClick = (prod) => {
    if (openProductDetail) {
      openProductDetail(prod);
    } else {
      window.location.href = `/product.html?product=${encodeURIComponent(prod.id)}`;
    }
  };

  return (
    <div className="prv-page">
      {/* ---------------- 1. NAVBAR ---------------- */}
      <header className="prv-navbar">
        <div className="prv-container prv-nav-inner">
          <a href="/preview-home.html" className="prv-logo">
            VALENSZO
          </a>

          <ul className="prv-nav-links">
            <li><a href="/preview-home.html" className="prv-nav-link active">Home</a></li>
            <li><a href="/collection.html" className="prv-nav-link">Collection</a></li>
            <li><a href="/men.html" className="prv-nav-link">Men</a></li>
            <li><a href="/women.html" className="prv-nav-link">Women</a></li>
            <li><a href="/diagnostic.html" className="prv-nav-link">Scent Quiz</a></li>
            <li>
              <a 
                href="https://wa.me/60182868402?text=Hello%20Valenszo,%20I%20would%20like%20to%20inquire%20about%20your%20fragrances" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="prv-nav-link"
              >
                Contact Us
              </a>
            </li>
          </ul>

          <div className="prv-nav-actions">
            {/* Search Input */}
            <form 
              className="prv-search-box" 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/collection.html?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
            >
              <Search size={15} color="#6b7280" />
              <input 
                type="text" 
                className="prv-search-input" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Shopping Cart Button */}
            <button 
              className="prv-icon-btn" 
              onClick={() => setIsCartOpen && setIsCartOpen(true)}
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="prv-cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- 2. HERO SECTION ---------------- */}
      <section className="prv-hero">
        <div className="prv-container prv-hero-grid">
          
          {/* Left Column: Editorial Headline & Subtitle */}
          <div className="prv-hero-content">
            <div className="prv-hero-star-decor" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000">
                <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2Z"/>
              </svg>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#000000" style={{ marginBottom: '8px' }}>
                <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2Z"/>
              </svg>
            </div>

            <h1 className="prv-hero-headline">
              <span className="hero-line-1">Smell is a</span>
              <span className="hero-line-2">word <span className="dot-sep">•</span> Perfume is</span>
              <span className="hero-line-3">literature</span>
            </h1>

            <p className="prv-hero-desc">
              Discover the beauty of fragrance with our collection of premium perfumes to enrich your everyday smell
            </p>

            <a href="/collection.html" className="prv-pill-cta">
              <span>Shop Now</span>
              <div className="prv-pill-arrow">
                <ArrowRight size={14} />
              </div>
            </a>
          </div>

          {/* Right Column: User Attached Luxury Fragrance Ritual Image */}
          <div className="prv-hero-image-col">
            <div className="prv-hero-portrait-frame">
              <img 
                src="/images/hero-perfume-wrist.jpg" 
                alt="Woman applying luxury fragrance to wrist" 
                loading="eager"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 3. BRAND LOGOS STRIP ---------------- */}
      <div className="prv-brands-strip">
        <div className="prv-container prv-brands-row">
          <div className="prv-brand-item" title="Dior">
            <img src="/brand-logos/dior.svg" alt="Dior" className="prv-brand-logo prv-brand-dior" />
          </div>
          <div className="prv-brand-item" title="Tom Ford">
            <img src="/brand-logos/tom-ford.svg" alt="Tom Ford" className="prv-brand-logo prv-brand-tom-ford" />
          </div>
          <div className="prv-brand-item" title="Chanel">
            <img src="/brand-logos/chanel.svg" alt="Chanel" className="prv-brand-logo prv-brand-chanel" />
          </div>
          <div className="prv-brand-item" title="Calvin Klein">
            <img src="/brand-logos/calvin-klein.svg" alt="Calvin Klein" className="prv-brand-logo prv-brand-calvin-klein" />
          </div>
          <div className="prv-brand-item" title="Clinique">
            <img src="/brand-logos/clinique.svg" alt="Clinique" className="prv-brand-logo prv-brand-clinique" />
          </div>
          <div className="prv-brand-item" title="Dolce & Gabbana">
            <img src="/brand-logos/dolce-gabbana.svg" alt="Dolce & Gabbana" className="prv-brand-logo prv-brand-dg" />
          </div>
        </div>
      </div>

      {/* ---------------- 4. POPULAR PRODUCTS ---------------- */}
      <section className="prv-section">
        <div className="prv-container">
          <h2 className="prv-section-heading">Popular Products</h2>

          <div className="prv-products-grid">
            {popularProducts.map((prod) => (
              <div 
                key={prod.id} 
                className="prv-card"
                onClick={() => handleCardClick(prod)}
              >
                <div className="prv-card-image-box">
                  <img 
                    src={prod.images?.[0] || prod.image || FALLBACK_BOTTLE} 
                    alt={prod.name} 
                    onError={(e) => { e.currentTarget.src = FALLBACK_BOTTLE; }}
                  />
                </div>

                <div className="prv-card-info">
                  <h3 className="prv-card-title">{prod.name}</h3>
                  <div className="prv-card-sub">
                    {prod.brandInspiration ? `Inspired by ${prod.brandInspiration}` : prod.category}
                  </div>

                  <div className="prv-card-bottom">
                    <span className="prv-card-price">RM{Number(prod.price || 45).toFixed(2)}</span>
                    <button 
                      className="prv-card-cart-btn" 
                      onClick={(e) => handleQuickAdd(e, prod)}
                      title="Add to Bag"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 5. EDITORIAL LIFESTYLE COLLAGE ---------------- */}
      <section className="prv-collage-section">
        <div className="prv-container prv-collage-grid">
          
          {/* Tile 1: Left Tall Model with Bottle */}
          <div className="prv-collage-tall-tile">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=85" 
              alt="Model with Luxury Perfume" 
            />
            <a href="/collection.html" className="prv-tile-overlay-btn">
              Shop Now
            </a>
          </div>

          {/* Right Stack: Two Tiles */}
          <div className="prv-collage-right-stack">
            {/* Tile 2: Misting Fragrance Spray */}
            <div className="prv-collage-wide-tile">
              <img 
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80" 
                alt="Spray Atomizer Mist" 
              />
              <a href="/collection.html?gender=women" className="prv-tile-overlay-btn">
                Shop Now
              </a>
            </div>

            {/* Tile 3: Perfume Flacon on Pedestal */}
            <div className="prv-collage-wide-tile">
              <img 
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=900&auto=format&fit=crop&q=80" 
                alt="Perfume Flacon Pedestal" 
              />
              <a href="/collection.html?gender=men" className="prv-tile-overlay-btn">
                Shop Now
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 6. NEW PRODUCTS ---------------- */}
      <section className="prv-section" style={{ paddingBottom: '5rem' }}>
        <div className="prv-container">
          <h2 className="prv-section-heading">New Products</h2>

          <div className="prv-products-grid">
            {newProducts.map((prod) => (
              <div 
                key={prod.id} 
                className="prv-card"
                onClick={() => handleCardClick(prod)}
              >
                <div className="prv-card-image-box">
                  <img 
                    src={prod.images?.[0] || prod.image || FALLBACK_BOTTLE} 
                    alt={prod.name} 
                    onError={(e) => { e.currentTarget.src = FALLBACK_BOTTLE; }}
                  />
                </div>

                <div className="prv-card-info">
                  <h3 className="prv-card-title">{prod.name}</h3>
                  <div className="prv-card-sub">
                    {prod.brandInspiration ? `Inspired by ${prod.brandInspiration}` : prod.category}
                  </div>

                  <div className="prv-card-bottom">
                    <span className="prv-card-price">RM{Number(prod.price || 45).toFixed(2)}</span>
                    <button 
                      className="prv-card-cart-btn" 
                      onClick={(e) => handleQuickAdd(e, prod)}
                      title="Add to Bag"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL PRE-FOOTER INVITATION */}
      <section className="prv-footer-invitation">
        <div className="prv-container prv-footer-invitation-inner">
          <div className="prv-invitation-left">
            <span className="prv-invitation-tag">Bespoke Fragrance Consultation</span>
            <h3 className="prv-invitation-title">Find Your Signature Note</h3>
            <p className="prv-invitation-desc">
              Unsure which scent complements your personality? Take our 60-second Scent Discovery Quiz to reveal perfumes harmonized to your aura.
            </p>
          </div>
          <div className="prv-invitation-right">
            <a href="/diagnostic.html" className="prv-pill-cta prv-invitation-btn">
              <span>Start Scent Quiz</span>
              <div className="prv-pill-arrow">
                <ArrowRight size={14} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 7. REFINED EDITORIAL FOOTER */}
      <footer className="prv-footer">
        <div className="prv-container">
          <div className="prv-footer-grid">
            
            {/* Column 1: Brand Mark & Heritage */}
            <div className="prv-footer-col prv-footer-brand-col">
              <a href="/preview-home.html" className="prv-footer-brand-mark">
                <span className="prv-footer-monogram">VL</span>
                <div className="prv-footer-brand-text">
                  <span className="prv-footer-logo-title">VALENSZO</span>
                  <span className="prv-footer-logo-sub">Fragrance Malaysia</span>
                </div>
              </a>
              <p className="prv-footer-brand-desc">
                Valenszo crafts long-lasting luxury perfumes using high-grade fragrance oils. Premium scents created for everyday elegance and enduring presence in Malaysia.
              </p>
              <div className="prv-footer-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#111111" aria-hidden="true">
                  <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2Z"/>
                </svg>
                <span>Curated with Precision</span>
              </div>
            </div>

            {/* Column 2: Fragrance Collections */}
            <div className="prv-footer-col">
              <h4 className="prv-footer-heading">Fragrance Collections</h4>
              <ul className="prv-footer-links">
                <li><a href="/men.html" className="prv-footer-link">Men's Perfumes</a></li>
                <li><a href="/women.html" className="prv-footer-link">Women's Perfumes</a></li>
                <li><a href="/collection.html" className="prv-footer-link">All Collections</a></li>
                <li><a href="/diagnostic.html" className="prv-footer-link">Scent Discovery Quiz</a></li>
              </ul>
            </div>

            {/* Column 3: Customer Care & WhatsApp Concierge */}
            <div className="prv-footer-col">
              <h4 className="prv-footer-heading">Customer Care</h4>
              <p className="prv-footer-care-text">
                Speak directly with our fragrance concierge for order inquiries and scent advice.
              </p>
              <a 
                href="https://wa.me/60182868402?text=Hello%20Valenszo!%20I%20would%20like%20assistance%20with%20your%20perfume%20catalog." 
                target="_blank" 
                rel="noopener noreferrer"
                className="prv-footer-wa-pill"
              >
                <MessageCircle size={16} />
                <span>WhatsApp: 018-286 8402</span>
              </a>
              <span className="prv-footer-hours">Daily Concierge Support • 9:00 AM – 10:00 PM</span>
            </div>

            {/* Column 4: Newsletter / Stay Connected */}
            <div className="prv-footer-col">
              <h4 className="prv-footer-heading">Join The Scent Circle</h4>
              <p className="prv-footer-newsletter-text">
                Receive private release alerts, olfactory notes, and bespoke member privileges.
              </p>
              <form 
                className="prv-footer-form" 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  showToast && showToast('Thank you for subscribing to Valenszo.'); 
                }}
              >
                <input 
                  type="email" 
                  placeholder="Enter your email..." 
                  className="prv-footer-input"
                  required 
                />
                <button type="submit" className="prv-footer-submit" aria-label="Subscribe">
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="prv-footer-bottom">
            <div className="prv-footer-copy">
              &copy; {new Date().getFullYear()} Valenszo Fragrance Malaysia. All rights reserved.
            </div>
            <div className="prv-footer-legal">
              <a href="#">Privacy Policy</a>
              <span className="prv-footer-dot">•</span>
              <a href="#">Legal Notice</a>
              <span className="prv-footer-dot">•</span>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <CartDrawer />
      <ProductDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function PreviewHomeApp() {
  return (
    <AuthProvider>
      <StoreProvider>
        <PreviewHomeContent />
      </StoreProvider>
    </AuthProvider>
  );
}
