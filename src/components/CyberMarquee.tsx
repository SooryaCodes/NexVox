import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CyberMarqueeProps {
  text: string;
  speed?: number;
  direction?: 'left' | 'right';
  repeat?: number;
  className?: string;
  separator?: string;
  pauseOnHover?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'gradient';
  glitch?: boolean;
}

const CyberMarquee = ({
  text,
  speed = 50,
  direction = 'left',
  repeat = 3,
  className = '',
  separator = ' • ',
  pauseOnHover = true,
  color = 'cyan',
  glitch = true
}: CyberMarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  
  // Create repeated text
  const repeatedText = Array(repeat).fill(text).join(separator);
  
  // Get color classes
  const getColorClass = () => {
    switch (color) {
      case 'cyan': return 'text-[#00FFFF]';
      case 'purple': return 'text-[#9D00FF]';
      case 'pink': return 'text-[#FF00E6]';
      case 'gradient': return 'text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#FF00E6]';
      default: return 'text-[#00FFFF]';
    }
  };
  
  useEffect(() => {
    if (!marqueeRef.current || !contentRef.current) return;
    
    const marquee = marqueeRef.current;
    const content = contentRef.current;
    
    // Calculate animation duration based on content width and speed
    const calculateDuration = () => {
      const contentWidth = content.offsetWidth;
      const duration = contentWidth / speed;
      return duration;
    };
    
    // Set up the scroll animation
    const setupScrollAnimation = () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      // Clone the content to ensure seamless looping
      gsap.set(content, { 
        x: direction === 'left' ? 0 : -content.offsetWidth / 2
      });
      
      animationRef.current = gsap.to(content, {
        x: direction === 'left' 
          ? -content.offsetWidth / 2 
          : 0,
        duration: calculateDuration(),
        ease: 'none',
        repeat: -1,
        onRepeat: () => {
          // Add occasional glitch if enabled
          if (glitch && Math.random() > 0.7) {
            const tl = gsap.timeline();
            tl.to(content, {
              opacity: 0.7,
              skewX: 20,
              duration: 0.1
            })
            .to(content, {
              opacity: 1,
              skewX: 0,
              duration: 0.1
            });
          }
        }
      });
    };
    
    // Initialize animation
    setupScrollAnimation();
    
    // Handle hover pause
    if (pauseOnHover) {
      marquee.addEventListener('mouseenter', () => {
        if (animationRef.current) {
          animationRef.current.pause();
        }
      });
      
      marquee.addEventListener('mouseleave', () => {
        if (animationRef.current) {
          animationRef.current.play();
        }
      });
    }
    
    // Handle resize
    const handleResize = () => {
      setupScrollAnimation();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [text, speed, direction, repeat, pauseOnHover, glitch]);

  return (
    <div 
      ref={marqueeRef}
      className={`overflow-hidden bg-black border-y border-[#00FFFF]/20 backdrop-blur-sm w-full ${className}`}
      aria-hidden="true"
    >
      <div 
        ref={contentRef} 
        className={`inline-block whitespace-nowrap font-orbitron ${getColorClass()}`}
      >
        {repeatedText}
      </div>
    </div>
  );
};

export default CyberMarquee; 