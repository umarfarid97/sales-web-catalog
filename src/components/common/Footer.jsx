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
  const { setSelectedCategory, showToast } = useStore();

  const handleNewsletter = (e) => {
    e.preventDefault();
    showToast('Merci! You have been subscribed to Valenszo Fragrance previews.', 'success');
  };

  return (
    <footer style={{ background: '#04060a', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 0 80px', color: '#ffffff' }}>
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
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#c5a059' }}>
              <Gift size={20} />
            </div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '4px', fontSize: '0.85rem' }}>Valenszo Art of Gifting</h4>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Complimentary iconic Valenszo gift box with signature ribbon.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#c5a059' }}>
              <Feather size={20} />
            </div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '4px', fontSize: '0.85rem' }}>2 Deluxe Samples</h4>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Choose 2 complimentary travel spray miniatures at checkout.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#c5a059' }}>
              <RefreshCw size={20} />
            </div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '4px', fontSize: '0.85rem' }}>Refillable Flacons</h4>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Sustainable design: refill your Valenszo flacon infinitely.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#c5a059' }}>
              <ShieldCheck size={20} />
            </div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '4px', fontSize: '0.85rem' }}>Free Climate Delivery</h4>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>White-glove delivery on all orders over RM150.</p>
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
            <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'flex-start' }}>
              <ValenszoLogo size="md" layout="horizontal" subtitle="FRAGRANCE MALAYSIA" style={{ alignItems: 'flex-start' }} />
            </div>
            <p style={{ fontSize: '0.84rem', color: '#9ca3af', lineHeight: '1.6', marginBottom: '14px' }}>
              Valenszo is an act of creation inspired by noble essences and rare raw materials. Handcrafted luxury fragrances with timeless elegance.
            </p>
            <div style={{ fontSize: '0.72rem', color: '#c5a059', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Kuala Lumpur &bull; Paris &bull; Worldwide Delivery
            </div>
          </div>

          {/* Fragrance Collections */}
          <div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '16px', fontSize: '0.88rem' }}>Fragrance Collections</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
              <li>
                <button 
                  onClick={() => { window.location.href = '/collection'; }} 
                  style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.84rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Valenszo Complete Line
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.location.href = '/men'; }} 
                  style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.84rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Men's Haute Collection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.location.href = '/women'; }} 
                  style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.84rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Women's Haute Collection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.location.href = '/bundle'; }} 
                  style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.84rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Signature Bundle Wardrobes
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '16px', fontSize: '0.88rem' }}>Client Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#9ca3af', padding: 0 }}>
              <li>Complimentary Bottle Presentation</li>
              <li>The Valenszo Art of Gifting</li>
              <li>Infinite Refill Station Guidance</li>
              <li>Track Your Delivery</li>
              <li>Contact Maison Concierge</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="couture-sub" style={{ color: '#ffffff', marginBottom: '16px', fontSize: '0.88rem' }}>Newsletter</h4>
            <p style={{ fontSize: '0.84rem', color: '#9ca3af', marginBottom: '12px', lineHeight: 1.5 }}>
              Subscribe to receive exclusive Valenszo Fragrance news and private previews.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="email"
                required
                placeholder="Enter email address"
                style={{
                  padding: '9px 12px',
                  fontSize: '0.82rem',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '4px',
                  color: '#ffffff',
                  flex: 1,
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                style={{
                  padding: '0 16px',
                  background: '#c5a059',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} 
                aria-label="Subscribe"
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
