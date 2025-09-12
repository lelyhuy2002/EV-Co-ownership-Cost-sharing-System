"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastScrollRef.current;
      const past = y > 80;
      setHeaderHidden(goingDown && past);
      lastScrollRef.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={`${styles.header} ${headerHidden ? styles.headerHidden : ""}`}>
        <div className={styles.headerLeft}>
          <Image src="/ev-logo.svg" alt="EV Data Marketplace" width={140} height={28} className={styles.brand} />
          <span className={styles.brandName}>EV Data Marketplace</span>
        </div>
        <HeaderNav />
      </header>

      <main className={styles.main}>
        {/* Hero Section */}
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

        {/* Why Choose Us */}
        <section id="benefits" className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>Vì sao chọn chúng tôi</h2>
          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}><span className={styles.iconBadge}>📚</span></div>
              <h3 className={styles.cardTitle}>Kho dữ liệu khổng lồ</h3>
              <p className={styles.cardText}>Truy cập hàng triệu điểm dữ liệu từ nguồn uy tín.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}><span className={styles.iconBadge}>📊</span></div>
              <h3 className={styles.cardTitle}>Công cụ phân tích mạnh mẽ</h3>
              <p className={styles.cardText}>Dashboard trực quan để khai thác giá trị dữ liệu.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}><span className={styles.iconBadge}>🔒</span></div>
              <h3 className={styles.cardTitle}>Bảo mật tuyệt đối</h3>
              <p className={styles.cardText}>An toàn và ẩn danh cho mọi giao dịch dữ liệu.</p>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>Các đối tác của chúng tôi</h2>
          <p className={styles.sectionSubtitle}>Được tin dùng bởi các tổ chức trong lĩnh vực xe điện và công nghệ dữ liệu.</p>
          <div className={styles.partnersRow}>
            <Image src="/vercel.svg" alt="Partner" width={96} height={96} />
            <Image src="/next.svg" alt="Partner" width={120} height={24} />
            <Image src="/globe.svg" alt="Partner" width={48} height={48} />
            <Image src="/file.svg" alt="Partner" width={48} height={48} />
          </div>
        </section>

        {/* How It Works */}
        <section id="marketplace" className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>Cách thức hoạt động</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h3 className={styles.stepTitle}>Tìm kiếm</h3>
              <p className={styles.stepText}>Tìm và chọn gói dữ liệu phù hợp nhu cầu.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h3 className={styles.stepTitle}>Mua và Tích hợp</h3>
              <p className={styles.stepText}>Thanh toán và tích hợp vào hệ thống qua API.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <h3 className={styles.stepTitle}>Phân tích</h3>
              <p className={styles.stepText}>Dùng dashboard và AI để ra quyết định.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* FAQs */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
          <div className={styles.faqs}>
            <details className={styles.faqItem}>
              <summary>Tôi có thể thử dữ liệu trước khi mua không?</summary>
              <p>Có, chúng tôi cung cấp dataset mẫu và sandbox API để bạn đánh giá.</p>
            </details>
            <details className={styles.faqItem}>
              <summary>Thanh toán hỗ trợ phương thức nào?</summary>
              <p>Ví điện tử và thẻ quốc tế; hoá đơn điện tử được cấp sau khi hoàn tất.</p>
            </details>
            <details className={styles.faqItem}>
              <summary>Dữ liệu có được ẩn danh không?</summary>
              <p>Tất cả dữ liệu đều được ẩn danh theo chính sách bảo mật nghiêm ngặt.</p>
            </details>
          </div>
        </section>

        {/* Newsletter */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <h2 className={styles.sectionTitle}>Đăng ký nhận tin</h2>
          <form className={styles.newsletter} onSubmit={(e) => { e.preventDefault(); const f = e.target as HTMLFormElement; const i = f.querySelector('input[type="email"]') as HTMLInputElement; alert(`Cảm ơn! Chúng tôi sẽ gửi cập nhật đến ${i.value}`); i.value = ""; }}>
            <input type="email" required placeholder="Nhập email của bạn" aria-label="Email" />
            <button type="submit" className={`${styles.button} ${styles.primary}`}>Đăng ký</button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer id="about" className={styles.footer}>
        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Về chúng tôi</h4>
          <p className={styles.footerText}>EV Data Marketplace — hạ tầng giao dịch dữ liệu cho ngành xe điện.</p>
        </div>
        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Liên kết</h4>
          <Link href="#about">About</Link>
          <Link href="#privacy">Chính sách bảo mật</Link>
          <Link href="#terms">Điều khoản sử dụng</Link>
        </div>
        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Liên hệ</h4>
          <a href="mailto:contact@evdata.local">contact@evdata.local</a>
          <div className={styles.socials}>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Twitter">X</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeaderNav() {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const sections = ["home", "benefits", "marketplace", "testimonials", "about"]; // ids
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

  return (
    <nav className={styles.nav}>
      <Link href="#home" className={`${styles.navLink} ${active === "home" ? styles.active : ""}`}>🏠 Home</Link>
      <Link href="#marketplace" className={`${styles.navLink} ${active === "marketplace" ? styles.active : ""}`}>🛒 Marketplace</Link>
      <Link href="#benefits" className={`${styles.navLink} ${active === "benefits" ? styles.active : ""}`}>✨ Why Us</Link>
      <Link href="#testimonials" className={`${styles.navLink} ${active === "testimonials" ? styles.active : ""}`}>💬 Reviews</Link>
      <div className={styles.headerCtas}>
        <button className={`${styles.button} ${styles.auth}`}>Đăng ký / Đăng nhập</button>
      </div>
    </nav>
  );
}

function Testimonials() {
  const items = useMemo(() => [
    {
      text: "Nền tảng này đã giúp chúng tôi tối ưu hệ thống sạc công cộng, giảm 20% chi phí vận hành.",
      avatar: "/vercel.svg",
    },
    {
      text: "Dữ liệu phong phú và API dễ tích hợp. Triển khai pilot chỉ trong một tuần.",
      avatar: "/next.svg",
    },
    {
      text: "Bảng điều khiển trực quan, giúp đội vận hành theo dõi hiệu suất theo thời gian thực.",
      avatar: "/globe.svg",
    },
  ], []);

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <section id="testimonials" className={`${styles.section} ${styles.reveal}`}>
      <h2 className={styles.sectionTitle}>Khách hàng nói gì</h2>
      <div className={styles.carousel}>
        {items.map((it, i) => (
          <div key={i} className={`${styles.carouselItem} ${i === index ? styles.carouselItemActive : ""}`}>
            <div className={styles.testimonial}>
              <Image src={it.avatar} alt="avatar" width={48} height={48} />
              <blockquote className={styles.quote}>{it.text}</blockquote>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {items.map((_, i) => (
          <button key={i} aria-label={`Go to slide ${i+1}`} className={`${styles.dot} ${i === index ? styles.dotActive : ""}`} onClick={() => setIndex(i)} />
        ))}
      </div>
    </section>
  );
}
