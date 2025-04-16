'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { m, AnimatePresence, useAnimation, Variants } from 'framer-motion';
import useSound from 'use-sound';
import Image from 'next/image';

interface PageTransitionProps {
  isTransitioning?: boolean;
  isOpen?: boolean;
  targetRoute: string;
  completeTransition?: () => void;
  onTransitionComplete?: () => void;
}

/**
 * Page transition component that provides an animated full-screen transition
 * with a Barba.js style animation effect and smooth scrolling
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  isTransitioning: propIsTransitioning,
  isOpen,
  targetRoute,
  completeTransition: propCompleteTransition,
  onTransitionComplete,
}) => {
  const isTransitioning = propIsTransitioning || isOpen || false;
  const completeTransition = propCompleteTransition || onTransitionComplete || (() => {});
  
  const router = useRouter();
  const [transitionPhase, setTransitionPhase] = useState<'initial' | 'enter' | 'exit'>('initial');
  const controls = useAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Sound effects
  const [playTransitionSound] = useSound('/sounds/whoosh.mp3', { volume: 0.5 });
  
  // Execute scroll sequence with improved physics
  const executeScrollSequence = () => {
    if (!scrollRef.current) return;
    
    // Create a more dynamic scrolling effect
    const element = scrollRef.current;
    const duration = 800; // ms - faster for better responsiveness
    const steps = 40; // more steps for smoother animation
    const interval = duration / steps;
    let step = 0;
    
    // Reset scroll position
    element.scrollTop = 0;
    
    const scrollInterval = setInterval(() => {
      if (step >= steps) {
        clearInterval(scrollInterval);
        return;
      }
      
      // Calculate scroll position using cubic bezier easing
      const progress = step / steps;
      // Custom easing function for more natural movement
      const easedProgress = cubicBezier(0.33, 1, 0.68, 1, progress);
      
      // First half scrolls down, second half scrolls up
      let scrollAmount;
      if (progress < 0.5) {
        scrollAmount = easedProgress * 2 * 5000; // Increased from 3000 to 5000 for more dramatic effect
      } else {
        scrollAmount = (1 - (easedProgress - 0.5) * 2) * 5000; // Increased from 3000 to 5000
      }
      
      element.scrollTop = scrollAmount;
      step++;
    }, interval);
    
    return scrollInterval;
  };
  
  // Cubic bezier easing function
  const cubicBezier = (x1: number, y1: number, x2: number, y2: number, t: number): number => {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
    const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
    
    const solveCurveX = (x: number) => {
      let t0 = 0;
      let t1 = 1;
      let t2 = x;
      
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      
      for (let i = 0; i < 8; i++) {
        const x2 = sampleCurveX(t2);
        if (Math.abs(x2 - x) < 0.001) return t2;
        
        const d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
        if (Math.abs(d2) < 1e-6) break;
        
        t2 = t2 - (x2 - x) / d2;
      }
      
      // Fallback to binary search
      while (t0 < t1) {
        const x2 = sampleCurveX(t2);
        if (Math.abs(x2 - x) < 0.001) return t2;
        
        if (x > x2) t0 = t2;
        else t1 = t2;
        
        t2 = (t1 - t0) * 0.5 + t0;
      }
      
      return t2;
    };
    
    return sampleCurveY(solveCurveX(t));
  };
  
  // Handle transition sequence
  useEffect(() => {
    if (isTransitioning) {
      // Immediately lock scrolling on page
      document.body.style.overflow = 'hidden';
      
      
      // Play sound effect with slight delay for better timing
      setTimeout(() => playTransitionSound(), 50);
      
      // Phase 1: Enter animation (bottom to top)
      setTransitionPhase('enter');
      
      // Execute scroll effect during transition
      const scrollInterval = executeScrollSequence();

      // Phase 2: After delay, navigate and prepare exit animation
      const navigationTimeout = setTimeout(() => {
        // Ensure navigation happens
        try {
          router.push(targetRoute);
          
          // Fallback navigation in case router fails
          setTimeout(() => {
            if (window.location.pathname !== targetRoute && !targetRoute.includes('#')) {
              window.location.href = targetRoute;
            }
          }, 200);
        } catch (error) {
          console.error('Navigation failed, using direct approach', error);
          window.location.href = targetRoute;
        }
        
        // Phase 3: Exit animation after navigation (top to bottom)
        const exitTimeout = setTimeout(() => {
          setTransitionPhase('exit');
          
          // Complete transition after exit animation
          const completeTimeout = setTimeout(() => {
            if (scrollInterval) clearInterval(scrollInterval);
            completeTransition();
            setTransitionPhase('initial');
            document.body.style.overflow = '';
          }, 700); // Exit animation duration - reduced from 900 to 700
          
          return () => clearTimeout(completeTimeout);
        }, 200); // Small delay after navigation
        
        return () => clearTimeout(exitTimeout);
      }, 700); // Enter animation duration - reduced from 900 to 700 for better responsiveness
      
      return () => {
        clearTimeout(navigationTimeout);
        if (scrollInterval) clearInterval(scrollInterval);
        document.body.style.overflow = '';
      };
    }
  }, [isTransitioning, targetRoute, router, completeTransition, playTransitionSound]);
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.2, // Faster fade in
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.2, // Faster fade out
        when: "afterChildren",
        staggerChildren: 0.04,
        staggerDirection: -1
      }
    }
  };
  
  const transitionVariants: Variants = {
    enter: { 
      y: ['100vh', '0vh'],
      transition: { 
        duration: 0.7, // Faster transitions
        ease: [0.16, 1, 0.3, 1] // Custom easing function (ease-out-expo)
      }
    },
    exit: { 
      y: ['0vh', '-100vh'],
      transition: { 
        duration: 0.7, // Faster transitions
        ease: [0.16, 1, 0.3, 1] // Same easing for consistency
      }
    }
  };
  
  const contentVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } // Spring-like effect
    },
    exit: { 
      opacity: 0, 
      scale: 1.2,
      transition: { duration: 0.2 }
    }
  };
  
  // Particle animation variants
  const particleVariants: Variants = {
    hidden: { opacity: 0, y: 100 },
    visible: (i: number) => ({ 
      opacity: 0.6,
      y: 0,
      transition: { 
        delay: i * 0.03, // Slightly faster delay
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: (i: number) => ({ 
      opacity: 0,
      y: -100,
      transition: { 
        delay: i * 0.015, // Slightly faster delay
        duration: 0.3,
        ease: "easeIn"
      }
    })
  };
  
  // Don't render anything if not transitioning
  if (!isTransitioning && transitionPhase === 'initial') return null;
  
  return (
    <AnimatePresence mode="wait">
      {(isTransitioning || transitionPhase !== 'initial') && (
        <m.div
          key="transition-container"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-black pointer-events-auto"
        >
          <div ref={scrollRef} className="absolute inset-0 overflow-hidden">
            {/* Animated decorative elements with improved visuals */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 40 }).map((_, i) => (
                <m.div 
                  key={i}
                  custom={i}
                  variants={particleVariants}
                  className="absolute w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    scale: 0.5 + Math.random() * 1.5,
                    opacity: 0.1 + Math.random() * 0.3,
                    filter: `blur(${2 + Math.random() * 8}px)`
                  }}
                />
              ))}
            </div>
          
            {/* Main transition element with enhanced gradient */}
            <m.div
              ref={overlayRef}
              key="transition-overlay"
              initial={false}
              animate={transitionPhase}
              variants={transitionVariants}
              className="absolute inset-0 bg-black"
              style={{
                backgroundSize: '400% 400%',
              }}
            >
              {/* Semi-transparent gradient overlay for visual interest */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-indigo-900/20 to-purple-900/30 opacity-70"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.9)_100%)]" />
              
              <m.div 
                className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white"
                variants={contentVariants}
              >
                {/* Different content based on transition phase */}
                {transitionPhase === 'enter' && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4 relative">
                      <div className="absolute inset-0 animate-ping-slow opacity-50">
                        <Image 
                          src="/logo.png" 
                          alt="Logo" 
                          width={96} 
                          height={96}
                        />
                      </div>
                      <div className="animate-spin-slow">
                        <Image 
                          src="/logo.png" 
                          alt="Logo" 
                          width={96} 
                          height={96}
                        />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      Loading Experience
                    </h2>
                    <p className="text-lg text-blue-200">Preparing your journey...</p>
                  </div>
                )}
                
                {transitionPhase === 'exit' && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4 relative">
                      <div className="animate-bounce">
                        <Image 
                          src="/logo.png" 
                          alt="Logo" 
                          width={96} 
                          height={96}
                          className="drop-shadow-glow"
                        />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      Welcome
                    </h2>
                    <p className="text-lg text-blue-200">Enjoy your experience</p>
                  </div>
                )}
              </m.div>
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;

<style jsx global>{`
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes spin-reverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes ping-slow {
    0% { transform: scale(0.95); opacity: 0.8; }
    70% { transform: scale(1.1); opacity: 0.3; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }
  
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
  
  .animate-spin-reverse {
    animation: spin-reverse 2s linear infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s ease-in-out infinite;
  }
  
  .animate-ping-slow {
    animation: ping-slow 2s ease-in-out infinite;
  }
  
  .animate-gradient-shift {
    animation: gradient-shift 3s ease infinite;
  }
  
  .drop-shadow-glow {
    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8));
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }
`}</style> 