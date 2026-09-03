import React from 'react';
import { useStore } from '../../context/StoreContext';
import { OLFACTORY_FAMILIES } from '../../data/initialProducts';
import { 
  Sparkles, 
  Flame, 
  Wind, 
  Droplets, 
  Crown, 
  Gift, 
  Layers
} from 'lucide-react';

export const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory } = useStore();

  const getFamilyIcon = (cat) => {
    switch (cat) {
      case 'All Creations': return <Sparkles size={14} />;
      case 'Sauvage Spectrum': return <Flame size={14} />;
      case 'Woody & Smoky': return <Flame size={14} />;
      case 'Fresh & Radiant': return <Wind size={14} />;
      case 'Amber & Spiced': return <Droplets size={14} />;
      case 'La Collection Privée': return <Crown size={14} />;
      case 'Discovery & Sets': return <Gift size={14} />;
      default: return <Layers size={14} />;
    }
  };

  return (
    <div className="category-filter-pills">
      {OLFACTORY_FAMILIES.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            className={`category-pill ${isActive ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            aria-pressed={isActive}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {getFamilyIcon(cat)}
              <span>{cat}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
