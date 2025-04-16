import { useState, useEffect, useRef, RefObject } from 'react';

// Add prefersReducedMotion detection
const motionSafe = typeof window !== 'undefined' 
  ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : true;

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

interface ScrollAnimationOptions {
  threshold?: number;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  rootMargin?: string;
  disabled?: boolean;
}

export const useScrollAnimation = <T extends HTMLElement>({
  threshold = 0.1,
  direction = 'up',
  delay = 0,
  duration = 700,
  distance = 50,
  once = true,
  rootMargin = "0px",
  disabled = false
}: ScrollAnimationOptions = {}): [RefObject<T>, boolean] => {
  const ref = useRef<T>(null) as RefObject<T>;
  const [isVisible, setIsVisible] = useState(false);
  const wasTriggeredRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Immediate visibility for users with reduced motion preferences or when disabled
  useEffect(() => {
    if (disabled || !motionSafe) {
      setIsVisible(true);
    }
  }, [disabled]);

  useEffect(() => {
    // Skip observer creation if animations are disabled
    if (disabled || !motionSafe) return;
    
    const element = ref.current;
    if (!element) return;

    // For better performance, only create observer if element isn't visible yet
    // or if we need to track visibility changes continuously
    if (wasTriggeredRef.current && once) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (!entries[0]?.isIntersecting) {
        if (!once) setIsVisible(false);
        return;
      }
      
      // Optimize by setting RAF for visibility change
      requestAnimationFrame(() => {
        setIsVisible(true);
        wasTriggeredRef.current = true;
        
        // Only disconnect if we want animation to trigger once
        if (once && observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      });
    };

    // Create and store the observer
    observerRef.current = new IntersectionObserver(handleIntersection, { 
      threshold,
      rootMargin 
    });

    observerRef.current.observe(element);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, once, rootMargin, disabled]);

  return [ref, isVisible];
};

// Get inline styles for animations
export const getAnimationStyles = (
  isVisible: boolean, 
  direction: AnimationDirection = 'up', 
  distance: number = 50,
  delay: number = 0,
  duration: number = 700,
  index: number = 0
): React.CSSProperties => {
  // Return no animation styles for users with reduced motion preferences
  if (!motionSafe) {
    return { opacity: 1 };
  }
  
  let transform = 'translate(0, 0)';
  
  if (!isVisible) {
    switch (direction) {
      case 'up':
        transform = `translateY(${distance}px)`;
        break;
      case 'down':
        transform = `translateY(-${distance}px)`;
        break;
      case 'left':
        transform = `translateX(${distance}px)`;
        break;
      case 'right':
        transform = `translateX(-${distance}px)`;
        break;
      case 'scale':
        transform = `scale(0.95)`;
        break;
      case 'fade':
      default:
        // Just fade, no transform
        break;
    }
  }

  return {
    opacity: isVisible ? 1 : 0,
    transform,
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay + (index * 75)}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform' // Only add will-change when animating
  };
};

// Get Tailwind classes for animations with optimized performance
export const getAnimationClasses = (
  isVisible: boolean,
  direction: AnimationDirection = 'up',
  delay: number = 0,
  index: number = 0
): string => {
  // Return empty string for users with reduced motion preferences
  if (!motionSafe) {
    return "opacity-100";
  }
  
  // Base classes - optimized for performance
  const baseClasses = 'transition-transform transition-opacity duration-700 ease-out';
  const delayValue = delay + (index * 50); // Reduced from 75 to 50 for faster animations
  const delayClass = delayValue > 0 ? `delay-[${delayValue}ms]` : '';
  
  if (!isVisible) {
    switch (direction) {
      case 'up':
        return `${baseClasses} ${delayClass} opacity-0 translate-y-8`;
      case 'down':
        return `${baseClasses} ${delayClass} opacity-0 -translate-y-8`;
      case 'left':
        return `${baseClasses} ${delayClass} opacity-0 translate-x-8`;
      case 'right':
        return `${baseClasses} ${delayClass} opacity-0 -translate-x-8`;
      case 'scale':
        return `${baseClasses} ${delayClass} opacity-0 scale-95`;
      case 'fade':
      default:
        return `${baseClasses} ${delayClass} opacity-0`;
    }
  }
  
  return `${baseClasses} ${delayClass} opacity-100 translate-y-0 translate-x-0 scale-100`;
};