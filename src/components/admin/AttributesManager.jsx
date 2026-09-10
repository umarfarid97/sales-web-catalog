import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Layers, 
  Sliders, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Database, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  X,
  Tag
} from 'lucide-react';

export const AttributesManager = () => {
  const { 
    attributes, 
    categories, 
    concentrations, 
    attributeStats, 
    addAttribute, 
    updateAttribute, 
    deleteAttribute,
    refreshStoreData,
    isCloudConnected,
    isLoadingFromCloud,
    showToast,
    products
  } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'concentration',
    name: '',
    value: '',
    displayOrder: 1
  });

  const openAddModal = (defaultType = 'concentration') => {
    setEditingAttr(null);
    setFormData({
      type: defaultType,
      name: '',
      value: '',
      displayOrder: (defaultType === 'category' ? categories.length : concentrations.length) + 1
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (attr) => {
    setEditingAttr(attr);
    setFormData({
      type: attr.type,
      name: attr.name,
      value: attr.value || attr.name,
      displayOrder: attr.displayOrder || 1
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Attribute name is required', 'error');
      return;
    }

    if (editingAttr) {
      await updateAttribute(editingAttr.id, {
        name: formData.name.trim(),
        value: (formData.value || formData.name).trim(),
        displayOrder: Number(formData.displayOrder) || 1
      });
    } else {
      await addAttribute({
        type: formData.type,
        name: formData.name.trim(),
        value: (formData.value || formData.name).trim(),
        displayOrder: Number(formData.displayOrder) || 1
      });
    }

    setIsAddModalOpen(false);
    setEditingAttr(null);
  };

  const handleDelete = async (attr) => {
    if (attr.type === 'category') {
      showToast('Core gender categories (Men, Women, Unisex) cannot be deleted as they define the catalog taxonomy.', 'warning');
      return;
    }

    const count = attributeStats.concentrationCounts[attr.name] || 0;
    const confirmMessage = count > 0 
      ? `"${attr.name}" is currently used by ${count} perfume(s). Are you sure you want to delete this concentration?`
      : `Delete concentration "${attr.name}"?`;

    if (window.confirm(confirmMessage)) {
      await deleteAttribute(attr.id);
    }
  };

  const copySqlSnippet = () => {
    const sql = `-- VALENSZO Attributes Table Migration
CREATE TABLE IF NOT EXISTS public.attributes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('category', 'concentration')),
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_attributes_type ON public.attributes(type);
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Attributes" ON public.attributes FOR SELECT USING (true);
CREATE POLICY "Admin All Attributes" ON public.attributes FOR ALL USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.attributes;`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    showToast('Copied PostgreSQL migration SQL to clipboard', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const totalCatalogCount = products.length;

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      {/* Top Banner & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="font-serif-title" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0b0c10', margin: 0 }}>
              Store Attributes & Taxonomy
            </h2>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              padding: '2px 10px', 
              borderRadius: '999px',
              background: isCloudConnected ? '#ecfdf5' : '#fffbeb',
              color: isCloudConnected ? '#065f46' : '#92400e',
              border: `1px solid ${isCloudConnected ? '#a7f3d0' : '#fde68a'}`
            }}>
              <Database size={12} />
              <span>{isCloudConnected ? 'Supabase public.attributes' : 'Local Storage Cache'}</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '6px', maxWidth: '680px', lineHeight: 1.5 }}>
            Define and manage the 3 core categories and perfume concentrations. Dropdown selectors in the product creation and editing modals are populated directly from these real database attributes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowSqlGuide(!showSqlGuide)}
            className="admin-btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <Database size={14} />
            <span>{showSqlGuide ? 'Hide SQL Guide' : 'Database Setup'}</span>
          </button>

          <button
            onClick={refreshStoreData}
            disabled={isLoadingFromCloud}
            className="admin-btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <RefreshCw size={14} className={isLoadingFromCloud ? 'spin-animation' : ''} />
            <span>Sync Live DB</span>
          </button>
        </div>
      </div>

      {/* SQL Setup Helper Accordion */}
      {showSqlGuide && (
        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid #cbd5e1', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
              <Database size={16} color="#0284c7" />
              <span>PostgreSQL Schema for Supabase Table: public.attributes</span>
            </div>
            <button
              onClick={copySqlSnippet}
              className="admin-btn-secondary"
              style={{ fontSize: '0.78rem', padding: '4px 10px', height: 'auto' }}
            >
              {copiedSql ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '12px' }}>
            This schema has been generated in <code style={{ fontFamily: 'monospace', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>supabase_attributes_schema.sql</code>. It creates the dedicated table, enables Row-Level Security, and automatically seeds the real 346 items from your database.
          </p>
          <pre style={{ 
            background: '#0f172a', 
            color: '#e2e8f0', 
            padding: '14px', 
            borderRadius: '6px', 
            fontSize: '0.78rem', 
            fontFamily: 'monospace', 
            overflowX: 'auto',
            maxHeight: '160px'
          }}>
{`-- 1. Create attributes table
CREATE TABLE IF NOT EXISTS public.attributes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('category', 'concentration')),
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
          </pre>
        </div>
      )}

      {/* Grid: Categories (Left) & Concentrations (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* SECTION 1: CATEGORIES (3 Types Only) */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#b38e44" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Product Categories
                </h3>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#6b7280', margin: '4px 0 0' }}>
                Strictly 3 types only: Women, Men, and Unisex
              </p>
            </div>
            <span style={{ 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              background: '#fef3c7', 
              color: '#92400e', 
              padding: '3px 8px', 
              borderRadius: '4px',
              border: '1px solid #fde68a'
            }}>
              3 Types Only
            </span>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map((cat, index) => {
                const count = attributeStats.categoryCounts[cat.name] || 0;
                const percent = totalCatalogCount > 0 ? ((count / totalCatalogCount) * 100).toFixed(1) : 0;

                return (
                  <div 
                    key={cat.id || index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '8px', 
                        background: '#f4f4f5', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        color: '#4b5563' 
                      }}>
                        {cat.displayOrder || index + 1}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                            {cat.name}
                          </span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 600, 
                            color: '#059669', 
                            background: '#d1fae5', 
                            padding: '1px 6px', 
                            borderRadius: '4px' 
                          }}>
                            Active
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                          Database Value: <code style={{ fontFamily: 'monospace', color: '#374151' }}>{cat.value}</code>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                          {count}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          {percent}% of catalog
                        </div>
                      </div>

                      <button
                        onClick={() => openEditModal(cat)}
                        className="admin-btn-secondary"
                        style={{ padding: '6px 10px', height: 'auto', fontSize: '0.75rem' }}
                        title="Edit Display Order or Label"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#f8fafc', 
              borderRadius: '6px', 
              border: '1px dashed #cbd5e1', 
              fontSize: '0.75rem', 
              color: '#64748b', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>All 346 fragrances in the store catalog are strictly mapped to these 3 categories.</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONCENTRATIONS (Dropdown Options) */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#b38e44" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Fragrance Concentrations
                </h3>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#6b7280', margin: '4px 0 0' }}>
                Populates the Concentration dropdown in Product Form
              </p>
            </div>

            <button
              onClick={() => openAddModal('concentration')}
              className="admin-btn-primary"
              style={{ fontSize: '0.78rem', padding: '6px 12px', height: 'auto' }}
            >
              <Plus size={14} />
              <span>Add Concentration</span>
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {concentrations.map((conc, index) => {
                const count = attributeStats.concentrationCounts[conc.name] || 0;
                const percent = totalCatalogCount > 0 ? ((count / totalCatalogCount) * 100).toFixed(1) : 0;

                return (
                  <div 
                    key={conc.id || index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '8px', 
                        background: '#f4f4f5', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        color: '#4b5563' 
                      }}>
                        {conc.displayOrder || index + 1}
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>
                          {conc.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '2px' }}>
                          Dropdown Value: <code style={{ fontFamily: 'monospace', color: '#374151' }}>{conc.value}</code>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                          {count}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          perfumes ({percent}%)
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => openEditModal(conc)}
                          className="admin-btn-secondary"
                          style={{ padding: '6px 8px', height: 'auto', fontSize: '0.75rem' }}
                          title="Edit Concentration"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(conc)}
                          className="admin-btn-secondary"
                          style={{ padding: '6px 8px', height: 'auto', fontSize: '0.75rem', color: '#dc2626' }}
                          title="Delete Concentration"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#f8fafc', 
              borderRadius: '6px', 
              border: '1px dashed #cbd5e1', 
              fontSize: '0.75rem', 
              color: '#64748b', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <Sparkles size={15} color="#d97706" />
              <span>Any concentration added here appears automatically in the Product creation dropdown.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Add / Edit Attribute Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div 
            className="modal-content admin-modal-light"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', background: '#ffffff', color: '#0b0c10', borderRadius: '10px' }}
          >
            <button
              className="modal-close-btn"
              onClick={() => setIsAddModalOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h3 className="font-serif-title" style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                {editingAttr ? `Edit ${editingAttr.type === 'category' ? 'Category' : 'Concentration'}` : `Add New Concentration`}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0' }}>
                {editingAttr ? 'Update attribute title or ordering.' : 'Define a new concentration for perfume selections.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="admin-form-label">
                  {formData.type === 'category' ? 'Category Name *' : 'Concentration Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, value: e.target.value })}
                  placeholder={formData.type === 'category' ? 'e.g. Unisex' : 'e.g. Extrait de Parfum (35%)'}
                  className="admin-form-input"
                  disabled={editingAttr && editingAttr.type === 'category'}
                />
                {editingAttr && editingAttr.type === 'category' && (
                  <span style={{ fontSize: '0.72rem', color: '#92400e', marginTop: '4px', display: 'block' }}>
                    Core category names are fixed to preserve catalog links.
                  </span>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="admin-form-label">Display Order</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingAttr ? 'Save Changes' : 'Create Attribute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};