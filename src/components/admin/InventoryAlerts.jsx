import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Plus
} from 'lucide-react';

export const InventoryAlerts = () => {
  const { products, restockProduct, showToast } = useStore();

  const lowStockItems = products.filter((p) => p.stock < 5);
  const outOfStockItems = products.filter((p) => p.stock === 0);

  const handleBatchRestock = () => {
    lowStockItems.forEach((p) => {
      restockProduct(p.id, 15);
    });
    showToast(`Batch restocked ${lowStockItems.length} perfumes (+15 bottles each)!`, 'success');
  };

  return (
    <div>
      
      {/* Alert Banner */}
      {lowStockItems.length > 0 ? (
        <div className="inventory-alert-card" style={{ border: '1px solid #fecaca', background: '#fef2f2' }}>
          <div className="inventory-alert-info">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-serif-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#991b1b' }}>
                {lowStockItems.length} Perfumes Need Restocking
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>
                {outOfStockItems.length} perfumes are completely out of stock.
              </p>
            </div>
          </div>

          <button
            className="admin-btn-primary"
            onClick={handleBatchRestock}
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            <RefreshCw size={16} />
            <span>Batch Restock All (+15 Bottles Each)</span>
          </button>
        </div>
      ) : (
        <div 
          className="admin-card-panel"
          style={{
            padding: '30px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: '#ecfdf5',
            borderColor: '#a7f3d0'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#065f46' }}>Inventory Healthy</h3>
            <p style={{ fontSize: '0.85rem', color: '#047857' }}>
              All perfumes have sufficient stock reserves (&gt; 5 bottles).
            </p>
          </div>
        </div>
      )}

      {/* Low Stock Items Grid */}
      {lowStockItems.length > 0 && (
        <div className="admin-table-container">
          <div className="admin-table-toolbar">
            <h3 className="font-serif-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0b0c10' }}>
              Critical Inventory Fragrances
            </h3>
          </div>

          {/* Desktop Table View */}
          <div className="admin-table-desktop-view">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Perfume Name</th>
                  <th>Category / Scent</th>
                  <th>Current Stock</th>
                  <th style={{ textAlign: 'right' }}>Restock Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={prod.images[0]} alt={prod.name} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                        <span className="font-serif-title" style={{ fontWeight: 700, color: '#111827' }}>{prod.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>{prod.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${prod.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                        {prod.stock === 0 ? 'Out of Stock (0)' : `${prod.stock} bottles left`}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => restockProduct(prod.id, 10)}
                      >
                        <Plus size={14} />
                        <span>Restock +10</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (Optimized for Smartphones) */}
          <div className="admin-mobile-cards-view">
            {lowStockItems.map((prod) => (
              <div key={prod.id} className="admin-mobile-card">
                <div className="admin-mobile-card-header">
                  <img src={prod.images[0]} alt={prod.name} className="admin-mobile-card-img" />
                  <div className="admin-mobile-card-info">
                    <div className="admin-mobile-card-title">{prod.name}</div>
                    <div className="admin-mobile-card-meta">
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{prod.category}</span>
                      <span className={`badge ${prod.stock === 0 ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                        {prod.stock === 0 ? 'Depleted (0)' : `${prod.stock} left`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="admin-mobile-card-actions">
                  <button
                    className="admin-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '9px 12px', fontSize: '0.8rem' }}
                    onClick={() => restockProduct(prod.id, 10)}
                  >
                    <Plus size={14} />
                    <span>Restock +10 Bottles</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
