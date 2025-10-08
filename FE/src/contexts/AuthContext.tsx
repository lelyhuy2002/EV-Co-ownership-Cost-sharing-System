"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, LoginRequest, LoginResponse, ApiError } from '@/lib/api';
import mockApi, { User as MockUser } from '@/lib/mockApi';

interface User {
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);

      // FE-only: check mock user store for status first
      try {
        const users = await mockApi.getUsers();
        const mu: MockUser | undefined = users.find((u: MockUser) => u.email === credentials.email);
        if (mu && mu.status && mu.status !== 'active') {
          return { success: false, message: 'Tài khoản đang ở trạng thái chờ xét duyệt. Vui lòng đợi admin kích hoạt.' };
        }
      } catch {}

      const response: LoginResponse = await apiService.login(credentials);
      
      if (response.success) {
        const userData: User = {
          userId: response.userId,
          fullName: response.fullName,
          email: response.email,
          role: response.role,
        };
        
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        if (response.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof ApiError) {
        return { 
          success: false, 
          message: error.message 
        };
      }
      return { 
        success: false, 
        message: 'Đăng nhập thất bại. Vui lòng thử lại.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
