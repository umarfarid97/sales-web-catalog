import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Gift,
  Truck,
  Feather,
  Sparkles
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    cartDiscountAmount,
    cartShipping,
    cartTotal,
    cartItemCount,
    freeShippingThreshold,
    isFreeShipping,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div 
      className="cart-drawer-overlay"
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(7, 11, 24, 0.98)' }}
      >
        
        {/* Drawer Header */}
        <div className="cart-drawer-header" style={{ borderBottom: '1px solid var(--border-card)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--accent-copper-light)" />
            <h3 className="couture-title" style={{ fontSize: '1.1rem' }}>Shopping Bag</h3>
            <span className="badge badge-copper">
              {cartItemCount} {cartItemCount === 1 ? 'creation' : 'creations'}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
            aria-label="Close Bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-progress" style={{ background: 'rgba(11, 17, 34, 0.9)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isFreeShipping ? '#6ee7b7' : 'var(--text-main)' }}>
              <Truck size={15} color="var(--accent-copper)" />
              {isFreeShipping 
                ? 'Unlocked Free White-Glove Climate Delivery!' 
                : `Add $${amountToFreeShipping.toFixed(2)} more for Free Delivery`}
            </span>
            <span style={{ color: isFreeShipping ? '#6ee7b7' : 'var(--accent-copper-light)', fontWeight: 700 }}>
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="progress-bar-bg" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${freeShippingProgress}%`,
                background: isFreeShipping ? '#10b981' : 'var(--accent-copper-gradient)'
              }} 
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-dim)' }}>
                <ShoppingBag size={28} />
              </div>
              <h4 className="couture-title" style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Your Bag is Empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Discover our iconic Sauvage concentrations and La Collection Privée.
              </p>
              <button
                className="btn btn-dior-solid"
                onClick={() => setIsCartOpen(false)}
                style={{ padding: '10px 24px', fontSize: '0.82rem' }}
              >
                Explore The Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item, idx) => (
                <div 
                  key={`${item.id}-${item.selectedSize || 'default'}-${idx}`} 
                  className="cart-item-card"
                  style={{ background: 'rgba(11, 17, 34, 0.75)', border: '1px solid var(--border-card)' }}
                >
                  <img src={item.images[0]} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 className="couture-title" style={{ fontSize: '0.92rem', marginBottom: '3px' }}>{item.name}</h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-copper-light)', fontWeight: 600, marginBottom: '2px' }}>
                          {item.selectedSize || '100 ml Grand Flacon'}
                        </div>
                        {item.engravingText && (
                          <div style={{ fontSize: '0.74rem', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Feather size={11} />
                            <span>Engraved: &quot;{item.engravingText}&quot;</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="cart-item-remove-btn"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <div className="qty-control-group">
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.selectedSize)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.selectedSize)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="cart-item-price" style={{ color: '#ffffff' }}>
                        ${((item.price || item.unitPrice) * item.quantity).toFixed(2)}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer" style={{ borderTop: '1px solid var(--border-card)' }}>
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Privilege Code (e.g. SAUVAGE25)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.82rem', letterSpacing: '0.08em' }}
              />
              <button type="submit" className="btn btn-dior-outline" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
                Apply
              </button>
            </form>

            {/* Active Promo Tag */}
            {appliedPromo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', background: 'rgba(226, 135, 67, 0.15)', border: '1px solid rgba(226, 135, 67, 0.35)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--accent-copper-light)', fontWeight: 700 }}>
                  Privilege {appliedPromo.code} (-{appliedPromo.discountPercent}%)
                </span>
                <button
                  onClick={removePromoCode}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Cost Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {cartDiscountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-copper-light)' }}>
                  <span>Privilege Discount</span>
                  <span>-${cartDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>White-Glove Climate Shipping</span>
                <span>{cartShipping === 0 ? 'COMPLIMENTARY' : `$${cartShipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* 2 Complimentary Samples Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <Gift size={14} color="var(--accent-copper-light)" />
              <span>Includes 2 complimentary 2ml deluxe spray samples at checkout.</span>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              className="btn btn-copper"
              onClick={handleProceedCheckout}
              style={{ width: '100%', padding: '14px 20px', fontSize: '0.9rem' }}
            >
              <span>Proceed to White-Glove Checkout</span>
              <ArrowRight size={16} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
