import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { X, Lock, Mail, User, Phone, MapPin, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    register, 
    isAuthenticating 
  } = useAuth();

  const { cartCount } = useStore();

  // Form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Kuala Lumpur');
  const [regState, setRegState] = useState('Wilayah Persekutuan');
  const [regZip, setRegZip] = useState('50250');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await login(signInEmail, signInPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to sign in.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName || !regEmail || !regPassword) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const res = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      address: regAddress,
      city: regCity,
      state: regState,
      zip: regZip
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    } else if (res.requiresConfirmation) {
      setSuccessMessage(res.message);
      setSignInEmail(regEmail);
      setAuthModalMode('signin');
    }
  };


  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          background: '#ffffff',
          color: '#000000',
          border: '1px solid #e5e7eb',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: '92dvh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          margin: 'auto',
          padding: '0'
        }}
      >
        {/* Header with Close */}
        <div style={{
          padding: '24px 28px 16px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <span style={{ 
              fontSize: '0.65rem', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              color: '#b38e44', 
              fontWeight: 700 
            }}>
              Maison Valenszo &bull; Client Privilege
            </span>
            <h3 style={{ 
              fontFamily: 'var(--font-couture, serif)', 
              fontSize: '1.45rem', 
              fontWeight: 800, 
              color: '#000000',
              margin: '4px 0 0'
            }}>
              {authModalMode === 'signin' ? 'Maison Client Sign In' : 'Create Maison Account'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            aria-label="Close modal"
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4b5563'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Reassurance Banner for Cart Preservation */}
        {cartCount > 0 && (
          <div style={{
            background: '#fafaf9',
            borderBottom: '1px solid #e7e5e4',
            padding: '10px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.78rem',
            color: '#44403c'
          }}>
            <Sparkles size={16} color="#b38e44" style={{ flexShrink: 0 }} />
            <span>
              Your shopping bag (<strong>{cartCount} item{cartCount > 1 ? 's' : ''}</strong>) is preserved and will be linked to your account.
            </span>
          </div>
        )}

        <div style={{ padding: '24px 28px 32px' }}>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: '#f3f4f6',
            borderRadius: '6px',
            padding: '4px',
            marginBottom: '22px'
          }}>
            <button
              type="button"
              onClick={() => { setAuthModalMode('signin'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.82rem',
                fontWeight: authModalMode === 'signin' ? 700 : 500,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: authModalMode === 'signin' ? '#ffffff' : 'transparent',
                color: authModalMode === 'signin' ? '#000000' : '#6b7280',
                boxShadow: authModalMode === 'signin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.82rem',
                fontWeight: authModalMode === 'register' ? 700 : 500,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: authModalMode === 'register' ? '#ffffff' : 'transparent',
                color: authModalMode === 'register' ? '#000000' : '#6b7280',
                boxShadow: authModalMode === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              marginBottom: '18px',
              lineHeight: 1.5
            }}>
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              marginBottom: '18px'
            }}>
              {errorMessage}
            </div>
          )}

          {/* ================= MODE 1: SIGN IN ================= */}
          {authModalMode === 'signin' ? (
            <form onSubmit={handleSignIn}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4b5563', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="email"
                    required
                    placeholder="client@valenszo.my"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 38px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.88rem',
                      color: '#000000',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4b5563' }}>
                    Password
                  </label>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 38px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.88rem',
                      color: '#000000',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: isAuthenticating ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s ease'
                }}
              >
                {isAuthenticating ? 'Authenticating...' : 'Sign In to Account'}
                {!isAuthenticating && <ArrowRight size={16} />}
              </button>
            </form>
          ) : (
            /* ================= MODE 2: REGISTER ================= */
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4b5563', marginBottom: '5px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adrien Laurent"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#000000',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4b5563', marginBottom: '5px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#000000',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4b5563', marginBottom: '5px' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#000000',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4b5563', marginBottom: '5px' }}>
                  Phone Number (for Express Delivery)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="tel"
                    placeholder="+60 12-345 6789"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#000000',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4b5563', marginBottom: '5px' }}>
                  Delivery Street Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Building, Street, Unit Number"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#000000',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: '#4b5563', marginBottom: '4px' }}>
                    City & State
                  </label>
                  <input
                    type="text"
                    value={`${regCity}, ${regState}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setRegCity(parts[0]?.trim() || '');
                      if (parts[1]) setRegState(parts[1]?.trim() || '');
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      color: '#000000',
                      background: '#ffffff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: '#4b5563', marginBottom: '4px' }}>
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={regZip}
                    onChange={(e) => setRegZip(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      color: '#000000',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: isAuthenticating ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s ease'
                }}
              >
                {isAuthenticating ? 'Creating Account...' : 'Complete Registration'}
                {!isAuthenticating && <ArrowRight size={16} />}
              </button>
            </form>
          )}

        </div>

        {/* Footer Security Assurance */}
        <div style={{
          background: '#f9fafb',
          borderTop: '1px solid #f3f4f6',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          color: '#6b7280'
        }}>
          <ShieldCheck size={14} color="#16a34a" />
          <span>Encrypted Client Database &bull; Maison Valenszo Privacy Protected</span>
        </div>
      </div>
    </div>
  );
};
