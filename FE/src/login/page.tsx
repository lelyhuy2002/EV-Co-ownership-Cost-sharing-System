"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isLoading) return;
    
    setErrorMessage("");
    setIsSubmitting(true);
    
    try {
      const result = await login({ email, password });
      
      if (!result.success) {
        setErrorMessage(result.message);
      }
      // If successful, the AuthContext will handle navigation
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    try {
      // Placeholder: Integrate Google OAuth SDK / NextAuth here
      await new Promise((resolve) => setTimeout(resolve, 600));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.visualPane}>
        <div className={styles.artGlow} />
        <div className={styles.artWrap}>
          <Image
            src="/ev-logo-custom.svg"
            alt="EV Co-ownership"
            width={260}
            height={260}
            priority
            className={styles.heroLogo}
          />
          <h1 className={styles.headline}>Welcome back</h1>
          <p className={styles.subhead}>Log in to manage trips, costs, and insights.</p>
        </div>
      </section>
      <section className={styles.formPane}>
        <div className={styles.formCard}>
          <button 
            type="button" 
            className={styles.homeButton}
            onClick={() => router.push('/home')}
            title="Trở về trang chủ"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Trang chủ</span>
          </button>
          <h2 className={styles.title}>Log in</h2>
          {errorMessage && (
            <div style={{ 
              color: '#ef4444', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.inputRow}>
              <span className={styles.inputIcon} aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm1 8.5C6.8 14.9 9.28 14 12 14s5.2.9 7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type="email"
                className={styles.input}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className={styles.underline} />
            </label>

            <label className={styles.inputRow}>
              <span className={styles.inputIcon} aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3.75" y="10" width="16.5" height="9.5" rx="2.25" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </span>
              <input
                type="password"
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className={styles.underline} />
            </label>

            <div className={styles.actionsRow}>
              <button type="submit" className={styles.primaryButton} disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? "Logging in…" : "Log In"}
              </button>
              <Link href="#" className={styles.link}>
                Forgot password?
              </Link>
            </div>
          </form>
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>hoặc</span>
            <span className={styles.dividerLine} />
          </div>
          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            <Image src="/google-logo.svg" alt="Google" width={18} height={18} />
            <span className={styles.googleText}>
              {isGoogleLoading ? "Đang mở Google…" : "Đăng nhập bằng Google"}
            </span>
          </button>
          <p className={styles.footerText}>
            New here? <Link href="/co-owner-registration" className={styles.linkAccent}>Sign up</Link>
          </p>
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={() => {
                // create or set admin user in localStorage for demo
                const admin = { id: 'user-admin', username: 'admin', fullName: 'System Admin', email: 'admin@local', role: 'admin', groups: [] };
                try { localStorage.setItem('currentUser', JSON.stringify(admin)); } catch {}
                // also create in mock users store if available
                try {
                  const usersRaw = localStorage.getItem('mock_users_v1');
                  let users = usersRaw ? JSON.parse(usersRaw) : [];
                  const exists = users.find((u:any)=>u.id === admin.id);
                  if (!exists) { users.push(admin); localStorage.setItem('mock_users_v1', JSON.stringify(users)); }
                } catch {}
                router.push('/admin');
              }}
              style={{ marginTop: 8 }}
            >
              Login as Admin (demo)
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}


