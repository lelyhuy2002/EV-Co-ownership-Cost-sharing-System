"use client";

import Link from 'next/link';
import AdminLayout from '@/components/Admin/AdminLayout';
import { mockApi, type JoinRequest } from '@/lib/mockApi';
import { useEffect, useState } from 'react';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import ToastProvider, { useToast } from '@/components/Admin/ToastProvider';

export default function UserManagement() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | { type: 'approve' | 'reject'; id: string }>(null);
  const toast = useToast();

  const load = async () => {
    const pending = await mockApi.getJoinRequests({ status: 'pending' });
    setRequests(pending as JoinRequest[]);
  };

  useEffect(() => {
    load();
  }, []);

  const begin = (type: 'approve' | 'reject', id: string) => {
    setConfirmAction({ type, id });
    setConfirmOpen(true);
  };

  const runConfirm = async () => {
    if (!confirmAction) return setConfirmOpen(false);
    try {
      if (confirmAction.type === 'approve') await mockApi.approveJoinRequest(confirmAction.id);
      else await mockApi.rejectJoinRequest(confirmAction.id);
      toast.push(`Request ${confirmAction.type}d`,'success');
    } catch (err: any) {
      toast.push(`Failed: ${err?.message || 'error'}`,'error');
    }
    setConfirmOpen(false);
    setConfirmAction(null);
    await load();
  };

  return (
    <ToastProvider>
      <AdminLayout active="requests">
        <h1>User Requests</h1>
        <p>Danh sách yêu cầu tham gia (pending)</p>
        {requests.length === 0 ? (
          <div>Không có yêu cầu đang chờ</div>
        ) : (
          // group by groupId
          Object.entries(requests.reduce((acc: any, r) => {
            (acc[r.groupId] = acc[r.groupId] || []).push(r);
            return acc;
          }, {})).map(([groupId, list]: any) => (
            <section key={groupId} style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 8 }}>{groupId}</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {list.map((r: JoinRequest) => (
                  <div key={r.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div><strong>{r.userName || r.userId}</strong> — <span style={{ color: '#666' }}>{new Date(r.createdAt).toLocaleString()}</span></div>
                      <div>
                        <button onClick={() => begin('approve', r.id)} style={{ marginRight: 8 }}>Approve</button>
                        <button onClick={() => begin('reject', r.id)}>Reject</button>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, color: '#444' }}>{r.message}</div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
        <p><Link href="/admin">Back to admin</Link></p>
      </AdminLayout>

      <ConfirmModal
        open={confirmOpen}
        title={confirmAction ? (confirmAction.type === 'approve' ? 'Approve Request' : 'Reject Request') : undefined}
        description={confirmAction ? `Are you sure you want to ${confirmAction.type} this request?` : undefined}
        onCancel={() => { setConfirmOpen(false); setConfirmAction(null); }}
        onConfirm={runConfirm}
      />
    </ToastProvider>
  );
}
