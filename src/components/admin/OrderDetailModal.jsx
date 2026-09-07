import React from 'react';
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
  Feather
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
        style={{ border: '1px solid rgba(212, 175, 55, 0.35)', background: 'rgba(15, 17, 25, 0.98)', maxHeight: '90vh', overflowY: 'auto' }}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 className="font-serif-title" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
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
                  className="btn btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => handleStatusChange('Processing')}
                >
                  Start Atelier Packing
                </button>
              )}
              {order.status === 'Processing' && (
                <button 
                  className="btn btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => handleStatusChange('Shipped')}
                >
                  <Truck size={14} />
                  <span>Dispatch White-Glove Courier</span>
                </button>
              )}
              {order.status === 'Shipped' && (
                <button 
                  className="btn btn-emerald"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => handleStatusChange('Delivered')}
                >
                  <CheckCircle2 size={14} />
                  <span>Mark Delivered</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid Layout: Client & Delivery Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '28px' }}>
            
            {/* Client Card */}
            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MapPin size={16} color="var(--accent-gold)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>Client &amp; Destination</h4>
              </div>

              <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                <p><strong style={{ color: 'var(--text-main)' }}>{order.customer.name}</strong></p>
                <p style={{ color: 'var(--text-muted)' }}>{order.customer.email} &bull; {order.customer.phone}</p>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                  {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip}, {order.customer.country}
                </p>
              </div>

              {/* Gift & Engraving Callout */}
              {order.customer.giftPackaging && (
                <div style={{ marginTop: '14px', padding: '10px 12px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(212, 175, 55, 0.25)', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fce08b', fontWeight: 700, marginBottom: '4px' }}>
                    <Gift size={13} />
                    <span>Luxury Gift Presentation &amp; Calligraphy Card</span>
                  </div>
                  {order.customer.giftNote && (
                    <p style={{ color: '#f3e5ab', fontStyle: 'italic' }}>&quot;{order.customer.giftNote}&quot;</p>
                  )}
                </div>
              )}

              {/* Included Samples */}
              {order.customer.samples && order.customer.samples.length > 0 && (
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#f3e5ab' }}>
                  <strong>Included Samples:</strong> {order.customer.samples.join(', ')}
                </div>
              )}
            </div>

            {/* Tracking & Payment Details */}
            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CreditCard size={16} color="var(--accent-gold)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>Payment &amp; Courier</h4>
              </div>

              <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Payment: </span>
                  <span style={{ fontWeight: 600 }}>{order.paymentMethod}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Tracking Number: </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-gold-light)', fontWeight: 700 }}>
                    {order.trackingNumber}
                  </span>
                  <button onClick={copyTracking} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', marginLeft: '6px', cursor: 'pointer' }}>
                    {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                  </button>
                </div>

                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Fulfillment Status: </span>
                  <span className={`badge status-${order.status.toLowerCase()}`} style={{ fontSize: '0.72rem' }}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Items Table */}
          <h4 className="font-serif-title" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-gold-light)' }}>
            Ordered Fragrances ({order.items.length})
          </h4>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Flacon Creation</th>
                  <th>Flacon Size</th>
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
                        <img src={item.image} alt={item.name} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                        <span className="font-serif-title" style={{ fontWeight: 700 }}>{item.name}</span>
                      </div>
                    </td>
                    <td>{item.size || '100 ml Grand Flacon'}</td>
                    <td>
                      {item.engraving ? (
                        <span style={{ color: '#fce08b', fontStyle: 'italic', fontSize: '0.8rem' }}>
                          <Feather size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          &quot;{item.engraving}&quot;
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td>{item.quantity}</td>
                    <td>RM {item.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#fce08b' }}>
                      RM {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal:</span>
                <span>RM {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6ee7b7' }}>
                  <span>Discount ({order.discountCode}):</span>
                  <span>-RM {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? 'FREE' : `RM ${order.shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#fce08b', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
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
