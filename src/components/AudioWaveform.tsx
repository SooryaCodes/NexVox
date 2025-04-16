"use client";

import { useRef, useState, useEffect } from 'react';
import { m } from 'framer-motion';

interface AudioWaveformProps {
  color?: string;
  activeColor?: string;
  height?: number;
  width?: number;
  barWidth?: number;
  gap?: number;
  bars?: number;
  isPlaying?: boolean;
  className?: string;
}

const AudioWaveform = ({ 
  color = "#00FFFF", 
  activeColor = "#FF00FF", 
  height = 60, 
  width = 300,
  barWidth = 3,
  gap = 2,
  bars = 50,
  isPlaying = true,
  className = "",
}: AudioWaveformProps) => {
  const [barHeights, setBarHeights] = useState<number[]>([]);
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Generate random heights for each bar
  useEffect(() => {
    const generateWaveform = () => {
      const newHeights = Array.from({ length: bars }, () => Math.random() * 100);
      setBarHeights(newHeights);
    };
    
    generateWaveform();
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [bars]);
  
  // Animate the waveform
  useEffect(() => {
    if (!isClient || !isPlaying) return;
    
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        
        if (deltaTime > 100) { // Update every 100ms
          setBarHeights(prev => 
            prev.map(height => {
              // Add some random movement to each bar
              const newHeight = height + (Math.random() * 30 - 15);
              // Clamp values between 10 and 100
              return Math.max(10, Math.min(100, newHeight));
            })
          );
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
    };
  }, [isPlaying, isClient]);
  
  // Calculate the total width required
  const totalWidth = bars * (barWidth + gap) - gap;
  const scaleFactor = width / totalWidth;
  
  if (!isClient) {
    return <div className={`flex items-center justify-center ${className}`} style={{ width, height }}></div>;
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
      <div className="flex items-center" style={{ transform: `scaleX(${scaleFactor})`, transformOrigin: 'center' }}>
        {barHeights.map((barHeight, index) => (
          <m.div
            key={index}
            className="rounded-full"
            style={{
              width: barWidth,
              backgroundColor: isPlaying ? activeColor : color,
              marginRight: index === bars - 1 ? 0 : gap,
              boxShadow: isPlaying ? `0 0 5px ${activeColor}` : 'none',
            }}
            initial={{ height: 5 }}
            animate={{ 
              height: isPlaying ? barHeight * height / 100 : 5,
              opacity: isPlaying ? 0.5 + (barHeight / 200) : 0.3,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 10,
              duration: 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioWaveform; 