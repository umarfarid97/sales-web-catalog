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
        style={{ borderLeft: '1px solid rgba(212, 175, 55, 0.3)' }}
      >
        
        {/* Drawer Header */}
        <div className="cart-drawer-header" style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--accent-gold)" />
            <h3 className="font-serif-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Fragrance Bag</h3>
            <span className="badge badge-gold">
              {cartItemCount} {cartItemCount === 1 ? 'flacon' : 'flacons'}
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
        <div className="free-shipping-progress" style={{ background: 'rgba(212, 175, 55, 0.06)', borderBottom: '1px solid rgba(212, 175, 55, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isFreeShipping ? '#6ee7b7' : 'var(--text-main)' }}>
              <Truck size={15} color="var(--accent-gold)" />
              {isFreeShipping 
                ? 'Unlocked Free White-Glove Climate Delivery!' 
                : `Add $${amountToFreeShipping.toFixed(2)} more for Free Delivery`}
            </span>
            <span style={{ color: isFreeShipping ? '#6ee7b7' : '#fce08b', fontWeight: 700 }}>
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="progress-bar-bg" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${freeShippingProgress}%`,
                background: isFreeShipping ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' : 'var(--accent-gold-gradient)'
              }} 
            />
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-gold)' }}>
                <ShoppingBag size={28} />
              </div>
              <h4 className="font-serif-title" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your Bag is Empty</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Discover our signature Extraits de Parfum, aged Oud resins, and discovery coffrets.
              </p>
              <button 
                className="btn btn-gold"
                onClick={() => setIsCartOpen(false)}
              >
                <span>Explore Scent Catalog</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div key={item.cartItemId} className="cart-item-card" style={{ border: '1px solid rgba(212, 175, 55, 0.15)', background: 'rgba(15, 17, 24, 0.7)' }}>
                  <img src={item.image} alt={item.name} className="cart-item-img" style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }} />
                  
                  <div className="cart-item-info">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <h4 className="font-serif-title" style={{ fontSize: '0.98rem', fontWeight: 700 }}>{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="cart-item-remove-btn"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)', margin: '3px 0' }}>
                      {item.size || '100 ml Grand Flacon'} &bull; {item.color}
                    </div>

                    {item.engraving && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#fcd34d', fontStyle: 'italic', marginBottom: '4px' }}>
                        <Feather size={12} />
                        <span>Engraved: &quot;{item.engraving}&quot;</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <div className="qty-control-group">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="qty-btn"
                          title="Decrease"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="qty-btn"
                          title="Increase"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="cart-item-price" style={{ color: '#fce08b' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="promo-input-form" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Promo (try LUXE25 or PARFUM10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Tag size={14} color="var(--accent-gold)" />
                  <span>Apply</span>
                </button>
              </div>

              {appliedPromo && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem', color: '#6ee7b7' }}>
                  <span>Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.discountPercent}% Off)</span>
                  <button type="button" onClick={removePromoCode} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>

              {cartDiscountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6ee7b7' }}>
                  <span>Privilege Discount ({appliedPromo?.discountPercent}%)</span>
                  <span>-${cartDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Climate-Safe Delivery</span>
                <span>{cartShipping === 0 ? <strong style={{ color: '#6ee7b7' }}>FREE</strong> : `$${cartShipping.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-gold-light)', fontFamily: 'var(--font-mono)' }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              className="btn btn-gold"
              style={{ width: '100%', padding: '13px', fontSize: '1.02rem' }}
              onClick={handleProceedCheckout}
            >
              <span>Proceed to White-Glove Checkout</span>
              <ArrowRight size={17} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
