import React from 'react';
import { OLFACTORY_FAMILIES } from '../../data/initialProducts';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  Flame, 
  Heart, 
  Sun, 
  Coffee, 
  Gift,
  Feather
} from 'lucide-react';

const FAMILY_ICONS = {
  'All': Sparkles,
  'Woody & Smoky': Flame,
  'Amber & Oriental': Feather,
  'Floral & Romantic': Heart,
  'Fresh & Citrus': Sun,
  'Gourmand & Spiced': Coffee,
  'Discovery & Sets': Gift
};

export const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory, products } = useStore();

  const getCategoryCount = (family) => {
    if (family === 'All') return products.length;
    return products.filter((p) => p.category === family).length;
  };

  return (
    <div className="category-filter-section">
      <div className="container">
        <div className="category-filter-container">
          {OLFACTORY_FAMILIES.map((family) => {
            const IconComponent = FAMILY_ICONS[family] || Sparkles;
            const count = getCategoryCount(family);
            const isActive = selectedCategory === family;

            return (
              <button
                key={family}
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(family)}
              >
                <IconComponent size={15} color={isActive ? '#0b0c10' : 'var(--accent-gold)'} />
                <span>{family}</span>
                <span 
                  style={{
                    fontSize: '0.72rem',
                    background: isActive ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#0b0c10' : 'var(--text-muted)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
