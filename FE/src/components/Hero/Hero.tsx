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
              <h1 className={`${styles.heroTitle} gradient-text`}>EV Share: Hệ Thống Đồng Sở Hữu & Chia Sẻ Chi Phí Xe Điện Tiên Phong</h1>
              <ul className={styles.heroChecklist}>
                <li>Chia sẻ chi phí sạc, bảo dưỡng minh bạch, tự động. 🔋</li>
                <li>Quản lý lịch trình sử dụng chung xe trực quan, không xung đột. 📅</li>
                <li>Theo dõi chi phí và lợi ích của từng chủ sở hữu theo thời gian thực. 💰</li>
                <li>Hợp đồng đồng sở hữu số hóa, bảo mật và dễ dàng cập nhật. 📜</li>
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
