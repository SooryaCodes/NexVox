"use client";

import { useEffect, useRef, useState, memo } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
}

// Memoize the component to prevent unnecessary re-renders
const ParticlesBackground = memo(function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  useEffect(() => {
    // Use intersection observer to only animate when visible
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 } // Start when 10% visible
    );
    
    observer.observe(canvas);
    observerRef.current = observer;
    
    return () => {
      if (observerRef.current && canvas) {
        observerRef.current.unobserve(canvas);
      }
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas with reduced resolution for better performance
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Reduced resolution for better performance
      const scaleFactor = window.innerWidth > 1024 ? 0.7 : 0.5;
      
      canvas.width = width * dpr * scaleFactor;
      canvas.height = height * dpr * scaleFactor;
      
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr * scaleFactor, dpr * scaleFactor);
    };
    
    setupCanvas();
    
    // Create particles with reduced count based on screen size
    const createParticles = () => {
      const count = Math.min(40, Math.floor(window.innerWidth / 30)); // Reduced particle count
      const particles: Particle[] = [];
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.4 - 0.2, // Reduced speed
          speedY: Math.random() * 0.4 - 0.2, // Reduced speed
          color: i % 2 === 0 ? '#00FFFF' : '#9D00FF',
          alpha: Math.random() * 0.5 + 0.1
        });
      }
      
      particlesRef.current = particles;
    };
    
    createParticles();
    
    // Animate with frame rate control
    const animate = (timestamp: number) => {
      if (!isVisible) {
        // Only request animation frame when visible
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Throttle updates for better performance (target ~15fps)
      if (timestamp - lastUpdateRef.current < 66) { // ~15fps
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastUpdateRef.current = timestamp;
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Simplified drawing
      const particles = particlesRef.current;
      
      // Skip drawing connections for better performance
      particles.forEach(particle => {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        if (particle.y > window.innerHeight) particle.y = 0;
        
        // Draw particle
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Handle resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupCanvas();
        createParticles();
      }, 300); // Longer debounce for resize
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isVisible]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
});

export default ParticlesBackground; 