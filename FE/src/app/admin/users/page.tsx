"use client";

import AdminLayout from '@/components/Admin/AdminLayout';
import { useEffect, useMemo, useState } from 'react';
import mockApi from '@/lib/mockApi';
import Link from 'next/link';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import ToastProvider, { useToast } from '@/components/Admin/ToastProvider';

function sortUsers(data: any[], key: string, dir: 'asc' | 'desc') {
  return data.slice().sort((a, b) => {
    const A = (a[key] || '').toString().toLowerCase();
    const B = (b[key] || '').toString().toLowerCase();
    if (A < B) return dir === 'asc' ? -1 : 1;
    if (A > B) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortKey, setSortKey] = useState('username');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [viewUser, setViewUser] = useState<any | null>(null);

  const load = async () => {
    const u = await mockApi.getUsers();
    setUsers(u || []);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let data = users;
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter((u:any) => (u.username || u.fullName || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
    }
    if (roleFilter !== 'all') data = data.filter((u:any) => u.role === roleFilter);
    data = sortUsers(data, sortKey, sortDir);
    return data;
  }, [users, query, roleFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const confirmDelete = (id: string) => { setDeleteId(id); setConfirmOpen(true); };

  const doDelete = async () => {
    if (!deleteId) return setConfirmOpen(false);
    try {
      const all = await mockApi.getUsers();
      const remaining = (all || []).filter((x:any) => x.id !== deleteId);
      localStorage.setItem('mock_users_v1', JSON.stringify(remaining));
      toast.push('User deleted','success');
      setConfirmOpen(false);
      setDeleteId(null);
      await load();
    } catch (err: any) {
      toast.push(`Failed: ${err?.message || 'error'}`,'error');
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const approve = async (id: string) => {
    try {
      await mockApi.approveUser(id);
      toast.push('Approved user','success');
      await load();
    } catch (e:any) { toast.push(e?.message || 'Failed','error'); }
  };
  const reject = async (id: string) => {
    try {
      await mockApi.rejectUser(id);
      toast.push('Rejected user','success');
      await load();
    } catch (e:any) { toast.push(e?.message || 'Failed','error'); }
  };

  return (
    <ToastProvider>
      <AdminLayout active="users">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>Users</h1>
          <div>
            <Link href="/admin">Back to admin</Link>
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder="Search users by name or email" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} style={{ padding: 8, borderRadius: 6, border: '1px solid #e6edf3', width: 320 }} />
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} style={{ padding: 8, borderRadius: 6, border: '1px solid #e6edf3' }}>
            <option value="all">All roles</option>
            <option value="coowner">Co-owner</option>
            <option value="provider">Provider</option>
            <option value="consumer">Consumer</option>
            <option value="admin">Admin</option>
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Sort by</label>
            <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #e6edf3' }}>
              <option value="username">Name</option>
              <option value="email">Email</option>
              <option value="id">ID</option>
              <option value="status">Status</option>
            </select>
            <button onClick={() => setSortDir(s => s === 'asc' ? 'desc' : 'asc')} style={{ padding: 8, borderRadius: 6, border: '1px solid #e6edf3' }}>{sortDir === 'asc' ? '↑' : '↓'}</button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 0' }}>ID</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 0' }}>Name</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 0' }}>Email</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 0' }}>Role</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 0' }}>Status</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px 0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((u:any) => (
                <tr key={u.id} style={{ transition: 'background 0.15s', cursor: 'default' }} onMouseEnter={e => (e.currentTarget.style.background = '#fbfdff')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '10px 0' }}>{u.id}</td>
                  <td>{u.fullName || u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status || 'active'}</td>
                  <td>
                    <button onClick={async () => { const full = await mockApi.getUserById(u.id); setViewUser(full); }} style={{ marginRight: 8, padding: '6px 8px', borderRadius: 6 }}>View</button>
                    {u.status !== 'active' ? (
                      <>
                        <button onClick={() => approve(u.id)} style={{ marginRight: 8, padding: '6px 8px', borderRadius: 6 }}>Approve</button>
                        <button onClick={() => reject(u.id)} style={{ padding: '6px 8px', borderRadius: 6 }}>Reject</button>
                      </>
                    ) : (
                      <>
                        <button style={{ marginRight: 8, padding: '6px 8px', borderRadius: 6 }}>Edit</button>
                        <button onClick={() => confirmDelete(u.id)} style={{ padding: '6px 8px', borderRadius: 6 }}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#6b7280' }}>Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding: 8, borderRadius: 6 }}>Prev</button>
              <div style={{ alignSelf: 'center' }}>{page} / {totalPages}</div>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: 8, borderRadius: 6 }}>Next</button>
            </div>
          </div>
        </div>

        {viewUser && (
          <div role="dialog" aria-modal className="modal" style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ background: '#fff', width: 560, maxWidth: '96vw', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>User details</h3>
                <button onClick={() => setViewUser(null)} style={{ padding: 6, borderRadius: 6 }}>Close</button>
              </div>
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 12, rowGap: 8 }}>
                <div><b>ID:</b> {viewUser.id}</div>
                <div><b>Status:</b> {viewUser.status}</div>
                <div><b>Name:</b> {viewUser.fullName || viewUser.username}</div>
                <div><b>Email:</b> {viewUser.email}</div>
                <div><b>Role:</b> {viewUser.role}</div>
                <div style={{ gridColumn: '1 / -1', marginTop: 8, fontWeight: 600 }}>Registration profile</div>
                <div><b>Full name:</b> {viewUser.profile?.fullName || '(na)'}</div>
                <div><b>Date of birth:</b> {viewUser.profile?.dob || '(na)'}</div>
                <div><b>ID number:</b> {viewUser.profile?.idNumber || '(na)'}</div>
                <div><b>Driver license:</b> {viewUser.profile?.driverLicense || '(na)'}</div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <b>Attachments:</b>
                  <ul style={{ margin: '4px 0 0 16px' }}>
                    <li>CCCD front: {viewUser.profile?.attachments?.idFrontImage?.name || '(none)'} ({viewUser.profile?.attachments?.idFrontImage?.type || ''})</li>
                    <li>CCCD back: {viewUser.profile?.attachments?.idBackImage?.name || '(none)'} ({viewUser.profile?.attachments?.idBackImage?.type || ''})</li>
                    <li>Driver license: {viewUser.profile?.attachments?.driverLicenseImage?.name || '(none)'} ({viewUser.profile?.attachments?.driverLicenseImage?.type || ''})</li>
                  </ul>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                {viewUser.status !== 'active' && (
                  <>
                    <button onClick={async ()=> { await approve(viewUser.id); setViewUser(null); }} style={{ padding: '6px 8px', borderRadius: 6 }}>Approve</button>
                    <button onClick={async ()=> { await reject(viewUser.id); setViewUser(null); }} style={{ padding: '6px 8px', borderRadius: 6 }}>Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminLayout>

      <ConfirmModal open={confirmOpen} title="Delete user" description="This will permanently delete the user from the demo datastore. Continue?" onCancel={() => { setConfirmOpen(false); setDeleteId(null); }} onConfirm={doDelete} />
    </ToastProvider>
  );
}
