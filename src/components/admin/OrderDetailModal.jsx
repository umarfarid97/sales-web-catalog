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
                <button 
                  className="admin-btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => handleStatusChange('Processing')}
                >
                  Start Atelier Packing
                </button>
              )}
              {order.status === 'Processing' && (
                <button 
                  className="admin-btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => handleStatusChange('Shipped')}
                >
                  <Truck size={14} />
                  <span>Dispatch White-Glove Courier</span>
                </button>
              )}
              {order.status === 'Shipped' && (
                <button 
                  className="admin-btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', background: '#059669', borderColor: '#059669' }}
                  onClick={() => handleStatusChange('Delivered')}
                >
                  <CheckCircle2 size={14} />
                  <span>Mark Delivered</span>
                </button>
              )}
            </div>
          </div>

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

              <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Payment: </span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{order.paymentMethod}</span>
                </div>

                <div>
                  <span style={{ color: '#6b7280' }}>Tracking Number: </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#b38e44', fontWeight: 700 }}>
                    {order.trackingNumber}
                  </span>
                  <button onClick={copyTracking} style={{ background: 'none', border: 'none', color: '#b38e44', marginLeft: '6px', cursor: 'pointer' }}>
                    {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                  </button>
                </div>

                <div>
                  <span style={{ color: '#6b7280' }}>Fulfillment Status: </span>
                  <span className={`order-status-badge status-${order.status.toLowerCase()}`} style={{ fontSize: '0.72rem' }}>
                    {order.status}
                  </span>
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
                        <img src={item.image} alt={item.name} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                        <span className="font-serif-title" style={{ fontWeight: 700, color: '#111827' }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#4b5563' }}>{item.size || '100 ml Grand Flacon'}</td>
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
