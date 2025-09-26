"use client";

import AdminLayout from '@/components/Admin/AdminLayout';
import { useEffect, useState } from 'react';
import mockApi from '@/lib/mockApi';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import ToastProvider, { useToast } from '@/components/Admin/ToastProvider';

export default function DataPackagesAdmin() {
  const [packages, setPackages] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | { type: 'approve' | 'reject'; id: string }>(null);
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      const g = await mockApi.getGroups();
      if (mounted) setPackages(g || []);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const begin = (type: 'approve' | 'reject', id: string) => { setConfirmAction({ type, id }); setConfirmOpen(true); };

  const run = async () => {
    if (!confirmAction) return setConfirmOpen(false);
    try {
      // For demo, toggle status
  const g: any[] = (await mockApi.getGroups()) || [];
  const idx = g.findIndex((x: any) => x.id === confirmAction.id);
      if (idx !== -1) {
        g[idx].status = confirmAction.type === 'approve' ? 'active' : 'pending';
        localStorage.setItem('mock_groups_v1', JSON.stringify(g));
        toast.push(`${confirmAction.type === 'approve' ? 'Approved' : 'Rejected'} package`,'success');
        setPackages(g);
      }
    } catch (err: any) {
      toast.push(`Failed: ${err?.message || 'error'}`,'error');
    }
    setConfirmOpen(false);
    setConfirmAction(null);
  };

  return (
    <ToastProvider>
      <AdminLayout active="packages">
        <h1>Data Packages</h1>
        <p>Quản lý các gói dữ liệu (mock)</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>ID</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>Title</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>Owner</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>Status</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '8px 0' }}>{p.id}</td>
                <td>{p.vehicleName || p.title}</td>
                <td>{p.adminName || p.ownerName || p.adminId}</td>
                  <td>
                    {p.status === 'active' ? (
                      <span style={{ background: '#ecfdf5', color: '#065f46', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>Active</span>
                    ) : p.status === 'pending' ? (
                      <span style={{ background: '#fffbeb', color: '#92400e', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>Pending</span>
                    ) : (
                      <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>{p.status}</span>
                    )}
                  </td>
                <td>
                  <button onClick={() => begin('approve', p.id)} style={{ marginRight: 8, padding: '6px 8px', borderRadius: 6 }}>Approve</button>
                  <button onClick={() => begin('reject', p.id)} style={{ padding: '6px 8px', borderRadius: 6 }}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminLayout>

      <ConfirmModal open={confirmOpen} title={confirmAction ? (confirmAction.type === 'approve' ? 'Approve package' : 'Reject package') : undefined} description={confirmAction ? `Are you sure you want to ${confirmAction.type} this package?` : undefined} onCancel={() => { setConfirmOpen(false); setConfirmAction(null); }} onConfirm={run} />
    </ToastProvider>
  );
}
