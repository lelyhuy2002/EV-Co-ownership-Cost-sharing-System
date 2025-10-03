import Link from "next/link";
import styles from "./Footer.module.css";
import { COMPANY_INFO, SOCIAL_LINKS } from "@/constants";

export default function Footer() {
  return (
    <footer id="about" className={styles.footer}>
      <div className={styles.footerCol}>
        <h4 className={styles.footerTitle}>Về chúng tôi</h4>
        <p className={styles.footerText}>{COMPANY_INFO.description}</p>
      </div>
      <div className={styles.footerCol}>
        <h4 className={styles.footerTitle}>Liên kết</h4>
        <Link href="#about">About</Link>
        <Link href="#privacy">Chính sách bảo mật</Link>
        <Link href="#terms">Điều khoản sử dụng</Link>
      </div>
      <div className={styles.footerCol}>
        <h4 className={styles.footerTitle}>Liên hệ</h4>
        <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
        <div className={styles.socials}>
          {SOCIAL_LINKS.map((social) => (
            <a key={social.label} href={social.href} aria-label={social.label}>
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
