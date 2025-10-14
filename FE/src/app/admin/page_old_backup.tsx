"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import mockApi from '@/lib/mockApi';
import styles from './admin.module.css';

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
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Tổng quan và thống kê hệ thống</p>
      </div>
      
      {!kpis ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Đang tải dữ liệu...</div>
        </div>
      ) : (
        <>
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiInfo}>
                  <div className={styles.kpiLabel}>Tổng người dùng</div>
                  <div className={styles.kpiValue}>{kpis.counts.totalUsers}</div>
                  <div className={styles.kpiDetails}>
                    {kpis.counts.coowners} đồng sở hữu · {kpis.counts.providers} nhà cung cấp
                  </div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendUp}>
                    <span>↑</span>
                    <span>12%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconGreen}>👥</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiInfo}>
                  <div className={styles.kpiLabel}>Gói dữ liệu</div>
                  <div className={styles.kpiValue}>{kpis.counts.packages}</div>
                  <div className={styles.kpiDetails}>
                    {kpis.counts.activePackages} hoạt động · {kpis.counts.pendingPackages} chờ duyệt
                  </div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendUp}>
                    <span>↑</span>
                    <span>8%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconOrange}>📦</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiInfo}>
                  <div className={styles.kpiLabel}>Doanh thu</div>
                  <div className={styles.kpiValue}>${kpis.rev.reduce((s: number, x: any) => s + x.value, 0)}</div>
                  <div className={styles.kpiDetails}>Ước tính 30 ngày</div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendUp}>
                    <span>↑</span>
                    <span>24%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconBlue}>💰</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiInfo}>
                  <div className={styles.kpiLabel}>Yêu cầu mới</div>
                  <div className={styles.kpiValue}>{kpis.counts.pendingRequests}</div>
                  <div className={styles.kpiDetails}>{kpis.counts.totalLogs} sự kiện</div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendDown}>
                    <span>↓</span>
                    <span>5%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconRed}>🔔</div>
              </div>
            </div>
          </div>

          <div className={styles.chartsRow}>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>
                <span className={styles.chartTitleIcon}>📈</span>
                <span>Hiệu suất (30 ngày gần nhất)</span>
              </div>
              <Chart rev={kpis.rev} />
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>
                <span className={styles.chartTitleIcon}>⚡</span>
                <span>Hoạt động gần đây</span>
              </div>
              <ul className={styles.activityList}>
                {kpis.recent.map((l: any) => (
                  <li key={l.id} className={styles.activityItem}>
                    <div className={styles.activityMessage}>{l.message}</div>
                    <div className={styles.activityTime}>{new Date(l.ts || l.time || l.createdAt || Date.now()).toLocaleString('vi-VN')}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.snapshotCard}>
            <div className={styles.snapshotTitle}>Snapshot Hệ thống</div>
            <div className={styles.snapshotContent}>
              Người dùng: {kpis.counts.totalUsers} · Gói dữ liệu: {kpis.counts.packages} · Yêu cầu chờ duyệt: {kpis.counts.pendingRequests}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function Chart({ rev }: { rev: any[] }) {
  const width = 600;
  const height = 200;
  const padding = 20;
  const max = Math.max(...rev.map(r => r.value), 1);
  const points = rev.map((p, i) => ({ 
    x: padding + (i / (rev.length - 1)) * (width - padding * 2), 
    y: padding + (height - padding * 2) - ((p.value / max) * (height - padding * 2)), 
    v: p.value 
  }));

  // Smooth curve path
  const linePath = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} Q ${prev.x},${prev.y} ${cx},${(prev.y + pt.y) / 2} T ${pt.x},${pt.y}`;
  }, '');

  // Area path
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div style={{ position: 'relative', width: '100%', height: height }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path 
          d={areaPath} 
          fill="url(#areaGradient)"
          style={{ opacity: 0.4 }}
        />
        
        {/* Line */}
        <path 
          d={linePath} 
          fill="none" 
          stroke="url(#gradient)" 
          strokeWidth={3} 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ 
            filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))',
            animation: 'dashDraw 2s ease-out'
          }}
        />
        
        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={4} 
              fill="url(#gradient)"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.5))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                animation: `popIn 0.5s ease-out ${i * 0.05}s backwards`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.setAttribute('r', '6');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.setAttribute('r', '4');
              }}
            />
            <title>Ngày {i + 1}: ${p.v}</title>
          </g>
        ))}
      </svg>
      
      <style jsx>{`
        @keyframes dashDraw {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }
        @keyframes popIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
