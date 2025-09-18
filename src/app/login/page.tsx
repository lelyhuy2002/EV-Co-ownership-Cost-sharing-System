"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Placeholder: integrate auth later
      await new Promise((resolve) => setTimeout(resolve, 800));
      // no-op
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
          <h2 className={styles.title}>Log in</h2>
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
              <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                {isSubmitting ? "Logging in…" : "Log In"}
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
        </div>
      </section>
    </main>
  );
}


