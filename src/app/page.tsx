"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

// Import components
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Benefits from "@/components/Benefits/Benefits";
import Partners from "@/components/Partners/Partners";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import Testimonials from "@/components/Testimonials/Testimonials";
import FAQ from "@/components/FAQ/FAQ";
import Newsletter from "@/components/Newsletter/Newsletter";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollRef = useRef(0);

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
      <Header headerHidden={headerHidden} />
      
      <main className={styles.main}>
        <Hero />
        <Benefits />
        <Partners />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
