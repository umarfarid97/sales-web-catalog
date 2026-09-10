import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrandValuesFooter } from './components/common/BrandValuesFooter';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthModal } from './components/common/AuthModal';
import { COMPLIMENTARY_SAMPLES } from './data/initialProducts';
import { PAYMENT_METHODS, MAISON_BANK_DETAILS, initiatePayment, parseToyyibPayStatus } from './services/paymentService';
import { 
  Check, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ShoppingBag, 
  Landmark,
  AlertCircle
} from 'lucide-react';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/pdp.css';
import './styles/admin.css';

export const CheckoutPageContent = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscountAmount,
    cartShipping,
    cartTotal,
    appliedPromo,
    createOrder,
    confirmOrderPayment,
    cancelOrderAndRestoreStock,
    showToast
  } = useStore();

  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedSamples, setSelectedSamples] = useState(['smp-1', 'smp-2']);
  const [isGiftBoxSelected, setIsGiftBoxSelected] = useState(true);
  const [giftNote, setGiftNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStateText, setSubmitStateText] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [paymentNotice, setPaymentNotice] = useState(null);

  // Synchronize return redirect from ToyyibPay FPX gateway
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const statusResult = parseToyyibPayStatus(window.location.search);
    const orderId = statusResult.orderId;

    if (!orderId) return;

    if (statusResult.isSuccess) {
      // --- SCENARIO A: PAYMENT CONFIRMED ---
      confirmOrderPayment(orderId, {
        billCode: statusResult.billCode,
        transactionId: statusResult.transactionId
      });

      const savedOrders = JSON.parse(localStorage.getItem('valenszo_real_orders') || '[]');
      const matchedOrder = savedOrders.find((o) => o.id === orderId) || {
        id: orderId,
        trackingNumber: '',
        courierName: '',
        paymentMethod: 'fpx',
        paymentStatus: 'Paid',
        billCode: statusResult.billCode
      };

      matchedOrder.paymentStatus = 'Paid';
      matchedOrder.billCode = statusResult.billCode;
      setPlacedOrder(matchedOrder);
      setStep(3);
      setPaymentNotice({
        type: 'success',
        title: 'Payment Verified via ToyyibPay FPX',
        message: `Your payment has been approved and confirmed. Reference Bill Code: ${statusResult.billCode || 'Confirmed'}.`
      });
      showToast('Payment verified successfully! Your atelier order is confirmed.', 'success');
    } else if (statusResult.isFailed) {
      // --- SCENARIO B: PAYMENT CANCELLED OR DECLINED AT BANK ---
      cancelOrderAndRestoreStock(orderId);
      setStep(2); // Keep customer on Checkout Step 2 so they don't see "Order Confirmed"
      setPaymentNotice({
        type: 'error',
        title: 'Payment Cancelled or Declined',
        message: 'Your payment was not completed at ToyyibPay. Your items and gift preferences have been preserved in your bag. You may select another bank or try another payment method below.'
      });
      showToast('Payment was not completed. Your items remain saved in your bag.', 'warning');
    } else if (statusResult.isPending) {
      // --- SCENARIO C: PENDING CLEARING ---
      const savedOrders = JSON.parse(localStorage.getItem('valenszo_real_orders') || '[]');
      const matchedOrder = savedOrders.find((o) => o.id === orderId) || {
        id: orderId,
        paymentMethod: 'fpx',
        paymentStatus: 'Pending Verification',
        billCode: statusResult.billCode
      };
      setPlacedOrder(matchedOrder);
      setStep(3);
      setPaymentNotice({
        type: 'warning',
        title: 'Payment Pending Clearing',
        message: 'Your payment is currently clearing with your bank. We will update your order status as soon as ToyyibPay confirms receipt.'
      });
    }
  }, []);


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
      paymentMethod: 'fpx'
    };
  });

  const toggleSample = (sampleId) => {
    if (selectedSamples.includes(sampleId)) {
      setSelectedSamples(selectedSamples.filter((id) => id !== sampleId));
    } else {
      if (selectedSamples.length >= 2) {
        setSelectedSamples([selectedSamples[1], sampleId]);
      } else {
        setSelectedSamples([...selectedSamples, sampleId]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setSubmitStateText(
      formData.paymentMethod === 'fpx' 
        ? 'Connecting to ToyyibPay Secure FPX...' 
        : 'Securing Atelier Order...'
    );

    const orderData = {
      customer: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.country}`,
        paymentMethod: formData.paymentMethod
      },
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        size: item.selectedSize || '100 ml Grand Flacon',
        engraving: item.engravingText || null,
        price: Number(item.price) || 150,
        quantity: Number(item.quantity) || 1,
        image: item.image || item.images?.[0]
      })),
      subtotal: cartSubtotal,
      discount: cartDiscountAmount,
      shipping: cartShipping,
      total: cartTotal,
      discountCode: appliedPromo?.code || null,
      paymentMethod: formData.paymentMethod,
      gifting: {
        giftBox: isGiftBoxSelected,
        giftNote: giftNote
      },
      samples: selectedSamples.map((id) => COMPLIMENTARY_SAMPLES.find((s) => s.id === id)?.name).filter(Boolean)
    };

    try {
      // Create draft order (silent: true prevents premature "Order Confirmed" toast before gateway redirect)
      const order = await createOrder(orderData, formData.paymentMethod, { silent: true });

      if (!order) {
        setIsSubmitting(false);
        return;
      }

      // 1. FPX Online Banking via ToyyibPay
      if (formData.paymentMethod === 'fpx') {
        const payResult = await initiatePayment({
          orderId: order.id,
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
          // Seamless redirect to ToyyibPay without premature success toast
          window.location.href = payResult.redirectUrl;
          return;
        }
      }

      // 2. Direct Bank Transfer / Concierge Pay
      if (formData.paymentMethod === 'bank-transfer') {
        setPlacedOrder(order);
        setStep(3);
        showToast('Order received with Maison Concierge! Please proceed with bank transfer.', 'success');
        return;
      }

      // 3. Fallback
      setPlacedOrder(order);
      setStep(3);
      showToast('Order received with Maison Atelier.', 'success');
    } catch (err) {
      console.error('Order creation error:', err);
      showToast('There was an issue finalizing your order. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (cart.length === 0 && !placedOrder) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem', background: '#faf8f5' }}>
        <div style={{ textAlign: 'center', maxWidth: '460px', width: '100%', background: '#ffffff', padding: 'clamp(2rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2rem)', borderRadius: '20px', border: '1px solid #ede8e1', boxShadow: '0 8px 32px rgba(44, 26, 17, 0.06)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f5efe6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#2b1810' }}>
            <ShoppingBag size={30} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: 'clamp(1.5rem, 3vw, 1.85rem)', fontWeight: 800, color: '#2b1810', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Your Shopping Bag is Empty
          </h2>
          <p style={{ color: '#786558', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
            Select a signature extrait de parfum from our atelier to proceed to white-glove checkout.
          </p>
          <a
            href="/collection"
            className="btn-pill btn-pill-espresso"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 32px', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem', width: '100%' }}
          >
            <span>Discover Fragrances</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, padding: 'clamp(1.5rem, 3.5vw, 3rem) 0 clamp(3rem, 6vw, 5rem)', background: '#faf8f5', color: '#2b1810' }}>
      <div className="container checkout-container" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 clamp(12px, 3vw, 24px)' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#d97706', fontWeight: 800, background: '#fbf3e6', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #f3d99d' }}>
            Maison Valenszo Haute Parfumerie
          </span>
          <h1 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', marginTop: '0.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#231710' }}>
            {step === 1 && 'The Art of Gifting & Samples'}
            {step === 2 && 'Delivery Details & Secure Payment'}
            {step === 3 && 'Order Confirmed'}
          </h1>
          
          {/* Step Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(0.75rem, 3vw, 1.75rem)', marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: step === 1 ? 800 : 500, color: step === 1 ? '#231710' : '#8c7d72', borderBottom: step === 1 ? '2.5px solid #231710' : '2px solid transparent', paddingBottom: '4px', transition: 'all 0.2s ease' }}>
              1. Gifting & Samples
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: step === 2 ? 800 : 500, color: step === 2 ? '#231710' : '#8c7d72', borderBottom: step === 2 ? '2.5px solid #231710' : '2px solid transparent', paddingBottom: '4px', transition: 'all 0.2s ease' }}>
              2. Delivery & Payment
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: step === 3 ? 800 : 500, color: step === 3 ? '#231710' : '#8c7d72', borderBottom: step === 3 ? '2.5px solid #231710' : '2px solid transparent', paddingBottom: '4px', transition: 'all 0.2s ease' }}>
              3. Confirmation
            </span>
          </div>
        </div>

        {/* STEP 1: GIFTING & SAMPLES */}
        {step === 1 && (
          <div className="checkout-step-grid">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Complimentary Atelier Discovery Sprays
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Select up to 2 complimentary 2ml deluxe extrait vials with your order.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                  {COMPLIMENTARY_SAMPLES.map((sample) => {
                    const isSelected = selectedSamples.includes(sample.id);
                    return (
                      <div
                        key={sample.id}
                        onClick={() => toggleSample(sample.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 18px',
                          border: isSelected ? '1.5px solid #000' : '1px solid #e5e7eb',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          background: isSelected ? '#faf9f6' : '#fff',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sample.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{sample.concentration}</div>
                        </div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: isSelected ? 'none' : '1.5px solid #d1d5db', background: isSelected ? '#000' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  The Maison Valenszo Gift Experience
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  All orders arrive in our signature midnight packaging with ribbon and wax seal.
                </p>

                <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '1.25rem', background: '#faf9f6' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={isGiftBoxSelected}
                      onChange={(e) => setIsGiftBoxSelected(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Include Personalized Hand-Written Card
                  </label>

                  {isGiftBoxSelected && (
                    <div style={{ marginTop: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                        Your Message (up to 200 characters):
                      </label>
                      <textarea
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="Wishing you unforgettable olfactory memories..."
                        rows={3}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-pill btn-pill-espresso"
                  style={{
                    marginTop: '2rem',
                    width: '100%',
                    padding: '15px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(35, 23, 16, 0.2)'
                  }}
                >
                  <span>Continue to Delivery & Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Order Summary Sidebar */}
              <div className="checkout-summary-sidebar" style={{ background: '#faf9f6', border: '1px solid #ebd9c8', borderRadius: '16px', padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid #ebd9c8', paddingBottom: '0.5rem' }}>
                  Order Summary ({cart.length} creations)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>Qty: {item.quantity} · {item.selectedSize}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>RM{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #ebd9c8', paddingTop: '1rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span>RM{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>White-Glove Shipping</span>
                    <span>{cartShipping === 0 ? 'COMPLIMENTARY' : `RM${cartShipping.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, borderTop: '1px solid #ebd9c8', paddingTop: '8px' }}>
                    <span>Total</span>
                    <span>RM{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY & REALISTIC PAYMENT FORM */}
          {step === 2 && (
            <form onSubmit={handleSubmitOrder} className="checkout-step-grid">
              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem', padding: 0 }}
                >
                  <ArrowLeft size={14} /> Back to Gifting Options
                </button>
                {paymentNotice && paymentNotice.type === 'error' && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1.5px solid #fca5a5',
                    color: '#991b1b',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '1.75rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#dc2626' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
                        {paymentNotice.title}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0, lineHeight: 1.5 }}>
                        {paymentNotice.message}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPaymentNotice(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', fontSize: '1.2rem', padding: 0, lineHeight: 1 }}
                      aria-label="Dismiss notice"
                    >
                      ×
                    </button>
                  </div>
                )}

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Delivery Address (Malaysia & International)
                </h3>

                <div className="checkout-fields-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#4b5563' }}>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#4b5563' }}>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }} />
                  </div>
                </div>

                <div className="checkout-fields-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#4b5563' }}>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#4b5563' }}>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#4b5563' }}>Street Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }} />
                </div>

                <div className="checkout-fields-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#4b5563' }}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#4b5563' }}>Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Secure Payment Method
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = formData.paymentMethod === pm.id;
                    return (
                      <label
                        key={pm.id}
                        style={{
                          padding: '14px 16px',
                          border: isSelected ? '1.5px solid #000' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          cursor: 'pointer',
                          background: isSelected ? '#faf9f6' : '#ffffff',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.id}
                          checked={isSelected}
                          onChange={handleInputChange}
                          style={{ marginTop: '3px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{pm.name}</span>
                            <span style={{ fontSize: '0.7rem', color: '#926917', background: '#fefce8', padding: '2px 8px', borderRadius: '4px' }}>{pm.badge}</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '4px 0 0' }}>{pm.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pill btn-pill-espresso"
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 24px rgba(35, 23, 16, 0.2)'
                  }}
                >
                  {isSubmitting ? (submitStateText || 'Securing Atelier Order...') : `Authorize & Place Order — RM${cartTotal.toFixed(2)}`}
                </button>

              </div>

              {/* Order Summary */}
              <div className="checkout-summary-sidebar" style={{ background: '#faf9f6', border: '1px solid #ebd9c8', borderRadius: '16px', padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid #ebd9c8', paddingBottom: '0.5rem' }}>
                  Order Total
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>Creations Subtotal</span>
                  <span style={{ fontWeight: 600 }}>RM{cartSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>Complimentary Samples</span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>2x Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: 600 }}>{cartShipping === 0 ? 'FREE' : `RM${cartShipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, borderTop: '1px solid #ebd9c8', paddingTop: '10px', marginTop: '10px' }}>
                  <span>Total Due</span>
                  <span>RM{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER CONFIRMED */}
          {step === 3 && placedOrder && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '3rem 2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                Order Confirmed
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Thank you for your patronage. Your atelier creation has entered bespoke cold-maceration inspection.
              </p>
              
              {paymentNotice && (
                <div style={{
                  background: paymentNotice.type === 'success' ? '#ecfdf5' : '#fef2f2',
                  border: `1px solid ${paymentNotice.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                  color: paymentNotice.type === 'success' ? '#065f46' : '#991b1b',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  marginBottom: '1.5rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  {paymentNotice.message}
                </div>
              )}

              <div style={{ background: '#faf9f6', padding: '1.25rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #f0ede6', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong>Order Reference:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{placedOrder.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong>Courier Tracking:</strong> 
                  <span style={{ 
                    fontSize: '0.82rem', 
                    color: placedOrder.trackingNumber ? '#926917' : '#6b7280', 
                    fontFamily: placedOrder.trackingNumber ? 'var(--font-mono)' : 'inherit', 
                    fontWeight: placedOrder.trackingNumber ? 700 : 500,
                    fontStyle: placedOrder.trackingNumber ? 'normal' : 'italic'
                  }}>
                    {placedOrder.trackingNumber ? `${placedOrder.courierName ? placedOrder.courierName + ' - ' : ''}${placedOrder.trackingNumber}` : 'Pending Dispatch'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong>Payment Method:</strong> <span style={{ textTransform: 'capitalize' }}>{placedOrder.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: placedOrder.billCode ? '6px' : '0' }}>
                  <strong>Payment Status:</strong> 
                  <span style={{ 
                    fontWeight: 700, 
                    color: placedOrder.paymentStatus === 'Paid' ? '#059669' : '#b45309' 
                  }}>
                    {placedOrder.paymentStatus || 'Confirmed'}
                  </span>
                </div>
                {placedOrder.billCode && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong>ToyyibPay Bill Code:</strong> <span style={{ fontFamily: 'var(--font-mono)', color: '#1e40af' }}>{placedOrder.billCode}</span>
                  </div>
                )}
                <div style={{ fontSize: '0.78rem', color: '#6b7280', fontStyle: 'italic', marginTop: '8px', borderTop: '1px dashed #e5e7eb', paddingTop: '8px' }}>
                  * Official courier tracking number will be assigned by our fulfillment team upon parcel dispatch.
                </div>
              </div>

              {placedOrder.paymentMethod === 'bank-transfer' && (
                <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '6px', padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#854d0e', fontWeight: 700 }}>
                    <Landmark size={18} />
                    <span>Maison Valenszo Bank Transfer Information</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#713f12', lineHeight: 1.6 }}>
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

              <a
                href="/"
                className="btn-pill btn-pill-espresso"
                style={{ display: 'inline-block', padding: '14px 28px', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.04em' }}
              >
                Return to Boutique Storefront
              </a>
            </div>
          )}

        </div>

        {/* Responsive layout overrides for Mobile & Tablet */}
        <style>{`
          .checkout-step-grid {
            display: grid;
            grid-template-columns: 1.25fr 0.75fr;
            gap: 2.5rem;
            align-items: start;
          }
          @media (max-width: 900px) {
            .checkout-step-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            .checkout-summary-sidebar {
              order: -1;
              margin-bottom: 0.5rem;
            }
          }
          @media (max-width: 600px) {
            .checkout-fields-row {
              grid-template-columns: 1fr !important;
              gap: 0.85rem !important;
            }
          }
        `}</style>
      </main>
  );
};

export default function CheckoutApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf8f5' }}>
            <Navbar />
            <CheckoutPageContent />
            <BrandValuesFooter />
            <Footer />
            <AuthModal />
            <ToastContainer />
          </div>
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
