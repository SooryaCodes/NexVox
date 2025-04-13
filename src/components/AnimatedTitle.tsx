"use client";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

interface AnimatedTitleProps {
  titles: string[];
  className?: string;
}

const AnimatedTitle = ({ titles, className = "" }: AnimatedTitleProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [currentTitle, setCurrentTitle] = useState(titles[0] || "");
  
  useEffect(() => {
    if (!titleRef.current || !textRef.current || titles.length === 0) return;
    
    // Apply hardware acceleration
    gsap.set(textRef.current, { 
      willChange: "transform, opacity", 
      force3D: true 
    });
    
    // Clear any existing animations
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    // Create a timeline with improved performance settings
    timelineRef.current = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
      paused: false,
      onComplete: () => {
        // Clean up transform properties after animation completes
        if (textRef.current) {
          gsap.set(textRef.current, { clearProps: "willChange" });
        }
      }
    });
    
    // Start with the first title text
    gsap.set(textRef.current, { text: titles[0] || "" });
    setCurrentTitle(titles[0] || "");
    
    // Animate each title in sequence with optimized animations
    titles.forEach((title, index) => {
      // Skip immediate animation for the first item since we set it above
      if (index > 0) {
        // Use a function to update React state on text change
        const updateTitle = () => setCurrentTitle(title);
        
        // Fade out current text with hardware acceleration
        timelineRef.current?.to(textRef.current, {
          duration: 0.4, 
          opacity: 0,
          y: -15,
          ease: "power2.in",
          clearProps: "y", // Clear transform prop after animation
        });
        
        // Reset text content and position
        timelineRef.current?.set(textRef.current, { 
          text: "",
          y: 15,
        });
        
        // Fade in with new text
        timelineRef.current?.to(textRef.current, {
          duration: 0.4,
          opacity: 1,
          y: 0,
          ease: "power2.out",
          onStart: updateTitle
        });
        
        // Add the text typing effect with better performance
        timelineRef.current?.to(textRef.current, {
          duration: 0.8,
          text: {
            value: title,
            delimiter: "",
          },
          ease: "none",
        });
      }
      
      // Hold each title for a moment
      timelineRef.current?.to({}, { duration: 2 });
    });
    
    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [titles]);
  
  return (
    <h1 ref={titleRef} className={`${className} hardware-accelerated`}>
      <span 
        ref={textRef} 
        className="inline-block min-h-[1.2em] animated-element"
        data-text={currentTitle}
      >
        {currentTitle}
      </span>
    </h1>
  );
};

export default AnimatedTitle; 