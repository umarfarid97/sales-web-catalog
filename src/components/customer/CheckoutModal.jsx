import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  ShoppingBag,
  Clock,
  Copy,
  Check
} from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    cartDiscountAmount, 
    cartShipping, 
    cartTotal,
    appliedPromo,
    placeOrder,
    setRole,
    setAdminTab,
    showToast
  } = useStore();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Form State
  const [shippingInfo, setShippingInfo] = useState({
    name: 'Jordan Vance',
    email: 'jordan.vance@example.com',
    phone: '+1 (555) 432-8910',
    address: '450 Mission Street, Suite 800',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'apple' | 'paypal'
  const [cardInfo, setCardInfo] = useState({
    number: '4242 •••• •••• 4242',
    name: 'JORDAN VANCE',
    expiry: '08/29',
    cvv: '888'
  });

  if (!isCheckoutOpen) return null;

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address) {
        showToast('Please fill in all required shipping fields', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Place order and trigger confetti!
      const paymentDesc = paymentMethod === 'card' 
        ? `Credit Card (Visa **** 4242)` 
        : paymentMethod === 'apple' 
        ? 'Apple Pay' 
        : 'PayPal Express';

      const newOrder = placeOrder(shippingInfo, paymentDesc);
      if (newOrder) {
        setCreatedOrder(newOrder);
        setStep(3);

        // Confetti burst
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (err) {
          console.log('Confetti triggered', err);
        }
      }
    }
  };

  const copyTracking = () => {
    if (createdOrder?.trackingNumber) {
      navigator.clipboard.writeText(createdOrder.trackingNumber);
      setCopiedTracking(true);
      showToast('Tracking number copied to clipboard', 'success');
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const viewInAdminPortal = () => {
    setIsCheckoutOpen(false);
    setRole('admin');
    setAdminTab('orders');
    showToast('Switched to Admin Portal -> Orders Tab', 'info');
  };

  return (
    <div 
      className="modal-overlay"
      onClick={() => step !== 3 && setIsCheckoutOpen(false)}
    >
      <div 
        className="modal-content"
        style={{ maxWidth: step === 3 ? '580px' : '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setIsCheckoutOpen(false)}
          aria-label="Close Checkout"
        >
          <X size={18} />
        </button>

        <div className="checkout-modal-body">
          
          {/* Step Indicator Header (Steps 1 & 2) */}
          {step < 3 && (
            <div>
              <div className="checkout-step-indicator">
                
                <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                  <div className="step-circle">
                    {step > 1 ? <CheckCircle2 size={18} /> : '1'}
                  </div>
                  <span className="step-label">Shipping Details</span>
                </div>

                <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                  <div className="step-circle">
                    {step > 2 ? <CheckCircle2 size={18} /> : '2'}
                  </div>
                  <span className="step-label">Payment Simulation</span>
                </div>

                <div className="step-node">
                  <div className="step-circle">3</div>
                  <span className="step-label">Confirmation</span>
                </div>

              </div>
            </div>
          )}

          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <form onSubmit={handleNextStep}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
                Delivery Information
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Enter where you'd like your order delivered.
              </p>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                  placeholder="e.g. Jordan Vance"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    placeholder="name@domain.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  placeholder="Street name, apt, suite"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State / Province</label>
                  <input
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    placeholder="State / Province"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Postal / ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.zip}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                    placeholder="94105"
                  />
                </div>
                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    placeholder="Country"
                  />
                </div>
              </div>

              {/* Order Mini Summary */}
              <div 
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  margin: '20px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cart Subtotal ({cart.length} items)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>${cartTotal.toFixed(2)}</div>
                </div>
                <button type="submit" className="btn btn-primary">
                  <span>Continue to Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Simulator */}
          {step === 2 && (
            <form onSubmit={handleNextStep}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
                Payment Method
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Simulated Sandbox Payment &bull; Instant Confirmation
              </p>

              {/* Payment Type Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === 'card' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${paymentMethod === 'card' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}
                >
                  <CreditCard size={20} color={paymentMethod === 'card' ? '#818cf8' : 'var(--text-muted)'} />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === 'apple' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${paymentMethod === 'apple' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}
                >
                  <Sparkles size={20} color={paymentMethod === 'apple' ? '#818cf8' : 'var(--text-muted)'} />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === 'paypal' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${paymentMethod === 'paypal' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}
                >
                  <ShieldCheck size={20} color={paymentMethod === 'paypal' ? '#818cf8' : 'var(--text-muted)'} />
                  <span>PayPal</span>
                </button>
              </div>

              {/* Card Simulator Mock Graphic */}
              {paymentMethod === 'card' && (
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px 24px',
                    marginBottom: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    color: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', opacity: 0.8 }}>LUMINA CHIP EMV</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, fontStyle: 'italic' }}>VISA</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', letterSpacing: '0.15em', marginBottom: '18px' }}>
                    {cardInfo.number}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <div>
                      <div style={{ opacity: 0.7 }}>CARDHOLDER</div>
                      <div style={{ fontWeight: 700 }}>{cardInfo.name}</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.7 }}>EXPIRES</div>
                      <div style={{ fontWeight: 700 }}>{cardInfo.expiry}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Items Total</span>
                  <span style={{ color: '#ffffff' }}>${cartSubtotal.toFixed(2)}</span>
                </div>
                {cartDiscountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#34d399', marginBottom: '6px' }}>
                    <span>Promo Discount ({appliedPromo?.code})</span>
                    <span>-${cartDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <span>Shipping</span>
                  <span style={{ color: cartShipping === 0 ? '#34d399' : '#ffffff' }}>
                    {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '6px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--accent-primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-emerald"
                  style={{ flex: 1, padding: '12px', fontSize: '1rem' }}
                >
                  <ShieldCheck size={18} />
                  <span>Authorize & Pay ${cartTotal.toFixed(2)}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Confirmation & Invoice */}
          {step === 3 && createdOrder && (
            <div className="order-success-view">
              
              <div className="order-success-icon-box">
                <CheckCircle2 size={44} color="#10b981" />
              </div>

              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '8px' }}>
                Order Placed Successfully!
              </h2>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px' }}>
                Thank you, <strong>{createdOrder.customer.name}</strong>. A confirmation email has been sent to <strong>{createdOrder.customer.email}</strong>.
              </p>

              {/* Order ID & Tracking Card */}
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  marginBottom: '28px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>ORDER REFERENCE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                      {createdOrder.id}
                    </div>
                  </div>
                  <span className="badge badge-warning">
                    <Clock size={12} />
                    Pending Dispatch
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>TRACKING NUMBER</div>
                    <div style={{ fontSize: '0.9rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      {createdOrder.trackingNumber}
                    </div>
                  </div>
                  <button
                    onClick={copyTracking}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    {copiedTracking ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Delivery to: <strong>{createdOrder.customer.address}, {createdOrder.customer.city}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn btn-primary"
                  onClick={viewInAdminPortal}
                  style={{ width: '100%', padding: '12px' }}
                >
                  <ShieldCheck size={18} />
                  <span>Inspect Order in Admin View (Test Real-Time Sync)</span>
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setIsCheckoutOpen(false)}
                  style={{ width: '100%', padding: '10px' }}
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
