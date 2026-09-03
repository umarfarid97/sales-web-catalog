import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Gift,
  Feather,
  Sparkles
} from 'lucide-react';

export const OrderTrackerModal = () => {
  const { isOrderTrackerOpen, setIsOrderTrackerOpen, orders } = useStore();
  const [searchId, setSearchId] = useState('');
  const [foundOrder, setFoundOrder] = useState(() => orders[0] || null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOrderTrackerOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const clean = searchId.trim().toUpperCase();
    const match = orders.find((o) => o.id.toUpperCase() === clean || o.trackingNumber?.toUpperCase() === clean);
    setFoundOrder(match || null);
    setHasSearched(true);
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const currentStep = foundOrder ? getStatusStep(foundOrder.status) : 1;

  return (
    <div 
      className="modal-overlay"
      onClick={() => setIsOrderTrackerOpen(false)}
    >
      <div 
        className="modal-content"
        style={{ maxWidth: '640px', border: '1px solid rgba(212, 175, 55, 0.35)', background: 'rgba(15, 17, 25, 0.98)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsOrderTrackerOpen(false)}
          aria-label="Close Fragrance Tracker"
        >
          <X size={18} />
        </button>

        <div style={{ padding: '32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
              <Truck size={22} />
            </div>
            <div>
              <h3 className="font-serif-title" style={{ fontSize: '1.4rem', fontWeight: 800 }}>Maison Delivery Tracker</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter your Fragrance Order Reference or Tracking Code</p>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', margin: '20px 0 28px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
              <input
                type="text"
                placeholder="e.g. ORD-98421 or TRK-LUM-9482710"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="form-input"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
            <button type="submit" className="btn btn-gold" style={{ padding: '0 20px' }}>
              Track
            </button>
          </form>

          {/* Found Order View */}
          {foundOrder ? (
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px'
              }}
            >
              {/* Order Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tracking Number</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-gold-light)', fontSize: '1.05rem' }}>
                    {foundOrder.trackingNumber}
                  </div>
                </div>
                <div>
                  <span className={`order-status-badge status-${foundOrder.status.toLowerCase()}`}>
                    {foundOrder.status}
                  </span>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '30px 0 24px' }}>
                {['Pending', 'Atelier Packing', 'In Transit', 'Delivered'].map((stepName, i) => {
                  const stepNumber = i + 1;
                  const isDone = currentStep >= stepNumber;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                      <div 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isDone ? 'var(--accent-gold-gradient)' : 'rgba(255, 255, 255, 0.08)',
                          color: isDone ? '#0b0c10' : 'var(--text-dim)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          boxShadow: isDone ? '0 0 12px rgba(212, 175, 55, 0.4)' : 'none'
                        }}
                      >
                        {isDone ? <CheckCircle2 size={16} strokeWidth={2.5} /> : stepNumber}
                      </div>
                      <span style={{ fontSize: '0.75rem', marginTop: '6px', color: isDone ? '#fce08b' : 'var(--text-dim)', fontWeight: isDone ? 700 : 500, textAlign: 'center' }}>
                        {stepName}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Items in this Order */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--accent-gold-light)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Flacons in this Dispatch
                </div>
                {foundOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', margin: '4px 0' }}>
                    <span style={{ color: 'var(--text-main)' }}>{it.quantity}x {it.name} ({it.size || '100ml'})</span>
                    <span style={{ color: '#fce08b', fontFamily: 'var(--font-mono)' }}>${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

            </div>
          ) : hasSearched ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
              No fragrance dispatch record found for &quot;{searchId}&quot;.
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};
