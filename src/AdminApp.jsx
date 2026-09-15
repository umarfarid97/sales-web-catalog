import React, { useEffect } from 'react';

export default function AdminApp() {
  useEffect(() => {
    window.location.replace('index.html');
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--font-brand, serif)' }}>Redirecting to catalog...</p>
    </div>
  );
}
