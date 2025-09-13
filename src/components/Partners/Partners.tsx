import Image from "next/image";
import styles from "./Partners.module.css";
import { PARTNERS } from "@/constants";

export default function Partners() {
  return (
    <section className={`${styles.section} ${styles.reveal}`}>
      <h2 className={styles.sectionTitle}>Các đối tác của chúng tôi</h2>
      <p className={styles.sectionSubtitle}>Được tin dùng bởi các tổ chức trong lĩnh vực xe điện và công nghệ dữ liệu.</p>
      <div className={styles.partnersRow}>
        {PARTNERS.map((partner, index) => (
          <Image 
            key={index}
            src={partner.src} 
            alt={partner.alt} 
            width={partner.width} 
            height={partner.height} 
          />
        ))}
      </div>
    </section>
  );
}
