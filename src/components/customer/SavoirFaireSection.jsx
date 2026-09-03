import React from 'react';
import { SAVOIR_FAIRE_RAW_MATERIALS } from '../../data/initialProducts';
import { Sparkles, Compass, MapPin, Feather } from 'lucide-react';

export const SavoirFaireSection = () => {
  return (
    <section className="savoir-faire-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-centered">
          <div className="couture-sub">
            Artisanal Provenance &bull; French Savoir-Faire
          </div>
          <h2 className="couture-title" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>
            The Art of Raw Materials
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
            François Demachy envisioned Sauvage as an act of creation dictated by exceptional raw materials. Each ingredient is sustainably sourced from exclusive partner harvests across the globe.
          </p>
        </div>

        {/* 4 Key Ingredients Grid */}
        <div className="raw-materials-grid">
          {SAVOIR_FAIRE_RAW_MATERIALS.map((mat) => (
            <div key={mat.id} className="raw-material-card">
              <div className="raw-material-img-wrap">
                <img src={mat.image} alt={mat.name} className="raw-material-img" />
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(4, 7, 17, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-couture)',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    color: 'var(--accent-copper-light)',
                    textTransform: 'uppercase'
                  }}
                >
                  {mat.role}
                </div>
              </div>

              <div className="raw-material-body">
                <div className="raw-material-origin" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={12} />
                  <span>{mat.origin}</span>
                </div>
                <h3 className="raw-material-title">{mat.name}</h3>
                <p className="raw-material-desc">{mat.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
