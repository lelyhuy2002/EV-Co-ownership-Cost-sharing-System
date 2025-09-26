"use client";

import { ReactNode } from 'react';

export default function ConfirmModal({ open, title, description, onCancel, onConfirm }: { open: boolean; title?: string; description?: string; onCancel: () => void; onConfirm: () => void; }) {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
      <div style={{ width: 420, background: 'white', borderRadius: 8, padding: 18, boxShadow: '0 8px 24px rgba(2,6,23,0.2)' }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>{title || 'Confirm'}</div>
        <div style={{ color: '#374151', marginBottom: 16 }}>{description || 'Are you sure?'}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel} style={{ padding: '8px 12px', borderRadius: 6 }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '8px 12px', borderRadius: 6, background: '#0b5cff', color: 'white', border: 'none' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
