import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { COMPLIMENTARY_SAMPLES } from '../../data/initialProducts';
import { PAYMENT_METHODS, MAISON_BANK_DETAILS, initiatePayment } from '../../services/paymentService';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Gift, 
  Sparkles,
  CheckCircle2,
  Landmark
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

  // Form State (Auto-populated with authenticated user profile & default address)
  const [formData, setFormData] = useState(() => {
    const defAddr = (currentUser?.addresses && currentUser.addresses.length > 0)
      ? (currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0])
      : null;
    const parts = (defAddr?.recipientName || currentUser?.name || '').split(' ');
    const fullAddr = defAddr
      ? (defAddr.addressLine1 + (defAddr.addressLine2 ? `, ${defAddr.addressLine2}` : ''))
      : (currentUser?.address || '18 Jalan Sultan Ismail');

    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: currentUser?.email || '',
      phone: defAddr?.phone || currentUser?.phone || '+60 12-345 6789',
      address: fullAddr,
      city: defAddr?.city || currentUser?.city || 'Kuala Lumpur',
      postalCode: defAddr?.zip || currentUser?.zip || '50250',
      country: defAddr?.country || currentUser?.country || 'Malaysia',
      paymentMethod: currentUser?.paymentPreferences?.preferredMethod || 'fpx'
    };
  });

  useEffect(() => {
    if (currentUser) {
      const defAddr = (currentUser.addresses && currentUser.addresses.length > 0)
        ? (currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0])
        : null;
      const parts = (defAddr?.recipientName || currentUser.name || '').split(' ');
      const fullAddr = defAddr
        ? (defAddr.addressLine1 + (defAddr.addressLine2 ? `, ${defAddr.addressLine2}` : ''))
        : (currentUser.address || '');

      setFormData(prev => ({
        ...prev,
        firstName: parts[0] || prev.firstName,
        lastName: parts.slice(1).join(' ') || prev.lastName,
        email: currentUser.email || prev.email,
        phone: defAddr?.phone || currentUser.phone || prev.phone,
        address: fullAddr || prev.address,
        city: defAddr?.city || currentUser.city || prev.city,
        postalCode: defAddr?.zip || currentUser.zip || prev.postalCode,
        country: defAddr?.country || currentUser.country || 'Malaysia',
        paymentMethod: currentUser.paymentPreferences?.preferredMethod || prev.paymentMethod
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
    if (cart.length === 0) {
      showToast('Your bag is empty.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const chosenSamples = selectedSamples.map((id) => COMPLIMENTARY_SAMPLES.find((s) => s.id === id)?.name).filter(Boolean);
      const chosenGifting = {
        giftBox: isGiftBoxSelected,
        giftNote: isGiftBoxSelected ? giftNote.trim() : ''
      };

      const orderData = {
        customer: {
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          samples: chosenSamples,
          selectedSamples: chosenSamples,
          gifting: chosenGifting,
          isGiftBox: isGiftBoxSelected,
          giftNote: isGiftBoxSelected ? giftNote.trim() : ''
        },
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          sku: item.sku,
          size: item.selectedSize || '100 ml Bottle',
          engraving: item.engravingText || null,
          price: Number(item.price) || 150,
          quantity: Number(item.quantity) || 1,
          image: item.image || item.images?.[0]
        })),
        subtotal: cartSubtotal,
        discount: cartDiscountAmount,
        discountCode: appliedPromo?.code || null,
        shipping: cartShipping,
        total: cartTotal,
        paymentMethod: formData.paymentMethod,
        samples: chosenSamples,
        gifting: chosenGifting
      };

      const newOrder = await createOrder(orderData, formData.paymentMethod, { silent: true });
      
      if (!newOrder) {
        setIsSubmitting(false);
        return;
      }

      // Initialize payment gateway if applicable
      if (formData.paymentMethod === 'fpx') {
        const payResult = await initiatePayment({
          orderId: newOrder.id,
          amount: cartTotal,
          customer: orderData.customer,
          paymentMethod: 'fpx'
        });

        if (payResult && !payResult.success) {
          showToast(payResult.error || 'Payment initialization failed. Please try again.', 'error');
          setIsSubmitting(false);
          return;
        }

        if (payResult.redirectUrl) {
          window.location.href = payResult.redirectUrl;
          return;
        }
      }

      if (formData.paymentMethod === 'bank-transfer') {
        setPlacedOrder(newOrder);
        setStep(3);
        showToast('Order received! Please proceed with bank transfer.', 'success');
        return;
      }

      setPlacedOrder(newOrder);
      setStep(3);
      showToast('Order received! We are preparing your order.', 'success');

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

        {/* Modal Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#926917', fontWeight: 700 }}>
            Valenszo &bull; Checkout
          </span>
          <h3 className="couture-title" style={{ fontSize: '1.4rem', margin: '4px 0 0', color: '#000000', fontWeight: 800 }}>
            {step === 1 && 'Complimentary Samples & Gift Box'}
            {step === 2 && 'Delivery Details & Secure Payment'}
            {step === 3 && 'Order Confirmed'}
          </h3>
          
          {/* Stepper Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  width: '28px',
                  height: '3px',
                  background: step >= s ? '#000000' : '#e5e7eb',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: '28px' }}>

          {/* STEP 1: Gifting & Deluxe Samples */}
          {step === 1 && (
            <div>
              {/* Complimentary Samples */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={16} color="#926917" />
                  <h4 className="couture-sub" style={{ color: '#000000', margin: 0, fontWeight: 700 }}>
                    Select 2 Free Deluxe Samples
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 16px' }}>
                  Each Valenszo perfume order includes two free 2ml sample sprays of your choice.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {COMPLIMENTARY_SAMPLES.map((sample) => {
                    const isSelected = selectedSamples.includes(sample.id);
                    return (
                      <div
                        key={sample.id}
                        onClick={() => toggleSample(sample.id)}
                        style={{
                          padding: '14px',
                          border: isSelected ? '1.5px solid #000000' : '1px solid #e5e7eb',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          background: isSelected ? '#fafafa' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#000000' }}>{sample.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{sample.concentration}</div>
                        </div>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? 'none' : '1.5px solid #d1d5db',
                          background: isSelected ? '#000000' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}>
                          {isSelected && <Check size={11} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gift Presentation Box */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Gift size={16} color="#926917" />
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#000000' }}>
                        Signature Valenszo Gift Box
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
                      Hand-wrapped in black textured linen with gold foil embossing and grossgrain ribbon.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isGiftBoxSelected}
                    onChange={(e) => setIsGiftBoxSelected(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#000000' }}
                  />
                </div>

                {isGiftBoxSelected && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Personal Handwritten Gift Note (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter your personal message for the recipient..."
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      className="form-input"
                      style={{ width: '100%', fontSize: '0.85rem', padding: '10px', background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-dior-solid"
                  onClick={() => setStep(2)}
                  style={{ padding: '12px 32px', fontSize: '0.88rem', background: '#000000', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                >
                  Proceed to Delivery & Payment &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping & Realistic Payment Method */}
          {step === 2 && (
            <form onSubmit={handleSubmitOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                
                {/* Shipping Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h4 className="couture-sub" style={{ color: '#000000', margin: 0, fontWeight: 700 }}>1. Delivery Address</h4>
                    {currentUser && (
                      <a href="/account?tab=addresses" target="_blank" rel="noreferrer" style={{ fontSize: '0.74rem', color: '#b38e44', fontWeight: 600, textDecoration: 'none' }}>
                        Manage Addresses &rarr;
                      </a>
                    )}
                  </div>

                  {/* Saved Address Quick Selector */}
                  {currentUser?.addresses && currentUser.addresses.length > 0 && (
                    <div style={{ marginBottom: '14px', padding: '10px 12px', background: '#fafaf9', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                        📍 Select from Saved Addresses:
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {currentUser.addresses.map((addr) => {
                          const isSelected = formData.address.includes(addr.addressLine1);
                          return (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => {
                                const parts = (addr.recipientName || '').split(' ');
                                setFormData((prev) => ({
                                  ...prev,
                                  firstName: parts[0] || prev.firstName,
                                  lastName: parts.slice(1).join(' ') || prev.lastName,
                                  phone: addr.phone || prev.phone,
                                  address: addr.addressLine1 + (addr.addressLine2 ? `, ${addr.addressLine2}` : ''),
                                  city: addr.city || prev.city,
                                  postalCode: addr.zip || prev.postalCode
                                }));
                                showToast(`Using address: ${addr.label}`, 'info');
                              }}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '3px',
                                border: isSelected ? '1.5px solid #000000' : '1px solid #d1d5db',
                                background: isSelected ? '#ffffff' : '#f3f4f6',
                                color: isSelected ? '#000000' : '#4b5563',
                                fontSize: '0.74rem',
                                fontWeight: isSelected ? 700 : 500,
                                cursor: 'pointer'
                              }}
                            >
                              {addr.label} {addr.isDefault && '★'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

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
                    <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Email Address (for tracking)</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Phone (for express courier)</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Delivery Street Address</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>City</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#000000', fontWeight: 600 }}>Postcode</label>
                      <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} className="form-input" style={{ background: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                </div>

                {/* Realistic Payment Method Selector */}
                <div>
                  <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '14px', fontWeight: 700 }}>2. Payment Method</h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {PAYMENT_METHODS.map((pm) => {
                      const isSelected = formData.paymentMethod === pm.id;
                      return (
                        <div
                          key={pm.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '6px',
                            border: isSelected ? '1.5px solid #000000' : '1px solid #e5e7eb',
                            background: isSelected ? '#fafafa' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                border: isSelected ? '5px solid #000000' : '1.5px solid #d1d5db'
                              }} />
                              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#000000' }}>{pm.name}</span>
                            </div>
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#926917', background: '#fefce8', padding: '2px 8px', borderRadius: '4px' }}>
                              {pm.badge}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0 26px', lineHeight: 1.4 }}>
                            {pm.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div style={{ padding: '16px', background: '#f3f4f6', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4b5563', marginBottom: '6px' }}>
                      <span>Subtotal ({cart.length} {cart.length === 1 ? 'bottle' : 'bottles'})</span>
                      <span style={{ color: '#000000', fontWeight: 600 }}>RM {cartSubtotal.toFixed(2)}</span>
                    </div>
                    {cartDiscountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#926917', marginBottom: '6px' }}>
                        <span>Privilege Discount ({appliedPromo?.code})</span>
                        <span style={{ fontWeight: 700 }}>-RM {cartDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4b5563', marginBottom: '8px' }}>
                      <span>Express Shipping</span>
                      <span style={{ color: cartShipping === 0 ? '#059669' : '#000000', fontWeight: 600 }}>
                        {cartShipping === 0 ? 'COMPLIMENTARY' : `RM ${cartShipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#000000', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                      <span>Total</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>RM {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ padding: '12px 24px', fontSize: '0.85rem', background: '#ffffff', color: '#000000', border: '1px solid #000000', cursor: 'pointer', borderRadius: '4px' }}
                >
                  &larr; Back to Gifting
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '12px 34px', fontSize: '0.88rem', background: '#000000', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 700 }}
                >
                  {isSubmitting ? 'Securing Order...' : `Confirm & Pay RM ${cartTotal.toFixed(2)}`}
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
                Your Order is Confirmed
              </div>
              <h2 className="couture-title" style={{ fontSize: '1.8rem', color: '#000000', fontWeight: 800, marginBottom: '12px' }}>
                Thank You, {formData.firstName}
              </h2>
              <p style={{ color: '#4b5563', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto 24px' }}>
                Your Valenszo perfume order has been received. Your parcel is being carefully prepared in our signature gift box.
              </p>

              {/* Order Tracking Card */}
              <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '20px', maxWidth: '520px', margin: '0 auto 24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase' }}>Order Number</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#000000' }}>{placedOrder.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase' }}>Courier Tracking</span>
                  <span style={{ 
                    fontSize: '0.82rem', 
                    color: placedOrder.trackingNumber ? '#926917' : '#6b7280', 
                    fontWeight: placedOrder.trackingNumber ? 700 : 500, 
                    fontFamily: placedOrder.trackingNumber ? 'var(--font-mono)' : 'inherit',
                    fontStyle: placedOrder.trackingNumber ? 'normal' : 'italic'
                  }}>
                    {placedOrder.trackingNumber ? `${placedOrder.courierName ? placedOrder.courierName + ' - ' : ''}${placedOrder.trackingNumber}` : 'Issued upon dispatch'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase' }}>Payment Method</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#000000', textTransform: 'capitalize' }}>{placedOrder.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase' }}>Complimentary Samples</span>
                  <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>2x Deluxe Vials Included</span>
                </div>
              </div>

              {/* Bank Transfer Instructions if chosen */}
              {placedOrder.paymentMethod === 'bank-transfer' && (
                <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '6px', padding: '18px', maxWidth: '520px', margin: '0 auto 28px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#854d0e', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Landmark size={18} />
                    <span>Valenszo Bank Transfer Details</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#713f12', lineHeight: 1.6 }}>
                    <div><strong>Bank:</strong> {MAISON_BANK_DETAILS.bankName}</div>
                    <div><strong>Account Name:</strong> {MAISON_BANK_DETAILS.accountName}</div>
                    <div><strong>Account Number:</strong> {MAISON_BANK_DETAILS.accountNumber}</div>
                    <div><strong>DuitNow Business ID:</strong> {MAISON_BANK_DETAILS.duitNowId}</div>
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: '#fffbeb', borderRadius: '4px', border: '1px dashed #fde047' }}>
                      <strong>Payment Reference:</strong> <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{placedOrder.id}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsCheckoutOpen(false)}
                style={{ padding: '12px 32px', background: '#000000', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 700 }}
              >
                Return To Collection
              </button>
            </div>
          )}

        </div>

        {/* Security Footer */}
        <div style={{
          background: '#f9fafb',
          borderTop: '1px solid #f3f4f6',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          color: '#6b7280'
        }}>
          <ShieldCheck size={14} color="#16a34a" />
          <span>256-Bit SSL Encrypted &bull; Official Malaysian Gateway &bull; Valenszo Authenticity Guaranteed</span>
        </div>
      </div>
    </div>
  );
};
