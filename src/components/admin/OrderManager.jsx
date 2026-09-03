import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  ShoppingCart, 
  Eye, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  X,
  CreditCard,
  Gift,
  Feather
} from 'lucide-react';

export const OrderManager = () => {
  const { orders, updateOrderStatus, setViewingOrder } = useStore();
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((ord) => {
    if (selectedStatusTab !== 'All' && ord.status !== selectedStatusTab) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchName = ord.customer?.name?.toLowerCase().includes(q);
      const matchEmail = ord.customer?.email?.toLowerCase().includes(q);
      const matchTracking = ord.trackingNumber?.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchEmail && !matchTracking) return false;
    }
    return true;
  });

  const getStatusCount = (status) => {
    if (status === 'All') return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <div>
      
      <div className="admin-table-container" style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }}>
        
        {/* Status Filter Tabs Toolbar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['All', ...statusOptions].map((st) => {
            const count = getStatusCount(st);
            const isActive = selectedStatusTab === st;

            return (
              <button
                key={st}
                onClick={() => setSelectedStatusTab(st)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: isActive ? 'var(--accent-gold-gradient)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#0b0c10' : 'var(--text-muted)',
                  border: `1px solid ${isActive ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{st}</span>
                <span 
                  style={{
                    fontSize: '0.72rem',
                    background: isActive ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Toolbar */}
        <div className="admin-table-toolbar">
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
            <input
              type="text"
              placeholder="Search Order ID, Client Name, Email, Tracking..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
            />
            {orderSearch && (
              <button
                onClick={() => setOrderSearch('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Fragrance Items</th>
                <th>Presentation Gifting</th>
                <th>Total Value</th>
                <th>Fulfillment Status</th>
                <th>Placed Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No luxury fragrance orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    
                    {/* Order ID */}
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-gold-light)', fontSize: '0.85rem' }}>
                        {ord.id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{ord.customer?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{ord.customer?.city}, {ord.customer?.country}</div>
                      </div>
                    </td>

                    {/* Items */}
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {ord.items.map((it, idx) => (
                          <div key={idx} style={{ color: '#f3e5ab' }}>
                            {it.quantity}x {it.name} <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({it.size || '100ml'})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Gifting / Samples */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {ord.customer?.giftPackaging ? (
                          <span className="badge badge-gold" style={{ fontSize: '0.68rem', width: 'fit-content' }}>
                            <Gift size={11} />
                            <span>Gift Boxed</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Standard Box</span>
                        )}

                        {ord.customer?.engravingText && (
                          <span style={{ fontSize: '0.72rem', color: '#fce08b', fontStyle: 'italic' }}>
                            <Feather size={10} style={{ display: 'inline', marginRight: '3px' }} />
                            &quot;{ord.customer.engravingText}&quot;
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td>
                      <span style={{ fontWeight: 700, color: '#fce08b', fontFamily: 'var(--font-mono)' }}>
                        ${ord.total.toFixed(2)}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`order-status-badge status-${ord.status.toLowerCase()}`}>
                        {ord.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {new Date(ord.placedAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        onClick={() => setViewingOrder(ord)}
                      >
                        <Eye size={13} color="var(--accent-gold)" />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
