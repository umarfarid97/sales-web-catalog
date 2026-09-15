import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Maison Valenszo Error Catch]:', error, errorInfo);

    // Auto-recovery attempt: If this is the first error in the session, clear corrupt cache and retry once automatically
    try {
      const alreadyAttempted = sessionStorage.getItem('valenszo_recovery_attempt');
      if (!alreadyAttempted) {
        sessionStorage.setItem('valenszo_recovery_attempt', 'true');
        const keysToRemove = [
          'valenszo_products_cache',
          'lumina_products',
          'valenszo_cart',
          'lumina_cart',
          'valenszo_active_gender',
          'valenszo_real_orders',
          'valenszo_favorites',
          'valenszo_role',
          'valenszo_attributes_cache'
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        setTimeout(() => {
          window.location.reload();
        }, 150);
      }
    } catch (e) {
      console.warn('Auto-recovery storage access error', e);
    }
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
    window.location.reload();
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
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '40px 32px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
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
              color: '#c5a059'
            }}>
              <AlertCircle size={28} />
            </div>

            <div style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#c5a059', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>
              Valenszo &bull; Support
            </div>

            <h2 style={{ fontFamily: 'var(--font-brand, serif)', fontSize: '1.8rem', letterSpacing: '0.06em', marginBottom: '14px', color: '#ffffff' }}>
              Please Refresh the Page
            </h2>

            <p style={{ color: '#9ca3af', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '28px' }}>
              Something went wrong while loading. Click below to refresh and load the catalog.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                padding: '12px 28px',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
              }}
            >
              <RotateCcw size={15} />
              <span>Refresh Page</span>
            </button>

            {/* Diagnostic Details Toggle for Admin / Development */}
            {this.state.error && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button
                  type="button"
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {this.state.showDetails ? 'Hide Diagnostic Info' : 'Show Diagnostic Info'}
                </button>
                {this.state.showDetails && (
                  <pre style={{
                    marginTop: '10px',
                    padding: '10px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    color: '#ef4444',
                    textAlign: 'left',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}>
                    {this.state.error.toString()}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
