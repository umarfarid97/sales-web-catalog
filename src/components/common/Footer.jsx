import React from 'react';
import { 
  ShieldCheck, 
  Gift, 
  RefreshCw, 
  Feather, 
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ValenszoLogo } from './ValenszoLogo';

export const Footer = () => {
  const { showToast } = useStore();

  const handleNewsletter = (e) => {
    e.preventDefault();
    showToast('Merci! You have been subscribed to Valenszo Fragrance previews.', 'success');
  };

  return (
    <footer style={{ background: '#1e130c', borderTop: '1px solid #332016', padding: '50px 0 80px', color: '#e8ded4' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px, 3vw, 24px)' }}>
        
        {/* Valenszo 4 Pillars */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            paddingBottom: '40px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '40px'
          }}
        >
          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#d97706' }}>
              <Gift size={20} />
            </div>
            <h4 style={{ color: '#ffffff', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.04em' }}>Art of Gifting</h4>
            <p style={{ fontSize: '0.8rem', color: '#a8978b', margin: 0 }}>Complimentary iconic gift box with signature satin presentation.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#d97706' }}>
              <Feather size={20} />
            </div>
            <h4 style={{ color: '#ffffff', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.04em' }}>Deluxe Miniatures</h4>
            <p style={{ fontSize: '0.8rem', color: '#a8978b', margin: 0 }}>Choose 2 complimentary travel spray miniatures at checkout.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#d97706' }}>
              <RefreshCw size={20} />
            </div>
            <h4 style={{ color: '#ffffff', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.04em' }}>35% Oil Concentration</h4>
            <p style={{ fontSize: '0.8rem', color: '#a8978b', margin: 0 }}>Hand-blended artisanal extraits formulated for all-day sillage.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#d97706' }}>
              <ShieldCheck size={20} />
            </div>
            <h4 style={{ color: '#ffffff', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.04em' }}>Express Dispatch</h4>
            <p style={{ fontSize: '0.8rem', color: '#a8978b', margin: 0 }}>Doorstep courier delivery on all orders nationwide.</p>
          </div>
        </div>

        {/* Footer Navigation & Newsletter */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '36px',
            marginBottom: '40px'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'flex-start', filter: 'brightness(0) invert(1)' }}>
              <ValenszoLogo size="md" layout="horizontal" subtitle="FRAGRANCE MALAYSIA" style={{ alignItems: 'flex-start' }} />
            </div>
            <p style={{ fontSize: '0.84rem', color: '#b5a498', lineHeight: '1.6', marginBottom: '14px' }}>
              Valenszo is an act of creation inspired by noble essences and rare raw materials. Handcrafted luxury fragrances with timeless elegance.
            </p>
            <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Kuala Lumpur &bull; Paris &bull; Express Delivery
            </div>
          </div>

          {/* Fragrance Collections */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.06em' }}>Fragrance Collections</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
              <li>
                <a 
                  href="/collection" 
                  style={{ color: '#b5a498', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b5a498'; }}
                >
                  All Creations
                </a>
              </li>
              <li>
                <a 
                  href="/men" 
                  style={{ color: '#b5a498', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b5a498'; }}
                >
                  Men's Haute Collection
                </a>
              </li>
              <li>
                <a 
                  href="/women" 
                  style={{ color: '#b5a498', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b5a498'; }}
                >
                  Women's Haute Collection
                </a>
              </li>
              <li>
                <a 
                  href="/bundle" 
                  style={{ color: '#b5a498', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b5a498'; }}
                >
                  Signature Bundle Wardrobes (Save 25%)
                </a>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.06em' }}>Client Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#b5a498', padding: 0 }}>
              <li>Complimentary Bottle Presentation</li>
              <li>The Valenszo Art of Gifting</li>
              <li>Scent Finder Quiz</li>
              <li>Track Your Delivery</li>
              <li>Contact Maison Concierge</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.06em' }}>Newsletter</h4>
            <p style={{ fontSize: '0.84rem', color: '#b5a498', marginBottom: '12px', lineHeight: 1.5 }}>
              Subscribe to receive exclusive Valenszo Fragrance private releases and collector previews.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="email"
                required
                placeholder="Enter email address"
                style={{
                  padding: '10px 16px',
                  fontSize: '0.82rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '9999px',
                  color: '#ffffff',
                  flex: 1,
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                style={{
                  padding: '0 18px',
                  background: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s'
                }} 
                aria-label="Subscribe"
                onMouseEnter={(e) => { e.currentTarget.style.background = '#b45309'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#d97706'; }}
              >
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          style={{
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.74rem',
            color: '#8c7d72'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Valenszo Fragrance Malaysia. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Legal Notice</span>
            <span>Terms of Savoir-Faire</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
