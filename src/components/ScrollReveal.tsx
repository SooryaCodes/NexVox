"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0,
  className = "" 
}: ScrollRevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Apply hardware acceleration
    gsap.set(element, {
      willChange: "transform, opacity",
      force3D: true
    });
    
    // Configure starting position based on direction
    let x = 0;
    let y = 0;
    
    switch (direction) {
      case 'up':
        y = 30;
        break;
      case 'down':
        y = -30;
        break;
      case 'left':
        x = 30;
        break;
      case 'right':
        x = -30;
        break;
    }
    
    // Set initial state
    gsap.set(element, { 
      autoAlpha: 0, 
      x,
      y,
      immediateRender: true
    });
    
    // Create animation timeline
    animation.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Clean up transform to improve performance after animation
        if (element && animation.current?.progress() === 1) {
          gsap.set(element, { 
            clearProps: "willChange",
            overwrite: false
          });
        }
      }
    });
    
    // Add the animation to the timeline with better easing
    animation.current.to(element, {
      duration: 0.8,
      autoAlpha: 1,
      x: 0,
      y: 0,
      ease: "power2.out",
      overwrite: "auto",
      delay
    });
    
    // Create the scroll trigger with markers for debugging
    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: "top bottom-=10%",
      end: "bottom top+=10%",
      onEnter: () => {
        if (animation.current) animation.current.play();
      },
      markers: false,
      id: `scroll-${Math.random().toString(36).substr(2, 9)}`,
      once: false
    });
    
    // Cleanup
    return () => {
      scrollTrigger.kill();
      if (animation.current) {
        animation.current.kill();
        animation.current = null;
      }
    };
  }, [direction, delay]);
  
  return (
    <div ref={elementRef} className={`hardware-accelerated ${className}`}>
      {children}
    </div>
  );
};

export default ScrollReveal; 