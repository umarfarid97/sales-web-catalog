import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  ArrowRight, 
  Droplets, 
  Flame, 
  ShieldCheck, 
  Gift, 
  Layers, 
  Check
} from 'lucide-react';
import { SAUVAGE_SPECTRUM_LEVELS } from '../../data/initialProducts';

export const HeroBanner = () => {
  const { setSelectedCategory, setSelectedProductModal, products, showToast } = useStore();
  const [selectedSpectrumId, setSelectedSpectrumId] = useState('elixir');
  const [copiedPromo, setCopiedPromo] = useState(false);

  const activeLevel = SAUVAGE_SPECTRUM_LEVELS.find((l) => l.id === selectedSpectrumId) || SAUVAGE_SPECTRUM_LEVELS[3];

  const handleCopyCode = () => {
    navigator.clipboard.writeText('SAUVAGE25');
    setCopiedPromo(true);
    showToast('Privilege Code SAUVAGE25 copied to clipboard (-25% Off)!', 'success');
    setTimeout(() => setCopiedPromo(false), 3000);
  };

  const handleOpenProduct = (spectrumId) => {
    let targetSku = 'SVG-LX-001';
    if (spectrumId === 'parfum') targetSku = 'SVG-PF-002';
    if (spectrumId === 'edp') targetSku = 'SVG-EDP-003';
    if (spectrumId === 'edt') targetSku = 'SVG-EDT-004';

    const match = products.find((p) => p.sku === targetSku);
    if (match) {
      setSelectedProductModal(match);
    }
  };

  return (
    <section className="sauvage-hero-stage">
      <div className="sauvage-hero-bg-overlay" />

      <div className="container">
        <div className="sauvage-hero-content">
          
          {/* Subtitle Badge */}
          <div className="sauvage-hero-sub">
            <Sparkles size={14} />
            <span>Haute Parfumerie &bull; The Art of Creation</span>
          </div>

          {/* Epic Sauvage Headline */}
          <h1 className="sauvage-hero-title">
            SAUVAGE
          </h1>

          {/* Poetic Tagline */}
          <p className="sauvage-hero-tagline">
            &ldquo;Raw and noble all at once. An olfactory overdose of fresh Reggio Bergamot, Wild Amberwood &amp; Nocturnal Spices under a desert twilight sky.&rdquo;
          </p>

          {/* Action CTAs */}
          <div className="sauvage-hero-actions">
            <button
              className="btn btn-copper"
              onClick={() => handleOpenProduct(selectedSpectrumId)}
              style={{ padding: '14px 34px', fontSize: '0.88rem' }}
            >
              <span>Discover {activeLevel.name}</span>
              <ArrowRight size={16} />
            </button>

            <button
              className="btn btn-dior-outline"
              onClick={() => {
                const el = document.getElementById('vault-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '14px 30px', fontSize: '0.88rem' }}
            >
              <span>Explore The Collection</span>
            </button>
          </div>

          {/* Interactive Sauvage Concentration Spectrum Selector */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-couture)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Select Concentration Spectrum:
            </div>

            <div className="spectrum-selector-wrap">
              {SAUVAGE_SPECTRUM_LEVELS.map((lvl) => {
                const isSelected = selectedSpectrumId === lvl.id;
                const isElixir = lvl.id === 'elixir';
                return (
                  <button
                    key={lvl.id}
                    className={`spectrum-level-btn ${isSelected ? (isElixir ? 'active-elixir' : 'active') : ''}`}
                    onClick={() => setSelectedSpectrumId(lvl.id)}
                  >
                    {lvl.name.replace('Sauvage ', '')}
                  </button>
                );
              })}
            </div>

            {/* Active Concentration Spotlight Bar */}
            <div 
              style={{
                marginTop: '16px',
                padding: '12px 20px',
                background: 'rgba(7, 12, 24, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-sm)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '16px',
                maxWidth: '680px',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedSpectrumId === 'elixir' ? 'var(--accent-copper)' : '#ffffff', boxShadow: '0 0 10px var(--accent-copper)' }} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-couture)', letterSpacing: '0.08em' }}>
                  {activeLevel.concentration} &bull; <span style={{ color: 'var(--accent-copper-light)' }}>{activeLevel.intensity}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {activeLevel.description}
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Privilege Code Banner */}
          <div 
            style={{
              marginTop: '28px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(226, 135, 67, 0.12)',
              border: '1px solid rgba(226, 135, 67, 0.35)',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem'
            }}
          >
            <span style={{ color: 'var(--accent-copper-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Complimentary Atelier Privilege:
            </span>
            <span style={{ color: '#ffffff' }}>Use Code <strong>SAUVAGE25</strong> for 25% Off + 2 Deluxe Travel Vials</span>
            <button
              onClick={handleCopyCode}
              style={{
                background: 'var(--accent-copper)',
                border: 'none',
                color: '#040711',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.7rem',
                cursor: 'pointer'
              }}
            >
              {copiedPromo ? 'COPIED!' : 'COPY CODE'}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
