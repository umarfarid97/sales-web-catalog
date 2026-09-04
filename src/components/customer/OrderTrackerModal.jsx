import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { lookupOrderInSupabase } from '../../services/supabaseService';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Gift, 
  Package, 
  MapPin, 
  Calendar, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const OrderTrackerModal = () => {
  const { isOrderTrackerOpen, setIsOrderTrackerOpen, orders, userOrders } = useStore();
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSearchingDb, setIsSearchingDb] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');

  // When modal opens or userOrders changes, default to the user's latest real order
  useEffect(() => {
    if (isOrderTrackerOpen) {
      if (userOrders && userOrders.length > 0) {
        setSelectedOrder(userOrders[0]);
      } else {
        setSelectedOrder(null);
      }
      setHasSearched(false);
      setSearchError('');
      setSearchId('');
    }
  }, [isOrderTrackerOpen, userOrders]);

  if (!isOrderTrackerOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearchingDb(true);
    setSearchError('');
    setHasSearched(true);

    const clean = searchId.trim().toUpperCase();

    // 1. Search in local active store memory
    const localMatch = orders.find(
      (o) => o.id?.toUpperCase() === clean || o.trackingNumber?.toUpperCase() === clean
    );

    if (localMatch) {
      setSelectedOrder(localMatch);
      setIsSearchingDb(false);
      return;
    }

    // 2. Query live Supabase database
    try {
      const dbMatch = await lookupOrderInSupabase(clean);
      if (dbMatch) {
        setSelectedOrder(dbMatch);
      } else {
        setSelectedOrder(null);
        setSearchError(`No dispatch record found in the Maison database for "${searchId.trim()}".`);
      }
    } catch (err) {
      console.error('Order search error:', err);
      setSearchError('Unable to query the database. Please verify your connection.');
    } finally {
      setIsSearchingDb(false);
    }
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

  const currentStep = selectedOrder ? getStatusStep(selectedOrder.status) : 1;

  return (
    <div 
      className="modal-overlay"
      onClick={() => setIsOrderTrackerOpen(false)}
    >
      <div 
        className="modal-content"
        style={{
          maxWidth: '680px',
          border: '1px solid #e5e7eb',
          background: '#ffffff',
          color: '#000000',
          maxHeight: '90vh',
          maxHeight: '90dvh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          margin: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsOrderTrackerOpen(false)}
          aria-label="Close Fragrance Tracker"
          style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#000000' }}
        >
          <X size={18} />
        </button>

        <div style={{ padding: '32px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '4px', 
              background: '#000000', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#ffffff' 
            }}>
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b38e44', fontWeight: 700 }}>
                Maison Valenszo Logistics
              </div>
              <h3 style={{ fontFamily: 'var(--font-couture, serif)', fontSize: '1.4rem', fontWeight: 800, color: '#000000', margin: 0 }}>
                Express Delivery Tracker
              </h3>
            </div>
          </div>

          {/* Guest Sign-In Notice if not authenticated */}
          {!isAuthenticated && (
            <div style={{
              background: '#fafaf9',
              border: '1px solid #e7e5e4',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '0.8rem',
              color: '#44403c'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="#b38e44" />
                <span>Signed-in clients can track all their orders automatically.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOrderTrackerOpen(false);
                  openAuthModal({ mode: 'signin' });
                }}
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Sign In
              </button>
            </div>
          )}

          {/* Multiple Orders Tabs for Logged-In User */}
          {isAuthenticated && userOrders.length > 1 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', fontWeight: 600, marginBottom: '8px' }}>
                Your Orders in Real Database ({userOrders.length}):
              </div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                {userOrders.map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => {
                      setSelectedOrder(ord);
                      setHasSearched(false);
                      setSearchError('');
                    }}
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.78rem',
                      borderRadius: '4px',
                      border: selectedOrder?.id === ord.id ? '1px solid #000000' : '1px solid #e5e7eb',
                      background: selectedOrder?.id === ord.id ? '#000000' : '#f9fafb',
                      color: selectedOrder?.id === ord.id ? '#ffffff' : '#374151',
                      fontWeight: selectedOrder?.id === ord.id ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {ord.id} ({ord.status})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#926917' }} />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. ORD-12345) or Tracking Code"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="form-input"
                style={{ 
                  width: '100%', 
                  padding: '11px 12px 11px 38px', 
                  background: '#ffffff', 
                  color: '#000000', 
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <button 
              type="submit" 
              disabled={isSearchingDb}
              style={{ 
                padding: '0 24px', 
                background: '#000000', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: isSearchingDb ? 'wait' : 'pointer' 
              }}
            >
              {isSearchingDb ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Search Error Alert */}
          {searchError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              marginBottom: '20px'
            }}>
              {searchError}
            </div>
          )}

          {/* Display Real Selected Order */}
          {selectedOrder ? (
            <div 
              style={{
                background: '#fafafa',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '24px'
              }}
            >
              {/* Order Meta Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '20px', 
                borderBottom: '1px solid #e5e7eb', 
                paddingBottom: '16px', 
                flexWrap: 'wrap', 
                gap: '12px' 
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Order Reference &bull; {selectedOrder.id}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#926917', fontSize: '1.1rem', marginTop: '2px' }}>
                    {selectedOrder.trackingNumber || 'TRK-PENDING'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: selectedOrder.status === 'Delivered' ? '#dcfce7' : selectedOrder.status === 'Shipped' ? '#e0e7ff' : '#fef3c7',
                    color: selectedOrder.status === 'Delivered' ? '#15803d' : selectedOrder.status === 'Shipped' ? '#4338ca' : '#b45309',
                    border: `1px solid ${selectedOrder.status === 'Delivered' ? '#bbf7d0' : selectedOrder.status === 'Shipped' ? '#c7d2fe' : '#fde68a'}`
                  }}>
                    {selectedOrder.status}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '4px' }}>
                    {selectedOrder.placedAt ? new Date(selectedOrder.placedAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                  </div>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '28px 0 24px' }}>
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
                          background: isDone ? '#000000' : '#e5e7eb',
                          color: isDone ? '#ffffff' : '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 800
                        }}
                      >
                        {isDone ? <CheckCircle2 size={16} strokeWidth={2.5} /> : stepNumber}
                      </div>
                      <span style={{ 
                        fontSize: '0.74rem', 
                        marginTop: '6px', 
                        color: isDone ? '#000000' : '#9ca3af', 
                        fontWeight: isDone ? 700 : 500, 
                        textAlign: 'center' 
                      }}>
                        {stepName}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Address & Customer Details */}
              <div style={{ 
                background: '#ffffff', 
                padding: '14px', 
                borderRadius: '4px', 
                border: '1px solid #e5e7eb', 
                marginBottom: '18px',
                fontSize: '0.82rem',
                color: '#374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#000000', marginBottom: '6px' }}>
                  <MapPin size={15} color="#b38e44" />
                  <span>White-Glove Express Destination</span>
                </div>
                <div>{selectedOrder.customer?.name || (selectedOrder.customer?.firstName ? `${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName || ''}` : 'Maison Client')}</div>
                <div>{selectedOrder.customer?.address || 'Kuala Lumpur Central Atelier'}</div>
                <div>{selectedOrder.customer?.city || 'Kuala Lumpur'}, {selectedOrder.customer?.postalCode || selectedOrder.customer?.zip || '50250'}, {selectedOrder.customer?.country || 'Malaysia'}</div>
                <div style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.78rem' }}>
                  Contact: {selectedOrder.customer?.phone || selectedOrder.customer?.email}
                </div>
              </div>

              {/* Items in this Order */}
              <div style={{ paddingTop: '14px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '0.78rem', color: '#b38e44', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  Creations in this Dispatch ({selectedOrder.items?.length || 0})
                </div>
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', margin: '6px 0' }}>
                    <span style={{ color: '#111827', fontWeight: 500 }}>
                      {it.quantity}x {it.name} <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>({it.size || '100 ml'})</span>
                    </span>
                    <span style={{ color: '#000000', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      RM {(Number(it.price) * Number(it.quantity)).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', marginTop: '10px', borderTop: '1px solid #e5e7eb', fontWeight: 800, fontSize: '0.95rem' }}>
                  <span>Total Settled</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>RM {Number(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
              </div>

            </div>
          ) : isAuthenticated && userOrders.length === 0 ? (
            /* Logged-In User with 0 Orders (Real Honest Zero State) */
            <div style={{ 
              textAlign: 'center', 
              padding: '44px 20px', 
              background: '#fcfcfc', 
              borderRadius: '6px', 
              border: '1px dashed #d1d5db' 
            }}>
              <Package size={36} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontFamily: 'var(--font-couture, serif)', fontSize: '1.15rem', color: '#000000', margin: '0 0 6px', fontWeight: 700 }}>
                No Active Orders in Your Account
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                You have not placed any fragrance orders under <strong>{currentUser?.email}</strong> yet. Once you complete checkout, real-time dispatch updates will appear here automatically.
              </p>
              <button
                type="button"
                onClick={() => setIsOrderTrackerOpen(false)}
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Curate Your Fragrance
              </button>
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};
