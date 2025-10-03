"use client";

import { useState } from "react";
import styles from "./FAQNewsletter.module.css";
import { FAQS } from "@/constants";
import ScrollAnimation from "@/components/ScrollAnimation/ScrollAnimation";

export default function FAQNewsletter() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section className={`${styles.section} ${styles.reveal}`}>
      <div className={styles.container}>
        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <ScrollAnimation animation="fadeIn" delay={0}>
            <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
          </ScrollAnimation>
          
          <div className={styles.faqs}>
            {FAQS.map((faq, index) => {
              const isOpen = openItems.includes(index);
              return (
                <ScrollAnimation 
                  key={index} 
                  animation="slideUp" 
                  delay={index * 50}
                >
                  <div className={styles.faqItem}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => toggleItem(index)}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.questionText}>{faq.question}</span>
                      <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    <div className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className={styles.newsletterSection}>
          <ScrollAnimation animation="fadeIn" delay={200}>
            <h3 className={styles.newsletterTitle}>Đăng ký nhận tin</h3>
            <p className={styles.newsletterSubtitle}>
              Nhận thông tin mới nhất về dữ liệu xe điện và các cơ hội kinh doanh
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation animation="slideUp" delay={300}>
            <div className={styles.newsletter}>
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className={styles.emailInput}
              />
              <button className={`${styles.button} ${styles.primary}`}>
                Đăng ký
              </button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
