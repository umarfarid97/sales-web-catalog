import React from 'react';
import { CATEGORIES } from '../../data/initialProducts';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  Headphones, 
  Watch, 
  Laptop, 
  Home, 
  Zap 
} from 'lucide-react';

const ICON_MAP = {
  Sparkles: Sparkles,
  Headphones: Headphones,
  Watch: Watch,
  Laptop: Laptop,
  Home: Home,
  Zap: Zap
};

export const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory, products } = useStore();

  const getCategoryCount = (catId) => {
    if (catId === 'All') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="category-bar-wrapper">
      <div className="container">
        <div className="category-pills-list">
          {CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Sparkles;
            const count = getCategoryCount(cat.id);
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <IconComponent size={16} />
                <span>{cat.name}</span>
                <span 
                  style={{
                    fontSize: '0.72rem',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
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
