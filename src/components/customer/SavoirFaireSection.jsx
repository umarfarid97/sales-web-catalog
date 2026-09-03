import React from 'react';
import { SAVOIR_FAIRE_RAW_MATERIALS } from '../../data/initialProducts';
import { MapPin, Sparkles } from 'lucide-react';

export const SavoirFaireSection = () => {
  return (
    <section className="dior-savoir-faire-banner">
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <div className="couture-sub" style={{ color: '#e5e7eb', marginBottom: '8px' }}>
            French Savoir-Faire &bull; Sustainable Sourcing
          </div>
          <h2 className="couture-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#ffffff' }}>
            The Art of Raw Materials
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#9ca3af', lineHeight: '1.7', marginTop: '12px' }}>
            Sauvage is an act of creation dictated by exceptional raw materials. Each ingredient is carefully selected from sustainable, long-standing partner harvests around the world.
          </p>
        </div>

        {/* 4 Materials Grid */}
        <div className="dior-materials-grid">
          {SAVOIR_FAIRE_RAW_MATERIALS.map((mat) => (
            <div key={mat.id} className="dior-material-card">
              <img src={mat.image} alt={mat.name} className="dior-material-img" />

              <div className="dior-material-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#e28743', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '6px' }}>
                  <MapPin size={12} />
                  <span>{mat.origin}</span>
                </div>

                <h3 className="couture-title" style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '8px' }}>
                  {mat.name}
                </h3>

                <p style={{ fontSize: '0.86rem', color: '#9ca3af', lineHeight: '1.5' }}>
                  {mat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
