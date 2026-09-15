import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ValenszoLogo } from './ValenszoLogo';

export const Footer = () => {
  const { showToast } = useStore();

  const handleNewsletter = (e) => {
    e.preventDefault();
    showToast('Thank you! You have been subscribed to Valenszo Fragrance updates.', 'success');
  };

  return (
    <footer style={{ background: '#1e130c', borderTop: '1px solid #332016', padding: '50px 0 80px', color: '#e8ded4' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px, 3vw, 24px)' }}>
        
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
              Valenszo crafts long-lasting luxury perfumes using high-grade fragrance oils. Premium scents made for everyday elegance in Malaysia.
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
                  href="collection.html" 
                  style={{ color: '#b5a498', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b5a498'; }}
                >
                  All Perfumes
                </a>
              </li>
              <li>
                <a 
                  href="men.html" 
                  style={{ color: '#b5a498', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b5a498'; }}
                >
                  Men's Perfumes
                </a>
              </li>
              <li>
                <a 
                  href="women.html" 
                  style={{ color: '#b5a498', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b5a498'; }}
                >
                  Women's Perfumes
                </a>
              </li>
              <li>
                <a 
                  href="diagnostic.html" 
                  style={{ color: '#b5a498', fontSize: '0.84rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#b5a498'; }}
                >
                  Scent Discovery Quiz
                </a>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.06em' }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#b5a498', padding: 0 }}>
              <li>Free Gift Packaging</li>
              <li>Gift Box & Greeting Card</li>
              <li>Scent Finder Quiz</li>
              <li>Track Your Delivery</li>
              <li>Contact Customer Support</li>
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
                  fontSize: '1rem',
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
            <span>Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
