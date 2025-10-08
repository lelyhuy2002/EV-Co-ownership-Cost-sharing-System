"use client";

import Link from 'next/link';
import Header from '@/components/Header/Header';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children, active = 'index' }: { children: React.ReactNode; active?: string }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      const user = raw ? JSON.parse(raw) : null;
      if (!user || (user.role !== 'admin' && user.role !== 'ADMIN')) {
        // not admin → redirect away
        router.replace('/login');
        return;
      }
    } catch {
      router.replace('/login');
      return;
    } finally {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F8FC' }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #eef2ff', boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>
          Đang kiểm tra quyền truy cập…
        </div>
      </div>
    );
  }

  // Palette
  const bg = '#F7F8FC';
  const surface = '#FFFFFF';
  const accent = '#0b5cff';
  const accentSoft = '#e6f0ff';
  const muted = '#6b7280';

  const sectionStyle = (sel: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    borderRadius: 6,
    background: active === sel ? accentSoft : 'transparent',
    color: active === sel ? accent : '#0f172a',
    textDecoration: 'none',
    borderLeft: active === sel ? `4px solid ${accent}` : '4px solid transparent'
  });

  const menuItem = (icon: React.ReactNode, label: string, href: string, sel: string) => (
    <Link href={href} style={sectionStyle(sel)}>
      <span style={{ width: 18, textAlign: 'center' }}>{icon}</span>
      <span style={{ fontSize: 13 }}>{label}</span>
    </Link>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg }}>
      <Header headerHidden={false} currentSection={0} />
      <div style={{ display: 'flex', gap: 24, padding: 24 }}>
        <aside style={{ width: 300 }}>
          <div style={{ background: surface, border: '1px solid #eef2ff', borderRadius: 8, padding: 12, boxShadow: '0 4px 12px rgba(2,6,23,0.04)' }}>
            <div style={{ marginBottom: 8, fontWeight: 700, fontSize: 14 }}>Navigation</div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>General</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {menuItem('🏠', 'Overview', '/admin', 'index')}
              </nav>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>User Management</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {menuItem('👥', 'Users', '/admin/users', 'users')}
                {menuItem('📝', 'Requests', '/admin/user-management', 'requests')}
              </nav>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>Marketplace</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {menuItem('📦', 'Data Packages', '/admin/data-packages', 'packages')}
                {menuItem('📊', 'Reports', '/admin/reports', 'reports')}
                {menuItem('⚖️', 'Contracts & Settings', '/admin/system-settings', 'settings')}
              </nav>
            </div>

            <div>
              <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>System</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {menuItem('🗒️', 'Logs', '/admin/logs', 'logs')}
              </nav>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1 }}>
          <div style={{ background: surface, border: '1px solid #eef2ff', borderRadius: 12, padding: 20, boxShadow: '0 6px 20px rgba(2,6,23,0.04)' }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
