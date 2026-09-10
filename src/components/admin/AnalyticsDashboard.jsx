import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Wallet, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles
} from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { 
    totalRevenue, 
    totalOrdersCount, 
    averageOrderValue, 
    pendingOrdersCount,
    products, 
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
    { name: 'Woody & Smoky', share: 36, color: '#b45309' },
    { name: 'Amber & Oriental', share: 26, color: '#d97706' },
    { name: 'Floral & Romantic', share: 20, color: '#db2777' },
    { name: 'Fresh & Citrus', share: 12, color: '#059669' },
    { name: 'Discovery Sets', share: 6, color: '#0891b2' }
  ];

  // Top products
  const topProducts = products.slice(0, 4);

  return (
    <div>
      
      {/* 4 Executive KPI Cards */}
      <div className="kpi-grid">
        
        {/* KPI 1: Revenue */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Revenue</span>
            <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#b45309' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div className="kpi-value">RM {totalRevenue.toFixed(2)}</div>
          <div className="kpi-trend trend-up">
            <ArrowUpRight size={14} />
            <span>+32.4% vs last month</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Orders</span>
            <div className="kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="kpi-value">{totalOrdersCount}</div>
          <div className="kpi-trend trend-up">
            <ArrowUpRight size={14} />
            <span>{pendingOrdersCount} pending fulfillment</span>
          </div>
        </div>

        {/* KPI 3: Average Order Value */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Average Order Value (AOV)</span>
            <div className="kpi-icon-box" style={{ background: '#fffbeb', color: '#d97706' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-value">RM {averageOrderValue.toFixed(2)}</div>
          <div className="kpi-trend trend-up">
            <ArrowUpRight size={14} />
            <span>Healthy basket size</span>
          </div>
        </div>

        {/* KPI 4: Active SKUs */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Scent Formulas</span>
            <div className="kpi-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}>
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
      <div className="admin-charts-grid">
        
        {/* Weekly Revenue Bar Chart */}
        <div className="admin-card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b0c10' }}>Weekly Perfume Sales</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Daily store sales breakdown</p>
            </div>
            <span className="badge badge-gold">7-Day Realtime</span>
          </div>

          {/* Simple Clean Bar Chart */}
          <div className="admin-bar-chart-wrap" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', gap: '10px' }}>
            {weeklyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', minWidth: 0 }}>
                <div className="admin-bar-value" style={{ fontSize: '0.74rem', color: '#111827', fontWeight: 700, marginBottom: '6px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  RM {d.revenue}
                </div>
                <div 
                  style={{ 
                    width: '100%', 
                    maxWidth: '42px', 
                    height: `${d.height}%`, 
                    background: i === 4 ? '#b38e44' : '#e5e7eb', 
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    boxShadow: i === 4 ? '0 4px 12px rgba(179, 142, 68, 0.35)' : 'none'
                  }} 
                />
                <div className="admin-bar-day" style={{ fontSize: '0.78rem', color: '#4b5563', marginTop: '8px', fontWeight: 600 }}>
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Olfactory Families Share */}
        <div className="admin-card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b0c10' }}>Olfactory Family Demand</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Volume by fragrance family</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryStats.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{cat.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: cat.color, fontWeight: 700 }}>{cat.share}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.share}%`, height: '100%', background: cat.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom: Top Selling Fragrances Table */}
      <div className="admin-card-panel" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b0c10' }}>Top Performing Perfumes</h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Best-selling and top-rated perfumes</p>
          </div>
          <button 
            className="admin-btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            onClick={() => setAdminTab('products')}
          >
            Manage Catalog →
          </button>
        </div>

        <div className="admin-top-products-grid">
          {topProducts.map((prod) => (
            <div key={prod.id} style={{ padding: '14px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={prod.images[0]} alt={prod.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb', flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="font-serif-title" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</div>
                <div style={{ fontSize: '0.82rem', color: '#b38e44', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>RM {prod.price.toFixed(2)}</div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>★ {prod.rating} ({prod.reviewsCount} reviews)</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
