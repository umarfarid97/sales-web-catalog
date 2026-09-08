import React from 'react';
import { Sparkles, Clock, Layers, Award, ShieldCheck } from 'lucide-react';

export const BrandValuesFooter = () => {
  return (
    <section 
      className="valenszo-brand-values-banner"
      style={{
        background: '#0a0a0a',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2rem 1.25rem',
        margin: 0
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

          <div style={{ color: '#f3f4f6', fontSize: '0.96rem', fontFamily: 'var(--font-brand, serif)', fontStyle: 'italic', maxWidth: '480px', letterSpacing: '0.02em', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
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
              <div style={{ fontSize: '0.72rem', color: '#e5e7eb', marginTop: '2px', fontWeight: 500 }}>
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
              <div style={{ fontSize: '0.72rem', color: '#e5e7eb', marginTop: '2px', fontWeight: 500 }}>
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
              <div style={{ fontSize: '0.72rem', color: '#e5e7eb', marginTop: '2px', fontWeight: 500 }}>
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
              <div style={{ fontSize: '0.72rem', color: '#e5e7eb', marginTop: '2px', fontWeight: 500 }}>
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
              <div style={{ fontSize: '0.72rem', color: '#e5e7eb', marginTop: '2px', fontWeight: 500 }}>
                100% Authentic
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
