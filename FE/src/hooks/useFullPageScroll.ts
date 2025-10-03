import { useEffect, useRef, useState } from 'react';

interface UseFullPageScrollOptions {
  duration?: number;
  easing?: string;
  threshold?: number;
}

export const useFullPageScroll = (options: UseFullPageScrollOptions = {}) => {
  const { duration = 1000, easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', threshold = 50 } = options;
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const containerRef = useRef<HTMLElement>(null);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]') as NodeListOf<HTMLElement>;
    sectionsRef.current = Array.from(sections);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastScrollTime.current < duration) return;
      
      lastScrollTime.current = now;
      
      if (isScrolling) return;
      
      const delta = e.deltaY;
      const direction = delta > 0 ? 1 : -1;
      
      scrollToSection(direction);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSection(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection(-1);
      }
    };

    const scrollToSection = (direction: number) => {
      const nextIndex = currentSection + direction;
      
      if (nextIndex < 0 || nextIndex >= sectionsRef.current.length) return;
      
      setIsScrolling(true);
      setCurrentSection(nextIndex);
      
      const targetSection = sectionsRef.current[nextIndex];
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        setTimeout(() => {
          setIsScrolling(false);
        }, duration);
      }
    };

    // Add event listeners
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isScrolling, duration]);

  const goToSection = (index: number) => {
    if (isScrolling || index < 0 || index >= sectionsRef.current.length) return;
    
    setIsScrolling(true);
    setCurrentSection(index);
    
    const targetSection = sectionsRef.current[index];
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        setIsScrolling(false);
      }, duration);
    }
  };

  return {
    currentSection,
    isScrolling,
    goToSection,
    totalSections: sectionsRef.current.length
  };
};

export default useFullPageScroll;
