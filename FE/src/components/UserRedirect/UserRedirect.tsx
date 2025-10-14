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
  allowedPaths = ['/groups', '/login', '/register']
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

    // Public routes (no auth required)
    const publicPaths = ['/', '/home', '/login', '/register', '/contact', '/pricing'];
    const isPublic = publicPaths.some(p => currentPath === p || currentPath.startsWith(p + '/'));

    // 0) Unauthenticated users: block protected areas
    if (!authUser) {
      if (currentPath.startsWith('/admin') || currentPath.startsWith('/dashboard') || currentPath.startsWith('/groups')) {
        if (currentPath !== '/login') {
          router.replace('/login');
        }
        return;
      }
      // allow public pages
      if (isPublic) return;
    }

    // 1) Admin users: allow /admin paths, but don't force them away from public pages on first load
    if (authUser && authUser.role?.toLowerCase() === 'admin') {
      // Allow admins to stay on admin pages
      if (currentPath.startsWith('/admin')) {
        return; // Admin is on admin page, all good
      }
      // Allow admins to access public pages like home
      if (isPublic) {
        return; // Let them browse public pages
      }
    }

    // 2) Non-admin users: gently prevent entering /admin (AdminLayout also guards)
    if (authUser && authUser.role?.toLowerCase() !== 'admin' && currentPath.startsWith('/admin')) {
      router.replace('/dashboard');
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
