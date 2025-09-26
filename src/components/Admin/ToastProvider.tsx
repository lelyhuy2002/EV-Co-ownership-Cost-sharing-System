"use client";

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Toast = { id: string; message: string; type?: 'info' | 'success' | 'error' };

const ToastContext = createContext<{ push: (m: string, t?: Toast['type']) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = 't-' + Math.random().toString(36).slice(2, 9);
    setToasts(t => [{ id, message, type }, ...t]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const ctx = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div style={{ position: 'fixed', right: 18, top: 18, zIndex: 1400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ minWidth: 220, background: t.type === 'error' ? '#fee2e2' : '#ecfdf5', color: '#064e3b', padding: '8px 12px', borderRadius: 8, boxShadow: '0 6px 18px rgba(2,6,23,0.08)' }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { push: (m: string) => console.log('Toast:', m) };
  return ctx;
}

export default ToastProvider;
