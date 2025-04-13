import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface NeonGridProps {
  color?: string;
  secondaryColor?: string;
  density?: number;
  opacity?: number;
  animate?: boolean;
}

const NeonGrid = ({
  color = '#00FFFF',
  secondaryColor = '#9D00FF',
  density = 30,
  opacity = 0.15,
  animate = true
}: NeonGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Grid settings
    const cellSize = density;
    const gridColor = color;
    const gridSecondaryColor = secondaryColor;
    
    let animationValue = 0;
    const drawGrid = () => {
      const { width, height } = canvas.getBoundingClientRect();
      
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Main grid lines
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(${hexToRgb(gridColor)}, ${opacity})`;
      
      // Horizontal lines
      for (let y = 0; y <= height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      
      // Vertical lines
      for (let x = 0; x <= width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      
      ctx.stroke();
      
      // Secondary grid (perspective effect)
      if (animate) {
        animationValue += 0.005;
        
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${hexToRgb(gridSecondaryColor)}, ${opacity * 2})`;
        
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        
        // Radial lines
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
          const x = centerX + Math.cos(angle + animationValue) * maxDistance;
          const y = centerY + Math.sin(angle + animationValue) * maxDistance;
          
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }
      
      if (animate) {
        animationRef.current = requestAnimationFrame(drawGrid);
      }
    };

    drawGrid();

    if (!animate) {
      // If not animating, draw once
      drawGrid();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, secondaryColor, density, opacity, animate]);

  // Utility function to convert hex to RGB
  const hexToRgb = (hex: string): string => {
    const sanitizedHex = hex.replace('#', '');
    const r = parseInt(sanitizedHex.substring(0, 2), 16);
    const g = parseInt(sanitizedHex.substring(2, 4), 16);
    const b = parseInt(sanitizedHex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default NeonGrid; 