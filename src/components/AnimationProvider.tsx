"use client";

import { useEffect, useRef } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

// Debounce function to prevent excessive updates
const debounce = (fn: (...args: unknown[]) => void, ms = 100) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: unknown, ...args: unknown[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

interface AnimationProviderProps {
  children: React.ReactNode;
}

export default function AnimationProvider({ children }: AnimationProviderProps) {
  const initialized = useRef(false);

  // Initialize optimizations when the app loads
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // Enable hardware acceleration for body
    document.body.style.transform = 'translateZ(0)';
    document.body.style.backfaceVisibility = 'hidden';
    document.body.style.willChange = 'transform';

    // Performance optimization for animations
    const debouncedOptimize = debounce(() => {
      // Reset hardware acceleration to force GPU recalculation on resize
      document.body.style.transform = '';
      setTimeout(() => {
        document.body.style.transform = 'translateZ(0)';
      }, 10);
    }, 200);

    // Subscribe to resize events with debouncing
    window.addEventListener('resize', debouncedOptimize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', debouncedOptimize);
      document.body.style.transform = '';
      document.body.style.backfaceVisibility = '';
      document.body.style.willChange = '';
    };
  }, []);
  
  // LazyMotion loads animation features only when needed
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
} 