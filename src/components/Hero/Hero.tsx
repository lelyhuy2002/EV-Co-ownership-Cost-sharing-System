"use client";

import styles from "./Hero.module.css";
import useParallax from "@/hooks/useParallax";
import ScrollAnimation from "@/components/ScrollAnimation/ScrollAnimation";

export default function Hero() {
  const parallaxOffset = useParallax({ speed: 0.3, direction: 'up' });

  return (
    <section id="home" className={`${styles.hero} ${styles.reveal}`}>
      <div className={styles.heroPanel}>
        <div className={styles.heroContent}>
          <ScrollAnimation animation="slideRight" delay={0}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Nâng tầm phân tích dữ liệu cho ngành xe điện</h1>
              <ul className={styles.heroChecklist}>
                <li>Phân tích nhanh, chính xác, tương thích với mọi hệ thống.</li>
                <li>Kho dữ liệu rộng khắp: sạc, hành trình, hiệu suất pin.</li>
                <li>Quy trình minh bạch, bảo mật và ẩn danh tuyệt đối.</li>
              </ul>
              <div className={styles.ctas}>
                <a href="#marketplace" className={`${styles.button} ${styles.primary}`}>Trải nghiệm ngay</a>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation animation="slideLeft" delay={200}>
            <div className={styles.heroVisual} aria-hidden>
              <div 
                className={styles.heroCircle}
                style={{ transform: `translateY(${parallaxOffset}px)` }}
              >
                <div className={styles.heroBadge}>🚗⚡️📈</div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
