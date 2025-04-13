"use client";

import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface ScrollingTextProps {
  text: string;
  repeat?: number;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
  textClassName?: string;
}

const ScrollingText = ({
  text,
  repeat = 3,
  direction = 'left',
  speed = 1,
  className = '',
  textClassName = '',
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
  
  // Create a transform that's dependent on scroll position
  const x = useTransform(
    smoothProgress,
    [0, 1],
    direction === 'left' 
      ? [0, -100 * speed] 
      : [-100 * speed, 0]
  );
  
  // Generate repeated text
  const repeatedText = Array(repeat).fill(text).join(' • ');
  
  return (
    <div 
      ref={containerRef}
      className={`w-full overflow-hidden relative ${className}`}
    >
      <motion.div
        className="whitespace-nowrap flex"
        style={{ x: `${x.get()}%` }}
      >
        <div className={`px-4 ${textClassName}`}>
          {repeatedText}
        </div>
        <div className={`px-4 ${textClassName}`}>
          {repeatedText}
        </div>
      </motion.div>
      
      {/* Gradient overlays for fading edges */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black to-transparent z-10"></div>
      
      {/* Glitch effect overlay */}
      <motion.div 
        className="absolute inset-0 mix-blend-overlay pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.05, 0, 0.07, 0],
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
      </motion.div>
    </div>
  );
};

export default ScrollingText; 