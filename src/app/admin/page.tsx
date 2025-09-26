"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import mockApi from '@/lib/mockApi';

export default function AdminIndex() {
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const users = await mockApi.getUsers();
      const groups = await mockApi.getGroups();
      const logs = await mockApi.getLogs();
      const requests = await mockApi.getJoinRequests();

      const counts = {
        totalUsers: users.length,
        coowners: users.filter((u: any) => u.role === 'coowner').length,
        providers: users.filter((u: any) => u.role === 'provider').length,
        consumers: users.filter((u: any) => u.role === 'consumer').length,
        packages: groups.length,
        activePackages: groups.filter((g: any) => g.status === 'active').length,
        pendingPackages: groups.filter((g: any) => g.status === 'pending').length,
        totalLogs: logs.length,
        pendingRequests: requests.filter((r: any) => r.status === 'pending').length
      };

      const rev = Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, value: Math.round(Math.random() * 200 + 20) }));

      if (mounted) setKpis({ counts, rev, recent: logs.slice(0, 10) });
    }

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <AdminLayout active="index">
      <h1 style={{ margin: 0 }}>Admin Overview</h1>
      {!kpis ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 12 }}>
            {/** KPI card helper */}
            <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #eef2ff', boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Total Users</div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{kpis.counts.totalUsers}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{kpis.counts.coowners} co-owners · {kpis.counts.providers} providers</div>
                </div>
                <div style={{ fontSize: 20, color: '#10b981' }}>▲</div>
              </div>
            </div>

            <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #eef2ff', boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Data Packages</div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{kpis.counts.packages}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{kpis.counts.activePackages} active · {kpis.counts.pendingPackages} pending</div>
                </div>
                <div style={{ fontSize: 20, color: '#f59e0b' }}>●</div>
              </div>
            </div>

            <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #eef2ff', boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Total Revenue</div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>${kpis.rev.reduce((s: number, x: any) => s + x.value, 0)}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>30-day estimate</div>
                </div>
                <div style={{ fontSize: 20, color: '#0b5cff' }}>💠</div>
              </div>
            </div>

            <div style={{ background: '#fff', padding: 18, borderRadius: 12, border: '1px solid #eef2ff', boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>New Requests</div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{kpis.counts.pendingRequests}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{kpis.counts.totalLogs} events</div>
                </div>
                <div style={{ fontSize: 20, color: '#ef4444' }}>!</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <div style={{ flex: 2, background: '#fff', padding: 12, borderRadius: 12, border: '1px solid #eef2ff', boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Performance (last 30 days)</div>
              <Chart rev={kpis.rev} />
            </div>

            <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 12, border: '1px solid #eef2ff', boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Recent Activity</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 240, overflow: 'auto' }}>
                {kpis.recent.map((l: any) => (
                  <li key={l.id} style={{ padding: '8px 6px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 13 }}>{l.message}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{new Date(l.ts || l.time || l.createdAt || Date.now()).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ background: '#fff', padding: 12, borderRadius: 12, border: '1px solid #eef2ff', marginTop: 16, boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>System Snapshot</div>
            <div style={{ fontSize: 13, color: '#374151' }}>Users: {kpis.counts.totalUsers} · Packages: {kpis.counts.packages} · Pending Requests: {kpis.counts.pendingRequests}</div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function Chart({ rev }: { rev: any[] }) {
  const width = 600;
  const height = 140;
  const max = Math.max(...rev.map(r => r.value), 1);
  const points = rev.map((p, i) => ({ x: (i / (rev.length - 1)) * width, y: height - (p.value / max) * height, v: p.value }));

  // build smooth path using simple quadratic bezier between points
  const d = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} Q ${prev.x},${prev.y} ${cx},${(prev.y + pt.y) / 2} T ${pt.x},${pt.y}`;
  }, '');

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height={height}>
        <path d={d} fill="none" stroke="#0b5cff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="#0b5cff" />
        ))}
      </svg>
      {/* simple tooltip via title on transparent overlay for each point */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {points.map((p, i) => (
          <div key={i} title={`Day ${i + 1}: ${p.v}`} style={{ position: 'absolute', left: `${(p.x / width) * 100}%`, top: `${(p.y / height) * 100}%`, transform: 'translate(-50%,-200%)', pointerEvents: 'auto', width: 24, height: 24 }} />
        ))}
      </div>
    </div>
  );
}
