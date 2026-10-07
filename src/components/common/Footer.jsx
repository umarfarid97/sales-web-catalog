import React from 'react';
import { MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="prv-footer" style={{ background: '#f7f4ee', borderTop: '1px solid #eeebdf', padding: '3.5rem 0 2rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Column 1: Brand Mark */}
          <div>
            <a href="index.html" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#111111' }}>
              <span style={{ fontFamily: 'var(--font-brand, "Bodoni Moda", serif)', fontSize: '1.85rem', fontWeight: 800, letterSpacing: '0.05em' }}>VL</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-brand, "Bodoni Moda", serif)', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.2em' }}>VALENSZO</span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8c7d70', fontWeight: 600 }}>Fragrance Malaysia</span>
              </div>
            </a>
          </div>

          {/* Column 2: Fragrance Collections */}
          <div>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#111111', marginBottom: '1rem' }}>
              Fragrance Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, margin: 0 }}>
              <li><a href="collection.html" style={{ fontSize: '0.84rem', color: '#63574c', textDecoration: 'none', transition: 'color 0.2s' }}>All Collections</a></li>
              <li><a href="men.html" style={{ fontSize: '0.84rem', color: '#63574c', textDecoration: 'none', transition: 'color 0.2s' }}>Men's Perfumes</a></li>
              <li><a href="women.html" style={{ fontSize: '0.84rem', color: '#63574c', textDecoration: 'none', transition: 'color 0.2s' }}>Women's Perfumes</a></li>
              <li><a href="collection.html?gender=Unisex" style={{ fontSize: '0.84rem', color: '#63574c', textDecoration: 'none', transition: 'color 0.2s' }}>Unisex Perfumes</a></li>
              <li><a href="diagnostic.html" style={{ fontSize: '0.84rem', color: '#63574c', textDecoration: 'none', transition: 'color 0.2s' }}>Scent Discovery Quiz</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#111111', marginBottom: '1rem' }}>
              Customer Care
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <a 
                  href="https://wa.me/60182868402?text=Hello%20Valenszo!%20I%20would%20like%20assistance%20with%20your%20perfume%20catalog." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '0.84rem', color: '#63574c', textDecoration: 'none', transition: 'color 0.2s' }}
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp: 018-286 8402</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Centered */}
        <div style={{
          paddingTop: '1.25rem',
          borderTop: '1px solid #eeebdf',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '0.45rem',
          fontSize: '0.74rem',
          color: '#8c7d70'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Valenszo Fragrance Malaysia. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
            <a href="#" style={{ color: '#8c7d70', textDecoration: 'none' }}>Privacy Policy</a>
            <span style={{ color: '#d1c8bd', fontSize: '0.7rem' }}>•</span>
            <a href="#" style={{ color: '#8c7d70', textDecoration: 'none' }}>Legal Notice</a>
            <span style={{ color: '#d1c8bd', fontSize: '0.7rem' }}>•</span>
            <a href="#" style={{ color: '#8c7d70', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
