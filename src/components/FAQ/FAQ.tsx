import styles from "./FAQ.module.css";
import { FAQS } from "@/constants";

export default function FAQ() {
  return (
    <section className={`${styles.section} ${styles.reveal}`}>
      <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
      <div className={styles.faqs}>
        {FAQS.map((faq, index) => (
          <details key={index} className={styles.faqItem}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
