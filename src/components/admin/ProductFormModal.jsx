import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  resolveProductGender, 
  resolveProductCategory, 
  resolveProductConcentration 
} from '../../utils/taxonomy';
import { X, Save } from 'lucide-react';

export const ProductFormModal = () => {
  const { 
    isProductFormOpen, 
    setIsProductFormOpen, 
    editingProduct, 
    addProduct, 
    updateProduct,
    genders,
    categories,
    concentrations
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    sku: '',
    gender: 'Men',
    category: 'Fresh / Aquatic / Citrus',
    concentration: 'Extrait de Parfum (30%)',
    price_30ml: '',
    price_50ml: '',
    price_100ml: '',
    stock: '15',
    rating: '',
    reviewsCount: '0',
    badge: 'New Release',
    tagline: '',
    description: '',
    topNotes: 'Calabrian Bergamot, Spiced Saffron, Pink Pepper',
    heartNotes: 'Damascena Rose, Midnight Jasmine, Incense',
    baseNotes: 'Royal Agarwood Oud, Ambergris, Bourbon Vanilla',
    longevity: '14+ Hours (Eternal)',
    sillage: 'Enveloping & Magnetic',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
    isFeatured: false
  });

  useEffect(() => {
    const defaultConc = concentrations && concentrations.length > 0 ? concentrations[0].name : 'Extrait de Parfum (30%)';
    const defaultCat = categories && categories.length > 0 ? categories[0].name : 'Fresh / Aquatic / Citrus';
    
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        brand: editingProduct.brand || editingProduct.brandInspiration || '',
        sku: editingProduct.sku || '',
        gender: resolveProductGender(editingProduct),
        category: resolveProductCategory(editingProduct, defaultCat),
        concentration: resolveProductConcentration(editingProduct, defaultConc),
        price_30ml: editingProduct.price_30ml?.toString() || (editingProduct.sizes?.find(s => s.ml === 30)?.price?.toString() || '45.00'),
        price_50ml: editingProduct.price_50ml?.toString() || (editingProduct.sizes?.find(s => s.ml === 50)?.price?.toString() || '65.00'),
        price_100ml: editingProduct.price_100ml?.toString() || (editingProduct.sizes?.find(s => s.ml === 100)?.price?.toString() || '125.00'),
        stock: editingProduct.stock?.toString() || '',
        rating: editingProduct.rating?.toString() || '4.95',
        reviewsCount: editingProduct.reviewsCount?.toString() || '24',
        badge: editingProduct.badge || '',
        tagline: editingProduct.tagline || '',
        description: editingProduct.description || '',
        topNotes: editingProduct.pyramid?.topNotes?.join(', ') || '',
        heartNotes: editingProduct.pyramid?.heartNotes?.join(', ') || '',
        baseNotes: editingProduct.pyramid?.baseNotes?.join(', ') || '',
        longevity: editingProduct.longevity || '14+ Hours',
        sillage: editingProduct.sillage || 'Enveloping',
        imageUrl: editingProduct.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
        isFeatured: !!editingProduct.isFeatured
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        sku: `VAL-PAR-${Math.floor(100 + Math.random() * 900)}`,
        gender: 'Men',
        category: defaultCat,
        concentration: defaultConc,
        price_30ml: '45.00',
        price_50ml: '65.00',
        price_100ml: '125.00',
        stock: '15',
        rating: '',
        reviewsCount: '0',
        badge: 'New Release',
        tagline: '',
        description: '',
        topNotes: 'Calabrian Bergamot, Spiced Saffron, Pink Pepper',
        heartNotes: 'Damascena Rose, Midnight Jasmine, Incense',
        baseNotes: 'Royal Agarwood Oud, Ambergris, Bourbon Vanilla',
        longevity: '14+ Hours (Eternal)',
        sillage: 'Enveloping & Magnetic',
        imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
        isFeatured: false
      });
    }
  }, [editingProduct, isProductFormOpen, concentrations, categories]);

  if (!isProductFormOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const p30 = parseFloat(formData.price_30ml) || 45;
    const p50 = parseFloat(formData.price_50ml) || 65;
    const p100 = parseFloat(formData.price_100ml) || 125;

    const productPayload = {
      ...formData,
      brand: formData.brand,
      brandInspiration: formData.brand,
      gender: formData.gender,
      category: formData.category,
      character: formData.category,
      olfactoryFamily: formData.category,
      concentration: formData.concentration,
      price_30ml: p30,
      price_50ml: p50,
      price_100ml: p100,
      price: p30,
      stock: parseInt(formData.stock, 10) || 0,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      reviewsCount: parseInt(formData.reviewsCount, 10) || 0,
      specs: {
        ...(editingProduct?.specs || {}),
        brandInspiration: formData.brand,
        gender: formData.gender,
        category: formData.category,
        character: formData.category,
        olfactoryFamily: formData.category,
        concentration: formData.concentration
      },
      pyramid: {
        topNotes: formData.topNotes.split(',').map((s) => s.trim()).filter(Boolean),
        heartNotes: formData.heartNotes.split(',').map((s) => s.trim()).filter(Boolean),
        baseNotes: formData.baseNotes.split(',').map((s) => s.trim()).filter(Boolean)
      },
      sizes: [
        { label: '30 ml Travel Atomizer', ml: 30, price: p30, isRefillable: true },
        { label: '50 ml Haute Flacon', ml: 50, price: p50, isRefillable: true },
        { label: '100 ml Collector Flacon', ml: 100, price: p100, isRefillable: true }
      ],
      images: [formData.imageUrl]
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }
  };


  return (
    <div 
      className="modal-overlay"
      onClick={() => setIsProductFormOpen(false)}
    >
      <div 
        className="modal-content modal-content-lg admin-modal-light"
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#ffffff', color: '#0b0c10', border: '1px solid #e5e7eb', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.2)' }}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsProductFormOpen(false)}
          aria-label="Close Product Form"
        >
          <X size={18} />
        </button>

        <div style={{ padding: 'clamp(18px, 4vw, 28px)', borderBottom: '1px solid #e5e7eb' }}>
          <h2 className="font-serif-title" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.4rem)', fontWeight: 700, color: '#0b0c10' }}>
            {editingProduct ? 'Edit Perfume' : 'Add New Perfume'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '4px' }}>
            Configure fragrance notes, inventory, and perfume specifications.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
          
          <div className="admin-modal-form-grid">
            
            {/* Left: General Info */}
            <div>
              <div className="admin-form-row-2col">
                <div className="form-group">
                  <label className="admin-form-label">Fragrance Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Oud Royal Extrait"
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="admin-form-label">Brand / Inspired By</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Louis Vuitton, Chanel, Dior"
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="admin-form-row-2col">
                <div className="form-group">
                  <label className="admin-form-label">Gender (3 Types Only) *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="admin-form-select"
                  >
                    {[...(genders || [])].sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((gen) => (
                      <option key={gen.id} value={gen.name}>{gen.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="admin-form-label">Concentration (Extrait / EDP) *</label>
                  <select
                    value={formData.concentration}
                    onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                    className="admin-form-select"
                  >
                    {[...(concentrations || [])].sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((conc) => (
                      <option key={conc.id} value={conc.name}>{conc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="admin-form-label">Category (Fragrance Family) *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="admin-form-select"
                >
                  {[...(categories || [])].sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>


              <div className="admin-form-row-3col">
                <div className="form-group">
                  <label className="admin-form-label">30ml Price (RM) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price_30ml}
                    onChange={(e) => setFormData({ ...formData, price_30ml: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="admin-form-label">50ml Price (RM) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price_50ml}
                    onChange={(e) => setFormData({ ...formData, price_50ml: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="admin-form-label">100ml Price (RM) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price_100ml}
                    onChange={(e) => setFormData({ ...formData, price_100ml: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="admin-form-label">Bottles in Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="admin-form-label">Tagline (Notes Preview)</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Imperial Agarwood, Spiced Persian Saffron & May Rose"
                  className="admin-form-input"
                />
              </div>

              <div className="form-group">
                <label className="admin-form-label">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-form-textarea"
                />
              </div>
            </div>

            {/* Right: Notes Pyramid & Image */}
            <div>
              <div style={{ padding: '16px', background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b38e44', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Olfactory Pyramid Breakdown
                </div>

                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="admin-form-label" style={{ fontSize: '0.74rem' }}>Top Notes (Comma-separated)</label>
                  <input
                    type="text"
                    value={formData.topNotes}
                    onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                    className="admin-form-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="admin-form-label" style={{ fontSize: '0.74rem' }}>Heart Notes (Comma-separated)</label>
                  <input
                    type="text"
                    value={formData.heartNotes}
                    onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                    className="admin-form-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label" style={{ fontSize: '0.74rem' }}>Base Notes (Comma-separated)</label>
                  <input
                    type="text"
                    value={formData.baseNotes}
                    onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                    className="admin-form-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="admin-form-label">Product Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-row-2col">
                <div className="form-group">
                  <label className="admin-form-label">Longevity</label>
                  <input
                    type="text"
                    value={formData.longevity}
                    onChange={(e) => setFormData({ ...formData, longevity: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="admin-form-label">Sillage</label>
                  <input
                    type="text"
                    value={formData.sillage}
                    onChange={(e) => setFormData({ ...formData, sillage: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#111827', cursor: 'pointer', marginTop: '12px', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  style={{ accentColor: '#000000', width: '16px', height: '16px' }}
                />
                <span>Feature on Home Page Showcase</span>
              </label>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setIsProductFormOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary">
              <Save size={16} />
              <span>{editingProduct ? 'Update Perfume' : 'Save Perfume'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
