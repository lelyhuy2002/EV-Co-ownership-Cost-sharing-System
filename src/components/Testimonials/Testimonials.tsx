"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Testimonials.module.css";
import { TESTIMONIALS } from "@/constants";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="testimonials" className={`${styles.section} ${styles.reveal}`}>
      <h2 className={styles.sectionTitle}>Khách hàng nói gì</h2>
      <div className={styles.carousel}>
        {TESTIMONIALS.map((testimonial, i) => (
          <div key={i} className={`${styles.carouselItem} ${i === index ? styles.carouselItemActive : ""}`}>
            <div className={styles.testimonial}>
              <Image src={testimonial.avatar} alt="avatar" width={48} height={48} />
              <blockquote className={styles.quote}>{testimonial.text}</blockquote>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {TESTIMONIALS.map((_, i) => (
          <button 
            key={i} 
            aria-label={`Go to slide ${i+1}`} 
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`} 
            onClick={() => setIndex(i)} 
          />
        ))}
      </div>
    </section>
  );
}
