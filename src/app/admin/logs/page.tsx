"use client";

import AdminLayout from '@/components/Admin/AdminLayout';
import { useEffect, useState } from 'react';
import { mockApi } from '@/lib/mockApi';
import Link from 'next/link';

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  const load = async () => {
    const l = await mockApi.getLogs();
    setLogs(l || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <AdminLayout active="logs">
      <h1>Logs</h1>
      <p>Hệ thống logs (mock)</p>
      <div style={{ maxHeight: 400, overflow: 'auto', border: '1px solid #eee', padding: 8 }}>
        {logs.map(l => (
          <div key={l.id} style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>
            <div style={{ fontSize: 12, color: '#666' }}>{new Date(l.ts).toLocaleString()}</div>
            <div><strong>{l.type}</strong> — {l.message}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 12 }}><Link href="/admin">Back to admin</Link></p>
    </AdminLayout>
  );
}
