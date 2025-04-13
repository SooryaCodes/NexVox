"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import soundEffects from '@/utils/soundEffects';

interface FuturisticButtonProps {
  text: string;
  type?: 'primary' | 'secondary' | 'outline' | 'neon';
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  rippleEffect?: boolean;
  glitchEffect?: boolean;
  accessibilityLabel?: string;
  disabled?: boolean;
  soundEffect?: 'default' | 'click' | 'success' | 'error' | 'special' | 'none';
  hoverSound?: string;
}

export default function FuturisticButton({ 
  text, 
  type = 'primary', 
  onClick, 
  className = '',
  icon,
  rippleEffect = true,
  glitchEffect = false,
  accessibilityLabel,
  disabled = false,
  soundEffect = 'default',
  hoverSound
}: FuturisticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleCounter = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP effects
  useEffect(() => {
    if (!glowRef.current) return;
    
    // Create continuous glow animation
    if (type === 'neon') {
      gsap.to(glowRef.current, {
        boxShadow: '0 0 20px #00FFFF, 0 0 30px #00FFFF',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
    
    return () => {
      gsap.killTweensOf(glowRef.current);
    };
  }, [type]);

  // Update the mouse position relative to the button
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Play hover sound
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Play hover sound
    if (!disabled && soundEffect !== 'none') {
      if (hoverSound) {
        soundEffects.loadAndPlay('custom-hover', hoverSound);
      } else {
        // Use different hover sounds based on button type
        switch (type) {
          case 'neon':
            soundEffects.loadAndPlay('neon-hover', '/audios/digital-blip.mp3');
            break;
          case 'primary':
            soundEffects.loadAndPlay('primary-hover', '/audios/bap.mp3');
            break;
          case 'secondary':
            soundEffects.playHover();
            break;
          default:
            soundEffects.playHover();
        }
      }
    }
  };

  // Add ripple effect on click
  const addRipple = (e: React.MouseEvent) => {
    if (!rippleEffect || disabled) return;
    
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (!buttonRect) return;
    
    const x = e.clientX - buttonRect.left;
    const y = e.clientY - buttonRect.top;
    
    const newRipple = {
      id: rippleCounter.current,
      x,
      y
    };
    
    rippleCounter.current += 1;
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  };

  // Handle click with sound effects
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    addRipple(e);
    
    // Play appropriate sound effect
    if (soundEffect !== 'none') {
      switch (soundEffect) {
        case 'success':
          soundEffects.playSuccess();
          break;
        case 'error':
          soundEffects.playError();
          break;
        case 'special':
          soundEffects.loadAndPlay('special', '/audios/digital-auth-process.mp3');
          break;
        case 'default':
        case 'click':
        default:
          soundEffects.playClick();
          break;
      }
    }
    
    // Call the onClick handler if provided
    onClick && onClick();
  };

  // Generate glitch effect on hover
  useEffect(() => {
    if (!glitchEffect || !isHovered || !buttonRef.current) return;
    
    let glitchInterval: NodeJS.Timeout;
    
    const runGlitch = () => {
      const glitchText = buttonRef.current?.querySelector('.glitch-text');
      if (!glitchText) return;
      
      gsap.to(glitchText, {
        skewX: () => Math.random() * 10 - 5,
        skewY: () => Math.random() * 10 - 5,
        duration: 0.1,
        onComplete: () => {
          gsap.to(glitchText, {
            skewX: 0,
            skewY: 0,
            duration: 0.1
          });
        }
      });
    };
    
    glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        runGlitch();
      }
    }, 500);
    
    return () => {
      clearInterval(glitchInterval);
    };
  }, [glitchEffect, isHovered]);

  // Generate button styles based on type
  const getButtonStyles = () => {
    const baseStyles = "relative px-6 py-3 font-orbitron rounded-md overflow-hidden transition-all duration-300 text-center flex items-center justify-center gap-2";
    
    switch (type) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]`;
      case 'secondary':
        return `${baseStyles} bg-transparent border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]/10`;
      case 'outline':
        return `${baseStyles} bg-transparent border border-gray-700 text-gray-300 hover:border-[#00FFFF] hover:text-[#00FFFF]`;
      case 'neon':
        return `${baseStyles} bg-black border border-[#00FFFF] text-[#00FFFF] hover:text-white hover:bg-[#00FFFF]/20`;
      default:
        return baseStyles;
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`${getButtonStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      disabled={disabled}
      aria-label={accessibilityLabel || text}
    >
      {/* Glow effect for neon button */}
      {type === 'neon' && (
        <div 
          ref={glowRef}
          className="absolute inset-0 rounded-md opacity-50"
        />
      )}
      
      {/* Gradient hover effect */}
      {isHovered && type === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] opacity-30 blur-xl"
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

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute bg-white rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            marginLeft: -100,
            marginTop: -100,
            width: 200,
            height: 200,
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
      
      {/* Icon */}
      {icon && <span className="text-lg relative z-10">{icon}</span>}
      
      {/* Text with effects */}
      <span className={`relative z-10 ${glitchEffect ? 'glitch-text' : ''}`}>
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