import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OLFACTORY_FAMILIES } from '../../data/initialProducts';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  X,
  Flame,
  Feather
} from 'lucide-react';

export const ProductManager = () => {
  const { 
    products, 
    deleteProduct, 
    restockProduct, 
    setIsProductFormOpen, 
    setEditingProduct,
    showToast
  } = useStore();

  const [searchTable, setSearchTable] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStockStatus, setFilterStockStatus] = useState('all'); // 'all', 'low', 'out'

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the active fragrance catalog?`)) {
      deleteProduct(id);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  // Filtered Table Items
  const tableItems = products.filter((p) => {
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    if (filterStockStatus === 'low' && (p.stock >= 5 || p.stock === 0)) return false;
    if (filterStockStatus === 'out' && p.stock > 0) return false;
    if (searchTable.trim()) {
      const q = searchTable.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  return (
    <div>
      
      {/* Table Container */}
      <div className="admin-table-container" style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }}>
        
        {/* Table Toolbar */}
        <div className="admin-table-toolbar" style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.15)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
              <input
                type="text"
                placeholder="Search SKU, fragrance title..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className="form-input"
                style={{ width: '100%', paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
              />
              {searchTable && (
                <button
                  onClick={() => setSearchTable('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Olfactory Family Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-select"
              style={{ height: '40px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="All">All Olfactory Families</option>
              {OLFACTORY_FAMILIES.filter((f) => f !== 'All').map((fam) => (
                <option key={fam} value={fam}>{fam}</option>
              ))}
            </select>

            {/* Stock Level Filter */}
            <select
              value={filterStockStatus}
              onChange={(e) => setFilterStockStatus(e.target.value)}
              className="form-select"
              style={{ height: '40px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="all">All Flacon Stock Levels</option>
              <option value="low">Low Inventory (&lt; 5 flacons)</option>
              <option value="out">Depleted / Out of Stock</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-gold"
              onClick={handleAddNew}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              <span>Formulate Fragrance</span>
            </button>
          </div>

        </div>

        {/* Table Body */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fragrance Creation</th>
                <th>SKU</th>
                <th>Olfactory Family</th>
                <th>Concentration</th>
                <th>Base Price</th>
                <th>Flacon Stock</th>
                <th>Sillage Rating</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableItems.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No fragrance records found matching your filters.
                  </td>
                </tr>
              ) : (
                tableItems.map((prod) => {
                  const isOutOfStock = prod.stock === 0;
                  const isLow = prod.stock > 0 && prod.stock < 5;

                  return (
                    <tr key={prod.id}>
                      {/* Product Name & Visual */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid rgba(212, 175, 55, 0.25)'
                            }}
                          />
                          <div>
                            <div className="font-serif-title" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                              {prod.badge && <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px', marginRight: '6px' }}>{prod.badge}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-gold-light)' }}>
                          {prod.sku || 'N/A'}
                        </span>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="badge badge-neutral" style={{ background: 'rgba(212, 175, 55, 0.08)', color: '#f3e5ab' }}>
                          {prod.category}
                        </span>
                      </td>

                      {/* Concentration */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {prod.concentration?.split(' ')[0] || 'Extrait'}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <span style={{ fontWeight: 700, color: '#fce08b', fontFamily: 'var(--font-mono)' }}>
                          ${prod.price.toFixed(2)}
                        </span>
                      </td>

                      {/* Stock */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`badge ${
                            isOutOfStock ? 'badge-danger' :
                            isLow ? 'badge-warning' : 'badge-success'
                          }`}>
                            {prod.stock} flacons
                          </span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td>
                        <span style={{ color: '#fcd34d', fontWeight: 700, fontSize: '0.85rem' }}>
                          ★ {prod.rating} <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({prod.reviewsCount})</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => restockProduct(prod.id, 10)}
                            title="Restock +10 flacons"
                          >
                            <RefreshCw size={13} color="var(--accent-gold)" />
                          </button>

                          <button
                            className="btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => handleEdit(prod)}
                            title="Edit creation"
                          >
                            <Edit size={13} color="#38bdf8" />
                          </button>

                          <button
                            className="btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => handleDelete(prod.id, prod.name)}
                            title="Delete creation"
                          >
                            <Trash2 size={13} color="#f87171" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
