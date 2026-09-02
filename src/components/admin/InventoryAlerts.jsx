import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  AlertTriangle, 
  PackageX, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight,
  ShieldCheck 
} from 'lucide-react';

export const InventoryAlerts = () => {
  const { products, restockProduct, showToast, setAdminTab } = useStore();

  const lowStockItems = products.filter((p) => p.stock < 5);
  const outOfStockItems = products.filter((p) => p.stock === 0);

  const handleBatchRestock = () => {
    lowStockItems.forEach((p) => {
      restockProduct(p.id, 15);
    });
    showToast(`Batch restocked ${lowStockItems.length} low-stock items (+15 units each)!`, 'success');
  };

  return (
    <div>
      
      {/* Alert Banner */}
      {lowStockItems.length > 0 ? (
        <div className="inventory-alert-card">
          <div className="inventory-alert-info">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                {lowStockItems.length} Products Require Immediate Replenishment
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {outOfStockItems.length} items are currently completely sold out.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleBatchRestock}
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            <RefreshCw size={16} />
            <span>Batch Restock All (+15 Each)</span>
          </button>
        </div>
      ) : (
        <div 
          className="glass-panel"
          style={{
            padding: '30px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.3)'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>Inventory Health Optimal</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              All catalog products maintain sufficient safety buffer inventory (&gt; 5 units).
            </p>
          </div>
        </div>
      )}

      {/* Low Stock Items Grid */}
      {lowStockItems.length > 0 && (
        <div className="admin-table-container">
          <div className="admin-table-toolbar">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Critical Stock Items</h3>
          </div>

          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Restock Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div className="product-row-info">
                      <img src={prod.images[0]} alt={prod.name} className="product-row-thumb" />
                      <div>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{prod.sku}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-neutral">{prod.category}</span>
                  </td>

                  <td>
                    {prod.stock === 0 ? (
                      <span className="badge badge-danger">Sold Out (0 units)</span>
                    ) : (
                      <span className="badge badge-warning">Critical ({prod.stock} left)</span>
                    )}
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => restockProduct(prod.id, 10)}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Plus size={13} />
                        <span>+10 units</span>
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => restockProduct(prod.id, 25)}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Plus size={13} />
                        <span>+25 units</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
