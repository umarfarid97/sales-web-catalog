import React from 'react';
import { 
  ShieldCheck, 
  Gift, 
  RefreshCw, 
  Feather, 
  Sparkles, 
  Mail, 
  ArrowRight,
  Compass
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer = () => {
  const { setSelectedCategory, showToast } = useStore();

  const handleNewsletter = (e) => {
    e.preventDefault();
    showToast('Merci! You have been granted Private Access to Sauvage reserve releases.', 'success');
  };

  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* Maison Commitments / Dior Savoir-Faire Bar */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '28px',
            paddingBottom: '50px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '50px'
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '4px', background: 'rgba(226, 135, 67, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-copper-light)', flexShrink: 0 }}>
              <Gift size={20} />
            </div>
            <div>
              <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '4px' }}>The Art of Gifting</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Each order is prepared in our iconic midnight blue gift box with custom ribbon.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '4px', background: 'rgba(226, 135, 67, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-copper-light)', flexShrink: 0 }}>
              <Feather size={20} />
            </div>
            <div>
              <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '4px' }}>2 Complimentary Samples</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Choose 2 deluxe travel spray vials with every fragrance order.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7', flexShrink: 0 }}>
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '4px' }}>Refillable Flacons</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sustainable eco-luxury flacons designed to be refilled indefinitely.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '4px', background: 'rgba(226, 135, 67, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-copper-light)', flexShrink: 0 }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '4px' }}>Artisanal French Provenance</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Crafted with rare Reggio bergamot &amp; high-concentration essences.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Newsletter */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '50px'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="couture-title" style={{ fontSize: '1.4rem', letterSpacing: '0.24em' }}>SAUVAGE</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
              Raw and noble all at once. An act of creation inspired by wide-open spaces under a blue-sky night.
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-copper-light)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              30 Avenue Montaigne, 75008 Paris
            </div>
          </div>

          {/* Olfactory Collections */}
          <div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '18px' }}>The Collections</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button 
                  onClick={() => setSelectedCategory('Sauvage Spectrum')} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Sauvage Spectrum
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSelectedCategory('La Collection Privée')} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  La Collection Privée
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSelectedCategory('Woody & Smoky')} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Woody &amp; Smoky Accords
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSelectedCategory('Discovery & Sets')} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Discovery Coffrets
                </button>
              </li>
            </ul>
          </div>

          {/* Client Services */}
          <div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '18px' }}>Maison Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>Bespoke Flacon Engraving</li>
              <li>The Art of Gifting</li>
              <li>Olfactory Diagnostic Quiz</li>
              <li>Refill Atelier Locator</li>
              <li>Order Tracking &amp; Concierge</li>
            </ul>
          </div>

          {/* Newsletter / Private Club */}
          <div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '18px' }}>Private Access</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Subscribe to receive exclusive invitations to rare elixir harvest releases and private previews.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="form-input"
                style={{ padding: '10px 14px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-dior-solid" style={{ padding: '0 16px' }} aria-label="Subscribe">
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '0.78rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} SAUVAGE Haute Parfumerie. All rights reserved. Handcrafted in France.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Savoir-Faire</span>
            <span>Delivery &amp; Returns</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
