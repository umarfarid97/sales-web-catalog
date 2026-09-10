import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Truck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Copy, 
  Check, 
  Gift, 
  Feather,
  Edit3,
  Send,
  AlertCircle
} from 'lucide-react';

const POPULAR_COURIERS = [
  'J&T Express',
  'Ninja Van',
  'Pos Laju',
  'DHL eCommerce',
  'SPX Express',
  'Flash Express',
  'Lalamove (Same-Day)',
  'GrabExpress',
  'Other'
];

export const OrderDetailModal = () => {
  const { 
    viewingOrder, 
    setViewingOrder, 
    updateOrderStatus, 
    dispatchOrder, 
    updateOrderTracking, 
    showToast 
  } = useStore();

  const [copied, setCopied] = useState(false);
  const [isDispatchFormOpen, setIsDispatchFormOpen] = useState(false);
  const [courierName, setCourierName] = useState('J&T Express');
  const [customCourier, setCustomCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [dispatchError, setDispatchError] = useState('');

  // Sync state whenever viewingOrder changes
  useEffect(() => {
    if (viewingOrder) {
      setTrackingNumber(viewingOrder.trackingNumber || '');
      const currentCourier = viewingOrder.courierName || '';
      if (POPULAR_COURIERS.includes(currentCourier)) {
        setCourierName(currentCourier);
        setCustomCourier('');
      } else if (currentCourier) {
        setCourierName('Other');
        setCustomCourier(currentCourier);
      } else {
        setCourierName('J&T Express');
        setCustomCourier('');
      }
      setIsDispatchFormOpen(false);
      setDispatchError('');
    }
  }, [viewingOrder]);

  if (!viewingOrder) return null;

  const order = viewingOrder;

  const copyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      showToast('Tracking number copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
    setViewingOrder({ ...order, status: newStatus });
  };

  const getEffectiveCourier = () => {
    if (courierName === 'Other') {
      return customCourier.trim() || 'Courier Express';
    }
    return courierName;
  };

  const handleConfirmDispatch = async (e) => {
    e?.preventDefault();
    if (!trackingNumber.trim()) {
      setDispatchError('Please enter the courier tracking number.');
      return;
    }
    setDispatchError('');
    const effectiveCourier = getEffectiveCourier();
    const cleanTracking = trackingNumber.trim();
    const dispatchedAt = new Date().toISOString();

    await dispatchOrder(order.id, {
      trackingNumber: cleanTracking,
      courierName: effectiveCourier
    });

    setViewingOrder({
      ...order,
      status: 'Shipped',
      trackingNumber: cleanTracking,
      courierName: effectiveCourier,
      dispatchedAt
    });

    setIsDispatchFormOpen(false);
  };

  const handleSaveTrackingEdit = async (e) => {
    e?.preventDefault();
    if (!trackingNumber.trim()) {
      setDispatchError('Tracking number cannot be blank.');
      return;
    }
    setDispatchError('');
    const effectiveCourier = getEffectiveCourier();
    const cleanTracking = trackingNumber.trim();

    await updateOrderTracking(order.id, {
      trackingNumber: cleanTracking,
      courierName: effectiveCourier
    });

    setViewingOrder({
      ...order,
      trackingNumber: cleanTracking,
      courierName: effectiveCourier
    });

    setIsDispatchFormOpen(false);
  };

  const isShippedOrDelivered = order.status === 'Shipped' || order.status === 'Delivered';

  return (
    <div 
      className="modal-overlay"
      onClick={() => setViewingOrder(null)}
    >
      <div 
        className="modal-content modal-content-lg admin-modal-light"
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#ffffff', color: '#0b0c10', border: '1px solid #e5e7eb', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.2)' }}
      >
        <button
          className="modal-close-btn"
          onClick={() => setViewingOrder(null)}
          aria-label="Close Order Details"
        >
          <X size={18} />
        </button>

        <div style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h3 className="font-serif-title" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800, color: '#0b0c10' }}>
                  Order {order.id}
                </h3>
                <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '4px' }}>
                Placed on {new Date(order.placedAt).toLocaleString()}
              </p>
            </div>

            {/* Quick Status Workflow Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: 'auto' }}>
              {order.status === 'Pending' && (
                <>
                  <button 
                    className="admin-btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    onClick={() => handleStatusChange('Processing')}
                  >
                    Start Packing Order
                  </button>
                  <button 
                    className="admin-btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    onClick={() => setIsDispatchFormOpen(true)}
                  >
                    <Truck size={14} />
                    <span>Dispatch Courier...</span>
                  </button>
                </>
              )}
              {order.status === 'Processing' && (
                <button 
                  className="admin-btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => setIsDispatchFormOpen(true)}
                >
                  <Truck size={14} />
                  <span>Dispatch Courier...</span>
                </button>
              )}
              {order.status === 'Shipped' && (
                <>
                  <button 
                    className="admin-btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    onClick={() => setIsDispatchFormOpen(true)}
                  >
                    <Edit3 size={13} />
                    <span>Edit Tracking</span>
                  </button>
                  <button 
                    className="admin-btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', background: '#059669', borderColor: '#059669' }}
                    onClick={() => handleStatusChange('Delivered')}
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Delivered</span>
                  </button>
                </>
              )}
              {order.status === 'Delivered' && (
                <button 
                  className="admin-btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => setIsDispatchFormOpen(true)}
                >
                  <Edit3 size={13} />
                  <span>Edit Tracking</span>
                </button>
              )}
            </div>
          </div>

          {/* Inline Courier Dispatch & Tracking Form Modal / Drawer */}
          {isDispatchFormOpen && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={18} color="#926917" />
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {isShippedOrDelivered ? 'Edit Courier Consignment Tracking' : 'Dispatch Order & Assign Courier Tracking'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDispatchFormOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: 0, marginBottom: '14px' }}>
                Enter the official tracking consignment details issued by the courier partner. This will immediately update customer tracking view.
              </p>

              {dispatchError && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px'
                }}>
                  <AlertCircle size={14} />
                  <span>{dispatchError}</span>
                </div>
              )}

              <form onSubmit={isShippedOrDelivered ? handleSaveTrackingEdit : handleConfirmDispatch}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  
                  {/* Courier Selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#334155', marginBottom: '6px' }}>
                      Courier Partner
                    </label>
                    <select
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="admin-form-input"
                      style={{ width: '100%', height: '38px', background: '#ffffff', borderRadius: '4px', fontSize: '0.85rem' }}
                    >
                      {POPULAR_COURIERS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Courier Input if 'Other' */}
                  {courierName === 'Other' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#334155', marginBottom: '6px' }}>
                        Custom Courier Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CityLink Express, Aramex..."
                        value={customCourier}
                        onChange={(e) => setCustomCourier(e.target.value)}
                        className="admin-form-input"
                        style={{ width: '100%', height: '38px', background: '#ffffff', borderRadius: '4px', fontSize: '0.85rem' }}
                      />
                    </div>
                  )}

                  {/* Tracking Number Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#334155', marginBottom: '6px' }}>
                      Courier Consignment Tracking # *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JNT192837465MY or 6001928374"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="admin-form-input"
                      style={{ 
                        width: '100%', 
                        height: '38px', 
                        background: '#ffffff', 
                        borderRadius: '4px', 
                        fontSize: '0.88rem', 
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsDispatchFormOpen(false)}
                    className="admin-btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={13} />
                    <span>{isShippedOrDelivered ? 'Save Tracking Changes' : 'Confirm Dispatch & Assign Tracking'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Grid Layout: Client & Delivery Info */}
          <div className="admin-order-modal-grid">
            
            {/* Client Card */}
            <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MapPin size={16} color="#b38e44" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#b38e44' }}>Client &amp; Destination</h4>
              </div>

              <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                <p><strong style={{ color: '#111827' }}>{order.customer.name}</strong></p>
                <p style={{ color: '#4b5563' }}>{order.customer.email} &bull; {order.customer.phone}</p>
                <p style={{ color: '#4b5563', marginTop: '4px' }}>
                  {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip}, {order.customer.country}
                </p>
              </div>

              {/* Gift & Engraving Callout */}
              {order.customer.giftPackaging && (
                <div style={{ marginTop: '14px', padding: '12px 14px', background: '#fffbeb', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 700, marginBottom: '4px' }}>
                    <Gift size={13} />
                    <span>Luxury Gift Presentation &amp; Calligraphy Card</span>
                  </div>
                  {order.customer.giftNote && (
                    <p style={{ color: '#92400e', fontStyle: 'italic' }}>&quot;{order.customer.giftNote}&quot;</p>
                  )}
                </div>
              )}

              {/* Included Samples */}
              {order.customer.samples && order.customer.samples.length > 0 && (
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#4b5563' }}>
                  <strong style={{ color: '#111827' }}>Included Samples:</strong> {order.customer.samples.join(', ')}
                </div>
              )}
            </div>

            {/* Tracking & Payment Details */}
            <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CreditCard size={16} color="#b38e44" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#b38e44' }}>Payment &amp; Courier</h4>
              </div>

              <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Payment Method: </span>
                  <span style={{ fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>{order.paymentMethod}</span>
                </div>

                <div>
                  <span style={{ color: '#6b7280' }}>Fulfillment Status: </span>
                  <span className={`order-status-badge status-${order.status.toLowerCase()}`} style={{ fontSize: '0.72rem' }}>
                    {order.status}
                  </span>
                </div>

                {/* Courier & Tracking Section */}
                <div style={{ marginTop: '4px', borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280', marginBottom: '6px' }}>
                    Courier Consignment Tracking
                  </div>

                  {order.trackingNumber ? (
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Courier Partner:</span>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{order.courierName || 'Standard Express'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Tracking #:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', color: '#926917', fontWeight: 800, fontSize: '0.92rem' }}>
                            {order.trackingNumber}
                          </span>
                          <button 
                            onClick={copyTracking} 
                            style={{ background: 'none', border: 'none', color: '#926917', cursor: 'pointer', padding: '2px' }}
                            title="Copy tracking code"
                          >
                            {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                      {order.dispatchedAt && (
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px', textAlign: 'right' }}>
                          Dispatched: {new Date(order.dispatchedAt).toLocaleString()}
                        </div>
                      )}
                      <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #e2e8f0', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setIsDispatchFormOpen(true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#475569',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit3 size={11} />
                          <span>Edit Courier / Tracking Number</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      background: '#fffbeb', 
                      border: '1px dashed #fcd34d', 
                      borderRadius: '6px', 
                      padding: '10px 12px',
                      fontSize: '0.8rem',
                      color: '#92400e'
                    }}>
                      <div style={{ marginBottom: '6px' }}>
                        No courier tracking number assigned yet. (Pending Admin dispatch)
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDispatchFormOpen(true)}
                        className="admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        <Truck size={12} style={{ marginRight: '4px' }} />
                        <span>Input Courier Tracking Now</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Items Table */}
          <h4 className="font-serif-title" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', color: '#0b0c10' }}>
            Ordered Fragrances ({order.items.length})
          </h4>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Bottle Size</th>
                  <th>Custom Engraving</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                        <span className="font-serif-title" style={{ fontWeight: 700, color: '#111827' }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#4b5563' }}>{item.size || '100 ml Bottle'}</td>
                    <td>
                      {item.engraving ? (
                        <span style={{ color: '#b45309', fontStyle: 'italic', fontSize: '0.8rem' }}>
                          <Feather size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          &quot;{item.engraving}&quot;
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td style={{ color: '#111827', fontWeight: 600 }}>{item.quantity}</td>
                    <td style={{ color: '#4b5563' }}>RM {item.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                      RM {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Subtotal:</span>
                <span style={{ color: '#111827' }}>RM {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Discount ({order.discountCode}):</span>
                  <span>-RM {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Shipping:</span>
                <span style={{ color: '#111827' }}>{order.shipping === 0 ? 'FREE' : `RM ${order.shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#0b0c10', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                <span>Total:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>RM {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
