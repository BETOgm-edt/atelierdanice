import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type}`}
            role="alert"
          >
            {toast.type === 'success' && <CheckCircle2 size={20} color="var(--color-success)" />}
            {toast.type === 'error' && <AlertCircle size={20} color="var(--color-danger)" />}
            {toast.type === 'info' && <Info size={20} color="var(--color-primary)" />}
            {toast.type === 'warning' && <AlertCircle size={20} color="var(--color-warning)" />}

            <p style={{ flex: 1, fontSize: '0.88rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              style={{ padding: '2px', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              aria-label="Fechar notificação"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};
