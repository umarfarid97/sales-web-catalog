import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const borderColor = isSuccess ? '#10b981' : isError ? '#f43f5e' : '#6366f1';
        const iconColor = isSuccess ? '#34d399' : isError ? '#fb7185' : '#818cf8';

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              background: 'rgba(18, 21, 30, 0.95)',
              border: `1px solid ${borderColor}55`,
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: '12px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
              minWidth: '300px',
              maxWidth: '420px',
              animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {isSuccess && <CheckCircle2 size={20} color={iconColor} style={{ flexShrink: 0 }} />}
            {isError && <AlertCircle size={20} color={iconColor} style={{ flexShrink: 0 }} />}
            {!isSuccess && !isError && <Info size={20} color={iconColor} style={{ flexShrink: 0 }} />}
            
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#f8fafc', fontWeight: 500, flex: 1, lineHeight: 1.4 }}>
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: '#94a3b8',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'color 0.15s'
              }}
              aria-label="Dismiss toast"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
