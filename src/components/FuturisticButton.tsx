"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FuturisticButtonProps {
  text: string;
  type?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export default function FuturisticButton({ 
  text, 
  type = 'primary', 
  onClick, 
  className = '',
  icon
}: FuturisticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update the mouse position relative to the button
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Generate button styles based on type
  const getButtonStyles = () => {
    const baseStyles = "relative px-6 py-3 font-orbitron rounded-md overflow-hidden transition-all duration-300 text-center flex items-center justify-center gap-2";
    
    switch (type) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]`;
      case 'secondary':
        return `${baseStyles} bg-transparent border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff]/10`;
      case 'outline':
        return `${baseStyles} bg-transparent border border-gray-700 text-gray-300 hover:border-[#0ff] hover:text-[#0ff]`;
      default:
        return baseStyles;
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`${getButtonStyles()} ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient hover effect */}
      {isHovered && type === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-purple-300 opacity-30 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            width: 200,
            height: 200,
            borderRadius: '50%',
          }}
        />
      )}
      
      {/* Glow border effect for secondary and outline buttons */}
      {isHovered && (type === 'secondary' || type === 'outline') && (
        <motion.div
          className={`absolute inset-0 rounded-md ${type === 'secondary' ? 'shadow-[0_0_15px_#00FFFF]' : 'shadow-[0_0_10px_#00FFFF]'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Icon */}
      {icon && <span className="text-lg">{icon}</span>}
      
      {/* Text with shimmer effect */}
      <span className="relative z-10">
        {isHovered ? (
          <span className="relative">
            <span className="relative z-10">{text}</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              initial={{ left: -100 }}
              animate={{ left: 200 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
              style={{ width: '50px', height: '100%' }}
            />
          </span>
        ) : (
          text
        )}
      </span>
    </motion.button>
  );
} 