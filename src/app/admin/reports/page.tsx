"use client";

import AdminLayout from '@/components/Admin/AdminLayout';
import { useState } from 'react';
import { mockApi } from '@/lib/mockApi';
import Link from 'next/link';

export default function AdminReports() {
  const [csv, setCsv] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const exportType = async (type: 'users'|'groups'|'requests'|'logs') => {
    const r = await mockApi.exportReport(type);
    setFilename(r.filename);
    setCsv(r.content);
  };

  return (
    <AdminLayout active="reports">
      <h1>Reports</h1>
      <p>Tạo báo cáo (CSV) từ dữ liệu mock</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => exportType('users')}>Export Users</button>
        <button onClick={() => exportType('groups')}>Export Groups</button>
        <button onClick={() => exportType('requests')}>Export Requests</button>
        <button onClick={() => exportType('logs')}>Export Logs</button>
      </div>

      {csv && (
        <div style={{ marginTop: 12 }}>
          <div><strong>Preview {filename}</strong></div>
          <textarea style={{ width: '100%', height: 240 }} value={csv} readOnly />
          <div style={{ marginTop: 8 }}>
            <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download={filename || 'report.csv'}>Download CSV</a>
          </div>
        </div>
      )}

      <p style={{ marginTop: 12 }}><Link href="/admin">Back to admin</Link></p>
    </AdminLayout>
  );
}
