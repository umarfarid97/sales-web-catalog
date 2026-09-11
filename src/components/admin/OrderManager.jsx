import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  Eye, 
  X,
  Gift,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const OrderManager = () => {
  const { orders, setViewingOrder } = useStore();
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 25;

  // Reset to first page when filtering or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatusTab, orderSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div>
      
      <div className="admin-table-container">
        
        {/* Status Filter Tabs Toolbar */}
        <div className="admin-status-scroller">
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
                  background: isActive ? '#000000' : '#ffffff',
                  color: isActive ? '#ffffff' : '#374151',
                  border: `1px solid ${isActive ? '#000000' : '#d1d5db'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <span>{st}</span>
                <span 
                  style={{
                    fontSize: '0.72rem',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f3f4f6',
                    color: isActive ? '#ffffff' : '#4b5563',
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
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search Order ID, Client Name, Email, Tracking..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="admin-form-input"
              style={{ width: '100%', paddingLeft: '36px', height: '40px', fontSize: '1rem' }}
            />
            {orderSearch && (
              <button
                onClick={() => setOrderSearch('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Orders Table (Desktop) */}
        <div className="admin-table-desktop-view">
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
                  <td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                    No luxury fragrance orders found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => (
                  <tr key={ord.id}>
                    
                    {/* Order ID */}
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#b38e44', fontSize: '0.85rem' }}>
                        {ord.id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{ord.customer?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{ord.customer?.email}</div>
                      </div>
                    </td>

                    {/* Items */}
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#374151' }}>
                        {ord.items?.length} item(s)
                      </div>
                    </td>

                    {/* Gifting */}
                    <td>
                      {ord.customer?.giftPackaging ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#b45309', fontSize: '0.82rem', fontWeight: 600 }}>
                          <Gift size={14} />
                          <span>Deluxe Gift Box</span>
                        </div>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Standard</span>
                      )}
                    </td>

                    {/* Total */}
                    <td>
                      <span style={{ fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>
                        RM {ord.total.toFixed(2)}
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
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {new Date(ord.placedAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        onClick={() => setViewingOrder(ord)}
                      >
                        <Eye size={13} color="#b38e44" />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (Optimized for Smartphones) */}
        <div className="admin-mobile-cards-view">
          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#6b7280', fontSize: '0.88rem' }}>
              No luxury fragrance orders found matching your search.
            </div>
          ) : (
            paginatedOrders.map((ord) => (
              <div key={ord.id} className="admin-mobile-order-card">
                <div className="admin-mobile-order-top">
                  <span className="admin-mobile-order-id">{ord.id}</span>
                  <span className={`order-status-badge status-${ord.status.toLowerCase()}`} style={{ fontSize: '0.72rem' }}>
                    {ord.status}
                  </span>
                </div>

                <div className="admin-mobile-order-customer">
                  <strong>{ord.customer?.name}</strong>
                  <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>{ord.customer?.city || 'Kuala Lumpur'}, {ord.customer?.state || 'WP'}</span>
                </div>

                <div className="admin-mobile-order-summary">
                  <span style={{ color: '#4b5563' }}>
                    {ord.items?.length || 1} Bottle{(ord.items?.length || 1) > 1 ? 's' : ''}
                    {ord.customer?.giftPackaging ? ' • 🎁 Gift' : ''}
                  </span>
                  <span className="admin-mobile-order-total">
                    RM {ord.total.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {new Date(ord.placedAt).toLocaleDateString()}
                  </span>
                  <button
                    className="admin-btn-primary"
                    style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                    onClick={() => setViewingOrder(ord)}
                  >
                    <Eye size={13} />
                    <span>Inspect &amp; Dispatch</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {filteredOrders.length > PAGE_SIZE && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '12px', 
            padding: '16px 20px', 
            background: '#fafafa', 
            borderTop: '1px solid #e5e7eb',
            borderRadius: '0 0 8px 8px'
          }}>
            <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>
              Showing <strong>{startIndex + 1}</strong>–<strong>{Math.min(startIndex + PAGE_SIZE, filteredOrders.length)}</strong> of <strong>{filteredOrders.length}</strong> orders
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="admin-btn-secondary"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: '6px 12px', 
                  fontSize: '0.8rem',
                  opacity: currentPage <= 1 ? 0.5 : 1,
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', padding: '0 8px' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="admin-btn-secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: '6px 12px', 
                  fontSize: '0.8rem',
                  opacity: currentPage >= totalPages ? 0.5 : 1,
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
