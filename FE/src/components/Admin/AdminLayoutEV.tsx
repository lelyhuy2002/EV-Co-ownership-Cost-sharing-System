"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './AdminLayout_EV.module.css';

export default function AdminLayoutEV({ children, active = 'index' }: { children: React.ReactNode; active?: string }) {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        let currentUser = authUser;
        
        if (!currentUser) {
          const raw = localStorage.getItem('currentUser');
          currentUser = raw ? JSON.parse(raw) : null;
        }
        
        if (!currentUser || currentUser.role?.toLowerCase() !== 'admin') {
          router.replace('/login');
          return;
        }
        
        setUser(currentUser);
      } catch (error) {
        router.replace('/login');
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router, authUser]);

  if (checking) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <div className={styles.loadingText}>Đang kiểm tra quyền truy cập...</div>
        </div>
      </div>
    );
  }

  const menuItem = (icon: string, label: string, href: string, sel: string) => (
    <Link 
      href={href} 
      className={`${styles.menuItem} ${active === sel ? styles.menuItemActive : ''}`}
    >
      <span className={styles.menuItemIcon}>{icon}</span>
      <span>{label}</span>
    </Link>
  );

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>EV Admin</div>
            <div className={styles.logoSubtitle}>Green Energy System</div>
          </div>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>DASHBOARD</div>
          <nav className={styles.menuItems}>
            {menuItem('🏠', 'Tổng quan', '/admin', 'index')}
            {menuItem('⚡', 'Năng lượng', '/admin/energy', 'energy')}
            {menuItem('🔋', 'Trạm sạc', '/admin/charging', 'charging')}
          </nav>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>QUẢN LÝ</div>
          <nav className={styles.menuItems}>
            {menuItem('🚗', 'Xe điện', '/admin/vehicles', 'vehicles')}
            {menuItem('👥', 'Người dùng', '/admin/users', 'users')}
            {menuItem('📝', 'Yêu cầu', '/admin/requests', 'requests')}
            {menuItem('👥', 'Nhóm chia sẻ', '/admin/groups', 'groups')}
          </nav>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>BÁO CÁO</div>
          <nav className={styles.menuItems}>
            {menuItem('📊', 'Thống kê', '/admin/analytics', 'analytics')}
            {menuItem('🌱', 'Môi trường', '/admin/environmental', 'environmental')}
            {menuItem('💰', 'Tài chính', '/admin/financial', 'financial')}
          </nav>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>HỆ THỐNG</div>
          <nav className={styles.menuItems}>
            {menuItem('⚙️', 'Cài đặt', '/admin/settings', 'settings')}
            {menuItem('📋', 'Logs', '/admin/logs', 'logs')}
          </nav>
        </div>

        {user && (
          <div className={styles.userBadge}>
            <div className={styles.userBadgeContent}>
              <div className={styles.userBadgeTitle}>Đăng nhập với</div>
              <div className={styles.userBadgeName}>{user.fullName || 'Admin'}</div>
              <div className={styles.userBadgeEmail}>{user.email}</div>
              <div className={styles.energyIndicator}>
                <span className={styles.energyDot}></span>
                <span>System Online</span>
              </div>
              <button 
                className={styles.logoutBtn}
                onClick={logout}
              >
                🚪 Đăng xuất
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.contentCard}>
          {children}
        </div>
      </main>
    </div>
  );
}
