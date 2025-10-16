"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './DashboardLayout.module.css';
import { 
  Zap, Home, Users, 
  FileText, UsersRound, BarChart3, DollarSign, 
  Settings, ScrollText, LogOut
} from 'lucide-react';

export default function DashboardLayout({ children, active = 'index' }: { children: React.ReactNode; active?: string }) {
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
        
        if (!currentUser) {
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

  const menuItem = (Icon: React.ComponentType<any>, label: string, href: string, sel: string) => (
    <Link 
      href={href} 
      className={`${styles.menuItem} ${active === sel ? styles.menuItemActive : ''}`}
    >
      <span className={styles.menuItemIcon}>
        <Icon size={20} strokeWidth={2} />
      </span>
      <span>{label}</span>
    </Link>
  );

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap size={28} color="white" />
          </div>
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>EV Share</div>
            <div className={styles.logoSubtitle}>Co-ownership App</div>
          </div>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>DASHBOARD</div>
          <nav className={styles.menuItems}>
            {menuItem(Home, 'Tổng quan', '/dashboard', 'index')}
          </nav>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>QUẢN LÝ</div>
          <nav className={styles.menuItems}>
            {menuItem(Users, 'Người dùng', '/dashboard/users', 'users')}
            {menuItem(FileText, 'Yêu cầu', '/dashboard/requests', 'requests')}
            {menuItem(UsersRound, 'Nhóm chia sẻ', '/dashboard/groups', 'groups')}
          </nav>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>BÁO CÁO</div>
          <nav className={styles.menuItems}>
            {menuItem(BarChart3, 'Thống kê', '/dashboard/analytics', 'analytics')}
            {menuItem(DollarSign, 'Tài chính', '/dashboard/financial', 'financial')}
          </nav>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>HỆ THỐNG</div>
          <nav className={styles.menuItems}>
            {menuItem(Settings, 'Cài đặt', '/dashboard/settings', 'settings')}
            {menuItem(ScrollText, 'Logs', '/dashboard/logs', 'logs')}
          </nav>
        </div>

        {user && (
          <div className={styles.userBadge}>
            <div className={styles.userBadgeContent}>
              <div className={styles.userBadgeTitle}>Đăng nhập với</div>
              <div className={styles.userBadgeName}>{user.fullName || 'User'}</div>
              <div className={styles.userBadgeEmail}>{user.email}</div>
              <div className={styles.energyIndicator}>
                <span className={styles.energyDot}></span>
                <span>System Online</span>
              </div>
              <button 
                className={styles.logoutBtn}
                onClick={logout}
              >
                <LogOut size={16} style={{display: 'inline', marginRight: '6px'}} />
                Đăng xuất
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
