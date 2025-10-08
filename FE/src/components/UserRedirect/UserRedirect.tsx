"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserGroups } from '@/hooks/useUserGroups';

interface UserRedirectProps {
  children: React.ReactNode;
  redirectPath?: string;
  allowedPaths?: string[];
}

export default function UserRedirect({ 
  children, 
  redirectPath = '/groups',
  allowedPaths = ['/groups', '/login', '/register', '/admin']
}: UserRedirectProps) {
  const { user, loading, isNewUser } = useUserGroups();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Determine current route
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    // Read current authenticated user from storage (AuthContext persists here)
    let authUser: any = null;
    try {
      const raw = localStorage.getItem('currentUser');
      authUser = raw ? JSON.parse(raw) : null;
    } catch {}

    // 1) Admin users: restrict to /admin only
    if (authUser && (authUser.role === 'admin' || authUser.role === 'ADMIN')) {
      if (!currentPath.startsWith('/admin')) {
        router.replace('/admin');
        return;
      }
    }

    // 2) Non-admin users: gently prevent entering /admin (AdminLayout also guards)
    if (authUser && authUser.role !== 'admin' && currentPath.startsWith('/admin')) {
      router.replace('/login');
      return;
    }

    // 3) New non-admin users: guide to groups if on a disallowed path
    if (!loading && user) {
      const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      if (isNewUser && !isAllowedPath) {
        router.push(redirectPath);
      }
    }
  }, [user, loading, isNewUser, router, redirectPath, allowedPaths]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #16a34a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280', margin: 0 }}>
            Đang kiểm tra tài khoản của bạn...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
