import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast, isCartOpen } = useStore();

  // If there are no active toasts OR if the Cart Drawer is open, do not render toasts
  // This guarantees the Cart Drawer footer & Checkout button are never obstructed
  if (toasts.length === 0 || isCartOpen) return null;

  return (
    <>
      <div
        className="maison-toast-container"
        style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'none',
          width: 'max-content',
          maxWidth: 'calc(100vw - 32px)'
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
              className="maison-toast-item"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                background: 'rgba(18, 21, 30, 0.95)',
                border: `1px solid ${borderColor}55`,
                borderLeft: `4px solid ${borderColor}`,
                borderRadius: '9999px',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
                minWidth: '280px',
                maxWidth: '460px',
                animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {isSuccess && <CheckCircle2 size={18} color={iconColor} style={{ flexShrink: 0 }} />}
              {isError && <AlertCircle size={18} color={iconColor} style={{ flexShrink: 0 }} />}
              {!isSuccess && !isError && <Info size={18} color={iconColor} style={{ flexShrink: 0 }} />}
              
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#f8fafc', fontWeight: 600, flex: 1, lineHeight: 1.4 }}>
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
                  borderRadius: '50%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.15s'
                }}
                aria-label="Dismiss toast"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .maison-toast-container {
            top: 72px !important;
            width: calc(100% - 32px) !important;
          }
          .maison-toast-item {
            min-width: 0 !important;
            width: 100% !important;
            border-radius: 12px !important;
            padding: 10px 14px !important;
          }
        }
      `}</style>
    </>
  );
};
