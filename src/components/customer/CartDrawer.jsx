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
  Sparkles,
  Truck,
  CheckCircle2
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
      >
        
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Shopping Cart</h3>
            <span className="badge badge-primary">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
            aria-label="Close Cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-progress">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isFreeShipping ? '#34d399' : 'var(--text-main)' }}>
              <Truck size={15} />
              {isFreeShipping 
                ? 'Unlocked Free Express Worldwide Shipping!' 
                : `Add $${amountToFreeShipping.toFixed(2)} more for Free Shipping`}
            </span>
            <span style={{ color: isFreeShipping ? '#34d399' : '#818cf8', fontWeight: 700 }}>
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        {cart.length > 0 ? (
          <div className="cart-drawer-items">
            {cart.map((item) => (
              <div 
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  alignItems: 'center'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                    background: '#141722'
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                    Variant: <span style={{ color: '#818cf8' }}>{item.color}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Stepper */}
                    <div className="quantity-stepper" style={{ transform: 'scale(0.85)', transformOrigin: 'right center' }}>
                      <button onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}>
                        <Minus size={13} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}>
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  style={{
                    color: 'var(--text-dim)',
                    padding: '6px',
                    transition: 'color var(--transition-fast)'
                  }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={clearCart}
              style={{
                color: '#fb7185',
                fontSize: '0.8rem',
                fontWeight: 600,
                alignSelf: 'flex-end',
                padding: '6px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={13} />
              <span>Clear Entire Cart</span>
            </button>
          </div>
        ) : (
          /* Empty Cart State */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--text-dim)' }}>
              <ShoppingBag size={28} />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Your cart is empty</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Explore our store catalog and discover innovative hardware gear.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsCartOpen(false)}
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Drawer Footer / Summary */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Promo code (e.g. LUMINA25)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{ width: '100%', paddingLeft: '34px', fontSize: '0.85rem' }}
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ padding: '0 16px', fontSize: '0.85rem' }}>
                Apply
              </button>
            </form>

            {appliedPromo && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: '#34d399',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} />
                  <span>Promo <strong>{appliedPromo.code}</strong> (-{appliedPromo.discountPercent}%)</span>
                </div>
                <button 
                  onClick={removePromoCode}
                  style={{ color: '#fb7185', fontWeight: 600 }}
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>${cartSubtotal.toFixed(2)}</span>
              </div>

              {cartDiscountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Promo Discount ({appliedPromo?.discountPercent}%)</span>
                  <span>-${cartDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated Shipping</span>
                <span style={{ color: isFreeShipping ? '#34d399' : 'var(--text-main)', fontWeight: 600 }}>
                  {isFreeShipping ? 'FREE' : `$${cartShipping.toFixed(2)}`}
                </span>
              </div>

              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                <span>Total Due</span>
                <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)' }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              onClick={handleProceedCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
