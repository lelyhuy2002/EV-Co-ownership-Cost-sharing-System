"use client";

import styles from "./Hero.module.css";
import Link from "next/link";
import useParallax from "@/hooks/useParallax";
import ScrollAnimation from "@/components/ScrollAnimation/ScrollAnimation";

export default function Hero() {
  const parallaxOffset = useParallax({ speed: 0.3, direction: 'up' });

  return (
    <section id="home" className={`${styles.hero} ${styles.reveal} animate-fade-in`}>
      <div className={styles.heroPanel}>
        <div className={styles.heroContent}>
          <ScrollAnimation animation="slideRight" delay={0}>
            <div className={styles.heroText}>
              <h1 className={`${styles.heroTitle} gradient-text`}>Nâng tầm phân tích dữ liệu cho ngành xe điện</h1>
              <ul className={styles.heroChecklist}>
                <li>Phân tích nhanh, chính xác, tương thích với mọi hệ thống.</li>
                <li>Kho dữ liệu rộng khắp: sạc, hành trình, hiệu suất pin.</li>
                <li>Quy trình minh bạch, bảo mật và ẩn danh tuyệt đối.</li>
              </ul>
              <div className={styles.ctas}>
                <a href="#marketplace" className={`${styles.button} ${styles.primary} hover-lift focus-ring`}>Trải nghiệm ngay</a>
                <Link href="/co-owner-registration" className={`${styles.button} ${styles.primary} hover-lift focus-ring`}>Đăng ký</Link>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation animation="slideLeft" delay={200}>
            <div className={styles.heroVisual} aria-hidden>
              <div 
                className={`${styles.heroCircle} hover-glow`}
                style={{ transform: `translateY(${parallaxOffset}px)` }}
              >
                <div className={`${styles.heroBadge} pulse`}>🚗⚡️📈</div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
