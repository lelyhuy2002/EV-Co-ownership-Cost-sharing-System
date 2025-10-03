"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./Partners.module.css";
import { PARTNERS } from "@/constants";
import ScrollAnimation from "@/components/ScrollAnimation/ScrollAnimation";

export default function Partners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  
  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === Math.ceil(PARTNERS.length / 3) - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay]);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === Math.ceil(PARTNERS.length / 3) - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.ceil(PARTNERS.length / 3) - 1 : prevIndex - 1
    );
  };
  
  const getVisiblePartners = () => {
    const startIndex = currentIndex * 3;
    return PARTNERS.slice(startIndex, startIndex + 3);
  };
  
  const totalSlides = Math.ceil(PARTNERS.length / 3);
  
  return (
    <section className={`${styles.section} ${styles.reveal}`}>
      <ScrollAnimation animation="fadeIn" delay={0}>
        <h2 className={styles.sectionTitle}>Hợp tác cùng những tên tuổi hàng đầu</h2>
        <p className={styles.sectionSubtitle}>Chúng tôi tự hào được đồng hành cùng các thương hiệu hàng đầu trong lĩnh vực xe điện và công nghệ dữ liệu, cùng nhau thúc đẩy sự phát triển bền vững.</p>
      </ScrollAnimation>

      <ScrollAnimation animation="slideUp" delay={200}>
        <div className={styles.carouselContainer}>
        <div className={styles.partnersRow}>
          {getVisiblePartners().map((partner, index) => (
            <div key={index} className={styles.partnerItem}>
              <Image 
                src={partner.src} 
                alt={partner.alt} 
                width={partner.width} 
                height={partner.height}
                className={styles.partnerLogo}
              />
            </div>
          ))}
        </div>
        
        {totalSlides > 1 && (
          <>
            <button 
              className={styles.carouselButton} 
              onClick={prevSlide}
              aria-label="Previous partners"
            >
              ‹
            </button>
            <button 
              className={styles.carouselButton} 
              onClick={nextSlide}
              aria-label="Next partners"
            >
              ›
            </button>
            
            <div className={styles.carouselDots}>
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        </div>
      </ScrollAnimation>
    </section>
  );
}
