"use client";

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HyperspeedEffectProps {
  active?: boolean;
  starCount?: number;
  speed?: number;
  className?: string;
}

const HyperspeedEffect = ({
  active = true,
  starCount = 200,
  speed = 3,
  className = "",
}: HyperspeedEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<{x: number, y: number, z: number, size: number, color: string}[]>([]);
  const animationFrame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Initialize stars
    stars.current = [];
    for (let i = 0; i < starCount; i++) {
      stars.current.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.5,
        color: getRandomColor()
      });
    }
    
    function getRandomColor() {
      const colors = [
        '#00FFFF', // Cyan
        '#FF00FF', // Magenta
        '#FFFFFF', // White
        '#3366FF', // Blue
        '#9900FF'  // Purple
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Update and draw stars
      for (let i = 0; i < stars.current.length; i++) {
        const star = stars.current[i];
        
        // Update z position (depth)
        if (active) {
          star.z -= speed;
        }
        
        // Reset star if it's too close
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * canvas.width - centerX;
          star.y = Math.random() * canvas.height - centerY;
        }
        
        // Calculate screen position
        const screenX = (star.x / star.z) * 500 + centerX;
        const screenY = (star.y / star.z) * 500 + centerY;
        
        // Ensure the star is within the canvas
        if (
          screenX >= 0 &&
          screenX <= canvas.width &&
          screenY >= 0 &&
          screenY <= canvas.height
        ) {
          // Calculate size based on z position
          const size = (1 - star.z / 1000) * star.size * 5;
          
          // Calculate opacity based on z position
          const opacity = 1 - star.z / 1000;
          
          // Calculate trail length
          const trailLength = active ? (1 - star.z / 1000) * 50 : 0;
          
          // Draw star trail
          if (active && trailLength > 1) {
            const gradient = ctx.createLinearGradient(
              screenX + trailLength, screenY,
              screenX, screenY
            );
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(1, star.color);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = size;
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(screenX + trailLength, screenY);
            ctx.stroke();
          }
          
          // Draw star
          ctx.beginPath();
          ctx.fillStyle = star.color;
          ctx.globalAlpha = opacity;
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      
      animationFrame.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [active, starCount, speed]);
  
  return (
    <div className={`fixed inset-0 -z-5 w-full h-full overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      {active && (
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1 }}
        />
      )}
    </div>
  );
};

export default HyperspeedEffect; 