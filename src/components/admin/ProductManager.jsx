import React, { useState, useDeferredValue, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  resolveProductGender, 
  resolveProductCategory, 
  resolveProductConcentration 
} from '../../utils/taxonomy';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const ProductManager = () => {
  const { 
    products = [], 
    categories = [],
    deleteProduct, 
    setIsProductFormOpen, 
    setEditingProduct
  } = useStore();

  const [searchTable, setSearchTable] = useState('');
  const deferredSearch = useDeferredValue(searchTable);
  const [filterGender, setFilterGender] = useState('All'); // 'All', 'Women', 'Men', 'Unisex'
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStockStatus, setFilterStockStatus] = useState('all'); // 'all', 'low', 'out'

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 25;

  // Reset to page 1 whenever search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearch, filterGender, filterCategory, filterStockStatus]);

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

  // Filtered Table Items using centralized taxonomy and deferred search
  const filteredItems = (products || []).filter((p) => {
    if (!p) return false;
    const pGender = resolveProductGender(p);
    if (filterGender !== 'All' && pGender !== filterGender) return false;

    const pCat = resolveProductCategory(p);
    if (filterCategory !== 'All' && pCat !== filterCategory && p.category !== filterCategory) return false;
    if (filterStockStatus === 'low' && (p.stock >= 5 || p.stock === 0)) return false;
    if (filterStockStatus === 'out' && p.stock > 0) return false;
    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE);


  return (
    <div>
      
      {/* Table Container */}
      <div className="admin-table-container">
        
        {/* Table Toolbar */}
        <div className="admin-table-toolbar">
          
          <div className="admin-table-toolbar-filters">
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="text"
                placeholder="Search SKU, fragrance title..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className="admin-form-input"
                style={{ width: '100%', paddingLeft: '36px', height: '40px', fontSize: '1rem' }}
              />
              {searchTable && (
                <button
                  onClick={() => setSearchTable('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Gender Filter (3 Types Only) */}
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="admin-form-select"
              style={{ height: '40px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="All">All Genders (3 Types)</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Unisex">Unisex</option>
            </select>

            {/* Category (Fragrance Family) Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="admin-form-select"
              style={{ height: '40px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="All">All Categories</option>
              {(categories || []).map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            {/* Stock Level Filter */}
            <select
              value={filterStockStatus}
              onChange={(e) => setFilterStockStatus(e.target.value)}
              className="admin-form-select"
              style={{ height: '40px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock (&lt; 5 bottles)</option>
              <option value="out">Depleted / Out of Stock</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: 'auto' }}>
            <button
              className="admin-btn-primary"
              onClick={handleAddNew}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              <span>Add Perfume</span>
            </button>
          </div>

        </div>

        {/* Desktop Table View */}
        <div className="admin-table-desktop-view">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Perfume Name</th>
                <th>SKU</th>
                <th>Gender</th>
                <th>Category</th>
                <th>Concentration</th>
                <th>Base Price</th>
                <th>Stock (Bottles)</th>
                <th>Sillage Rating</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                    No fragrance records found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((prod) => {
                  const isOutOfStock = prod.stock === 0;
                  const isLow = prod.stock > 0 && prod.stock < 5;
                  const resolvedGender = resolveProductGender(prod);
                  const resolvedCat = resolveProductCategory(prod);
                  const resolvedConc = resolveProductConcentration(prod);

                  return (
                    <tr key={prod.id}>
                      {/* Product Name & Visual */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=120&q=80'}
                            alt={prod.name}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #e5e7eb'
                            }}
                          />
                          <div>
                            <div className="font-serif-title" style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {prod.badge && <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px', marginRight: '6px' }}>{prod.badge}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#4b5563' }}>
                          {prod.sku || 'N/A'}
                        </span>
                      </td>

                      {/* Gender (3 Types Only) */}
                      <td>
                        <span style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 700, 
                          padding: '2px 8px', 
                          borderRadius: '4px',
                          display: 'inline-block',
                          background: resolvedGender === 'Women' ? '#fdf2f8' : (resolvedGender === 'Unisex' ? '#f5f3ff' : '#f0f9ff'),
                          color: resolvedGender === 'Women' ? '#9d174d' : (resolvedGender === 'Unisex' ? '#5b21b6' : '#0369a1'),
                          border: `1px solid ${resolvedGender === 'Women' ? '#fbcfe8' : (resolvedGender === 'Unisex' ? '#ddd6fe' : '#bae6fd')}`
                        }}>
                          {resolvedGender}
                        </span>
                      </td>

                      {/* Category (Fragrance Family) */}
                      <td>
                        <span className="badge badge-neutral">
                          {resolvedCat}
                        </span>
                      </td>

                      {/* Concentration */}
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                          {resolvedConc}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <span style={{ fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>
                          RM {Number(prod.price || 0).toFixed(2)}
                        </span>
                      </td>

                      {/* Stock */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`badge ${
                            isOutOfStock ? 'badge-danger' :
                            isLow ? 'badge-warning' : 'badge-success'
                          }`}>
                            {prod.stock} bottles
                          </span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td>
                        <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                          ★ {prod.rating} <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>({prod.reviewsCount})</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn-icon"
                            onClick={() => handleEdit(prod)}
                            title="Edit perfume"
                          >
                            <Edit size={13} color="#2563eb" />
                          </button>

                          <button
                            className="btn-icon"
                            onClick={() => handleDelete(prod.id, prod.name)}
                            title="Delete perfume"
                          >
                            <Trash2 size={13} color="#dc2626" />
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

        {/* Mobile Cards View (Optimized for Smartphones) */}
        <div className="admin-mobile-cards-view">
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#6b7280', fontSize: '0.88rem' }}>
              No perfume records found matching your filters.
            </div>
          ) : (
            paginatedItems.map((prod) => {
              const isOutOfStock = prod.stock === 0;
              const isLow = prod.stock > 0 && prod.stock < 5;
              const resolvedGender = resolveProductGender(prod);
              const resolvedCat = resolveProductCategory(prod);

              return (
                <div key={prod.id} className="admin-mobile-card">
                  <div className="admin-mobile-card-header">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=120&q=80'}
                      alt={prod.name}
                      className="admin-mobile-card-img"
                    />
                    <div className="admin-mobile-card-info">
                      <div className="admin-mobile-card-title">{prod.name}</div>
                      <div className="admin-mobile-card-meta">
                        <span className="admin-mobile-card-sku">{prod.sku || 'N/A'}</span>
                        <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{resolvedGender}</span>
                        <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{resolvedCat}</span>
                        {prod.badge && (
                          <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>{prod.badge}</span>
                        )}
                      </div>
                      <div className="admin-mobile-card-price-row">
                        <span className="admin-mobile-card-price">RM {Number(prod.price || 0).toFixed(2)}</span>
                        <span className={`badge ${
                          isOutOfStock ? 'badge-danger' :
                          isLow ? 'badge-warning' : 'badge-success'
                        }`} style={{ fontSize: '0.72rem' }}>
                          {prod.stock} bottles
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-mobile-card-actions">
                    <button
                      className="admin-mobile-action-btn"
                      onClick={() => handleEdit(prod)}
                    >
                      <Edit size={13} color="#2563eb" />
                      <span>Edit</span>
                    </button>
                    <button
                      className="admin-mobile-action-btn text-danger"
                      onClick={() => handleDelete(prod.id, prod.name)}
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {filteredItems.length > PAGE_SIZE && (
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
              Showing <strong>{startIndex + 1}</strong>–<strong>{Math.min(startIndex + PAGE_SIZE, filteredItems.length)}</strong> of <strong>{filteredItems.length}</strong> fragrances
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
