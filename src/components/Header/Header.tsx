"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { NAVIGATION_ITEMS, COMPANY_INFO } from "@/constants";

interface HeaderProps {
  headerHidden: boolean;
}

export default function Header({ headerHidden }: HeaderProps) {
  return (
    <header className={`${styles.header} ${headerHidden ? styles.headerHidden : ""}`}>
      <div className={styles.headerLeft}>
        <Image src={COMPANY_INFO.logo} alt={COMPANY_INFO.name} width={140} height={28} className={styles.brand} />
        <span className={styles.brandName}>{COMPANY_INFO.name}</span>
      </div>
      <HeaderNav />
    </header>
  );
}

function HeaderNav() {
  const [active, setActive] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sections = NAVIGATION_ITEMS.map(item => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.open : ""}`}>
        {NAVIGATION_ITEMS.map((item) => (
          <Link 
            key={item.id}
            href={item.href} 
            className={`${styles.navLink} ${active === item.id ? styles.active : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className={styles.headerCtas}>
        <button className={`${styles.button} ${styles.secondary}`}>
          Đăng nhập
        </button>
        <button className={`${styles.button} ${styles.primary}`}>
          Đăng ký
        </button>
      </div>
      
      <button 
        className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.active : ""}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </>
  );
}
