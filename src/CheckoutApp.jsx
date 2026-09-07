import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BrandValuesFooter } from './components/common/BrandValuesFooter';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthModal } from './components/common/AuthModal';
import { COMPLIMENTARY_SAMPLES } from './data/initialProducts';
import { PAYMENT_METHODS, MAISON_BANK_DETAILS, initiatePayment } from './services/paymentService';
import { 
  Check, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Gift, 
  Feather, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Landmark
} from 'lucide-react';

// Styles
import './index.css';
import './styles/components.css';
import './styles/customer.css';
import './styles/pdp.css';
import './styles/admin.css';

const CheckoutPageLayout = () => {
  const {
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

  const [step, setStep] = useState(1);
  const [selectedSamples, setSelectedSamples] = useState(['smp-1', 'smp-2']);
  const [isGiftBoxSelected, setIsGiftBoxSelected] = useState(true);
  const [giftNote, setGiftNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

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
      const order = await createOrder(orderData);

      // Initialize payment gateway if configured
      const payResult = await initiatePayment({
        orderId: order.id,
        amount: cartTotal,
        customer: orderData.customer,
        paymentMethod: formData.paymentMethod
      });

      if (payResult.redirectUrl) {
        window.location.href = payResult.redirectUrl;
        return;
      }

      setPlacedOrder(order);
      setStep(3);
      showToast('Order confirmed! An invitation & tracking details have been generated.', 'success');
    } catch (err) {
      console.error('Order creation error:', err);
      showToast('There was an issue finalizing your order. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !placedOrder) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '440px' }}>
            <ShoppingBag size={48} style={{ color: '#d1d5db', margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
              Your Shopping Bag is Empty
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: 1.6 }}>
              Select a signature extrait de parfum from the boutique to proceed to white-glove checkout.
            </p>
            <a
              href="/"
              className="dior-btn"
              style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '14px 28px', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              Discover Fragrances
            </a>
          </div>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', color: '#111827' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#d97706', fontWeight: 700 }}>
              Maison Valenszo Haute Parfumerie
            </span>
            <h1 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '2.4rem', marginTop: '0.4rem', fontWeight: 800 }}>
              {step === 1 && 'The Art of Gifting & Samples'}
              {step === 2 && 'Delivery Details & Secure Payment'}
              {step === 3 && 'Order Confirmed'}
            </h1>
            
            {/* Step Indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: step === 1 ? 800 : 500, color: step === 1 ? '#000' : '#9ca3af', borderBottom: step === 1 ? '2px solid #000' : 'none', paddingBottom: '4px' }}>
                1. Gifting & Samples
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: step === 2 ? 800 : 500, color: step === 2 ? '#000' : '#9ca3af', borderBottom: step === 2 ? '2px solid #000' : 'none', paddingBottom: '4px' }}>
                2. Delivery & Payment
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: step === 3 ? 800 : 500, color: step === 3 ? '#000' : '#9ca3af', borderBottom: step === 3 ? '2px solid #000' : 'none', paddingBottom: '4px' }}>
                3. Confirmation
              </span>
            </div>
          </div>

          {/* STEP 1: GIFTING & SAMPLES */}
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'start' }}>
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
                  className="dior-btn"
                  onClick={() => setStep(2)}
                  style={{ marginTop: '2rem', width: '100%', background: '#000', color: '#fff', padding: '15px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  Continue to Delivery & Payment
                </button>
              </div>

              {/* Order Summary Sidebar */}
              <div style={{ background: '#faf9f6', border: '1px solid #ebd9c8', borderRadius: '8px', padding: '1.5rem' }}>
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
            <form onSubmit={handleSubmitOrder} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'start' }}>
              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem', padding: 0 }}
                >
                  <ArrowLeft size={14} /> Back to Gifting Options
                </button>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Delivery Address (Malaysia & International)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Street Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
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
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          cursor: 'pointer',
                          background: isSelected ? '#faf9f6' : '#ffffff'
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
                  className="dior-btn"
                  style={{ width: '100%', background: '#000', color: '#fff', padding: '16px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting ? 'Securing Atelier Order...' : `Authorize & Place Order — RM${cartTotal.toFixed(2)}`}
                </button>
              </div>

              {/* Order Summary */}
              <div style={{ background: '#faf9f6', border: '1px solid #ebd9c8', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid #ebd9c8', paddingBottom: '0.5rem' }}>
                  Order Total
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Creations Subtotal</span>
                  <span>RM{cartSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Complimentary Samples</span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>2x Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Shipping</span>
                  <span>{cartShipping === 0 ? 'FREE' : `RM${cartShipping.toFixed(2)}`}</span>
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
              
              <div style={{ background: '#faf9f6', padding: '1.25rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #f0ede6', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong>Order Reference:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{placedOrder.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong>Tracking Number:</strong> <span style={{ fontFamily: 'var(--font-mono)', color: '#926917' }}>{placedOrder.trackingNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Payment Method:</strong> <span style={{ textTransform: 'capitalize' }}>{placedOrder.paymentMethod}</span>
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
                className="dior-btn"
                style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '14px 28px', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                Return to Boutique Storefront
              </a>
            </div>
          )}

        </div>
      </main>

      <BrandValuesFooter />

      <Footer />

      <MobileBottomNav />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function CheckoutApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <CheckoutPageLayout />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
