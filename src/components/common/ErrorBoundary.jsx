import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Maison Concierge Error Catch:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('valenszo_cart');
      localStorage.removeItem('lumina_cart');
      localStorage.removeItem('valenszo_active_gender');
    } catch (e) {
      console.error(e);
    }
    window.location.href = window.location.origin;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050811',
          color: '#ffffff',
          padding: '24px',
          fontFamily: 'var(--font-couture, sans-serif)',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '4px',
            padding: '40px 32px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(226, 135, 67, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'var(--dior-gold, #c5a059)'
            }}>
              <AlertCircle size={28} />
            </div>

            <div style={{ fontSize: '0.72rem', letterSpacing: '0.36em', color: 'var(--dior-gold, #c5a059)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>
              Maison Valenszo &bull; Notice
            </div>

            <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.8rem', letterSpacing: '0.12em', marginBottom: '14px', color: '#ffffff' }}>
              Boutique Display Refresh
            </h2>

            <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '28px' }}>
              We encountered a momentary display interruption. Click below to refresh your shopping session.
            </p>

            <button
              onClick={this.handleReset}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                padding: '12px 28px',
                fontFamily: 'var(--font-couture, sans-serif)',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RotateCcw size={15} />
              <span>Refresh Boutique</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
