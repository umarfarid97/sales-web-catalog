import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { COMPLIMENTARY_SAMPLES } from '../../data/initialProducts';
import { 
  X, 
  Check, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Gift, 
  Feather, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock
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
    createOrder,
    showToast
  } = useStore();

  const [step, setStep] = useState(1); // 1: Gifting & Samples, 2: Shipping & Payment, 3: Success Confirmation
  const [selectedSamples, setSelectedSamples] = useState(['smp-1', 'smp-2']);
  const [isGiftBoxSelected, setIsGiftBoxSelected] = useState(true);
  const [giftNote, setGiftNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Alexandre',
    lastName: 'de Saint-Germain',
    email: 'alexandre.stgermain@couture.fr',
    phone: '+33 6 12 34 56 78',
    address: '30 Avenue Montaigne',
    city: 'Paris',
    postalCode: '75008',
    country: 'France',
    paymentMethod: 'credit-card',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••'
  });

  if (!isCheckoutOpen) return null;

  const toggleSample = (sampleId) => {
    if (selectedSamples.includes(sampleId)) {
      setSelectedSamples(selectedSamples.filter((id) => id !== sampleId));
    } else {
      if (selectedSamples.length < 2) {
        setSelectedSamples([...selectedSamples, sampleId]);
      } else {
        showToast('You may select up to 2 complimentary deluxe samples.', 'warning');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          ...formData,
          selectedSamples: selectedSamples.map((id) => COMPLIMENTARY_SAMPLES.find((s) => s.id === id)?.name),
          isGiftBox: isGiftBoxSelected,
          giftNote: isGiftBoxSelected ? giftNote : null
        },
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          sku: item.sku,
          size: item.selectedSize || '100 ml Grand Flacon',
          engraving: item.engravingText || null,
          price: item.price || item.unitPrice,
          quantity: item.quantity,
          image: item.images[0]
        })),
        subtotal: cartSubtotal,
        discount: cartDiscountAmount,
        discountCode: appliedPromo?.code || null,
        shipping: cartShipping,
        total: cartTotal,
        paymentMethod: formData.paymentMethod
      };

      const newOrder = await createOrder(orderData);
      setPlacedOrder(newOrder);
      setStep(3);
      showToast('Votre commande est confirmée! Order placed with Maison Atelier.', 'success');
    } catch (err) {
      console.error('Order creation failed:', err);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={() => step !== 3 && setIsCheckoutOpen(false)}
    >
      <div 
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'rgba(7, 11, 24, 0.98)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsCheckoutOpen(false)}
          aria-label="Close Checkout"
        >
          <X size={18} />
        </button>

        <div style={{ padding: '36px' }}>
          
          {/* Checkout Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '4px', background: 'var(--accent-copper-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#040711' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="couture-title" style={{ fontSize: '1.4rem' }}>Maison White-Glove Checkout</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>The Dior Art of Gifting &bull; Paris Atelier Fulfillment</p>
            </div>
          </div>

          {/* STEP 1: The Art of Gifting & 2x Complimentary Samples */}
          {step === 1 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                
                {/* Left: Art of Gifting Presentation Box */}
                <div style={{ background: 'rgba(11, 17, 34, 0.75)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <Gift size={20} color="var(--accent-copper-light)" />
                    <h4 className="couture-title" style={{ fontSize: '1rem' }}>The Art of Gifting</h4>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                    Each flacon is cradled in iconic midnight blue gift packaging, sealed with a gold-embossed ribbon.
                  </p>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '14px' }}>
                    <input
                      type="checkbox"
                      checked={isGiftBoxSelected}
                      onChange={(e) => setIsGiftBoxSelected(e.target.checked)}
                      style={{ accentColor: 'var(--accent-copper)', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                      Complimentary Dior Signature Gift Packaging
                    </span>
                  </label>

                  {isGiftBoxSelected && (
                    <div>
                      <label className="form-label">Personalized Calligraphy Card Message</label>
                      <textarea
                        rows={3}
                        placeholder="Write a personal note (e.g. 'To Alexandre, with timeless elegance...')"
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        className="form-textarea"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                  )}
                </div>

                {/* Right: 2 Complimentary Samples Selection */}
                <div style={{ background: 'rgba(11, 17, 34, 0.75)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Feather size={18} color="var(--accent-copper-light)" />
                      <h4 className="couture-title" style={{ fontSize: '1rem' }}>2 Deluxe Samples</h4>
                    </div>
                    <span className="badge badge-copper" style={{ fontSize: '0.68rem' }}>
                      {selectedSamples.length}/2 Selected
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Select 2 complimentary 2ml deluxe spray vials to accompany your parcel:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {COMPLIMENTARY_SAMPLES.map((sample) => {
                      const isSelected = selectedSamples.includes(sample.id);
                      return (
                        <div
                          key={sample.id}
                          onClick={() => toggleSample(sample.id)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-sm)',
                            background: isSelected ? 'rgba(226, 135, 67, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                            border: isSelected ? '1px solid var(--accent-copper)' : '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                              {sample.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--accent-copper-light)' }}>
                              {sample.concentration}
                            </div>
                          </div>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: isSelected ? 'none' : '1px solid var(--border-subtle)', background: isSelected ? 'var(--accent-copper)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#040711' }}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
                <button
                  className="btn btn-copper"
                  onClick={() => setStep(2)}
                  style={{ padding: '12px 30px', fontSize: '0.88rem' }}
                >
                  <span>Continue to Delivery &amp; Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery & Payment Details */}
          {step === 2 && (
            <form onSubmit={handleSubmitOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                
                {/* Delivery Form */}
                <div>
                  <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '14px' }}>1. Delivery Address</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="form-input" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="form-input" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} className="form-input" />
                    </div>
                  </div>
                </div>

                {/* Payment Simulation */}
                <div>
                  <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '14px' }}>2. Secure Payment</h4>

                  <div style={{ padding: '16px', background: 'rgba(11, 17, 34, 0.75)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <Lock size={15} color="#34d399" />
                      <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                        256-Bit Encrypted Transaction
                      </span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="form-input" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="form-group">
                        <label className="form-label">Expires</label>
                        <input type="text" name="cardExp" value={formData.cardExp} onChange={handleInputChange} className="form-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVC</label>
                        <input type="text" name="cardCvc" value={formData.cardCvc} onChange={handleInputChange} className="form-input" />
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Subtotal ({cart.length} flacons)</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {cartDiscountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--accent-copper-light)', marginBottom: '6px' }}>
                        <span>Privilege Discount</span>
                        <span>-${cartDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      <span>Climate Shipping</span>
                      <span>{cartShipping === 0 ? 'COMPLIMENTARY' : `$${cartShipping.toFixed(2)}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                      <span>Total</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                <button
                  type="button"
                  className="btn btn-dior-outline"
                  onClick={() => setStep(1)}
                  style={{ padding: '12px 24px', fontSize: '0.85rem' }}
                >
                  &larr; Back to Gifting
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-copper"
                  style={{ padding: '12px 34px', fontSize: '0.88rem' }}
                >
                  {isSubmitting ? 'Placing Order...' : `Confirm & Authorize $${cartTotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Success Confirmation */}
          {step === 3 && placedOrder && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 20px' }}>
                <CheckCircle2 size={36} />
              </div>

              <div className="couture-sub" style={{ color: 'var(--accent-copper-light)', marginBottom: '6px' }}>
                Votre Commande est Confirmée
              </div>
              <h2 className="couture-title" style={{ fontSize: '1.8rem', marginBottom: '12px' }}>
                Thank You, {formData.firstName}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto 24px' }}>
                Your Sauvage fragrance order has been transmitted to our Paris Atelier. Your parcel is being carefully prepared in our signature midnight blue gift presentation box.
              </p>

              {/* Order Tracking Card */}
              <div style={{ background: 'rgba(11, 17, 34, 0.85)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '20px', maxWidth: '500px', margin: '0 auto 30px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Order Number</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>{placedOrder.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tracking Code</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-copper-light)' }}>{placedOrder.trackingNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Complimentary Samples</span>
                  <span style={{ fontSize: '0.82rem', color: '#6ee7b7' }}>2x Deluxe Vials Included</span>
                </div>
              </div>

              <button
                className="btn btn-dior-solid"
                onClick={() => setIsCheckoutOpen(false)}
                style={{ padding: '12px 32px' }}
              >
                Return To Collection
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
