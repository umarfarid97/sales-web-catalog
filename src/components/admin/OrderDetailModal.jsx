import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Truck, 
  Calendar, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  PackageCheck,
  Copy,
  Check
} from 'lucide-react';

export const OrderDetailModal = () => {
  const { viewingOrder, setViewingOrder, updateOrderStatus, showToast } = useStore();
  const [copied, setCopied] = React.useState(false);

  if (!viewingOrder) return null;

  const order = viewingOrder;

  const copyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      showToast('Tracking number copied', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
    setViewingOrder({ ...order, status: newStatus });
  };

  return (
    <div 
      className="modal-overlay"
      onClick={() => setViewingOrder(null)}
    >
      <div 
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setViewingOrder(null)}
          aria-label="Close Order Details"
        >
          <X size={18} />
        </button>

        <div style={{ padding: '32px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  Order {order.id}
                </h3>
                <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Placed on {new Date(order.placedAt).toLocaleString()}
              </p>
            </div>

            {/* Quick Status Workflow Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {order.status === 'Pending' && (
                <button 
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => handleStatusChange('Processing')}
                >
                  Start Processing
                </button>
              )}
              {order.status === 'Processing' && (
                <button 
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => handleStatusChange('Shipped')}
                >
                  <Truck size={14} />
                  <span>Dispatch & Ship</span>
                </button>
              )}
              {order.status === 'Shipped' && (
                <button 
                  className="btn btn-emerald"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => handleStatusChange('Delivered')}
                >
                  <CheckCircle2 size={14} />
                  <span>Confirm Delivery</span>
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
            
            {/* Left: Line Items List */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
                Items Purchased ({order.items?.length || 0})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', background: '#141722' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.92rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        Variant: <span style={{ color: '#818cf8' }}>{item.color}</span> &bull; Qty: <strong>{item.quantity}</strong>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Subtotal</span>
                  <span>${order.subtotal?.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#34d399', marginBottom: '6px' }}>
                    <span>Discount ({order.discountCode || 'Promo'})</span>
                    <span>-${order.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Shipping Fee</span>
                  <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping?.toFixed(2)}`}</span>
                </div>
                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '6px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  <span>Total Paid</span>
                  <span style={{ color: 'var(--accent-primary)' }}>${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right: Customer & Shipping Details */}
            <div>
              
              {/* Shipping Address Card */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <MapPin size={16} color="#818cf8" />
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Customer & Shipping</h5>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600, marginBottom: '2px' }}>
                  {order.customer?.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  {order.customer?.address}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {order.customer?.city}, {order.customer?.state} {order.customer?.zip}, {order.customer?.country}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Email: <span style={{ color: '#818cf8' }}>{order.customer?.email}</span>
                </div>
                {order.customer?.phone && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Phone: {order.customer.phone}
                  </div>
                )}
              </div>

              {/* Payment & Tracking Card */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CreditCard size={16} color="#34d399" />
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Payment & Tracking</h5>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Method: <strong style={{ color: '#ffffff' }}>{order.paymentMethod}</strong>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Tracking Number:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#818cf8', flex: 1 }}>
                    {order.trackingNumber || 'TRK-LUM-PENDING'}
                  </span>
                  <button
                    onClick={copyTracking}
                    style={{ color: copied ? '#34d399' : 'var(--text-dim)', padding: '2px' }}
                    title="Copy Tracking Number"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
