"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);
    
    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);
  
  if (typeof window === 'undefined') return null;
  
  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ mixBlendMode: 'exclusion' }}
    >
      <m.div
        className="w-4 h-4 rounded-full bg-white fixed"
        style={{
          x: position.x - 8,
          y: position.y - 8,
          opacity: visible ? 1 : 0
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: visible ? 1 : 0
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut'
        }}
      />
    </div>
  );
};

export default CustomCursor;
