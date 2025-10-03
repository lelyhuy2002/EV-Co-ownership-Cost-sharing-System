"use client";

import AdminLayout from '@/components/Admin/AdminLayout';
import { useEffect, useMemo, useState } from 'react';
import { mockApi, type JoinRequest } from '@/lib/mockApi';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import ToastProvider, { useToast } from '@/components/Admin/ToastProvider';

type ReqRow = JoinRequest & { type?: 'provider' | 'support' | 'delete' | 'other' };

const PAGE_SIZE = 8;

export default function UserManagement() {
  return (
    <ToastProvider>
      <UserRequests />
    </ToastProvider>
  );
}

function UserRequests() {
  const toast = useToast();
  const [requests, setRequests] = useState<ReqRow[]>([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'all' | 'provider' | 'support' | 'delete' | 'other'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);

  // modal state
  const [detail, setDetail] = useState<ReqRow | null>(null);
  const [confirm, setConfirm] = useState<{ kind: 'approve' | 'reject'; id: string } | null>(null);
  const [rejectReasonOpen, setRejectReasonOpen] = useState<{ id: string } | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    // load pending & other requests
    const all = await mockApi.getJoinRequests();
    // map to extended shape (type heuristics)
    const mapped: ReqRow[] = (all || []).map((r: JoinRequest) => ({ ...r, type: inferTypeFromMessage(r.message) }));
    setRequests(mapped.reverse());
  }

  const filtered = useMemo(() => {
    let r = requests.slice();
    if (tab !== 'all') r = r.filter(x => x.type === tab);
    if (statusFilter !== 'all') r = r.filter(x => x.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(x => (x.userName || x.userId || '').toLowerCase().includes(q) || (x.message || '').toLowerCase().includes(q) || x.id.toLowerCase().includes(q));
    }
    return r;
  }, [requests, tab, statusFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  

  return (
    <AdminLayout active="requests">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: 0 }}>Quản lý và phê duyệt Yêu cầu Đăng ký (Nhà cung cấp/Khác)</h2>
          <div style={{ color: '#6b7280', marginTop: 6 }}>Quản lý, xem chi tiết và xử lý tất cả các yêu cầu gửi lên hệ thống.</div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm theo tên / email / ID / nội dung..." style={{ padding: 10, borderRadius: 8, border: '1px solid #E6E9EF', flex: 1 }} />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }} style={{ padding: 10, borderRadius: 8 }}>
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        {(['all','provider','support','delete','other'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, border: tab === t ? '1px solid #0b5cff' : '1px solid transparent', background: tab === t ? '#eef4ff' : '#fff' }}>
            {t === 'all' ? 'Tất cả' : t === 'provider' ? 'Yêu cầu Nhà cung cấp' : t === 'support' ? 'Yêu cầu Hỗ trợ' : t === 'delete' ? 'Yêu cầu Xóa' : 'Khác'}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12, background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F3F6FB' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 12 }}>ID</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Người yêu cầu</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Loại</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Ngày gửi</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Trạng thái</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Không có yêu cầu</td></tr>
            ) : pageItems.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f2f4f7', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.background = '#fbfdff')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: 12 }}><code>{r.id}</code></td>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700 }}>{r.userName || r.userId}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>{r.message?.slice(0, 80) || ''}</div>
                </td>
                <td style={{ padding: 12 }}><RequestTypeBadge type={r.type} /></td>
                <td style={{ padding: 12 }}>{new Date(r.createdAt).toLocaleString()}</td>
                <td style={{ padding: 12 }}><StatusBadge status={r.status} /></td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setDetail(r)} style={{ padding: '8px 10px', borderRadius: 8, background: '#eef2ff', border: 'none', color: '#0b5cff' }}>Xem chi tiết</button>
                    <button onClick={() => setConfirm({ kind: 'approve', id: r.id })} disabled={r.status !== 'pending'} style={{ padding: '8px 10px', borderRadius: 8, background: '#16a34a', color: '#fff', border: 'none' }}>Phê duyệt</button>
                    <button onClick={() => setRejectReasonOpen({ id: r.id })} disabled={r.status !== 'pending'} style={{ padding: '8px 10px', borderRadius: 8, background: '#dc2626', color: '#fff', border: 'none' }}>Từ chối</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafbff' }}>
          <div style={{ color: '#6b7280' }}>Hiển thị {start + 1} - {Math.min(start + PAGE_SIZE, filtered.length)} / {filtered.length}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 10px', borderRadius: 8 }}>Prev</button>
            <div style={{ alignSelf: 'center' }}>Trang {page}/{totalPages}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 10px', borderRadius: 8 }}>Next</button>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <DetailModal req={detail} onClose={() => setDetail(null)} onApprove={() => setConfirm({ kind: 'approve', id: detail.id })} onReject={() => setRejectReasonOpen({ id: detail.id })} />
      )}

      {/* Confirm approve */}
      {confirm && (
        <ConfirmModal open={true} title={`Phê duyệt yêu cầu ${confirm.id}`} description={`Bạn chắc chắn muốn phê duyệt yêu cầu ${confirm.id}?`} onCancel={() => setConfirm(null)} onConfirm={() => handleConfirm(confirm, handleApprove)} />
      )}

      {/* Reject reason modal */}
      {rejectReasonOpen && (
        <ConfirmRejectModal id={rejectReasonOpen.id} onCancel={() => setRejectReasonOpen(null)} onConfirm={reason => handleReject(reason)} />
      )}
    </AdminLayout>
  );

  // helpers
  function inferTypeFromMessage(msg?: string) {
    if (!msg) return 'other';
    const m = msg.toLowerCase();
    if (m.includes('provider') || m.includes('nhà cung cấp')) return 'provider';
    if (m.includes('support') || m.includes('hỗ trợ')) return 'support';
    if (m.includes('delete') || m.includes('xóa')) return 'delete';
    return 'other';
  }

  async function handleConfirm(c: { kind: 'approve' | 'reject'; id: string }, cb: (id: string) => Promise<void>) {
    if (c.kind === 'approve') await handleApprove(c.id);
    else {
      // open reject reason
      setRejectReasonOpen({ id: c.id });
    }
    setConfirm(null);
  }

  async function handleApprove(id: string) {
    try { await mockApi.approveJoinRequest(id); toast?.push?.('Đã phê duyệt','success'); await load(); } catch (e:any) { toast?.push?.(`Lỗi: ${e?.message||e}`,'error'); }
  }

  async function handleReject(reason?: string) {
    if (!rejectReasonOpen) return;
    try { await mockApi.rejectJoinRequest(rejectReasonOpen.id); // log
      const logs = await mockApi.getLogs(); logs.unshift({ id: 'log-'+Math.random().toString(36).slice(2,9), ts: new Date().toISOString(), type: 'join.reject', message: `Reject ${rejectReasonOpen.id}: ${reason||'no reason'}`}); localStorage.setItem('mock_logs_v1', JSON.stringify(logs));
      toast?.push?.('Đã từ chối','info'); await load();
    } catch (e:any) { toast?.push?.(`Lỗi: ${e?.message||e}`,'error'); }
    setRejectReasonOpen(null);
  }
}

