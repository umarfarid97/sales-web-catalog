import React from 'react';
import { Sparkles, Clock, Layers, Award, ShieldCheck } from 'lucide-react';

export const BrandValuesFooter = () => {
  return (
    <section 
      className="valenszo-brand-values-banner"
      style={{
        background: '#0a0a0a',
        color: '#ffffff',
        borderTop: '1px solid #262626',
        padding: '2.5rem 1.5rem',
        marginTop: 'auto'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Top Tagline Row */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '2rem'
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.6rem', letterSpacing: '0.15em', fontWeight: 800 }}>
              VALENSZO
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: '#c5a059', textTransform: 'uppercase', marginTop: '2px' }}>
              FRAGRANCE
            </div>
          </div>

          <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', fontFamily: 'var(--font-brand, serif)', fontStyle: 'italic', maxWidth: '480px' }}>
            Find your scent. Create your signature. Layer what defines you.
          </div>
        </div>

        {/* 5 Luxury Icons Row */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.75rem',
            alignItems: 'start'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', border: '1px solid #c5a059', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c5a059', flexShrink: 0 }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff' }}>
                FINE INGREDIENTS
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                Expertly Crafted
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', border: '1px solid #c5a059', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c5a059', flexShrink: 0 }}>
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff' }}>
                LONG-LASTING
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                Premium Performance
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', border: '1px solid #c5a059', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c5a059', flexShrink: 0 }}>
              <Layers size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff' }}>
                LAYER & PERSONALIZE
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                Make It Uniquely Yours
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', border: '1px solid #c5a059', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c5a059', flexShrink: 0 }}>
              <Award size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff' }}>
                LUXURY EXPERIENCE
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                From Start to Finish
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', border: '1px solid #c5a059', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c5a059', flexShrink: 0 }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff' }}>
                TRUSTED QUALITY
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                100% Authentic
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
