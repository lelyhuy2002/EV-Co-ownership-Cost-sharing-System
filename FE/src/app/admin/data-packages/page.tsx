"use client";

import AdminLayout from '@/components/Admin/AdminLayout';
import { useEffect, useMemo, useState } from 'react';
import mockApi from '@/lib/mockApi';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import ToastProvider, { useToast } from '@/components/Admin/ToastProvider';

type DataPkg = any;

const PAGE_SIZE = 10;

export default function DataPackagesAdmin() {
  return (
    <ToastProvider>
      <PackagesPage />
    </ToastProvider>
  );
}

function PackagesPage() {
  const toast = useToast();
  const [items, setItems] = useState<DataPkg[]>([]);
  const [tab, setTab] = useState<'pending' | 'active' | 'rejected'>('pending');
  const [query, setQuery] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  // side panel
  const [panel, setPanel] = useState<DataPkg | null>(null);
  const [confirm, setConfirm] = useState<{ kind: 'approve' | 'reject'; id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState<{ id: string; open: boolean }>({ id: '', open: false });

  useEffect(() => { load(); }, []);

  async function load() {
    const g = await mockApi.getGroups();
    setItems((g || []).slice().reverse());
  }

  const owners = useMemo(() => Array.from(new Set(items.map(i => (i.adminName || i.adminId || '')))).filter(Boolean), [items]);
  const types = useMemo(() => Array.from(new Set(items.map(i => (i.dataType || 'Unknown')))).filter(Boolean), [items]);

  const filtered = useMemo(() => {
    let r = items.slice();
    if (tab) r = r.filter(x => (x.status || 'pending') === tab);
    if (ownerFilter) r = r.filter(x => (x.adminName || x.adminId || '').toLowerCase().includes(ownerFilter.toLowerCase()));
    if (typeFilter) r = r.filter(x => ((x.dataType || 'Unknown') + '').toLowerCase().includes(typeFilter.toLowerCase()));
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(x => (x.vehicleName || x.title || '').toLowerCase().includes(q) || (x.adminName || '').toLowerCase().includes(q) || (x.id || '').toLowerCase().includes(q));
    }
    return r;
  }, [items, tab, ownerFilter, typeFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  async function doApprove(id: string) {
    try { await mockApi.approvePackage(id); toast?.push?.('Package approved','success'); await load(); } catch (e:any) { toast?.push?.(`Error: ${e?.message||e}`,'error'); }
    setConfirm(null);
  }

  async function doReject(id: string, reason?: string) {
    try { await mockApi.rejectPackage(id, reason); toast?.push?.('Package rejected','info'); await load(); } catch (e:any) { toast?.push?.(`Error: ${e?.message||e}`,'error'); }
    setRejectReason({ id: '', open: false });
  }

  return (
    <AdminLayout active="packages">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Quản lý Gói Dữ liệu</h2>
          <div style={{ color: '#6b7280', marginTop: 6 }}>Duyệt, quản lý và xem trước các gói dữ liệu trên Sàn giao dịch</div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={() => { setTab('pending'); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, background: tab === 'pending' ? '#fff7ed' : '#fff' }}>Đang chờ duyệt</button>
        <button onClick={() => { setTab('active'); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, background: tab === 'active' ? '#ecfdf5' : '#fff' }}>Đang hoạt động</button>
        <button onClick={() => { setTab('rejected'); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, background: tab === 'rejected' ? '#fff1f2' : '#fff' }}>Bị từ chối / Ẩn</button>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm theo tiêu đề / owner / id..." style={{ padding: 10, borderRadius: 8, border: '1px solid #E6E9EF', flex: 1 }} />
        <select value={ownerFilter} onChange={e => { setOwnerFilter(e.target.value); setPage(1); }} style={{ padding: 10, borderRadius: 8 }}>
          <option value="">Tất cả nhà cung cấp</option>
          {owners.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} style={{ padding: 10, borderRadius: 8 }}>
          <option value="">Tất cả loại dữ liệu</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 12 }}>
        <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F3F6FB' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: 12 }}>Title</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Owner</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Uploaded</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Type</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Price</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Không có gói dữ liệu</td></tr>
              ) : pageItems.map((p: DataPkg) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f2f4f7' }}>
                  <td style={{ padding: 12 }}><a onClick={() => setPanel(p)} style={{ color: '#0b5cff', cursor: 'pointer' }}>{p.vehicleName || p.title || 'Untitled'}</a></td>
                  <td style={{ padding: 12 }}>{p.adminName || p.adminId}</td>
                  <td style={{ padding: 12 }}>{p.createdDate || new Date(p.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td style={{ padding: 12 }}>{p.dataType || 'Unknown'}</td>
                  <td style={{ padding: 12 }}>{p.price ? `${p.price} VND` : '-'}</td>
                  <td style={{ padding: 12 }}><StatusBadge status={(p.status || 'pending')} /></td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setConfirm({ kind: 'approve', id: p.id })} disabled={(p.status || 'pending') !== 'pending'} style={{ background: '#16a34a', color: '#fff', padding: '6px 10px', borderRadius: 8, border: 'none' }}>Approve</button>
                      <button onClick={() => setRejectReason({ id: p.id, open: true })} disabled={(p.status || 'pending') !== 'pending'} style={{ background: '#dc2626', color: '#fff', padding: '6px 10px', borderRadius: 8, border: 'none' }}>Reject</button>
                      <button onClick={() => setPanel(p)} style={{ padding: '6px 10px', borderRadius: 8 }}>View</button>
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

        {/* Right side panel for quick view */}
        <div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 12, boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
            {panel ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{panel.vehicleName || panel.title}</h3>
                    <div style={{ color: '#6b7280', marginTop: 6 }}>{panel.adminName || panel.adminId}</div>
                  </div>
                  <div>
                    <StatusBadge status={(panel.status || 'pending')} />
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <strong>Mô tả</strong>
                  <p style={{ color: '#374151' }}>{panel.description || panel.purpose || 'Không có mô tả'}</p>
                  <strong>Định dạng / Meta</strong>
                  <pre style={{ background: '#f8fafc', padding: 8, borderRadius: 6 }}>{JSON.stringify(panel.format || panel.meta || { fields: ['timestamp','lat','lng'] }, null, 2)}</pre>
                  <div style={{ marginTop: 8 }}>
                    <strong>API Key thử nghiệm</strong>
                    <div style={{ background: '#0b5cff', color: '#fff', padding: '6px 8px', borderRadius: 6, display: 'inline-block', marginTop: 6 }}>demo-key-{panel.id?.slice?.(0,6) || 'xxxx'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => { setConfirm({ kind: 'approve', id: panel.id }); }} disabled={(panel.status || 'pending') !== 'pending'} style={{ background: '#16a34a', color: '#fff', padding: '8px 12px', borderRadius: 8 }}>Approve</button>
                  <button onClick={() => setRejectReason({ id: panel.id, open: true })} disabled={(panel.status || 'pending') !== 'pending'} style={{ background: '#dc2626', color: '#fff', padding: '8px 12px', borderRadius: 8 }}>Reject</button>
                  <button onClick={() => setPanel(null)} style={{ padding: '8px 12px', borderRadius: 8 }}>Close</button>
                </div>
              </div>
            ) : (
              <div style={{ color: '#6b7280' }}>Chọn một gói để xem nhanh chi tiết ở đây.</div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm approve modal */}
      {confirm && (
        <ConfirmModal open={true} title={`Phê duyệt gói ${confirm.id}`} description={`Bạn chắc chắn muốn phê duyệt gói này?`} onCancel={() => setConfirm(null)} onConfirm={() => doApprove(confirm.id)} />
      )}

      {/* Reject reason modal */}
      {rejectReason.open && (
        <RejectReasonModal id={rejectReason.id} onCancel={() => setRejectReason({ id: '', open: false })} onConfirm={(reason) => doReject(rejectReason.id, reason)} />
      )}
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) status = 'pending';
  if (status === 'pending') return <span style={{ background: '#fffbeb', color: '#92400e', padding: '6px 10px', borderRadius: 999 }}>Pending</span>;
  if (status === 'active') return <span style={{ background: '#ecfdf5', color: '#065f46', padding: '6px 10px', borderRadius: 999 }}>Active</span>;
  if (status === 'rejected') return <span style={{ background: '#fff1f2', color: '#9f1239', padding: '6px 10px', borderRadius: 999 }}>Rejected</span>;
  return <span style={{ background: '#e6eefc', color: '#1f2937', padding: '6px 10px', borderRadius: 999 }}>{status}</span>;
}

function RejectReasonModal({ id, onCancel, onConfirm }: { id: string; onCancel: () => void; onConfirm: (reason?: string) => void }) {
  const [txt, setTxt] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', zIndex: 1400 }}>
      <div style={{ background: '#fff', padding: 16, borderRadius: 8, minWidth: 520 }}>
        <h3>Từ chối gói {id}</h3>
        <p style={{ color: '#6b7280' }}>Nhập lý do từ chối để gửi thông báo cho nhà cung cấp</p>
        <textarea value={txt} onChange={e => setTxt(e.target.value)} rows={5} style={{ width: '100%', padding: 8, borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button disabled={!txt.trim()} onClick={() => onConfirm(txt.trim())} style={{ background: '#dc2626', color: '#fff', padding: '8px 10px', borderRadius: 8 }}>Xác nhận từ chối</button>
          <button onClick={onCancel} style={{ padding: '8px 10px', borderRadius: 8 }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}