function DetailModal({ req, onClose, onApprove, onReject }: { req: ReqRow; onClose: () => void; onApprove: () => void; onReject: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', zIndex: 1400 }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: 16, minWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <h3 style={{ margin: 0 }}>Chi tiết yêu cầu {req.id}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 18 }}>✕</button>
        </div>
        <div style={{ marginTop: 8 }}>
          <h4 style={{ margin: '6px 0' }}>{req.userName || req.userId}</h4>
          <div style={{ color: '#6b7280' }}>{req.message}</div>
          <div style={{ marginTop: 12 }}>Loại: <RequestTypeBadge type={req.type} /></div>
          <div style={{ marginTop: 6 }}>Ngày: {new Date(req.createdAt).toLocaleString()}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button onClick={onApprove} style={{ background: '#16a34a', color: '#fff', padding: '8px 10px', borderRadius: 8 }}>Phê duyệt</button>
          <button onClick={onReject} style={{ background: '#dc2626', color: '#fff', padding: '8px 10px', borderRadius: 8 }}>Từ chối</button>
          <button onClick={onClose} style={{ padding: '8px 10px', borderRadius: 8 }}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmRejectModal({ id, onCancel, onConfirm }: { id: string; onCancel: () => void; onConfirm: (reason?: string) => void }) {
  const [txt, setTxt] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', zIndex: 1400 }}>
      <div style={{ background: '#fff', padding: 16, borderRadius: 8, minWidth: 520 }}>
        <h3>Từ chối yêu cầu {id}</h3>
        <p style={{ color: '#6b7280' }}>Nhập lý do từ chối (bắt buộc)</p>
        <textarea value={txt} onChange={e => setTxt(e.target.value)} rows={5} style={{ width: '100%', padding: 8, borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button disabled={!txt.trim()} onClick={() => onConfirm(txt.trim())} style={{ background: '#dc2626', color: '#fff', padding: '8px 10px', borderRadius: 8 }}>Xác nhận từ chối</button>
          <button onClick={onCancel} style={{ padding: '8px 10px', borderRadius: 8 }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

function RequestTypeBadge({ type }: { type?: 'provider' | 'support' | 'delete' | 'other' }) {
  const map: any = { provider: ['Nhà cung cấp', '#eef4ff', '#0b5cff'], support: ['Hỗ trợ', '#fff7ed', '#92400e'], delete: ['Xóa tài khoản', '#fff1f2', '#991b1b'], other: ['Khác', '#f3f6fb', '#374151'] };
  const m = map[type ?? 'other'];
  return <span style={{ padding: '6px 10px', borderRadius: 999, background: m[1], color: m[2] }}>{m[0]}</span>;
}

function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  if (status === 'pending') return <span style={{ background: '#fffbeb', color: '#92400e', padding: '6px 10px', borderRadius: 999 }}>Pending</span>;
  if (status === 'approved') return <span style={{ background: '#ecfdf5', color: '#065f46', padding: '6px 10px', borderRadius: 999 }}>Approved</span>;
  return <span style={{ background: '#fff1f2', color: '#9f1239', padding: '6px 10px', borderRadius: 999 }}>Rejected</span>;
}
