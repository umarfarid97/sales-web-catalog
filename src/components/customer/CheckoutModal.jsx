import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { COMPLIMENTARY_SAMPLES } from '../../data/initialProducts';
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
  Check,
  Gift,
  Feather,
  Flame
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

  const [step, setStep] = useState(1); // 1: Client & Samples, 2: Payment & Gifting, 3: Success
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Form State
  const [shippingInfo, setShippingInfo] = useState({
    name: 'Lady Genevieve Laurent',
    email: 'genevieve.laurent@beaute-paris.fr',
    phone: '+33 6 89 24 11 05',
    address: '24 Place Vendôme, Apt 3A',
    city: 'Paris',
    state: 'Île-de-France',
    zip: '75001',
    country: 'France',
    giftPackaging: true,
    giftNote: 'With warm compliments from Paris.',
    samples: ['Oud Royal Extrait (2ml Vial)', 'Brumes de Vanille (2ml Vial)']
  });

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'apple' | 'paypal'
  const [cardInfo, setCardInfo] = useState({
    number: '4242 •••• •••• 4242',
    name: 'GENEVIEVE LAURENT',
    expiry: '08/29',
    cvv: '888'
  });

  if (!isCheckoutOpen) return null;

  const toggleSample = (sampleName) => {
    setShippingInfo((prev) => {
      const current = prev.samples || [];
      if (current.includes(sampleName)) {
        return { ...prev, samples: current.filter((s) => s !== sampleName) };
      }
      if (current.length >= 2) {
        showToast('You can select a maximum of 2 complimentary samples', 'info');
        return prev;
      }
      return { ...prev, samples: [...current, sampleName] };
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address) {
        showToast('Please fill in all required delivery fields', 'error');
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

        // Gold Confetti burst
        try {
          confetti({
            particleCount: 140,
            spread: 90,
            colors: ['#d4af37', '#f59e0b', '#fbbf24', '#ffffff', '#e2a8b2'],
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
      setTimeout(() => setCopiedTracking(false), 2500);
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={() => setIsCheckoutOpen(false)}
    >
      <div 
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid rgba(212, 175, 55, 0.35)', background: 'rgba(15, 17, 25, 0.98)' }}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setIsCheckoutOpen(false)}
          aria-label="Close Checkout"
        >
          <X size={18} />
        </button>

        {/* Header & Steps Indicator */}
        <div style={{ padding: '28px 36px 20px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                White-Glove Fragrance Fulfillment
              </span>
              <h2 className="font-serif-title" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                {step === 1 && 'Delivery & Complimentary Samples'}
                {step === 2 && 'Payment & Presentation Gifting'}
                {step === 3 && 'Order Confirmed'}
              </h2>
            </div>

            {/* Stepper Dots */}
            {step < 3 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step >= 1 ? 'var(--accent-gold-gradient)' : 'rgba(255, 255, 255, 0.1)',
                  color: step >= 1 ? '#0b0c10' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}>
                  1
                </span>
                <div style={{ width: '20px', height: '2px', background: step >= 2 ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.1)' }} />
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step >= 2 ? 'var(--accent-gold-gradient)' : 'rgba(255, 255, 255, 0.1)',
                  color: step >= 2 ? '#0b0c10' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}>
                  2
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 36px', maxHeight: '72vh', overflowY: 'auto' }}>
          
          {/* STEP 1: Delivery & Sample Selection */}
          {step === 1 && (
            <form onSubmit={handleNextStep}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                
                {/* Left: Shipping Inputs */}
                <div>
                  <h4 className="font-serif-title" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-gold-light)' }}>
                    Client &amp; Destination Address
                  </h4>

                  <div className="form-group">
                    <label className="form-label">Full Client Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State / Region</label>
                      <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Complimentary Samples Picker */}
                <div>
                  <div style={{ padding: '18px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 'var(--radius-lg)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Gift size={18} color="var(--accent-gold)" />
                        <h4 className="font-serif-title" style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                          Choose 2 Complimentary Samples
                        </h4>
                      </div>
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                        {shippingInfo.samples?.length || 0}/2 Selected
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      Deluxe 2ml spray vials included with our compliments in a velvet sachet.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {COMPLIMENTARY_SAMPLES.map((smp) => {
                        const isSelected = shippingInfo.samples?.includes(smp.name);
                        return (
                          <div
                            key={smp.id}
                            onClick={() => toggleSample(smp.name)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-md)',
                              background: isSelected ? 'rgba(212, 175, 55, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                              border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: isSelected ? '#fce08b' : 'var(--text-main)' }}>
                                {smp.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{smp.family}</div>
                            </div>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                              background: isSelected ? 'var(--accent-gold-gradient)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#0b0c10'
                            }}>
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Small Box */}
                  <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Items ({cart.length})</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {cartDiscountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6ee7b7', marginBottom: '6px' }}>
                        <span>Privilege Discount ({appliedPromo?.discountPercent}%)</span>
                        <span>-${cartDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', color: '#fce08b', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  Return to Boutique
                </button>
                <button type="submit" className="btn btn-gold">
                  <span>Continue to Payment &amp; Gifting</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment & Gifting Option */}
          {step === 2 && (
            <form onSubmit={handleNextStep}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                
                {/* Left: Payment Options */}
                <div>
                  <h4 className="font-serif-title" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-gold-light)' }}>
                    Payment Method
                  </h4>

                  {/* Payment Selectors */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`size-option-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    >
                      <CreditCard size={18} color="var(--accent-gold)" style={{ margin: '0 auto 4px' }} />
                      <span className="size-option-name">Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple')}
                      className={`size-option-btn ${paymentMethod === 'apple' ? 'active' : ''}`}
                    >
                      <span style={{ fontSize: '1.2rem', display: 'block' }}></span>
                      <span className="size-option-name">Apple Pay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`size-option-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                    >
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', display: 'block' }}>PP</span>
                      <span className="size-option-name">PayPal</span>
                    </button>
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input
                          type="text"
                          value={cardInfo.number}
                          onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Name on Card</label>
                        <input
                          type="text"
                          value={cardInfo.name}
                          onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                          <label className="form-label">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardInfo.expiry}
                            onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV</label>
                          <input
                            type="password"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod !== 'card' && (
                    <div style={{ padding: '24px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.3)', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.92rem', color: '#f3e5ab' }}>
                        Instant biometrics authorization will be requested upon clicking &quot;Place Fragrance Order&quot;.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Presentation Gift Box & Note */}
                <div>
                  <div style={{ padding: '18px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 'var(--radius-lg)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <Gift size={18} color="var(--accent-gold)" />
                      <h4 className="font-serif-title" style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                        Complimentary Gift Presentation
                      </h4>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer', marginBottom: '14px' }}>
                      <input
                        type="checkbox"
                        checked={shippingInfo.giftPackaging}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, giftPackaging: e.target.checked })}
                        style={{ accentColor: 'var(--accent-gold)', width: '16px', height: '16px' }}
                      />
                      <span>Hand-wrapped in Gold Embossed Box with Black Silk Ribbon</span>
                    </label>

                    {shippingInfo.giftPackaging && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Handwritten Calligraphy Card Message</label>
                        <textarea
                          rows={3}
                          value={shippingInfo.giftNote}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, giftNote: e.target.value })}
                          placeholder="Write a message to be hand-penned on heavy cotton stationery..."
                          className="form-textarea"
                          style={{ fontSize: '0.82rem' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Final Total Box */}
                  <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Subtotal</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {cartDiscountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6ee7b7', marginBottom: '6px' }}>
                        <span>Privilege Discount ({appliedPromo?.discountPercent}%)</span>
                        <span>-${cartDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Delivery</span>
                      <span>FREE</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', color: '#fce08b', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                      <span>Grand Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Address</span>
                </button>
                <button type="submit" className="btn btn-gold" style={{ padding: '13px 32px' }}>
                  <Sparkles size={16} />
                  <span>Place Fragrance Order (${cartTotal.toFixed(2)})</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Success Confirmation */}
          {step === 3 && createdOrder && (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', border: '2px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent-gold)' }}>
                <CheckCircle2 size={38} />
              </div>

              <h3 className="font-serif-title" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
                Thank You, {createdOrder.customer.name}
              </h3>

              <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 24px' }}>
                Your haute parfumerie order <strong style={{ color: '#fce08b' }}>#{createdOrder.id}</strong> has been registered with our atelier and is being prepared with white-glove care.
              </p>

              {/* Tracking Box */}
              <div style={{ maxWidth: '440px', margin: '0 auto 28px', padding: '16px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(212, 175, 55, 0.4)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Live Tracking Number
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                    {createdOrder.trackingNumber}
                  </span>
                  <button
                    onClick={copyTracking}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    title="Copy tracking number"
                  >
                    {copiedTracking ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Samples Included Confirmation */}
              {createdOrder.customer.samples && createdOrder.customer.samples.length > 0 && (
                <div style={{ maxWidth: '440px', margin: '0 auto 28px', fontSize: '0.85rem', color: '#f3e5ab' }}>
                  <Gift size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                  <strong>Included Samples:</strong> {createdOrder.customer.samples.join(', ')}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setStep(1);
                  }}
                >
                  Return to Boutique
                </button>

                <button
                  className="btn btn-gold"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setRole('admin');
                    setAdminTab('orders');
                    setStep(1);
                  }}
                >
                  <span>View in Maison Admin Portal</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
