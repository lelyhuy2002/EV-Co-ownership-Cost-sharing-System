"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import useFullPageScroll from "@/hooks/useFullPageScroll";

// Import components
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Benefits from "@/components/Benefits/Benefits";
import Partners from "@/components/Partners/Partners";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import Testimonials from "@/components/Testimonials/Testimonials";
import FAQNewsletter from "@/components/FAQNewsletter/FAQNewsletter";
import Footer from "@/components/Footer/Footer";
import NavigationIndicator from "@/components/NavigationIndicator/NavigationIndicator";

export default function Home() {
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollRef = useRef(0);
  const { currentSection, goToSection, totalSections } = useFullPageScroll();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastScrollRef.current;
      const past = y > 80;
      setHeaderHidden(goingDown && past);
      lastScrollRef.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.page}>
      <Header headerHidden={headerHidden} currentSection={currentSection} goToSection={goToSection} />
      
      <main className={styles.main}>
        <div data-section="0" className={styles.section}>
          <Hero />
        </div>
        
        <div data-section="1" className={styles.section}>
          <Benefits />
        </div>
        
        <div data-section="2" className={styles.section}>
          <Partners />
        </div>
        
        <div data-section="3" className={styles.section}>
          <HowItWorks />
        </div>
        
        <div data-section="4" className={styles.section}>
          <Testimonials />
        </div>
        
        <div data-section="5" className={styles.section}>
          <FAQNewsletter />
        </div>
      </main>

      <Footer />
      
      <NavigationIndicator 
        currentSection={currentSection}
        totalSections={totalSections}
        goToSection={goToSection}
      />
    </div>
  );
}
