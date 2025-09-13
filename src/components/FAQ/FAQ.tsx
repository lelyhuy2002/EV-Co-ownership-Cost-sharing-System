"use client";

import { useState } from "react";
import styles from "./FAQ.module.css";
import { FAQS } from "@/constants";

export default function FAQ() {
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
      <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
      <div className={styles.faqs}>
        {FAQS.map((faq, index) => {
          const isOpen = openItems.includes(index);
          return (
            <div key={index} className={styles.faqItem}>
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
          );
        })}
      </div>
    </section>
  );
}
