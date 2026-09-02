import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Users, 
  ArrowUpRight, 
  Sparkles,
  Award,
  Layers
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
    { day: 'Mon', revenue: 640, height: 45 },
    { day: 'Tue', revenue: 980, height: 65 },
    { day: 'Wed', revenue: 820, height: 55 },
    { day: 'Thu', revenue: 1450, height: 85 },
    { day: 'Fri', revenue: 1890, height: 95 },
    { day: 'Sat', revenue: 1280, height: 75 },
    { day: 'Sun', revenue: totalRevenue > 0 ? 1120 : 300, height: 70 }
  ];

  // Category breakdown calculation
  const categoryStats = [
    { name: 'Audio', share: 38, color: '#6366f1' },
    { name: 'Wearables', share: 28, color: '#8b5cf6' },
    { name: 'Workstation', share: 22, color: '#06b6d4' },
    { name: 'Smart Home', share: 12, color: '#10b981' }
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
            <span className="kpi-title">Gross Revenue</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-value">${totalRevenue.toFixed(2)}</div>
          <div className="kpi-trend trend-up">
            <ArrowUpRight size={14} />
            <span>+24.6% vs last 30 days</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Orders</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
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
            <span className="kpi-title">Avg Order Value (AOV)</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-value">${averageOrderValue.toFixed(2)}</div>
          <div className="kpi-trend trend-up">
            <ArrowUpRight size={14} />
            <span>Healthy customer cart size</span>
          </div>
        </div>

        {/* KPI 4: Active SKUs */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Catalog SKUs</span>
            <div className="kpi-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
              <Package size={20} />
            </div>
          </div>
          <div className="kpi-value">{products.length}</div>
          <div className="kpi-trend" style={{ color: 'var(--text-muted)' }}>
            <span>Across 5 hardware categories</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="analytics-grid">
        
        {/* Revenue Performance Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Weekly Revenue Trends</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Simulated 7-Day Performance & Order Inflow</p>
            </div>
            <span className="badge badge-primary">Daily Trajectory</span>
          </div>

          <div className="chart-svg-container">
            {weeklyData.map((item, idx) => (
              <div key={idx} className="chart-bar-col">
                <div 
                  className="chart-bar" 
                  style={{ height: `${item.height}%` }}
                  title={`${item.day}: $${item.revenue}`}
                />
                <span className="chart-bar-label">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Category Distribution</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Sales volume by category</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            {categoryStats.map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.name}</span>
                  <span style={{ color: cat.color, fontWeight: 700 }}>{cat.share}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${cat.share}%`, 
                      height: '100%', 
                      background: cat.color, 
                      borderRadius: 'var(--radius-full)' 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Performing Products Leaderboard */}
      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#fbbf24" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top Performing Catalog Items</h3>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={() => setAdminTab('products')}
          >
            Manage All Catalog →
          </button>
        </div>

        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="product-row-info">
                    <img src={p.images[0]} alt={p.name} className="product-row-thumb" />
                    <div>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{p.sku}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-neutral">{p.category}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>${p.price.toFixed(2)}</span>
                </td>
                <td>
                  {p.stock <= 0 ? (
                    <span className="badge badge-danger">Out of Stock</span>
                  ) : p.stock < 5 ? (
                    <span className="badge badge-warning">Low Stock ({p.stock})</span>
                  ) : (
                    <span className="badge badge-success">In Stock ({p.stock})</span>
                  )}
                </td>
                <td>
                  <span style={{ color: '#fbbf24', fontWeight: 600 }}>★ {p.rating}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
