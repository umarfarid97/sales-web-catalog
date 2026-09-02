import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Package, Save, Plus, Image as ImageIcon } from 'lucide-react';

export const ProductFormModal = () => {
  const { 
    isProductFormOpen, 
    setIsProductFormOpen, 
    editingProduct, 
    setEditingProduct, 
    addProduct, 
    updateProduct 
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Audio',
    price: '',
    originalPrice: '',
    stock: '',
    rating: '4.8',
    reviewsCount: '24',
    badge: '',
    tagline: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    isFeatured: false
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        sku: editingProduct.sku || '',
        category: editingProduct.category || 'Audio',
        price: editingProduct.price?.toString() || '',
        originalPrice: editingProduct.originalPrice?.toString() || '',
        stock: editingProduct.stock?.toString() || '',
        rating: editingProduct.rating?.toString() || '4.8',
        reviewsCount: editingProduct.reviewsCount?.toString() || '24',
        badge: editingProduct.badge || '',
        tagline: editingProduct.tagline || '',
        description: editingProduct.description || '',
        imageUrl: editingProduct.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
        isFeatured: !!editingProduct.isFeatured
      });
    } else {
      setFormData({
        name: '',
        sku: `LUM-${Math.floor(100 + Math.random() * 900)}`,
        category: 'Audio',
        price: '',
        originalPrice: '',
        stock: '15',
        rating: '4.9',
        reviewsCount: '12',
        badge: 'New Drop',
        tagline: '',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80',
        isFeatured: false
      });
    }
  }, [editingProduct, isProductFormOpen]);

  if (!isProductFormOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const productPayload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      rating: parseFloat(formData.rating) || 5.0,
      reviewsCount: parseInt(formData.reviewsCount, 10) || 0,
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
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsProductFormOpen(false)}
          aria-label="Close Product Form"
        >
          <X size={18} />
        </button>

        <div style={{ padding: '32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <Package size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {editingProduct ? `Updating SKU: ${editingProduct.sku}` : 'Fill in the details below to publish a new hardware item'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              
              {/* Left Column: Core Fields */}
              <div>
                <div className="form-group">
                  <label>Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Ultra ANC Wireless Headphones"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>SKU Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="LUM-AUD-009"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Audio">Audio</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Workstation">Workstation</option>
                      <option value="Smart Home">Smart Home</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Sale Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="299.99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Original / MSRP ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="349.99"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Stock Count *</label>
                    <input
                      type="number"
                      required
                      placeholder="25"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Badge / Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Best Seller, Sale, New"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Short Tagline</label>
                  <input
                    type="text"
                    placeholder="Lossless spatial audio with active noise cancellation"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Description</label>
                  <textarea
                    rows="3"
                    placeholder="Enter full technical details, acoustic features, materials, and usage."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Right Column: Image Preview & Settings */}
              <div>
                <div className="form-group">
                  <label>Product Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                {/* Instant Image Preview */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Live Preview:
                  </label>
                  <div 
                    style={{
                      width: '100%',
                      height: '200px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      background: '#151822',
                      border: '1px solid var(--border-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                    ) : (
                      <div style={{ color: 'var(--text-dim)', textAlign: 'center' }}>
                        <ImageIcon size={32} style={{ margin: '0 auto 6px' }} />
                        <div style={{ fontSize: '0.8rem' }}>Enter an image URL</div>
                      </div>
                    )}
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '24px' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                  />
                  <span>Mark as Featured Flagship Drop (Show in Hero Banner)</span>
                </label>
              </div>

            </div>

            {/* Form Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsProductFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-emerald"
                style={{ padding: '10px 24px' }}
              >
                <Save size={16} />
                <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
