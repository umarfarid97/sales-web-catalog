import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Package, 
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  X
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
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
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
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  return (
    <div>
      
      {/* Table Container */}
      <div className="admin-table-container">
        
        {/* Table Toolbar */}
        <div className="admin-table-toolbar">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search SKU, product title..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                style={{ width: '100%', paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
              />
              {searchTable && (
                <button
                  onClick={() => setSearchTable('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ height: '40px', fontSize: '0.85rem' }}
            >
              <option value="All">All Categories</option>
              <option value="Audio">Audio</option>
              <option value="Wearables">Wearables</option>
              <option value="Workstation">Workstation</option>
              <option value="Smart Home">Smart Home</option>
              <option value="Accessories">Accessories</option>
            </select>

            {/* Stock Filter */}
            <select
              value={filterStockStatus}
              onChange={(e) => setFilterStockStatus(e.target.value)}
              style={{ height: '40px', fontSize: '0.85rem' }}
            >
              <option value="all">All Stock Statuses</option>
              <option value="low">Low Stock (&lt; 5)</option>
              <option value="out">Out of Stock (0)</option>
            </select>
          </div>

          <button
            className="btn btn-emerald"
            onClick={handleAddNew}
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>

        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Item & SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th>Ratings</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableItems.length > 0 ? (
                tableItems.map((prod) => {
                  const isOut = prod.stock <= 0;
                  const isLow = prod.stock > 0 && prod.stock < 5;

                  return (
                    <tr key={prod.id}>
                      {/* Product Thumbnail & Details */}
                      <td>
                        <div className="product-row-info">
                          <img src={prod.images[0]} alt={prod.name} className="product-row-thumb" />
                          <div>
                            <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>
                              {prod.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                              {prod.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="badge badge-neutral">{prod.category}</span>
                      </td>

                      {/* Price */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontWeight: 700, color: '#ffffff' }}>
                            ${prod.price.toFixed(2)}
                          </span>
                          {prod.originalPrice > prod.price && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                              ${prod.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Level */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isOut ? (
                            <span className="badge badge-danger">Out of Stock (0)</span>
                          ) : isLow ? (
                            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={12} />
                              Low Stock ({prod.stock})
                            </span>
                          ) : (
                            <span className="badge badge-success">In Stock ({prod.stock})</span>
                          )}
                        </div>
                      </td>

                      {/* Rating */}
                      <td>
                        <span style={{ color: '#fbbf24', fontWeight: 600 }}>★ {prod.rating}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '4px' }}>
                          ({prod.reviewsCount})
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          
                          {/* Quick Restock */}
                          <button
                            onClick={() => restockProduct(prod.id, 10)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                            title="Quick restock +10 units"
                          >
                            <RefreshCw size={13} />
                            <span>+10</span>
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleEdit(prod)}
                            className="btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            title="Edit Product"
                          >
                            <Edit size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="btn-icon"
                            style={{ width: '32px', height: '32px', color: '#fb7185' }}
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No products found matching the criteria.
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
