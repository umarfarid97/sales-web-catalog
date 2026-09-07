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
    showToast(`Batch replenished ${lowStockItems.length} fragrance creations (+15 flacons each)!`, 'success');
  };

  return (
    <div>
      
      {/* Alert Banner */}
      {lowStockItems.length > 0 ? (
        <div className="inventory-alert-card" style={{ border: '1px solid rgba(244, 63, 94, 0.35)', background: 'rgba(244, 63, 94, 0.08)' }}>
          <div className="inventory-alert-info">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-serif-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                {lowStockItems.length} Fragrance Creations Require Atelier Maceration &amp; Flacon Restock
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {outOfStockItems.length} creations are completely depleted / sold out.
              </p>
            </div>
          </div>

          <button
            className="btn btn-gold"
            onClick={handleBatchRestock}
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            <RefreshCw size={16} />
            <span>Batch Restock All (+15 Flacons Each)</span>
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
            <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>Flacon Vault Inventory Healthy</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              All signature fragrance creations have sufficient safety reserves (&gt; 5 flacons).
            </p>
          </div>
        </div>
      )}

      {/* Low Stock Items Grid */}
      {lowStockItems.length > 0 && (
        <div className="admin-table-container" style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div className="admin-table-toolbar">
            <h3 className="font-serif-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
              Critical Inventory Fragrances
            </h3>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Fragrance Creation</th>
                <th>Olfactory Family</th>
                <th>Current Reserve</th>
                <th style={{ textAlign: 'right' }}>Replenish Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={prod.images[0]} alt={prod.name} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span className="font-serif-title" style={{ fontWeight: 700 }}>{prod.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>{prod.category}</span>
                  </td>
                  <td>
                    <span className={`badge ${prod.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                      {prod.stock === 0 ? 'Depleted (0 flacons)' : `${prod.stock} flacons left`}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-gold"
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
      )}

    </div>
  );
};
