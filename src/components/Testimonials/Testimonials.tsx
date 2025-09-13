"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Testimonials.module.css";
import { TESTIMONIALS } from "@/constants";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const id = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className={`${styles.section} ${styles.reveal}`}>
      <h2 className={styles.sectionTitle}>Khách hàng nói gì</h2>
      
      <div className={styles.carouselContainer}>
        <button 
          className={styles.arrowButton} 
          onClick={prevSlide}
          aria-label="Previous testimonial"
        >
          ‹
        </button>
        
        <div className={styles.carousel}>
          {TESTIMONIALS.map((testimonial, i) => (
            <div key={i} className={`${styles.carouselItem} ${i === index ? styles.carouselItemActive : ""}`}>
              <div className={styles.testimonial}>
                <div className={styles.quoteIcon}>"</div>
                <blockquote className={styles.quote}>{testimonial.text}</blockquote>
                <div className={styles.testimonialFooter}>
                  <div className={styles.avatarContainer}>
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      width={80} 
                      height={80}
                      className={styles.avatar}
                    />
                  </div>
                  <div className={styles.testimonialInfo}>
                    <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                    <p className={styles.testimonialPosition}>{testimonial.position}</p>
                    <div className={styles.companyInfo}>
                      <Image 
                        src={testimonial.companyLogo} 
                        alt={testimonial.company}
                        width={120}
                        height={40}
                        className={styles.companyLogo}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className={styles.arrowButton} 
          onClick={nextSlide}
          aria-label="Next testimonial"
        >
          ›
        </button>
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
