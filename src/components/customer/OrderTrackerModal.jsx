import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin,
  Calendar
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
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsOrderTrackerOpen(false)}
          aria-label="Close Order Tracker"
        >
          <X size={18} />
        </button>

        <div style={{ padding: '32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <Truck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Real-Time Order Tracking</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter your Order Reference ID or Tracking Code</p>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', margin: '20px 0 28px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="e.g. ORD-89241 or TRK-LUM-9482103"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
              Track
            </button>
          </form>

          {/* Found Order View */}
          {foundOrder ? (
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px'
              }}
            >
              {/* Order Meta Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>ORDER REFERENCE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    {foundOrder.id}
                  </div>
                </div>
                <div>
                  <span className={`order-status-badge status-${foundOrder.status.toLowerCase()}`}>
                    {foundOrder.status}
                  </span>
                </div>
              </div>

              {/* Progress Timeline Nodes */}
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '30px 0 36px' }}>
                <div 
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '24px',
                    right: '24px',
                    height: '3px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 1
                  }}
                />

                {/* Node 1: Order Placed */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: currentStep >= 1 ? '#10b981' : 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: currentStep >= 1 ? '#ffffff' : 'var(--text-dim)' }}>Placed</span>
                </div>

                {/* Node 2: Processing */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: currentStep >= 2 ? '#10b981' : 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <Clock size={16} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: currentStep >= 2 ? '#ffffff' : 'var(--text-dim)' }}>Processing</span>
                </div>

                {/* Node 3: Shipped */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: currentStep >= 3 ? '#10b981' : 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <Truck size={16} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: currentStep >= 3 ? '#ffffff' : 'var(--text-dim)' }}>In Transit</span>
                </div>

                {/* Node 4: Delivered */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: currentStep >= 4 ? '#10b981' : 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <Package size={16} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: currentStep >= 4 ? '#ffffff' : 'var(--text-dim)' }}>Delivered</span>
                </div>
              </div>

              {/* Order Info Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={16} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>RECIPIENT</div>
                    <div style={{ color: '#ffffff', fontWeight: 600 }}>{foundOrder.customer?.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{foundOrder.customer?.address}, {foundOrder.customer?.city}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Calendar size={16} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>ORDER DATE</div>
                    <div style={{ color: '#ffffff', fontWeight: 600 }}>
                      {new Date(foundOrder.placedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {foundOrder.items?.length || 1} items &bull; Total: ${foundOrder.total?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : hasSearched && (
            <div style={{ textAlign: 'center', padding: '30px', color: '#fb7185' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 10px' }} />
              <h4>Order not found</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Please verify your order number format (e.g. ORD-89241).
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
