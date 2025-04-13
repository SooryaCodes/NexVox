"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins outside of component
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
  
  // Optimize GSAP performance
  gsap.config({
    nullTargetWarn: false,
    autoSleep: 60,
    force3D: true,
  });
}

// Debounce function to prevent excessive updates
const debounce = (fn: Function, ms = 100) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

interface AnimationProviderProps {
  children: React.ReactNode;
}

export default function AnimationProvider({ children }: AnimationProviderProps) {
  const initialized = useRef(false);

  // Initialize GSAP when the app loads
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // Enable hardware acceleration for body
    document.body.style.transform = 'translateZ(0)';
    document.body.style.backfaceVisibility = 'hidden';

    // Improve scrolling performance
    ScrollTrigger.config({ 
      ignoreMobileResize: false,
      syncInterval: 60,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    // Debounced refresh function
    const debouncedRefresh = debounce(() => {
      ScrollTrigger.refresh(true);
    }, 200);

    // Subscribe to resize events with debouncing
    window.addEventListener('resize', debouncedRefresh);
    
    // Force a refresh on load with a delay to ensure everything is rendered
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 300);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', debouncedRefresh);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf("*");
    };
  }, []);
  
  return children;
} 