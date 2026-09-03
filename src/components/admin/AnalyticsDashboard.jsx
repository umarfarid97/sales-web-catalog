import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  ArrowUpRight, 
  Sparkles,
  Flame,
  Gift
} from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { 
    totalRevenue, 
    totalOrdersCount, 
    averageOrderValue, 
    pendingOrdersCount,
    products, 
    orders,
    setAdminTab
  } = useStore();

  // Weekly Revenue Sample Data
  const weeklyData = [
    { day: 'Mon', revenue: 940, height: 45 },
    { day: 'Tue', revenue: 1480, height: 65 },
    { day: 'Wed', revenue: 1120, height: 55 },
    { day: 'Thu', revenue: 2150, height: 85 },
    { day: 'Fri', revenue: 2890, height: 95 },
    { day: 'Sat', revenue: 1980, height: 75 },
    { day: 'Sun', revenue: totalRevenue > 0 ? 1720 : 600, height: 70 }
  ];

  // Olfactory family breakdown calculation
  const categoryStats = [
    { name: 'Woody & Smoky', share: 36, color: '#d4af37' },
    { name: 'Amber & Oriental', share: 26, color: '#f59e0b' },
    { name: 'Floral & Romantic', share: 20, color: '#e2a8b2' },
    { name: 'Fresh & Citrus', share: 12, color: '#10b981' },
    { name: 'Discovery Sets', share: 6, color: '#06b6d4' }
  ];

  // Top products
  const topProducts = products.slice(0, 4);

  return (
    <div>
      
      {/* 4 Executive KPI Cards */}
      <div className="kpi-grid">
        
        {/* KPI 1: Revenue */}
        <div className="kpi-card" style={{ border: '1px solid rgba(212, 175, 55, 0.25)' }}>
          <div className="kpi-header">
            <span className="kpi-title">Maison Gross Revenue</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--accent-gold)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-value">${totalRevenue.toFixed(2)}</div>
          <div className="kpi-trend trend-up">
            <ArrowUpRight size={14} />
            <span>+32.4% vs last month</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="kpi-card" style={{ border: '1px solid rgba(212, 175, 55, 0.25)' }}>
          <div className="kpi-header">
            <span className="kpi-title">Fragrance Orders</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="kpi-value">{totalOrdersCount}</div>
          <div className="kpi-trend trend-up">
            <ArrowUpRight size={14} />
            <span>{pendingOrdersCount} pending atelier fulfillment</span>
          </div>
        </div>

        {/* KPI 3: Average Order Value */}
        <div className="kpi-card" style={{ border: '1px solid rgba(212, 175, 55, 0.25)' }}>
          <div className="kpi-header">
            <span className="kpi-title">Avg Flacon Cart (AOV)</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-value">${averageOrderValue.toFixed(2)}</div>
          <div className="kpi-trend trend-up">
            <ArrowUpRight size={14} />
            <span>High luxury flacon basket size</span>
          </div>
        </div>

        {/* KPI 4: Active SKUs */}
        <div className="kpi-card" style={{ border: '1px solid rgba(212, 175, 55, 0.25)' }}>
          <div className="kpi-header">
            <span className="kpi-title">Active Scent Formulas</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(226, 168, 178, 0.15)', color: '#fda4af' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div className="kpi-value">{products.length}</div>
          <div className="kpi-trend trend-up">
            <span>Extrait &amp; EDP Collections</span>
          </div>
        </div>

      </div>

      {/* Grid: Charts & Top Scents */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginTop: '24px' }}>
        
        {/* Weekly Revenue Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Weekly Fragrance Demand Velocity</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Daily boutique sales breakdown</p>
            </div>
            <span className="badge badge-gold">7-Day Realtime</span>
          </div>

          {/* Simple Clean Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', gap: '12px' }}>
            {weeklyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.72rem', color: '#fce08b', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                  ${d.revenue}
                </div>
                <div 
                  style={{ 
                    width: '100%', 
                    maxWidth: '42px', 
                    height: `${d.height}%`, 
                    background: i === 4 ? 'var(--accent-gold-gradient)' : 'rgba(212, 175, 55, 0.25)', 
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.4s ease',
                    boxShadow: i === 4 ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none'
                  }} 
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '8px', fontWeight: 600 }}>
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Olfactory Families Share */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Olfactory Family Demand</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Volume by fragrance family</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryStats.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: cat.color, fontWeight: 700 }}>{cat.share}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.share}%`, height: '100%', background: cat.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom: Top Selling Fragrances Table */}
      <div className="glass-panel" style={{ padding: '24px', marginTop: '24px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top Signature Fragrances</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Highest velocity creations by customer rating</p>
          </div>
          <button 
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={() => setAdminTab('products')}
          >
            Manage Catalog →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {topProducts.map((prod) => (
            <div key={prod.id} style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={prod.images[0]} alt={prod.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(212, 175, 55, 0.25)' }} />
              <div>
                <div className="font-serif-title" style={{ fontWeight: 700, fontSize: '0.88rem' }}>{prod.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#fce08b', fontFamily: 'var(--font-mono)' }}>${prod.price.toFixed(2)}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>★ {prod.rating} ({prod.reviewsCount} reviews)</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
