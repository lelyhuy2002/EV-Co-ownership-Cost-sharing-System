"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./HowItWorks.module.css";
import { STEPS } from "@/constants";

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate steps one by one
            STEPS.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps(prev => [...prev, index]);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="marketplace" className={`${styles.section} ${styles.reveal}`}>
      <h2 className={styles.sectionTitle}>Cách thức hoạt động</h2>
      <div className={styles.steps}>
        {STEPS.map((step, index) => (
          <div 
            key={index} 
            className={`${styles.step} ${visibleSteps.includes(index) ? styles.stepVisible : ''}`}
          >
            <div className={styles.stepIconContainer}>
              <Image 
                src={step.icon} 
                alt={`Step ${step.number} icon`}
                width={48}
                height={48}
                className={styles.stepIcon}
              />
              <div className={styles.stepNum}>{step.number}</div>
            </div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
