import React, { useEffect, useRef } from 'react';

interface RoomNeonGridProps {
  color: string;
  secondaryColor: string;
  opacity?: number;
}

export default function RoomNeonGrid({ 
  color = "#00FFFF", 
  secondaryColor = "#9D00FF", 
  opacity = 0.15
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
    const gridSpacing = 40;
    const mainGridColor = hexToRgba(color, opacity);
    const secondaryGridColor = hexToRgba(secondaryColor, opacity);
    
    // Floating particles
    const particles: { x: number; y: number; size: number; color: string; vx: number; vy: number; life: number; }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? hexToRgba(color, Math.random() * 0.3) : hexToRgba(secondaryColor, Math.random() * 0.3),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: Math.random() * 100 + 100
      });
    }
    
    // Animate particles
    let animationTime = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationTime += 0.01;
      
      // Draw diagonal gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.5, 'rgba(10, 10, 20, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.lineWidth = 1;
      
      // Horizontal lines with subtle wave effect
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        for (let x = 0; x < canvas.width; x += 5) {
          const waveHeight = Math.sin(x * 0.01 + animationTime) * 2;
          ctx.lineTo(x, y + waveHeight);
        }
        
        ctx.strokeStyle = y % (gridSpacing * 3) === 0 ? mainGridColor : secondaryGridColor;
        ctx.globalAlpha = y % (gridSpacing * 3) === 0 ? 1 : 0.5;
        ctx.stroke();
      }
      
      // Vertical lines with subtle wave effect
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        for (let y = 0; y < canvas.height; y += 5) {
          const waveWidth = Math.sin(y * 0.01 + animationTime) * 2;
          ctx.lineTo(x + waveWidth, y);
        }
        
        ctx.strokeStyle = x % (gridSpacing * 3) === 0 ? mainGridColor : secondaryGridColor;
        ctx.globalAlpha = x % (gridSpacing * 3) === 0 ? 1 : 0.5;
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
      
      // Draw glowing nodes at intersections
      for (let x = 0; x < canvas.width; x += gridSpacing * 3) {
        for (let y = 0; y < canvas.height; y += gridSpacing * 3) {
          const pulse = (Math.sin(animationTime + x * 0.01 + y * 0.01) + 1) * 0.5;
          const radius = 3 + pulse * 2;
          
          // Glow effect
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 5);
          gradient.addColorStop(0, hexToRgba(color, 0.5 * pulse));
          gradient.addColorStop(0.5, hexToRgba(color, 0.2 * pulse));
          gradient.addColorStop(1, hexToRgba(color, 0));
          
          ctx.beginPath();
          ctx.arc(x, y, radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Node
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
      
      // Update and draw particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.5;
        
        // Respawn particles
        if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.size = Math.random() * 3 + 1;
          p.color = Math.random() > 0.5 ? hexToRgba(color, Math.random() * 0.3) : hexToRgba(secondaryColor, Math.random() * 0.3);
          p.vx = (Math.random() - 0.5) * 0.5;
          p.vy = (Math.random() - 0.5) * 0.5;
          p.life = Math.random() * 100 + 100;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      
      // Subtle pulsing overlay effect
      const overlayOpacity = (Math.sin(animationTime * 0.5) + 1) * 0.05;
      ctx.fillStyle = `rgba(0, 255, 255, ${overlayOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [color, secondaryColor, opacity]);
  
  return (
    <>
      {/* Base dark gradient background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-[#050530] to-black"></div>
      
      {/* Animated canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ opacity: 0.8 }}
      />
      
      {/* Additional glow effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-[150px] opacity-5"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-500 rounded-full blur-[120px] opacity-5"></div>
      </div>
    </>
  );
}