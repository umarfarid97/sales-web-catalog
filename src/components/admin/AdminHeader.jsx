import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Plus, 
  Download,
  ShieldCheck
} from 'lucide-react';

export const AdminHeader = () => {
  const { 
    adminTab, 
    setAdminTab, 
    setIsProductFormOpen, 
    setEditingProduct,
    lowStockCount,
    pendingOrdersCount,
    showToast,
    orders,
    isCloudConnected
  } = useStore();

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleExportCSV = () => {
    const headers = 'Order ID,Customer,Email,Total,Status,Date\n';
    const rows = orders.map(o => `"${o.id}","${o.customer.name}","${o.customer.email}",${o.total},"${o.status}","${o.placedAt}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valenszo_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Exported order records to CSV', 'success');
  };

  return (
    <div className="admin-header-row">
      
      {/* Title & Live Badge */}
      <div className="admin-title-badge">
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1>Store Operations & Admin Portal</h1>
            <div className="admin-status-pill">
              <span className="admin-live-dot" style={{ backgroundColor: isCloudConnected ? '#10b981' : '#f59e0b' }} />
              <span>{isCloudConnected ? 'Supabase Cloud DB' : 'Local Storage Mode'}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isCloudConnected
              ? 'Real-time multi-user synchronization active via Supabase PostgreSQL'
              : 'Standalone browser storage active. Add Supabase keys to enable cloud sync.'}
          </p>
        </div>
      </div>

      {/* Tabs & Top Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        
        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${adminTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setAdminTab('analytics')}
          >
            <BarChart3 size={16} />
            <span>KPIs & Analytics</span>
          </button>

          <button
            className={`admin-tab-btn ${adminTab === 'products' ? 'active' : ''}`}
            onClick={() => setAdminTab('products')}
          >
            <Package size={16} />
            <span>Catalog (CRUD)</span>
          </button>

          <button
            className={`admin-tab-btn ${adminTab === 'orders' ? 'active' : ''}`}
            onClick={() => setAdminTab('orders')}
          >
            <ShoppingCart size={16} />
            <span>Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="badge badge-warning" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            className={`admin-tab-btn ${adminTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setAdminTab('inventory')}
          >
            <AlertTriangle size={16} />
            <span>Stock Alerts</span>
            {lowStockCount > 0 && (
              <span className="badge badge-danger" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>
                {lowStockCount}
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <button
          className="btn btn-emerald"
          onClick={handleAddNewProduct}
        >
          <Plus size={16} />
          <span>New Product</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleExportCSV}
          title="Export CSV Report"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>

      </div>

    </div>
  );
};
