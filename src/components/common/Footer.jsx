import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Headphones, 
  ArrowRight,
  Heart
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
              background: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Free Express Shipping</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>On all orders over $150</p>
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
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>2-Year Comprehensive</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Full hardware replacement</p>
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
              color: '#fbbf24'
            }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>30-Day Risk-Free Trial</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Hassle-free instant returns</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee'
            }}>
              <Headphones size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>24/7 Expert Support</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Direct audio & hardware engineers</p>
            </div>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="footer-grid">
          
          <div className="footer-brand">
            <div className="brand-logo" style={{ marginBottom: '12px' }}>
              <div className="brand-icon-box" style={{ width: '34px', height: '34px' }}>
                <Sparkles size={18} color="#ffffff" />
              </div>
              <span>LUMINA</span>
            </div>
            <p>
              Next-generation lifestyle hardware, ergonomic workstation essentials, and spatial acoustic equipment engineered for creators and pioneers.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <span className="badge badge-primary">ISO 9001 Certified</span>
              <span className="badge badge-success">Carbon Neutral</span>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Collections</h4>
            <ul className="footer-links">
              <li>
                <button 
                  onClick={() => { setRole('customer'); setSelectedCategory('Audio'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}
                >
                  Studio Audio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setRole('customer'); setSelectedCategory('Wearables'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}
                >
                  Smart Wearables
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setRole('customer'); setSelectedCategory('Workstation'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}
                >
                  Workstation Setup
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setRole('customer'); setSelectedCategory('Smart Home'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}
                >
                  Ambient Smart Home
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Platform View</h4>
            <ul className="footer-links">
              <li>
                <button 
                  onClick={() => setRole('customer')}
                  style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}
                >
                  Customer Storefront
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setRole('admin')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.88rem' }}
                >
                  Merchant Admin Console →
                </button>
              </li>
              <li><a href="#privacy">Privacy & Security</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Newsletter & Perks</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '14px' }}>
              Subscribe to receive private sale drops and 10% off your first checkout.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{ flex: 1, fontSize: '0.85rem' }}
                aria-label="Newsletter email address"
              />
              <button className="btn btn-primary" style={{ padding: '0 16px' }} aria-label="Subscribe">
                <ArrowRight size={16} />
              </button>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Use promo code <span style={{ color: '#818cf8', fontWeight: 700 }}>LUMINA25</span> for 25% off today!
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} LUMINA Technologies & Lifestyle Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for exceptional user and admin experiences.
          </div>
        </div>

      </div>
    </footer>
  );
};
