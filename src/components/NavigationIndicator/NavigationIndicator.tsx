"use client";

import styles from "./NavigationIndicator.module.css";

interface NavigationIndicatorProps {
  currentSection: number;
  totalSections: number;
  goToSection: (index: number) => void;
}

export default function NavigationIndicator({ 
  currentSection, 
  totalSections, 
  goToSection 
}: NavigationIndicatorProps) {
  return (
    <div className={styles.navigationIndicator}>
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          className={`${styles.dot} ${currentSection === index ? styles.active : ''}`}
          onClick={() => goToSection(index)}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
}
