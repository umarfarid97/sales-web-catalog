import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Gift, 
  Award, 
  ArrowRight,
  Heart,
  Flame,
  Feather
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer = () => {
  const { setRole, setSelectedCategory } = useStore();

  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* Value Prop Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          paddingBottom: '48px',
          marginBottom: '48px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(212, 175, 55, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>White-Glove Shipping</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Climate-controlled & free over $150</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}>
              <Gift size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fcd34d' }}>2 Free Deluxe Samples</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Curated with every flacon purchase</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(226, 168, 178, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose-gold)'
            }}>
              <Feather size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fda4af' }}>Bespoke Bottle Engraving</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Complimentary personalized flacons</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <Award size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#6ee7b7' }}>Artisanal French Alchemy</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Crafted & macerated in Grasse</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap'
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--accent-gold-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={18} color="#0b0c10" />
              </div>
              <span className="font-serif-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.1em' }}>
                LUMINA
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px', maxWidth: '320px' }}>
              Maison de Haute Parfumerie dedicated to bottling rare botanical essences, aged agarwood extraits, and nocturnal scent alchemies.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-gold">Paris • Grasse • Geneva</span>
            </div>
          </div>

          {/* Col 2: Olfactory Collections */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold-light)', marginBottom: '16px' }}>
              Olfactory Families
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <a href="#catalog" onClick={() => setSelectedCategory('Woody & Smoky')} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Woody & Smoky Ouds
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => setSelectedCategory('Amber & Oriental')} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Amber & Vanilla Oriental
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => setSelectedCategory('Floral & Romantic')} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                  May Rose & Jasmine Floral
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => setSelectedCategory('Fresh & Citrus')} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Mediterranean Neroli
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => setSelectedCategory('Discovery & Sets')} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Discovery Coffrets
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Maison Services */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold-light)', marginBottom: '16px' }}>
              Bespoke Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><span style={{ color: 'var(--text-muted)' }}>Custom Flacon Engraving</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Complimentary Gift Box & Ribbon</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Private Olfactory Consultations</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Scent Layering Masterclasses</span></li>
            </ul>
          </div>

          {/* Col 4: Boutique Portal */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold-light)', marginBottom: '16px' }}>
              Maison Portal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <button 
                  onClick={() => setRole('admin')}
                  style={{ background: 'none', border: 'none', color: '#fce08b', cursor: 'pointer', textAlign: 'left', font: 'inherit', fontWeight: '600' }}
                >
                  Admin Operations Portal →
                </button>
              </li>
              <li><span style={{ color: 'var(--text-muted)' }}>Live PostgreSQL Database</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Realtime Inventory Tracking</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Render CDN Cloud Deployed</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '28px',
          fontSize: '0.82rem',
          color: 'var(--text-dim)',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p>© {new Date().getFullYear()} LUMINA Haute Parfumerie Paris. All Rights Reserved. Crafted with pure olfactory mastery.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Maison</span>
            <span>Authenticity Certificate</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
