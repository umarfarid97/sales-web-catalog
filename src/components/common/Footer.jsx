import React from 'react';
import { ValenszoLogo } from './ValenszoLogo';

export const Footer = () => {
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
            <p style={{ fontSize: '0.84rem', color: '#b5a498', lineHeight: '1.6', margin: 0 }}>
              Valenszo crafts long-lasting luxury perfumes using high-grade fragrance oils. Premium scents made for everyday elegance in Malaysia.
            </p>
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
              <li>
                <a 
                  href="https://wa.me/60182868402?text=Hello%20Valenszo!%20I%20would%20like%20assistance%20with%20your%20perfume%20catalog." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#d97706', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  WhatsApp: 018-286 8402
                </a>
              </li>
            </ul>
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
