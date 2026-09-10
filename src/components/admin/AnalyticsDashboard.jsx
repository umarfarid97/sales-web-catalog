import React, { useMemo, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Wallet, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Award,
  Clock
} from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { 
    totalRevenue, 
    totalOrdersCount, 
    averageOrderValue, 
    pendingOrdersCount,
    lowStockCount,
    outOfStockCount,
    orders,
    products, 
    setAdminTab,
    refreshStoreData,
    isLoadingFromCloud,
    isCloudConnected,
    isSettledOrder: isSettledOrderFn
  } = useStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date());

  // Helper: Determine if order is settled/paid
  const isSettled = (ord) => {
    if (typeof isSettledOrderFn === 'function') {
      return isSettledOrderFn(ord);
    }
    if (!ord || ord.status === 'Cancelled' || ord.status === 'Refunded') return false;
    if (ord.paymentStatus === 'Paid') return true;
    if (['Processing', 'Shipped', 'Delivered'].includes(ord.status)) return true;
    if (ord.status === 'Pending Payment' || ord.paymentStatus === 'Unpaid') return false;
    return ord.status === 'Pending';
  };

  const settledOrders = useMemo(() => {
    return (orders || []).filter(isSettled);
  }, [orders]);

  const unpaidCount = useMemo(() => {
    return (orders || []).filter((o) => o && (o.status === 'Pending Payment' || o.paymentStatus === 'Unpaid')).length;
  }, [orders]);

  // --- Real-time 7-Day Revenue Trend (Live Orders Breakdown) ---
  const { weeklyData, weeklyTrendPct, weeklyRevenueTotal } = useMemo(() => {
    const days = [];
    const now = new Date();

    // 1. Generate past 7 days (including today)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({
        dateStr,
        day: i === 0 ? 'Today' : dayShort,
        revenue: 0,
        ordersCount: 0,
        isToday: i === 0
      });
    }

    // 2. Track past 7 days vs previous 7 days for real trend growth calculation
    const sevenDaysAgoTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
    const fourteenDaysAgoTime = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).getTime();

    let recentPeriodRev = 0;
    let priorPeriodRev = 0;

    (orders || []).forEach((ord) => {
      if (!isSettled(ord) || !ord.placedAt) return;
      const orderTime = new Date(ord.placedAt).getTime();
      const orderDateStr = new Date(ord.placedAt).toISOString().slice(0, 10);
      const total = Number(ord.total) || 0;

      // Match calendar bucket
      const bucket = days.find((d) => d.dateStr === orderDateStr);
      if (bucket) {
        bucket.revenue += total;
        bucket.ordersCount += 1;
      }

      // Comparison periods
      if (orderTime >= sevenDaysAgoTime) {
        recentPeriodRev += total;
      } else if (orderTime >= fourteenDaysAgoTime) {
        priorPeriodRev += total;
      }
    });

    const maxRev = Math.max(...days.map((d) => d.revenue), 1);
    const calculatedDays = days.map((d) => ({
      ...d,
      revenue: Math.round(d.revenue * 100) / 100,
      height: d.revenue > 0 ? Math.min(100, Math.max(16, Math.round((d.revenue / maxRev) * 85) + 15)) : 8
    }));

    let trendPct = null;
    if (priorPeriodRev > 0) {
      trendPct = Math.round(((recentPeriodRev - priorPeriodRev) / priorPeriodRev) * 100);
    } else if (recentPeriodRev > 0) {
      trendPct = 100;
    }

    return {
      weeklyData: calculatedDays,
      weeklyTrendPct: trendPct,
      weeklyRevenueTotal: recentPeriodRev
    };
  }, [orders]);

  // --- Real-time Olfactory Family Demand (Calculated from Real Order Items) ---
  const categoryStats = useMemo(() => {
    const familyCounts = {
      'Woody & Smoky': 0,
      'Amber & Oriental': 0,
      'Floral & Romantic': 0,
      'Fresh & Citrus': 0,
      'Discovery Sets': 0
    };

    const colorMap = {
      'Woody & Smoky': '#b45309',
      'Amber & Oriental': '#d97706',
      'Floral & Romantic': '#db2777',
      'Fresh & Citrus': '#059669',
      'Discovery Sets': '#0891b2'
    };

    let totalBottlesSold = 0;

    (orders || []).forEach((ord) => {
      if (ord.status === 'Cancelled' || ord.status === 'Refunded') return;
      (ord.items || []).forEach((it) => {
        const qty = Number(it.quantity) || 1;
        totalBottlesSold += qty;

        const p = products.find((prod) => prod.id === it.productId || prod.id === it.id || prod.name === it.name);
        const family = it.olfactoryFamily || p?.olfactoryFamily || p?.category || '';
        const char = `${it.character || ''} ${p?.character || ''}`.toLowerCase();
        const name = (it.name || '').toLowerCase();

        if (name.includes('discovery') || name.includes('set') || it.category === 'Set') {
          familyCounts['Discovery Sets'] += qty;
        } else if (family.includes('Wood') || char.includes('wood') || char.includes('smoky') || char.includes('leather')) {
          familyCounts['Woody & Smoky'] += qty;
        } else if (family.includes('Amber') || family.includes('Orient') || char.includes('amber') || char.includes('warm') || char.includes('spicy')) {
          familyCounts['Amber & Oriental'] += qty;
        } else if (family.includes('Flor') || char.includes('flor') || char.includes('rose') || char.includes('sweet')) {
          familyCounts['Floral & Romantic'] += qty;
        } else if (family.includes('Fresh') || family.includes('Citrus') || char.includes('fresh') || char.includes('citrus') || char.includes('aquatic') || char.includes('marine')) {
          familyCounts['Fresh & Citrus'] += qty;
        } else {
          familyCounts['Woody & Smoky'] += qty;
        }
      });
    });

    // If no orders placed yet in this store, distribute from active product catalog
    const hasOrderData = totalBottlesSold > 0;
    if (!hasOrderData && products.length > 0) {
      products.forEach((p) => {
        const family = p.olfactoryFamily || p.category || '';
        const char = (p.character || '').toLowerCase();
        const name = (p.name || '').toLowerCase();

        if (name.includes('discovery') || name.includes('set')) {
          familyCounts['Discovery Sets'] += 1;
        } else if (family.includes('Wood') || char.includes('wood') || char.includes('smoky')) {
          familyCounts['Woody & Smoky'] += 1;
        } else if (family.includes('Amber') || family.includes('Orient') || char.includes('amber')) {
          familyCounts['Amber & Oriental'] += 1;
        } else if (family.includes('Flor') || char.includes('flor')) {
          familyCounts['Floral & Romantic'] += 1;
        } else {
          familyCounts['Fresh & Citrus'] += 1;
        }
        totalBottlesSold += 1;
      });
    }

    const divisor = totalBottlesSold || 1;
    return Object.entries(familyCounts).map(([name, count]) => {
      const share = Math.round((count / divisor) * 100);
      return {
        name,
        count,
        share,
        color: colorMap[name] || '#b38e44',
        isCatalogFallback: !hasOrderData
      };
    });
  }, [orders, products]);

  // --- Real-time Top Performing Perfumes (Ranked by Bottles Sold & Revenue) ---
  const topProducts = useMemo(() => {
    const salesMap = {};

    (orders || []).forEach((ord) => {
      if (ord.status === 'Cancelled' || ord.status === 'Refunded') return;
      (ord.items || []).forEach((it) => {
        const key = it.productId || it.id || it.name;
        if (!salesMap[key]) {
          salesMap[key] = {
            id: it.productId || it.id,
            name: it.name,
            image: it.image,
            price: Number(it.price) || 0,
            unitsSold: 0,
            revenue: 0
          };
        }
        const qty = Number(it.quantity) || 1;
        salesMap[key].unitsSold += qty;
        salesMap[key].revenue += qty * (Number(it.price) || 0);
      });
    });

    const rankedSold = Object.values(salesMap)
      .map((entry) => {
        const fullProd = products.find((p) => p.id === entry.id || p.name === entry.name);
        return {
          id: entry.id,
          name: fullProd?.name || entry.name,
          images: fullProd?.images?.length ? fullProd.images : [entry.image || '/images/default.jpg'],
          price: fullProd?.price || entry.price,
          rating: fullProd?.rating || 5.0,
          reviewsCount: fullProd?.reviewsCount || 0,
          unitsSold: entry.unitsSold,
          revenue: entry.revenue,
          isRealSale: true
        };
      })
      .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue);

    // If fewer than 4 products sold yet, backfill with top-rated catalog creations
    if (rankedSold.length < 4) {
      const existingNames = new Set(rankedSold.map((r) => r.name.toLowerCase()));
      const remainingCatalog = products
        .filter((p) => !existingNames.has(p.name.toLowerCase()))
        .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));

      for (const p of remainingCatalog) {
        if (rankedSold.length >= 4) break;
        rankedSold.push({
          ...p,
          unitsSold: 0,
          revenue: 0,
          isRealSale: false
        });
      }
    }

    return rankedSold.slice(0, 4);
  }, [orders, products]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (typeof refreshStoreData === 'function') {
      await refreshStoreData();
    }
    setLastRefreshedAt(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div>
      
      {/* Live Sync Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px 18px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: isCloudConnected ? '#10b981' : '#f59e0b',
            boxShadow: isCloudConnected ? '0 0 0 3px rgba(16, 185, 129, 0.2)' : 'none'
          }} />
          <div style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 600 }}>
            {isCloudConnected ? 'Real-time Supabase Cloud Synchronized' : 'Local Storage Mode (Stand-alone)'}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            &bull; Last synced {lastRefreshedAt.toLocaleTimeString()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={isRefreshing || isLoadingFromCloud}
          className="admin-btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            fontSize: '0.8rem',
            cursor: isRefreshing || isLoadingFromCloud ? 'wait' : 'pointer'
          }}
        >
          <RefreshCw size={13} className={isRefreshing || isLoadingFromCloud ? 'spin-icon' : ''} />
          <span>{isRefreshing || isLoadingFromCloud ? 'Syncing...' : 'Refresh Live Data'}</span>
        </button>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="kpi-grid">
        
        {/* KPI 1: Settled Revenue */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Settled Revenue</span>
            <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#b45309' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div className="kpi-value">RM {totalRevenue.toFixed(2)}</div>
          <div className="kpi-trend trend-up">
            {weeklyTrendPct !== null && weeklyTrendPct >= 0 ? (
              <>
                <ArrowUpRight size={14} />
                <span>+{weeklyTrendPct}% 7-day velocity</span>
              </>
            ) : weeklyTrendPct !== null ? (
              <>
                <ArrowDownRight size={14} color="#dc2626" />
                <span style={{ color: '#dc2626' }}>{weeklyTrendPct}% 7-day velocity</span>
              </>
            ) : (
              <>
                <Clock size={13} />
                <span>RM {weeklyRevenueTotal.toFixed(2)} past 7 days</span>
              </>
            )}
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
            <span>{pendingOrdersCount} pending fulfillment ({settledOrders.length} settled)</span>
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
            <span style={{ color: '#4b5563' }}>
              {settledOrders.length > 0 ? `Calculated across ${settledOrders.length} paid orders` : 'Awaiting first settled order'}
            </span>
          </div>
        </div>

        {/* KPI 4: Active SKUs & Inventory */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Scent Formulas</span>
            <div className="kpi-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div className="kpi-value">{products.length}</div>
          <div className="kpi-trend trend-up">
            <span style={{ color: outOfStockCount > 0 ? '#dc2626' : lowStockCount > 0 ? '#d97706' : '#059669', fontWeight: 600 }}>
              {outOfStockCount > 0 ? `${outOfStockCount} out of stock` : lowStockCount > 0 ? `${lowStockCount} low stock alerts` : 'All inventory healthy'}
            </span>
          </div>
        </div>

      </div>

      {/* Grid: Charts & Top Scents */}
      <div className="admin-charts-grid">
        
        {/* Weekly Revenue Bar Chart (Real-time 7-Day Live Aggregation) */}
        <div className="admin-card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b0c10' }}>
                7-Day Real-Time Perfume Sales
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Actual daily revenue from settled orders (past 7 days)
              </p>
            </div>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>Real-Time Live</span>
            </span>
          </div>

          {/* Clean Realtime Bar Chart */}
          <div className="admin-bar-chart-wrap" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', gap: '10px' }}>
            {weeklyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', minWidth: 0 }}>
                <div 
                  className="admin-bar-value" 
                  style={{ 
                    fontSize: '0.72rem', 
                    color: d.revenue > 0 ? '#111827' : '#9ca3af', 
                    fontWeight: 700, 
                    marginBottom: '6px', 
                    fontFamily: 'var(--font-mono)', 
                    whiteSpace: 'nowrap' 
                  }}
                  title={`${d.ordersCount} orders on ${d.dateStr}`}
                >
                  RM {d.revenue > 0 ? d.revenue.toFixed(0) : '0'}
                </div>
                <div 
                  style={{ 
                    width: '100%', 
                    maxWidth: '42px', 
                    height: `${d.height}%`, 
                    background: d.isToday ? '#b38e44' : d.revenue > 0 ? '#d97706' : '#e5e7eb', 
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.4s ease',
                    boxShadow: d.isToday && d.revenue > 0 ? '0 4px 12px rgba(179, 142, 68, 0.4)' : 'none'
                  }} 
                />
                <div 
                  className="admin-bar-day" 
                  style={{ 
                    fontSize: '0.76rem', 
                    color: d.isToday ? '#b38e44' : '#4b5563', 
                    marginTop: '8px', 
                    fontWeight: d.isToday ? 800 : 600 
                  }}
                >
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Olfactory Families Share (Calculated Live from Real Order Line Items) */}
        <div className="admin-card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b0c10' }}>
                Olfactory Family Demand
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {categoryStats[0]?.isCatalogFallback ? 'Catalog collection breakdown' : 'Actual volume purchased by fragrance family'}
              </p>
            </div>
            {unpaidCount > 0 && (
              <span style={{ fontSize: '0.74rem', color: '#f59e0b', background: '#fffbeb', border: '1px solid #fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                {unpaidCount} unpaid in checkout
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryStats.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#111827' }}>
                    {cat.name} <span style={{ fontSize: '0.74rem', color: '#6b7280', fontWeight: 400 }}>({cat.count} {cat.isCatalogFallback ? 'creations' : 'sold'})</span>
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: cat.color, fontWeight: 700 }}>{cat.share}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.share}%`, height: '100%', background: cat.color, borderRadius: '9999px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom: Top Selling Fragrances Table (Calculated Live from Sales Volume) */}
      <div className="admin-card-panel" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={18} color="#b38e44" />
              <h3 className="font-serif-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b0c10', margin: 0 }}>
                Top Performing Perfumes
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
              Ranked live by actual order quantity and customer reviews
            </p>
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
                <div className="font-serif-title" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {prod.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '2px 0' }}>
                  <span style={{ fontSize: '0.82rem', color: '#b38e44', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    RM {Number(prod.price).toFixed(2)}
                  </span>
                  {prod.isRealSale && prod.unitsSold > 0 ? (
                    <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {prod.unitsSold} sold
                    </span>
                  ) : null}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                  {prod.isRealSale && prod.unitsSold > 0 
                    ? `RM ${prod.revenue.toFixed(2)} revenue &bull; ★ ${prod.rating}`
                    : `★ ${prod.rating} (${prod.reviewsCount} reviews)`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
