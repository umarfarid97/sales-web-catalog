import React from 'react';
import { 
  ShieldCheck, 
  Gift, 
  RefreshCw, 
  Feather, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ValenszoLogo } from './ValenszoLogo';

export const Footer = () => {
  const { setSelectedCategory, showToast } = useStore();

  const handleNewsletter = (e) => {
    e.preventDefault();
    showToast('Merci! You have been subscribed to Valenszo Fragrance previews.', 'success');
  };

  return (
    <footer style={{ background: '#f8f9fa', borderTop: '1px solid var(--border-subtle)', padding: '60px 0 30px' }}>
      <div className="container">
        
        {/* Valenszo 4 Pillars */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            paddingBottom: '48px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '48px'
          }}
        >
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#000000' }}>
              <Gift size={20} />
            </div>
            <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '4px' }}>Valenszo Art of Gifting</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Complimentary iconic Valenszo gift box with signature ribbon.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#000000' }}>
              <Feather size={20} />
            </div>
            <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '4px' }}>2 Deluxe Samples</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Choose 2 complimentary travel spray miniatures at checkout.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#000000' }}>
              <RefreshCw size={20} />
            </div>
            <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '4px' }}>Refillable Flacons</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sustainable design: refill your Valenszo flacon infinitely.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#000000' }}>
              <ShieldCheck size={20} />
            </div>
            <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '4px' }}>Free Climate Delivery</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>White-glove delivery on all orders over $150.</p>
          </div>
        </div>

        {/* Footer Navigation & Newsletter */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'flex-start' }}>
              <ValenszoLogo size="md" layout="horizontal" subtitle="FRAGRANCE MALAYSIA" style={{ alignItems: 'flex-start' }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>
              Valenszo is an act of creation inspired by noble essences and rare raw materials. Handcrafted luxury fragrances with timeless elegance.
            </p>
            <div style={{ fontSize: '0.74rem', color: '#000000', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Kuala Lumpur &bull; Paris &bull; Worldwide Delivery
            </div>
          </div>

          {/* Fragrance Collections */}
          <div>
            <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '16px' }}>Fragrance Collections</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <button 
                  onClick={() => setSelectedCategory('All Creations')} 
                  style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '0.86rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Valenszo Complete Line
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSelectedCategory('La Collection Privée')} 
                  style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '0.86rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  La Collection Privée Christian Dior
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSelectedCategory('Discovery & Sets')} 
                  style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '0.86rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Discovery Coffrets &amp; Gift Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '16px' }}>Client Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: '#4b5563' }}>
              <li>Complimentary Bottle Engraving</li>
              <li>The Dior Art of Gifting</li>
              <li>Sauvage Refill Station Locator</li>
              <li>Track Your Delivery</li>
              <li>Contact Maison Concierge</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="couture-sub" style={{ color: '#000000', marginBottom: '16px' }}>Newsletter</h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Subscribe to receive exclusive Dior Fragrance news and private previews.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.82rem' }}
              />
              <button type="submit" className="btn btn-dior-black" style={{ padding: '0 16px' }} aria-label="Subscribe">
                <ArrowRight size={15} />
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
            gap: '12px',
            fontSize: '0.74rem',
            color: '#6b7280'
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
