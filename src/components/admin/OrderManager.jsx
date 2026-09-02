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
  CreditCard
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
      
      <div className="admin-table-container">
        
        {/* Status Filter Tabs Toolbar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
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
                  background: isActive ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{st}</span>
                <span 
                  style={{
                    fontSize: '0.72rem',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
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
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search Order ID, Customer Name, Email, Tracking..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
            />
            {orderSearch && (
              <button
                onClick={() => setOrderSearch('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredOrders.length}</strong> orders
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Customer</th>
                <th>Purchased Items</th>
                <th>Total</th>
                <th>Fulfillment Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    
                    {/* Order ID & Date */}
                    <td>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
                          {ord.id}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {new Date(ord.placedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>{ord.customer?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{ord.customer?.email}</div>
                      </div>
                    </td>

                    {/* Items */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {ord.items?.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.name}
                            title={`${item.quantity}x ${item.name} (${item.color})`}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-subtle)',
                              background: '#151822'
                            }}
                          />
                        ))}
                        {ord.items?.length > 3 && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            +{ord.items.length - 3} more
                          </span>
                        )}
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                          ({ord.items?.reduce((s, i) => s + i.quantity, 0)} pcs)
                        </span>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>
                        ${ord.total?.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {ord.paymentMethod?.split('(')[0] || 'Paid'}
                      </div>
                    </td>

                    {/* Fulfillment Status Dropdown */}
                    <td>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className={`order-status-badge status-${ord.status.toLowerCase()}`}
                        style={{ cursor: 'pointer', outline: 'none' }}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st} style={{ background: '#11131a', color: '#ffffff' }}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setViewingOrder(ord)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        title="View Detailed Invoice"
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No orders found matching the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
