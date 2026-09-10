import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Users,
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
  Tag,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const AttributesManager = () => {
  const store = useStore();
  const { 
    attributes = [], 
    genders = [], 
    categories = [], 
    concentrations = [], 
    attributeStats = { genderCounts: {}, categoryCounts: {}, concentrationCounts: {} }, 
    addAttribute, 
    updateAttribute, 
    deleteAttribute,
    refreshStoreData,
    isCloudConnected,
    isLoadingFromCloud,
    showToast,
    products = []
  } = store || {};

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'gender', 'category', 'concentration'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'category',
    name: '',
    value: '',
    displayOrder: 1
  });

  const openAddModal = (defaultType = 'category') => {
    setEditingAttr(null);
    const existingList = defaultType === 'gender' ? genders : (defaultType === 'category' ? categories : concentrations);
    setFormData({
      type: defaultType,
      name: '',
      value: '',
      displayOrder: (existingList?.length || 0) + 1
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (attr) => {
    if (!attr) return;
    setEditingAttr(attr);
    setFormData({
      type: attr.type || 'category',
      name: attr.name || '',
      value: attr.value || attr.name || '',
      displayOrder: attr.displayOrder || 1
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast?.('Attribute name is required', 'error');
      return;
    }

    if (editingAttr) {
      await updateAttribute?.(editingAttr.id, {
        name: formData.name.trim(),
        value: (formData.value || formData.name).trim(),
        displayOrder: Number(formData.displayOrder) || 1
      });
    } else {
      await addAttribute?.({
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
    if (!attr) return;
    if (attr.type === 'gender') {
      showToast?.('Core gender taxonomy (Men, Women, Unisex) is strictly locked to 3 types and cannot be deleted.', 'warning');
      return;
    }

    const count = attr.type === 'category' 
      ? (attributeStats?.categoryCounts?.[attr.name] || 0)
      : (attributeStats?.concentrationCounts?.[attr.name] || 0);

    const typeLabel = attr.type === 'category' ? 'Category' : 'Concentration';
    const confirmMessage = count > 0 
      ? `"${attr.name}" is currently assigned to ${count} perfume(s). Deleting it will leave those products without a matching attribute. Proceed with deletion?`
      : `Delete ${typeLabel.toLowerCase()} "${attr.name}"?`;

    if (window.confirm(confirmMessage)) {
      await deleteAttribute?.(attr.id);
    }
  };

  const sqlMigrationSnippet = `-- ============================================================================
-- VALENSZO HAUTE PARFUMERIE - ATTRIBUTES SCHEMA & DATA MIGRATION (V2)
-- Types: 'gender' (3 types), 'category' (Fragrance Families), 'concentration'
-- ============================================================================

-- 1. Create or update attributes table
CREATE TABLE IF NOT EXISTS public.attributes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Allow 'gender', 'category', 'concentration'
ALTER TABLE public.attributes DROP CONSTRAINT IF EXISTS attributes_type_check;
ALTER TABLE public.attributes ADD CONSTRAINT attributes_type_check 
  CHECK (type IN ('gender', 'category', 'concentration'));

-- 3. Indices
CREATE INDEX IF NOT EXISTS idx_attributes_type ON public.attributes(type);
CREATE INDEX IF NOT EXISTS idx_attributes_order ON public.attributes(display_order);

-- 4. Enable RLS
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Attributes" ON public.attributes;
CREATE POLICY "Public Read Attributes" ON public.attributes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Attributes" ON public.attributes;
CREATE POLICY "Admin All Attributes" ON public.attributes FOR ALL USING (true) WITH CHECK (true);

-- 5. Realtime Sync
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'attributes') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attributes;
  END IF;
END $$;

-- 6. Clean and re-seed
TRUNCATE TABLE public.attributes;

-- 7. Seed GENDERS (3 types only: Women, Men, Unisex)
INSERT INTO public.attributes (id, type, name, value, display_order)
VALUES
  ('gen-women', 'gender', 'Women', 'Women', 1),
  ('gen-men', 'gender', 'Men', 'Men', 2),
  ('gen-unisex', 'gender', 'Unisex', 'Unisex', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, value = EXCLUDED.value, display_order = EXCLUDED.display_order;

-- 8. Seed CATEGORIES (Fragrance Families from real public.products)
INSERT INTO public.attributes (id, type, name, value, display_order)
SELECT 
  'cat-' || TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(family, '[^a-zA-Z0-9]+', '-', 'g'))),
  'category',
  family,
  family,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as display_order
FROM (
  SELECT COALESCE(specs->>'olfactoryFamily', specs->>'character') as family
  FROM public.products
  WHERE COALESCE(specs->>'olfactoryFamily', specs->>'character') IS NOT NULL
    AND COALESCE(specs->>'olfactoryFamily', specs->>'character') NOT IN ('', 'Pour Femme', 'Pour Homme')
) f
GROUP BY family
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, value = EXCLUDED.value, display_order = EXCLUDED.display_order;

-- 9. Seed CONCENTRATIONS directly from real public.products
INSERT INTO public.attributes (id, type, name, value, display_order)
SELECT 
  'conc-' || TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(concentration, '[^a-zA-Z0-9]+', '-', 'g'))),
  'concentration',
  concentration,
  concentration,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as display_order
FROM (
  SELECT specs->>'concentration' as concentration 
  FROM public.products 
  WHERE specs->>'concentration' IS NOT NULL AND specs->>'concentration' != ''
) c
GROUP BY concentration
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, value = EXCLUDED.value, display_order = EXCLUDED.display_order;`;

  const copySqlSnippet = () => {
    navigator.clipboard.writeText(sqlMigrationSnippet);
    setCopiedSql(true);
    showToast?.('Copied PostgreSQL migration SQL to clipboard', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const totalCatalogCount = products?.length || 0;

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      {/* Top Banner & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '6px', maxWidth: '720px', lineHeight: 1.5 }}>
            Centralized taxonomy for the luxury fragrance store. Manage <strong>Gender</strong> (strictly 3 types), <strong>Category</strong> (Fragrance Families), and <strong>Concentration</strong>. All dropdown selectors across the admin portal and product creation are dynamically populated from these records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowSqlGuide(!showSqlGuide)}
            className="admin-btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <Database size={14} color="#0284c7" />
            <span>{showSqlGuide ? 'Hide SQL Script' : 'Supabase SQL Script'}</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
              <Database size={16} color="#0284c7" />
              <span>Supabase SQL Editor Migration Script: public.attributes (V2 Taxonomy)</span>
            </div>
            <button
              onClick={copySqlSnippet}
              className="admin-btn-secondary"
              style={{ fontSize: '0.78rem', padding: '5px 12px', height: 'auto', background: '#0284c7', color: '#ffffff', borderColor: '#0284c7' }}
            >
              {copiedSql ? <Check size={14} color="#ffffff" /> : <Copy size={14} />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '12px', lineHeight: 1.5 }}>
            Run this script once in your <strong>Supabase SQL Editor</strong>. It updates the type constraint to allow <code>gender</code>, <code>category</code>, and <code>concentration</code>, and seeds all 3 Genders, 19 Categories, and 4 Concentrations directly from your 346 real database products.
          </p>
          <pre style={{ 
            background: '#0f172a', 
            color: '#e2e8f0', 
            padding: '14px', 
            borderRadius: '6px', 
            fontSize: '0.78rem', 
            fontFamily: 'monospace', 
            overflowX: 'auto',
            maxHeight: '180px'
          }}>
{sqlMigrationSnippet}
          </pre>
        </div>
      )}

      {/* Filter Tabs Toolbar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: activeTab === 'all' ? '1px solid #111827' : '1px solid #e5e7eb',
            background: activeTab === 'all' ? '#111827' : '#ffffff',
            color: activeTab === 'all' ? '#ffffff' : '#4b5563',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          All Attributes ({ (genders?.length || 0) + (categories?.length || 0) + (concentrations?.length || 0) })
        </button>

        <button
          onClick={() => setActiveTab('gender')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: activeTab === 'gender' ? '1px solid #92400e' : '1px solid #e5e7eb',
            background: activeTab === 'gender' ? '#fef3c7' : '#ffffff',
            color: activeTab === 'gender' ? '#92400e' : '#4b5563',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Users size={13} />
          <span>Gender ({genders?.length || 3})</span>
        </button>

        <button
          onClick={() => setActiveTab('category')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: activeTab === 'category' ? '1px solid #065f46' : '1px solid #e5e7eb',
            background: activeTab === 'category' ? '#ecfdf5' : '#ffffff',
            color: activeTab === 'category' ? '#065f46' : '#4b5563',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Layers size={13} />
          <span>Category ({categories?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('concentration')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: activeTab === 'concentration' ? '1px solid #1e40af' : '1px solid #e5e7eb',
            background: activeTab === 'concentration' ? '#eff6ff' : '#ffffff',
            color: activeTab === 'concentration' ? '#1e40af' : '#4b5563',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sliders size={13} />
          <span>Concentration ({concentrations?.length || 0})</span>
        </button>
      </div>

      {/* Main Sections Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* SECTION 1: GENDER TAXONOMY (3 Types Only) */}
        {(activeTab === 'all' || activeTab === 'gender') && (
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#b38e44" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Gender Taxonomy
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0' }}>
                  Strictly 3 types only: Women, Men, and Unisex. Defines catalog collection partitioning.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  background: '#fef3c7', 
                  color: '#92400e', 
                  padding: '3px 8px', 
                  borderRadius: '4px',
                  border: '1px solid #fde68a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Lock size={11} />
                  <span>3 Types Only (Locked)</span>
                </span>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {(genders || []).map((gen, index) => {
                  const count = attributeStats?.genderCounts?.[gen.name] || 0;
                  const percent = totalCatalogCount > 0 ? ((count / totalCatalogCount) * 100).toFixed(1) : 0;

                  return (
                    <div 
                      key={gen.id || `gen-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 18px',
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ 
                          width: '34px', 
                          height: '34px', 
                          borderRadius: '8px', 
                          background: gen.name === 'Women' ? '#fdf2f8' : (gen.name === 'Unisex' ? '#f5f3ff' : '#f0f9ff'),
                          color: gen.name === 'Women' ? '#9d174d' : (gen.name === 'Unisex' ? '#5b21b6' : '#0369a1'),
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '0.85rem', 
                          fontWeight: 700 
                        }}>
                          {gen.displayOrder || index + 1}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#111827' }}>
                              {gen.name}
                            </span>
                            <span style={{ 
                              fontSize: '0.68rem', 
                              fontWeight: 600, 
                              color: '#059669', 
                              background: '#d1fae5', 
                              padding: '1px 6px', 
                              borderRadius: '4px' 
                            }}>
                              Active
                            </span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '2px' }}>
                            Database Value: <code style={{ fontFamily: 'monospace', color: '#374151' }}>{gen.value || gen.name}</code>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                            {count}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                            {percent}% of catalog
                          </div>
                        </div>

                        <button
                          onClick={() => openEditModal(gen)}
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
                <span>All {totalCatalogCount} perfumes in the store catalog are strictly mapped to these 3 core genders (Women: 219, Men: 104, Unisex: 23).</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CATEGORIES (Fragrance Families) */}
        {(activeTab === 'all' || activeTab === 'category') && (
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#b38e44" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Product Categories (Fragrance Families)
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0' }}>
                  Olfactory scent families (Fresh, Floral, Woody, Gourmand, etc.). Populates the Category dropdown in Product Form and customer navigation lineup.
                </p>
              </div>

              <button
                onClick={() => openAddModal('category')}
                className="admin-btn-primary"
                style={{ fontSize: '0.8rem', padding: '7px 14px', height: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                {(categories || []).map((cat, index) => {
                  const count = attributeStats?.categoryCounts?.[cat.name] || 0;
                  const percent = totalCatalogCount > 0 ? ((count / totalCatalogCount) * 100).toFixed(1) : 0;

                  return (
                    <div 
                      key={cat.id || `cat-${index}`}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '6px', 
                          background: '#f4f4f5', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '0.8rem', 
                          fontWeight: 700, 
                          color: '#4b5563',
                          flexShrink: 0
                        }}>
                          {cat.displayOrder || index + 1}
                        </div>

                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {cat.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '1px' }}>
                            Slug: <code style={{ fontFamily: 'monospace', color: '#4b5563' }}>{cat.id}</code>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                            {count}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>
                            perfumes ({percent}%)
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => openEditModal(cat)}
                            className="admin-btn-secondary"
                            style={{ padding: '5px 8px', height: 'auto', fontSize: '0.72rem' }}
                            title="Edit Category"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            className="admin-btn-secondary"
                            style={{ padding: '5px 8px', height: 'auto', fontSize: '0.72rem', color: '#dc2626' }}
                            title="Delete Category"
                          >
                            <Trash2 size={12} />
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
                <Sparkles size={15} color="#10b981" />
                <span>Categories represent fragrance scent families and automatically populate the Category dropdown in product forms and customer collection filters.</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: CONCENTRATIONS (Dropdown Options) */}
        {(activeTab === 'all' || activeTab === 'concentration') && (
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} color="#b38e44" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Fragrance Concentrations
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0' }}>
                  Defines fragrance oil ratios (Extrait, EDP Intense, EDP). Populates the Concentration dropdown in Product Form.
                </p>
              </div>

              <button
                onClick={() => openAddModal('concentration')}
                className="admin-btn-primary"
                style={{ fontSize: '0.8rem', padding: '7px 14px', height: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Add Concentration</span>
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                {(concentrations || []).map((conc, index) => {
                  const count = attributeStats?.concentrationCounts?.[conc.name] || 0;
                  const percent = totalCatalogCount > 0 ? ((count / totalCatalogCount) * 100).toFixed(1) : 0;

                  return (
                    <div 
                      key={conc.id || `conc-${index}`}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '6px', 
                          background: '#f4f4f5', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '0.8rem', 
                          fontWeight: 700, 
                          color: '#4b5563' 
                        }}>
                          {conc.displayOrder || index + 1}
                        </div>

                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>
                            {conc.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '1px' }}>
                            Dropdown Value: <code style={{ fontFamily: 'monospace', color: '#374151' }}>{conc.value || conc.name}</code>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                            {count}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>
                            perfumes ({percent}%)
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => openEditModal(conc)}
                            className="admin-btn-secondary"
                            style={{ padding: '5px 8px', height: 'auto', fontSize: '0.72rem' }}
                            title="Edit Concentration"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(conc)}
                            className="admin-btn-secondary"
                            style={{ padding: '5px 8px', height: 'auto', fontSize: '0.72rem', color: '#dc2626' }}
                            title="Delete Concentration"
                          >
                            <Trash2 size={12} />
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
                <span>Any concentration managed here appears immediately in the Product form concentration dropdown.</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Attribute Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div 
            className="modal-content admin-modal-light"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '460px', background: '#ffffff', color: '#0b0c10', borderRadius: '10px' }}
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
                {editingAttr 
                  ? `Edit ${editingAttr.type === 'gender' ? 'Gender' : (editingAttr.type === 'category' ? 'Category' : 'Concentration')}` 
                  : `Add New ${formData.type === 'category' ? 'Category' : 'Concentration'}`}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0' }}>
                {editingAttr ? 'Update attribute label and ordering in database.' : 'Define a new store taxonomy attribute for products.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              
              {!editingAttr && (
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="admin-form-label">Attribute Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="admin-form-select"
                  >
                    <option value="category">Category (Fragrance Family)</option>
                    <option value="concentration">Concentration</option>
                  </select>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="admin-form-label">
                  {formData.type === 'gender' ? 'Gender Name *' : (formData.type === 'category' ? 'Category / Fragrance Family Name *' : 'Concentration Name *')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, value: e.target.value })}
                  placeholder={formData.type === 'category' ? 'e.g. Amber / Warm / Oriental' : (formData.type === 'gender' ? 'e.g. Women' : 'e.g. Extrait de Parfum (35%)')}
                  className="admin-form-input"
                  disabled={editingAttr && editingAttr.type === 'gender'}
                />
                {editingAttr && editingAttr.type === 'gender' && (
                  <span style={{ fontSize: '0.72rem', color: '#92400e', marginTop: '4px', display: 'block' }}>
                    Core gender names (Women, Men, Unisex) cannot be renamed to preserve catalog collections.
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
                <span style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Lower numbers appear first in selector dropdowns.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
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

export default AttributesManager;