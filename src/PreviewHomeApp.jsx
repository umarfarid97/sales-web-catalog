import React, { useState, useMemo } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartDrawer } from './components/customer/CartDrawer';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { 
  Search, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Heart,
  MessageCircle
} from 'lucide-react';
import { cleanPerfumeName } from './utils/taxonomy';
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
          <a href="/index.html" className="prv-logo">
            VALENSZO
          </a>

          <ul className="prv-nav-links">
            <li><a href="/index.html" className="prv-nav-link active">Home</a></li>
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


            <h1 className="prv-hero-headline">
              Smell is a word • Perfume is literature
            </h1>

            <p className="prv-hero-desc">
              Discover the beauty of fragrance with our collection of premium perfumes to enrich your everyday smell
            </p>

            <a href="collection.html" className="prv-pill-cta">
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
                  <h3 className="prv-card-title">{cleanPerfumeName(prod.name)}</h3>
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
          
          {/* Tile 1: 3rd picture -> Unisex Perfume Page */}
          <a 
            href="collection.html?gender=Unisex" 
            className="prv-collage-tall-tile"
            aria-label="Shop Unisex Perfume Collection"
          >
            <img 
              src="/images/collage-unisex.jpg" 
              alt="Unisex Perfume Collection" 
            />
            <span className="prv-tile-overlay-btn">
              Shop Unisex
            </span>
          </a>

          {/* Right Stack: Two Tiles */}
          <div className="prv-collage-right-stack">
            {/* Tile 2: 1st picture -> Men Perfume Page */}
            <a 
              href="men.html" 
              className="prv-collage-wide-tile"
              aria-label="Shop Men's Perfume Collection"
            >
              <img 
                src="/images/collage-men.jpg" 
                alt="Men's Perfume Collection" 
              />
              <span className="prv-tile-overlay-btn">
                Shop Men
              </span>
            </a>

            {/* Tile 3: 2nd picture -> Women Perfume Page */}
            <a 
              href="women.html" 
              className="prv-collage-wide-tile"
              aria-label="Shop Women's Perfume Collection"
            >
              <img 
                src="/images/collage-women.jpg" 
                alt="Women's Perfume Collection" 
              />
              <span className="prv-tile-overlay-btn">
                Shop Women
              </span>
            </a>
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
                  <h3 className="prv-card-title">{cleanPerfumeName(prod.name)}</h3>
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
            
            {/* Column 1: Brand Mark */}
            <div className="prv-footer-col prv-footer-brand-col">
              <a href="index.html" className="prv-footer-brand-mark">
                <span className="prv-footer-monogram">VL</span>
                <div className="prv-footer-brand-text">
                  <span className="prv-footer-logo-title">VALENSZO</span>
                  <span className="prv-footer-logo-sub">Fragrance Malaysia</span>
                </div>
              </a>
            </div>

            {/* Column 2: Fragrance Collections */}
            <div className="prv-footer-col">
              <h4 className="prv-footer-heading">Fragrance Collections</h4>
              <ul className="prv-footer-links">
                <li><a href="collection.html" className="prv-footer-link">All Collections</a></li>
                <li><a href="men.html" className="prv-footer-link">Men's Perfumes</a></li>
                <li><a href="women.html" className="prv-footer-link">Women's Perfumes</a></li>
                <li><a href="collection.html?gender=Unisex" className="prv-footer-link">Unisex Perfumes</a></li>
                <li><a href="diagnostic.html" className="prv-footer-link">Scent Discovery Quiz</a></li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="prv-footer-col">
              <h4 className="prv-footer-heading">Customer Care</h4>
              <ul className="prv-footer-links">
                <li>
                  <a 
                    href="https://wa.me/60182868402?text=Hello%20Valenszo!%20I%20would%20like%20assistance%20with%20your%20perfume%20catalog." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="prv-footer-wa-link"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp: 018-286 8402</span>
                  </a>
                </li>
              </ul>
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
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <PreviewHomeContent />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
