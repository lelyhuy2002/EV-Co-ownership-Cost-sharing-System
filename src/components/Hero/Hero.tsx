import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="home" className={`${styles.hero} ${styles.reveal}`}>
      <div className={styles.heroPanel}>
        <div className={styles.heroContent}>
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
        <div className={styles.heroVisual} aria-hidden>
          <div className={styles.heroCircle}>
            <div className={styles.heroBadge}>🚗⚡️📈</div>
          </div>
        </div>
      </div>
    </section>
  );
}
