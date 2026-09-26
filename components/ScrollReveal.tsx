'use strict';
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.04,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    const current = domRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const getDirectionClasses = () => {
    switch (direction) {
      case 'up':
        return 'translate3d(0, 16px, 0)';
      case 'down':
        return 'translate3d(0, -16px, 0)';
      case 'left':
        return 'translate3d(16px, 0, 0)';
      case 'right':
        return 'translate3d(-16px, 0, 0)';
      case 'none':
        return 'scale3d(0.98, 0.98, 1)';
      default:
        return 'translate3d(0, 16px, 0)';
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: '600ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: isVisible ? 'auto' : 'transform, opacity',
        transform: isVisible ? 'none' : getDirectionClasses(),
      }}
      className={`transition-all duration-500 ${
        isVisible
          ? 'opacity-100'
          : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};


