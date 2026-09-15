import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Gift, 
  Truck, 
  Feather,
  MessageCircle
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
    appliedPromo,
    applyPromoCode,
    removePromoCode
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  // Lock document body scroll while cart drawer is open to prevent background scrolling on mobile
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const safeSubtotal = Number(cartSubtotal) || 0;
  const safeThreshold = Number(freeShippingThreshold) || 150;
  const freeShippingProgress = Math.min(100, Math.max(0, (safeSubtotal / safeThreshold) * 100));
  const amountToFreeShipping = Math.max(0, safeThreshold - safeSubtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoInput('');
    }
  };

  const handleProceedCheckout = () => {
    if (!cart || cart.length === 0) return;
    const itemsList = cart.map((item, idx) => 
      `${idx + 1}. ${item.name} (${item.size || '50ml'}) x${item.quantity} = RM${((Number(item.price) || 0) * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const summary = `Hello Valenszo! 🛍️\n\nI would like to order the following from your online catalog:\n\n${itemsList}\n\nEstimated Subtotal: RM${safeSubtotal.toFixed(2)}\nDelivery: ${cartShipping === 0 ? 'FREE' : `RM${cartShipping.toFixed(2)}`}\nTotal: RM${cartTotal.toFixed(2)}\n\nCould you please assist me with payment and delivery arrangement? Thank you!`;
    
    const waUrl = `https://wa.me/60182868402?text=${encodeURIComponent(summary)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="cart-drawer-overlay"
      onClick={() => setIsCartOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overscrollBehavior: 'contain',
        touchAction: 'none'
      }}
    >
      <div 
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderLeft: '1px solid #e5e7eb',
          background: '#ffffff',
          color: '#000000',
          boxShadow: '-10px 0 50px rgba(0, 0, 0, 0.18)',
          height: '100dvh',
          maxHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          overscrollBehavior: 'contain'
        }}
      >
        
        {/* Drawer Header */}
        <div className="cart-drawer-header" style={{ borderBottom: '1px solid #e5e7eb', padding: '20px 24px', background: '#ffffff', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#000000" />
            <h3 className="couture-title" style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 800, letterSpacing: '0.12em' }}>
              Shopping Bag
            </h3>
            <span style={{
              background: '#000000',
              color: '#ffffff',
              padding: '3px 9px',
              borderRadius: '2px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em'
            }}>
              {cartItemCount || 0} {cartItemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="btn-icon"
            style={{ width: '36px', height: '36px', background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#000000', cursor: 'pointer' }}
            aria-label="Close Bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-progress" style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', padding: '12px 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isFreeShipping ? '#059669' : '#111827' }}>
              <Truck size={16} color={isFreeShipping ? '#059669' : '#000000'} />
              {isFreeShipping 
                ? 'Unlocked Free Express Delivery!' 
                : `Add RM${amountToFreeShipping.toFixed(2)} more for Free Express Delivery`}
            </span>
            <span style={{ color: isFreeShipping ? '#059669' : '#000000', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="progress-bar-bg" style={{ background: '#e5e7eb', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${freeShippingProgress}%`,
                background: isFreeShipping ? '#059669' : '#000000'
              }} 
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div 
          className="cart-items-container" 
          style={{ 
            background: '#ffffff',
            flex: '1 1 0px',
            minHeight: 0,
            maxHeight: '100%',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
            padding: '16px 20px'
          }}
        >
          {(!cart || cart.length === 0) ? (
            <div className="cart-empty-state" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#000000' }}>
                <ShoppingBag size={28} />
              </div>
              <h4 className="couture-title" style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.12em' }}>
                Your Bag is Empty
              </h4>
              <p style={{ color: '#4b5563', fontSize: '0.85rem', marginBottom: '24px', lineHeight: '1.5' }}>
                Discover our iconic Valenszo concentrations and La Collection Privée.
              </p>
              <button
                className="btn btn-dior-solid"
                onClick={() => setIsCartOpen(false)}
                style={{ padding: '12px 28px', fontSize: '0.82rem', background: '#000000', color: '#ffffff', border: '1px solid #000000', cursor: 'pointer' }}
              >
                Explore The Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item, idx) => {
                const itemImg = item.image || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80';
                const itemQty = Math.max(1, Number(item.quantity) || 1);
                const itemPrice = Number(item.price) || 0;
                const itemTotal = (itemPrice * itemQty).toFixed(2);
                const itemKey = item.cartItemId || `${item.id}-${item.selectedSize || 'std'}-${idx}`;

                return (
                  <div 
                    key={itemKey} 
                    className="cart-item-card"
                    style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '14px', display: 'flex', gap: '14px' }}
                  >
                    <img src={itemImg} alt={item.name || 'Perfume'} style={{ width: '76px', height: '76px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #f3f4f6' }} />
                    
                    <div className="cart-item-info" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 className="couture-title" style={{ fontSize: '0.92rem', color: '#000000', fontWeight: 700, marginBottom: '4px' }}>
                            {item.name}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: '#926917', fontWeight: 600, marginBottom: '4px' }}>
                            {item.selectedSize || item.size || '100 ml Bottle'}
                          </div>
                          {item.engravingText && (
                            <div style={{ fontSize: '0.74rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                              <Feather size={12} />
                              <span>Engraved: &quot;{item.engravingText}&quot;</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId || item.id, item.selectedSize)}
                          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                          <button
                            style={{ width: '28px', height: '28px', background: 'none', border: 'none', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            onClick={() => updateCartQuantity(item.cartItemId || item.id, itemQty - 1, item.selectedSize)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 700, color: '#000000', fontFamily: 'var(--font-mono)' }}>
                            {itemQty}
                          </span>
                          <button
                            style={{ width: '28px', height: '28px', background: 'none', border: 'none', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            onClick={() => updateCartQuantity(item.cartItemId || item.id, itemQty + 1, item.selectedSize)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div style={{ color: '#000000', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>
                          RM{itemTotal}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer" style={{ borderTop: '1px solid #e5e7eb', background: '#ffffff', padding: '18px 24px calc(18px + env(safe-area-inset-bottom, 0px))', flexShrink: 0 }}>
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Privilege Code (e.g. VALENSZO25)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                className="form-input"
                style={{ padding: '9px 12px', fontSize: '1rem', letterSpacing: '0.08em', flex: 1, background: '#ffffff', color: '#000000', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
              <button 
                type="submit" 
                className="btn-pill btn-pill-espresso" 
                style={{ padding: '9px 18px', fontSize: '0.78rem', cursor: 'pointer', letterSpacing: '0.06em' }}
              >
                Apply
              </button>
            </form>

            {/* Active Promo Tag */}
            {appliedPromo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fdf8eb', border: '1px solid #f3d99d', borderRadius: '4px', marginBottom: '16px', fontSize: '0.78rem' }}>
                <span style={{ color: '#926917', fontWeight: 700 }}>
                  Privilege {appliedPromo.code} (-{appliedPromo.discountPercent}%)
                </span>
                <button
                  onClick={removePromoCode}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Cost Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>Subtotal</span>
                <span style={{ color: '#000000', fontWeight: 600 }}>RM{safeSubtotal.toFixed(2)}</span>
              </div>
              {cartDiscountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#926917' }}>
                  <span>Privilege Discount</span>
                  <span style={{ fontWeight: 700 }}>-RM{cartDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>Express Delivery</span>
                <span style={{ color: cartShipping === 0 ? '#059669' : '#000000', fontWeight: 600 }}>
                  {cartShipping === 0 ? 'FREE' : `RM${cartShipping.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#000000', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
                <span>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>RM{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* 2 Complimentary Samples Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#fdf8eb', border: '1px solid #f3d99d', borderRadius: '4px', marginBottom: '18px', fontSize: '0.78rem', color: '#926917' }}>
              <Gift size={15} color="#926917" />
              <span>Includes 2 free 2ml deluxe spray samples at checkout.</span>
            </div>

            {/* Proceed to WhatsApp Order CTA */}
            <button
              onClick={handleProceedCheckout}
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '0.9rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                letterSpacing: '0.06em',
                fontWeight: 800,
                background: '#128C7E',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(18, 140, 126, 0.28)',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#075E54'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#128C7E'; }}
            >
              <MessageCircle size={18} />
              <span>Order via WhatsApp</span>
              <ArrowRight size={16} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
