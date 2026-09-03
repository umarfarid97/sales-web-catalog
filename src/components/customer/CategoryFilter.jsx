import React from 'react';
import { useStore } from '../../context/StoreContext';
import { OLFACTORY_FAMILIES } from '../../data/initialProducts';

export const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="dior-lineup-tabs-section">
      <div className="container" style={{ height: '100%' }}>
        <div className="dior-lineup-scroll-wrap">
          {OLFACTORY_FAMILIES.map((cat) => {
            const isActive = selectedCategory === cat || (cat === 'All Creations' && (selectedCategory === 'All' || selectedCategory === 'All Sauvage'));
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
