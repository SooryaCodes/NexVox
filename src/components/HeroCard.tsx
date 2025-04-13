"use client";

import { useState, useRef, useEffect } from 'react';
import { m, useAnimation } from 'framer-motion';

interface HeroCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

const HeroCard = ({ title, description, children, className = "" }: HeroCardProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  
  // Function to handle mouse position and calculate rotation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate normalized position (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    
    // Set rotation (limited to +/- 7 degrees for smoother effect)
    setRotateY(normalizedX * 7);
    setRotateX(-normalizedY * 7);
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-out';
    }
    controls.start({
      scale: 1.02,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    });
  };
  
  // Reset to initial position when mouse leaves
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
    controls.start({
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    });
  };
  
  // Optimize performance with RAF
  useEffect(() => {
    if (!isHovering) return;
    
    const animate = (time: number) => {
      if (!cardRef.current) return;
      
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        if (deltaTime > 16) { // Cap at ~60fps
          cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          previousTimeRef.current = time;
        }
      } else {
        previousTimeRef.current = time;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      previousTimeRef.current = undefined;
    };
  }, [isHovering, rotateX, rotateY]);

  return (
    <m.div
      ref={cardRef}
      className={`relative bg-black/70 p-8 rounded-xl border border-[#0ff]/20 hover:border-[#0ff]/40 h-full hardware-accelerated ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: isHovering 
          ? '0 20px 40px rgba(0, 255, 255, 0.2), 0 0 15px rgba(0, 255, 255, 0.1)'
          : '0 10px 20px rgba(0, 0, 0, 0.3)'
      }}
      animate={controls}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ scale: 1 }}
    >
      <div className="flex flex-col h-full z-10 relative">
        {children && <div className="flex justify-center mb-4">{children}</div>}
        
        <h3 className="text-xl font-orbitron text-[#0ff] mb-4">{title}</h3>
        <p className="opacity-80 text-sm">{description}</p>
      </div>
      
      {/* Card glare effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovering ? 0.2 : 0,
          background: `radial-gradient(circle at ${isHovering ? (rotateY + 1) * 50 : 50}% ${isHovering ? (rotateX + 1) * 50 : 50}%, rgba(255, 255, 255, 0.8), transparent 60%)`,
        }}
      />
    </m.div>
  );
};

export default HeroCard; 