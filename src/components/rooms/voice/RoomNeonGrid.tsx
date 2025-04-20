import React, { useEffect, useRef } from 'react';

interface RoomNeonGridProps {
  color: string;
  secondaryColor: string;
  opacity?: number;
  blurStrength?: number;
}

export default function RoomNeonGrid({ 
  color = "#00FFFF", 
  secondaryColor = "#9D00FF", 
  opacity = 0.15,
  blurStrength = 3
}: RoomNeonGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const setCanvasSize = () => {
      const { width, height } = document.body.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Convert hex to rgba
    const hexToRgba = (hex: string, alpha: number): string => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    // Grid parameters
    const gridSpacing = 50 * blurStrength; // Increase spacing with blur strength
    const mainGridColor = hexToRgba(color, opacity * 0.8);
    const secondaryGridColor = hexToRgba(secondaryColor, opacity * 0.7);
    
    // Increased blur radius
    ctx.shadowBlur = 10 * blurStrength;
    
    // Floating particles
    const particles: { x: number; y: number; size: number; color: string; vx: number; vy: number; life: number; }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 * blurStrength + 2,
        color: Math.random() > 0.5 ? hexToRgba(color, Math.random() * 0.4) : hexToRgba(secondaryColor, Math.random() * 0.4),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        life: Math.random() * 100 + 100
      });
    }
    
    // Animate particles
    let animationTime = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationTime += 0.008;
      
      // Draw diagonal gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.5, 'rgba(8, 8, 22, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid with thicker lines and more blur
      ctx.lineWidth = 1.5;
      ctx.shadowColor = color;
      
      // Horizontal lines with subtle wave effect
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        for (let x = 0; x < canvas.width; x += 20) {
          const waveHeight = Math.sin(x * 0.005 + animationTime) * 8 * blurStrength;
          ctx.lineTo(x, y + waveHeight);
        }
        
        ctx.strokeStyle = y % (gridSpacing * 2) === 0 ? mainGridColor : secondaryGridColor;
        ctx.shadowBlur = y % (gridSpacing * 2) === 0 ? 15 * blurStrength : 5 * blurStrength;
        ctx.globalAlpha = y % (gridSpacing * 2) === 0 ? 0.7 : 0.3;
        ctx.stroke();
      }
      
      // Vertical lines with subtle wave effect
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        for (let y = 0; y < canvas.height; y += 20) {
          const waveWidth = Math.sin(y * 0.005 + animationTime) * 8 * blurStrength;
          ctx.lineTo(x + waveWidth, y);
        }
        
        ctx.strokeStyle = x % (gridSpacing * 2) === 0 ? mainGridColor : secondaryGridColor;
        ctx.shadowBlur = x % (gridSpacing * 2) === 0 ? 15 * blurStrength : 5 * blurStrength;
        ctx.globalAlpha = x % (gridSpacing * 2) === 0 ? 0.7 : 0.3;
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
      
      // Draw glowing nodes at intersections with increased glow
      for (let x = 0; x < canvas.width; x += gridSpacing * 2) {
        for (let y = 0; y < canvas.height; y += gridSpacing * 2) {
          const pulse = (Math.sin(animationTime + x * 0.01 + y * 0.01) + 1) * 0.5;
          const radius = (3 + pulse * 3) * blurStrength;
          
          // Glow effect with larger radius
          const glowRadius = radius * 8;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
          gradient.addColorStop(0, hexToRgba(color, 0.7 * pulse));
          gradient.addColorStop(0.3, hexToRgba(color, 0.3 * pulse));
          gradient.addColorStop(0.7, hexToRgba(color, 0.1 * pulse));
          gradient.addColorStop(1, hexToRgba(color, 0));
          
          ctx.beginPath();
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.shadowColor = color;
          ctx.shadowBlur = 20 * blurStrength;
          ctx.fill();
          
          // Node
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
      
      // Set shadow blur for particles
      ctx.shadowBlur = 15 * blurStrength;
      
      // Update and draw particles with more blur
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.5;
        
        // Respawn particles
        if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.size = Math.random() * 4 * blurStrength + 2;
          p.color = Math.random() > 0.5 ? hexToRgba(color, Math.random() * 0.4) : hexToRgba(secondaryColor, Math.random() * 0.4);
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = (Math.random() - 0.5) * 0.3;
          p.life = Math.random() * 100 + 100;
        }
        
        // Draw particle with glow
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Add extra glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d\.]+\)$/g, '0.1)');
        ctx.fill();
      });
      
      // Subtle pulsing overlay effect
      const overlayOpacity = (Math.sin(animationTime * 0.5) + 1) * 0.08;
      ctx.fillStyle = `rgba(0, 255, 255, ${overlayOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [color, secondaryColor, opacity, blurStrength]);
  
  return (
    <>
      {/* Base dark gradient background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-[#050530] to-black"></div>
      
      {/* Animated canvas with blur filter */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ 
          opacity: 0.8,
          filter: `blur(${blurStrength}px)` 
        }}
      />
      
      {/* Glass overlay for extra blurriness */}
      <div className="fixed inset-0 z-0 pointer-events-none backdrop-blur-2xl bg-black/5"></div>
      
      {/* Additional glow effects with increased blur */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-[200px] opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-purple-500 rounded-full blur-[180px] opacity-10"></div>
        <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-blue-500 rounded-full blur-[150px] opacity-5"></div>
      </div>
    </>
  );
}