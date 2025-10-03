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
    if (!loading && user) {
      // Check if user is on an allowed path
      const currentPath = window.location.pathname;
      const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
      // If user has no groups and is not on an allowed path, redirect them
      if (isNewUser && !isAllowedPath) {
        console.log('New user detected, redirecting to find-groups page');
        router.push(redirectPath);
      }
    }
  }, [user, loading, isNewUser, router, redirectPath, allowedPaths]);

  // Show loading state while checking user status
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
