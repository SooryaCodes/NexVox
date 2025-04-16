'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useAnimation, Variants } from 'framer-motion';
import useSound from 'use-sound';
import Image from 'next/image';

interface PageTransitionProps {
  isTransitioning: boolean;
  targetRoute: string;
  completeTransition: () => void;
}

/**
 * Page transition component that provides an animated full-screen transition
 * with a scrolling effect and directional animation
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  isTransitioning,
  targetRoute,
  completeTransition,
}) => {
  const router = useRouter();
  const [transitionPhase, setTransitionPhase] = useState<'initial' | 'enter' | 'exit'>('initial');
  const controls = useAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Sound effects
  const [playTransitionSound] = useSound('/sounds/whoosh.mp3', { volume: 0.4 });
  
  // Execute scroll sequence 
  const executeScrollSequence = () => {
    if (!scrollRef.current) return;
    
    // Create a rapid scrolling effect
    const element = scrollRef.current;
    const duration = 800; // ms
    const steps = 20;
    const interval = duration / steps;
    let step = 0;
    
    const scrollInterval = setInterval(() => {
      if (step >= steps) {
        clearInterval(scrollInterval);
        return;
      }
      
      // Calculate scroll position using easing
      const progress = step / steps;
      const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      const scrollAmount = easedProgress * 2000; // Adjust this value for scroll intensity
      
      element.scrollTop = scrollAmount;
      step++;
    }, interval);
  };
  
  // Handle transition sequence
  useEffect(() => {
    if (isTransitioning) {
      // Play sound effect
      playTransitionSound();
      
      // Phase 1: Enter animation (bottom to top)
      setTransitionPhase('enter');
      
      // Execute scroll effect during transition
      const scrollInterval = setInterval(executeScrollSequence, 400);
      
      // Phase 2: After delay, navigate and prepare exit animation
      const navigationTimeout = setTimeout(() => {
        router.push(targetRoute);
        
        // Phase 3: Exit animation after navigation (top to bottom)
        const exitTimeout = setTimeout(() => {
          setTransitionPhase('exit');
          
          // Complete transition after exit animation
          const completeTimeout = setTimeout(() => {
            clearInterval(scrollInterval);
            completeTransition();
            setTransitionPhase('initial');
          }, 800); // Exit animation duration
          
          return () => clearTimeout(completeTimeout);
        }, 200); // Small delay after navigation
        
        return () => clearTimeout(exitTimeout);
      }, 800); // Enter animation duration
      
      return () => {
        clearTimeout(navigationTimeout);
        clearInterval(scrollInterval);
      };
    }
  }, [isTransitioning, targetRoute, router, completeTransition, playTransitionSound]);
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.5,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const transitionVariants: Variants = {
    enter: { 
      y: ['100vh', '0vh'],
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] // Custom easing function
      }
    },
    exit: { 
      y: ['0vh', '-100vh'],
      transition: { 
        duration: 0.8, 
        ease: [0.7, 0, 0.84, 0] // Different easing for exit
      }
    }
  };
  
  const contentVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 1.2,
      transition: { duration: 0.3 }
    }
  };
  
  // Don't render anything if not transitioning
  if (!isTransitioning && transitionPhase === 'initial') return null;
  
  return (
    <AnimatePresence mode="wait">
      {(isTransitioning || transitionPhase !== 'initial') && (
        <motion.div
          key="transition-container"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black pointer-events-auto"
        >
          <div ref={scrollRef} className="absolute inset-0 overflow-hidden">
            {/* Animated decorative elements */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse-slow"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: 0.1 + Math.random() * 0.3
                  }}
                />
              ))}
            </div>
          
            {/* Main transition element */}
            <motion.div
              key="transition-overlay"
              initial={false}
              animate={transitionPhase}
              variants={transitionVariants}
              className="absolute inset-0 bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900"
            >
              <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white"
                variants={contentVariants}
              >
                {/* Different content based on transition phase */}
                {transitionPhase === 'enter' && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4 animate-spin-slow">
                      <Image 
                        src="/logo.png" 
                        alt="Logo" 
                        width={96} 
                        height={96}
                        className="animate-pulse"
                      />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Loading Experience</h2>
                    <p className="text-lg text-blue-200">Preparing your journey...</p>
                  </div>
                )}
                
                {transitionPhase === 'exit' && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                      <Image 
                        src="/logo.png" 
                        alt="Logo" 
                        width={96} 
                        height={96}
                        className="animate-bounce"
                      />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Welcome</h2>
                    <p className="text-lg text-blue-200">Enjoy your experience</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
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
  
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
  
  .animate-spin-reverse {
    animation: spin-reverse 2s linear infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s ease-in-out infinite;
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
`}</style> 