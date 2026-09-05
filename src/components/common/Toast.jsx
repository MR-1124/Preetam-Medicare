import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container no-print">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger' || toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`toast ${isSuccess ? 'toast-success' : isDanger ? 'toast-danger' : isWarning ? 'toast-warning' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isSuccess && <CheckCircle2 size={18} color="var(--success)" />}
              {isDanger && <AlertCircle size={18} color="var(--danger)" />}
              {isWarning && <AlertCircle size={18} color="var(--warning)" />}
              {!isSuccess && !isDanger && !isWarning && <Info size={18} color="var(--primary)" />}
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ color: 'var(--text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
