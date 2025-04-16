'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Ultra-optimized navigation hook for NexVox
 * Delivers immediate, instantaneous navigation with zero delays
 */
export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const lastNavigationTime = useRef<number>(0);
  const navigationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestNavigationTarget = useRef<string | null>(null);

  // Custom navigation event dispatcher
  const dispatchNavigationEvent = useCallback((type: 'start' | 'end', url: string = window.location.href) => {
    if (typeof window === 'undefined') return;
    
    const event = new CustomEvent(`navigation-${type}`, { 
      bubbles: true,
      cancelable: false, 
      detail: { 
        url,
        timestamp: Date.now() 
      }
    });
    
    window.dispatchEvent(event);
    document.dispatchEvent(event);
  }, []);

  // Reset navigation state - ensure we're never stuck in navigating state
  const resetNavigationState = useCallback(() => {
    setIsNavigating(false);
    if (navigationTimerRef.current) {
      clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }
    dispatchNavigationEvent('end');
  }, [dispatchNavigationEvent]);

  // Ultra-fast navigation function
  const navigate = useCallback((to: string, options?: { replace?: boolean, scroll?: boolean }) => {
    // Skip if navigation is too frequent (prevent spam)
    const now = Date.now();
    if (now - lastNavigationTime.current < 200) return;
    lastNavigationTime.current = now;
    
    // Store latest navigation target to verify completion
    latestNavigationTarget.current = to;

    // Handle external links
    if (to.startsWith('http')) {
      window.open(to, '_blank', 'noopener');
      return;
    }

    // Handle hash navigation
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      const currentPath = window.location.pathname;
      
      // If only changing hash on same page
      if (path === '' || path === currentPath) {
        const element = document.getElementById(hash);
        if (element) {
          // Start navigation
          setIsNavigating(true);
          dispatchNavigationEvent('start', to);
          
          // Immediate scroll
          element.scrollIntoView({ behavior: 'smooth' });
          
          // Update URL without full navigation
          window.history.pushState({}, '', to);
          
          // End navigation after a brief moment
          if (navigationTimerRef.current) {
            clearTimeout(navigationTimerRef.current);
          }
          
          navigationTimerRef.current = setTimeout(() => {
            setIsNavigating(false);
            dispatchNavigationEvent('end', to);
            navigationTimerRef.current = null;
          }, 100); // Very short timeout
          
          return;
        }
      }
    }

    // Start navigation immediately
    setIsNavigating(true);
    dispatchNavigationEvent('start', to);

    // Execute navigation with no delay
    try {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
      
      // Set a maximum navigation time in case Next.js router is slow
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
      }
      
      navigationTimerRef.current = setTimeout(() => {
        // Force navigation completion if taking too long
        setIsNavigating(false);
        dispatchNavigationEvent('end', to);
        navigationTimerRef.current = null;
      }, 300); // Maximum time to wait
      
    } catch (error) {
      console.error('Navigation error:', error);
      resetNavigationState();
    }
  }, [router, dispatchNavigationEvent, resetNavigationState]);

  // Force navigation completion if pathname actually changes
  useEffect(() => {
    if (isNavigating && pathname && latestNavigationTarget.current) {
      // If pathname matches our target path (ignoring hash), complete navigation
      if (latestNavigationTarget.current.split('#')[0] === pathname) {
        resetNavigationState();
      }
    }
  }, [pathname, isNavigating, resetNavigationState]);

  // Set up event listeners for navigation events
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      resetNavigationState();
    };

    const handlePopState = () => {
      // When browser back/forward buttons are used
      resetNavigationState();
    };

    // Set up event listeners
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('navigation-start', () => {
      setIsNavigating(true);
    });
    document.addEventListener('navigation-end', handleRouteChangeComplete);

    // Backup reset to ensure we're never stuck in a navigating state
    const backupResetInterval = setInterval(() => {
      if (isNavigating) {
        const navigationDuration = Date.now() - lastNavigationTime.current;
        // If navigation has been ongoing for more than 800ms, force reset
        if (navigationDuration > 800) {
          console.warn('Navigation taking too long, forcing reset');
          resetNavigationState();
        }
      }
    }, 1000);

    return () => {
      // Clean up
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('navigation-start', () => {
        setIsNavigating(true);
      });
      document.removeEventListener('navigation-end', handleRouteChangeComplete);
      
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
      }
      
      clearInterval(backupResetInterval);
    };
  }, [dispatchNavigationEvent, isNavigating, resetNavigationState]);

  return { navigate, isNavigating };
}

export default useNavigation; 