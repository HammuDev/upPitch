'use client';

import React, { useEffect, useRef, useState, memo } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = memo(
  ({ children, delay = 0, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Check if IntersectionObserver is supported
      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        setIsVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.02,
          rootMargin: '40px 0px 0px 0px',
        }
      );

      const el = domRef.current;
      if (el) {
        observer.observe(el);
      }

      return () => {
        observer.disconnect();
      };
    }, []);

    return (
      <div
        ref={domRef}
        style={{
          transitionDuration: '300ms',
          transitionDelay: `${delay}ms`,
        }}
        className={`transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      >
        {children}
      </div>
    );
  }
);

ScrollReveal.displayName = 'ScrollReveal';
