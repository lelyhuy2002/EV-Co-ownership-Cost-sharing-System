"use client";

import { ReactNode } from "react";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import styles from "./ScrollAnimation.module.css";

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scaleIn";
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollAnimation({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = "",
}: ScrollAnimationProps) {
  const [ref, isVisible] = useScrollAnimation({ threshold });

  return (
    <div
      ref={ref}
      className={`${styles.scrollAnimation} ${styles[animation]} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getInitialTransform(animation),
      }}
    >
      {children}
    </div>
  );
}

function getInitialTransform(animation: string): string {
  switch (animation) {
    case "slideUp":
      return "translateY(30px)";
    case "slideLeft":
      return "translateX(-30px)";
    case "slideRight":
      return "translateX(30px)";
    case "scaleIn":
      return "scale(0.9)";
    default:
      return "translateY(0)";
  }
}
