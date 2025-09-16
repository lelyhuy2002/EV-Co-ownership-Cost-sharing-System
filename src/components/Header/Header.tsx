"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "./Header.module.css";
import { NAVIGATION_ITEMS, COMPANY_INFO } from "@/constants";

interface HeaderProps {
  headerHidden: boolean;
  currentSection: number;
  goToSection: (index: number) => void;
}

export default function Header({ headerHidden, currentSection, goToSection }: HeaderProps) {
  return (
    <header className={`${styles.header} ${headerHidden ? styles.headerHidden : ""} glass`}>
      <div className={styles.headerLeft}>
        <Image src={COMPANY_INFO.logo} alt={COMPANY_INFO.name} width={140} height={28} className={styles.brand} />
        <span className={`${styles.brandName} gradient-text`}>{COMPANY_INFO.name}</span>
      </div>
      <HeaderNav currentSection={currentSection} goToSection={goToSection} />
    </header>
  );
}

function HeaderNav({ currentSection, goToSection }: { currentSection: number; goToSection: (index: number) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (index: number) => {
    goToSection(index);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.open : ""}`}>
        {NAVIGATION_ITEMS.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(index)}
            className={`${styles.navLink} ${currentSection === index ? styles.active : ""}`}
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className={styles.headerCtas}>
        <NextLink href="/login" className={`${styles.button} ${styles.secondary} hover-lift focus-ring`}>
          Đăng nhập
        </NextLink>
        <NextLink href="/co-owner-registration" className={`${styles.button} ${styles.primary} hover-lift focus-ring`}>
          Đăng ký
        </NextLink>
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
