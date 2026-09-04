import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
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

  const { currentUser } = useAuth();

  const [step, setStep] = useState(1); // 1: Gifting & Samples, 2: Shipping & Payment, 3: Success Confirmation
  const [selectedSamples, setSelectedSamples] = useState(['smp-1', 'smp-2']);
  const [isGiftBoxSelected, setIsGiftBoxSelected] = useState(true);
  const [giftNote, setGiftNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Form State (Auto-populated with authenticated user profile)
  const [formData, setFormData] = useState(() => {
    const parts = (currentUser?.name || '').split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '+60 12-345 6789',
      address: currentUser?.address || '18 Jalan Sultan Ismail',
      city: currentUser?.city || 'Kuala Lumpur',
      postalCode: currentUser?.zip || '50250',
      country: 'Malaysia',
      paymentMethod: 'credit-card',
      cardNumber: '•••• •••• •••• 4242',
      cardExp: '12/28',
      cardCvc: '•••'
    };
  });

  useEffect(() => {
    if (currentUser) {
      const parts = (currentUser.name || '').split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: parts[0] || prev.firstName,
        lastName: parts.slice(1).join(' ') || prev.lastName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city,
        postalCode: currentUser.zip || prev.postalCode,
        country: currentUser.country || 'Malaysia'
      }));
    }
  }, [currentUser]);

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
        style={{
          background: '#ffffff',
          color: '#000000',
          border: '1px solid #e5e7eb',
          maxHeight: '90vh',
          maxHeight: '90dvh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          margin: 'auto'
        }}
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
            <div style={{ width: '42px', height: '42px', borderRadius: '4px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="couture-title" style={{ fontSize: '1.3rem', color: '#000000', fontWeight: 800 }}>Maison White-Glove Checkout</h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>The Valenszo Art of Gifting &bull; Atelier Fulfillment</p>
            </div>
          </div>

          {/* STEP 1: The Art of Gifting & 2x Complimentary Samples */}
          {step === 1 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                
                {/* Left: Art of Gifting Presentation Box */}
                <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <Gift size={20} color="#926917" />
                    <h4 className="couture-title" style={{ fontSize: '1rem', color: '#000000', fontWeight: 700 }}>The Art of Gifting</h4>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '16px' }}>
                    Each flacon is cradled in iconic Valenszo gift packaging, sealed with a gold-embossed ribbon.
                  </p>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '14px' }}>
                    <input
                      type="checkbox"
                      checked={isGiftBoxSelected}
                      onChange={(e) => setIsGiftBoxSelected(e.target.checked)}
                      style={{ accentColor: '#000000', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#000000' }}>
                      Complimentary Valenszo Signature Gift Packaging
                    </span>
                  </label>

                  {isGiftBoxSelected && (
                    <div>
                      <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Personalized Calligraphy Card Message</label>
                      <textarea
                        rows={3}
                        placeholder="Write a personal note (e.g. 'To Alexandre, with timeless elegance...')"
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        className="form-textarea"
                        style={{ fontSize: '0.85rem', background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }}
                      />
                    </div>
                  )}
                </div>

                {/* Right: 2 Complimentary Samples Selection */}
                <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Feather size={18} color="#926917" />
                      <h4 className="couture-title" style={{ fontSize: '1rem', color: '#000000', fontWeight: 700 }}>2 Deluxe Samples</h4>
                    </div>
                    <span style={{ background: '#000000', color: '#ffffff', padding: '3px 8px', borderRadius: '2px', fontSize: '0.68rem', fontWeight: 700 }}>
                      {selectedSamples.length}/2 Selected
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#4b5563', marginBottom: '14px' }}>
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
                            borderRadius: '4px',
                            background: isSelected ? '#fdf8eb' : '#ffffff',
                            border: isSelected ? '1px solid #c5a059' : '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000000' }}>
                              {sample.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#926917', fontWeight: 600 }}>
                              {sample.concentration}
                            </div>
                          </div>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: isSelected ? 'none' : '1px solid #d1d5db', background: isSelected ? '#000000' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
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
                  className="btn btn-dior-solid"
                  onClick={() => setStep(2)}
                  style={{ padding: '12px 30px', fontSize: '0.88rem', background: '#000000', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
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
                  <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '14px', fontWeight: 700 }}>1. Delivery Address</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>First Name</label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Last Name</label>
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Address</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>City</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Postal Code</label>
                      <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                </div>

                {/* Payment Simulation */}
                <div>
                  <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '14px', fontWeight: 700 }}>2. Secure Payment</h4>

                  <div style={{ padding: '16px', background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '4px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <Lock size={15} color="#059669" />
                      <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
                        256-Bit Encrypted Transaction
                      </span>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Card Number</label>
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Expires</label>
                        <input type="text" name="cardExp" value={formData.cardExp} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>CVC</label>
                        <input type="text" name="cardCvc" value={formData.cardCvc} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ padding: '16px', background: '#f3f4f6', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4b5563', marginBottom: '6px' }}>
                      <span>Subtotal ({cart.length} flacons)</span>
                      <span style={{ color: '#000000', fontWeight: 600 }}>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {cartDiscountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#926917', marginBottom: '6px' }}>
                        <span>Privilege Discount</span>
                        <span style={{ fontWeight: 700 }}>-${cartDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4b5563', marginBottom: '8px' }}>
                      <span>Climate Shipping</span>
                      <span style={{ color: cartShipping === 0 ? '#059669' : '#000000', fontWeight: 600 }}>
                        {cartShipping === 0 ? 'COMPLIMENTARY' : `$${cartShipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#000000', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
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
                  style={{ padding: '12px 24px', fontSize: '0.85rem', background: '#ffffff', color: '#000000', border: '1px solid #000000', cursor: 'pointer' }}
                >
                  &larr; Back to Gifting
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-dior-solid"
                  style={{ padding: '12px 34px', fontSize: '0.88rem', background: '#000000', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Placing Order...' : `Confirm & Authorize $${cartTotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Success Confirmation */}
          {step === 3 && placedOrder && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', margin: '0 auto 20px' }}>
                <CheckCircle2 size={36} />
              </div>

              <div className="couture-sub" style={{ color: '#926917', marginBottom: '6px', fontWeight: 600 }}>
                Votre Commande est Confirmée
              </div>
              <h2 className="couture-title" style={{ fontSize: '1.8rem', color: '#000000', fontWeight: 800, marginBottom: '12px' }}>
                Thank You, {formData.firstName}
              </h2>
              <p style={{ color: '#4b5563', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto 24px' }}>
                Your Valenszo fragrance order has been transmitted to our Atelier. Your parcel is being carefully prepared in our signature luxury gift presentation box.
              </p>

              {/* Order Tracking Card */}
              <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '20px', maxWidth: '500px', margin: '0 auto 30px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase' }}>Order Number</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#000000' }}>{placedOrder.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase' }}>Tracking Code</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#926917' }}>{placedOrder.trackingNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase' }}>Complimentary Samples</span>
                  <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>2x Deluxe Vials Included</span>
                </div>
              </div>

              <button
                className="btn btn-dior-solid"
                onClick={() => setIsCheckoutOpen(false)}
                style={{ padding: '12px 32px', background: '#000000', color: '#ffffff', border: 'none', cursor: 'pointer' }}
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
