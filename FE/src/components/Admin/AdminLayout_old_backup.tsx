"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children, active = 'index' }: { children: React.ReactNode; active?: string }) {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check from AuthContext first, then fallback to localStorage
        let currentUser = authUser;
        
        if (!currentUser) {
          const raw = localStorage.getItem('currentUser');
          currentUser = raw ? JSON.parse(raw) : null;
        }
        
        console.log('Admin check - current user:', currentUser);
        
        // Check if user is admin (case-insensitive)
        if (!currentUser || currentUser.role?.toLowerCase() !== 'admin') {
          console.log('Not admin, redirecting to login');
          router.replace('/login');
          return;
        }
        
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
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
      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>
              <span>⚡</span>
              <span>Admin Panel</span>
            </div>

            <div className={styles.menuSection}>
              <div className={styles.menuSectionTitle}>General</div>
              <nav className={styles.menuItems}>
                {menuItem('📊', 'Tổng quan', '/admin', 'index')}
              </nav>
            </div>

            <div className={styles.menuSection}>
              <div className={styles.menuSectionTitle}>Quản lý người dùng</div>
              <nav className={styles.menuItems}>
                {menuItem('👥', 'Danh sách Users', '/admin/users', 'users')}
                {menuItem('📝', 'Yêu cầu tham gia', '/admin/user-management', 'requests')}
              </nav>
            </div>

            <div className={styles.menuSection}>
              <div className={styles.menuSectionTitle}>Marketplace</div>
              <nav className={styles.menuItems}>
                {menuItem('📦', 'Gói dữ liệu', '/admin/data-packages', 'packages')}
                {menuItem('📈', 'Báo cáo', '/admin/reports', 'reports')}
                {menuItem('⚙️', 'Cài đặt', '/admin/system-settings', 'settings')}
              </nav>
            </div>

            <div className={styles.menuSection}>
              <div className={styles.menuSectionTitle}>Hệ thống</div>
              <nav className={styles.menuItems}>
                {menuItem('📋', 'Logs', '/admin/logs', 'logs')}
              </nav>
            </div>

            {/* User Badge */}
            {user && (
              <div className={styles.userBadge}>
                <div className={styles.userBadgeTitle}>Đăng nhập với</div>
                <div className={styles.userBadgeName}>{user.fullName || 'Admin'}</div>
                <div className={styles.userBadgeEmail}>{user.email}</div>
                <button 
                  className={styles.logoutBtn}
                  onClick={logout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </aside>

        <main className={styles.mainArea}>
          <div className={styles.contentCard}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
