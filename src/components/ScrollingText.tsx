"use client";

import React, { useRef, useEffect } from 'react';
import { m, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';

interface ScrollingTextProps {
  text: string;
  repeat?: number;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
  textClassName?: string;
  scrollLinked?: boolean;
  autoScroll?: boolean;
  glitchEffect?: boolean;
  separator?: string;
  glitchIntensity?: number;
  gradientOverlay?: boolean;
  textColor?: string;
}

const ScrollingText = ({
  text,
  repeat = 3,
  direction = 'left',
  speed = 1,
  className = '',
  textClassName = '',
  scrollLinked = true,
  autoScroll = false,
  glitchEffect = true,
  separator = ' • ',
  glitchIntensity = 0.07,
  gradientOverlay = true,
  textColor = 'text-white',
}: ScrollingTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Create a smoother scroll progress
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 100,
    damping: 30,
    restDelta: 0.001 
  });
  
  // Auto-scrolling functionality
  const xPos = useMotionValue(0);
  
  useEffect(() => {
    if (autoScroll && !scrollLinked) {
      const baseSpeed = direction === 'left' ? -1 : 1;
      xPos.set(direction === 'left' ? 0 : -100);
    }
  }, [autoScroll, direction, scrollLinked, xPos]);
  
  useAnimationFrame((time) => {
    if (autoScroll && !scrollLinked) {
      const current = xPos.get();
      const newPos = direction === 'left'
        ? (current - speed * 0.05) % -100 // loop back to 0 when reaching -100
        : (current + speed * 0.05) % 100; // loop back to -100 when reaching 0
      
      xPos.set(newPos); 
    }
  });
  
  // Create a transform that's dependent on scroll position
  const x = useTransform(
    scrollLinked ? smoothProgress : xPos,
    scrollLinked ? [0, 1] : [0, -100],
    direction === 'left' 
      ? [0, -100 * speed] 
      : [-100 * speed, 0]
  );
  
  // Generate repeated text
  const repeatedText = Array(repeat).fill(text).join(separator);
  
  return (
    <div 
      ref={containerRef}
      className={`w-full overflow-hidden relative ${className}`}
    >
      <m.div
        className="whitespace-nowrap flex"
        style={{ x: scrollLinked ? `${x.get()}%` : x }}
      >
        <div className={`px-4 ${textClassName} ${textColor}`}>
          {repeatedText}
        </div>
        <div className={`px-4 ${textClassName} ${textColor}`}>
          {repeatedText}
        </div>
      </m.div>
      
      {/* Gradient overlays for fading edges */}
      {gradientOverlay && (
        <>
          <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black to-transparent z-10"></div>
        </>
      )}
      
      {/* Glitch effect overlay */}
      {glitchEffect && (
        <m.div 
          className="absolute inset-0 mix-blend-overlay pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, glitchIntensity, 0, glitchIntensity, 0],
            x: [0, 5, -5, 2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
            times: [0, 0.2, 0.3, 0.6, 1],
          }}
        >
          <div className="h-full w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-purple-500/0"></div>
        </m.div>
      )}
    </div>
  );
};

export default ScrollingText; 