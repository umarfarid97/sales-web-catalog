import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MEN_CLUSTERS, WOMEN_CLUSTERS } from '../../data/initialProducts';

export const CategoryFilter = () => {
  const { 
    activeGender, 
    selectGenderCollection, 
    selectedCategory, 
    setSelectedCategory 
  } = useStore();

  const clusters = activeGender === 'Women' ? WOMEN_CLUSTERS : MEN_CLUSTERS;

  return (
    <div className="dior-lineup-tabs-section">
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: '14px' }}>
        
        {/* Gender Collection Selector Pill */}
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '4px', padding: '3px', flexShrink: 0 }}>
          <button
            onClick={() => selectGenderCollection('Men')}
            style={{
              padding: '6px 14px',
              borderRadius: '3px',
              border: 'none',
              background: activeGender === 'Men' ? '#000000' : 'transparent',
              color: activeGender === 'Men' ? '#ffffff' : '#4b5563',
              fontFamily: 'var(--font-couture)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            Men&apos;s
          </button>
          <button
            onClick={() => selectGenderCollection('Women')}
            style={{
              padding: '6px 14px',
              borderRadius: '3px',
              border: 'none',
              background: activeGender === 'Women' ? '#000000' : 'transparent',
              color: activeGender === 'Women' ? '#ffffff' : '#4b5563',
              fontFamily: 'var(--font-couture)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            Women&apos;s
          </button>
        </div>

        {/* Dynamic Gender Olfactory Lineup Tabs */}
        <div className="dior-lineup-scroll-wrap" style={{ flex: 1 }}>
          {clusters.map((cat) => {
            const isAll = cat.startsWith('All') && (selectedCategory.startsWith('All') || selectedCategory === 'All' || selectedCategory === 'All Creations');
            const isActive = selectedCategory === cat || isAll;
            return (
              <button
                key={cat}
                className={`dior-lineup-tab ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isActive}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
