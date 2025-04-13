"use client";

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HyperspeedEffectProps {
  active: boolean;
  intensity?: 'low' | 'medium' | 'high';
  colorScheme?: 'cyberpunk' | 'neon' | 'rainbow';
}

const HyperspeedEffect = ({ 
  active, 
  intensity = 'medium',
  colorScheme = 'cyberpunk'
}: HyperspeedEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Define colors based on color scheme
  const getColors = () => {
    switch (colorScheme) {
      case 'cyberpunk':
        return ['#00FFFF', '#FF00E6', '#9D00FF', '#FF3300'];
      case 'neon':
        return ['#39FF14', '#00FFFF', '#FFFF00', '#FF00E6'];
      case 'rainbow':
        return ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
      default:
        return ['#00FFFF', '#FF00E6', '#9D00FF', '#FF3300'];
    }
  };
  
  // Define number of stars based on intensity
  const getStarsCount = () => {
    switch (intensity) {
      case 'low': return 100;
      case 'medium': return 200;
      case 'high': return 500;
      default: return 200;
    }
  };

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Stars array
    const stars: Array<{
      x: number;
      y: number;
      z: number;
      prevZ: number;
      color: string;
      size: number;
      trail: Array<{ x: number; y: number; z: number }>;
    }> = [];
    
    // Initialize stars
    const colors = getColors();
    const starsCount = getStarsCount();
    
    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000 + 1000,
        prevZ: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.random() * 2,
        trail: [] // For trail effect
      });
    }
    
    // Animation speed
    const speed = intensity === 'high' ? 25 : intensity === 'medium' ? 15 : 8;
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Update and draw stars
      stars.forEach(star => {
        // Store previous position for trail
        star.prevZ = star.z;
        
        // Update z position (moving towards viewer)
        star.z -= speed;
        
        // Reset if star is too close
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width - centerX;
          star.y = Math.random() * canvas.height - centerY;
          star.z = 1000;
          star.trail = []; // Reset trail
        }
        
        // Calculate projected position
        const factor = 200 / star.z;
        const x = star.x * factor + centerX;
        const y = star.y * factor + centerY;
        
        // Store position for trail
        star.trail.push({ x, y, z: star.z });
        
        // Limit trail length
        if (star.trail.length > 5) {
          star.trail.shift();
        }
        
        // Draw trail
        if (star.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(star.trail[0].x, star.trail[0].y);
          
          for (let i = 1; i < star.trail.length; i++) {
            ctx.lineTo(star.trail[i].x, star.trail[i].y);
          }
          
          // Set line style
          ctx.strokeStyle = star.color;
          ctx.lineWidth = (star.size * (1 - star.z / 1000)) * 2; // Thicker as it gets closer
          ctx.stroke();
        }
        
        // Draw star
        const size = star.size * (1 - star.z / 1000) * 3;
        ctx.beginPath();
        ctx.arc(x, y, size > 0 ? size : 0.1, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, intensity, colorScheme, getColors, getStarsCount]);
  
  if (!active) return null;
  
  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      />
    </motion.div>
  );
};

export default HyperspeedEffect;