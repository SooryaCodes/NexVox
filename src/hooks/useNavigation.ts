'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import soundEffects from '@/utils/soundEffects';
import { markNavigationStart, markNavigationEnd } from '@/utils/performance';

export const useNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationStart = useRef(0);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);
  
  // Reset any active navigation timeouts
  const clearNavigationTimeouts = useCallback(() => {
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current);
      navigationTimeout.current = null;
    }
  }, []);
  
  // Start navigation process - don't call setState directly, use ref instead
  const startNavigation = useCallback(() => {
    // Clear any pending timeouts
    clearNavigationTimeouts();
    
    // Set ref state first (this doesn't trigger rerenders)
    isNavigatingRef.current = true;
    
    // Use a microtask to schedule the state update outside of React's current rendering cycle
    Promise.resolve().then(() => {
      if (isNavigatingRef.current) {
        setIsNavigating(true);
      }
    });
    
    navigationStart.current = performance.now();
    
    // Mark performance
    markNavigationStart('page-navigation');
    
    // Tell sound system we're navigating
    soundEffects.setNavigating(true);
    
    // Remove transition sound when changing pages
    // soundEffects.playTransition();
  }, [clearNavigationTimeouts]);
  
  // End navigation process - don't call setState directly, use ref instead
  const endNavigation = useCallback((delay = 0) => {
    // Reduced delay to 0 for immediate navigation completion
    navigationTimeout.current = setTimeout(() => {
      // Set ref state first
      isNavigatingRef.current = false;
      
      // Then safely update React state
      setIsNavigating(false);
      
      // Tell sound system navigation is complete
      soundEffects.setNavigating(false);
      
      // Mark performance end
      markNavigationEnd('page-navigation');
      
      // Calculate navigation time in debug mode
      if (process.env.NODE_ENV === 'development') {
        const navTime = performance.now() - navigationStart.current;
        console.debug(`Navigation completed in ${navTime.toFixed(2)}ms`);
      }
      
      navigationTimeout.current = null;
    }, delay);
  }, []);
  
  // Set up navigation state change listener for global events
  useEffect(() => {
    const handleNavigationStart = () => {
      startNavigation();
    };
    
    const handleNavigationEnd = () => {
      endNavigation();
    };
    
    // Listen for navigation events
    window.addEventListener('navigationstart', handleNavigationStart);
    window.addEventListener('routechangecomplete', handleNavigationEnd);
    
    // Create custom history state handler for SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(data: any, unused: string, url?: string | URL | null) {
      // Only trigger for actual page changes, not hash changes on same page
      const newUrl = url?.toString() || '';
      const currentPath = window.location.pathname;
      const newPath = newUrl.split('#')[0];
      
      // Only handle actual page changes, not hash changes
      if (newPath && newPath !== currentPath) {
        handleNavigationStart();
      }
      
      const result = originalPushState.call(this, data, unused, url);
      
      // Simulate navigation end after a brief delay for non-hash changes
      if (newPath && newPath !== currentPath) {
        setTimeout(handleNavigationEnd, 50); // Reduced delay from 300 to 50
      }
      
      return result;
    };
    
    history.replaceState = function(data: any, unused: string, url?: string | URL | null) {
      // Same logic as pushState
      const newUrl = url?.toString() || '';
      const currentPath = window.location.pathname;
      const newPath = newUrl.split('#')[0];
      
      if (newPath && newPath !== currentPath) {
        handleNavigationStart();
      }
      
      const result = originalReplaceState.call(this, data, unused, url);
      
      if (newPath && newPath !== currentPath) {
        setTimeout(handleNavigationEnd, 50); // Reduced delay from 300 to 50
      }
      
      return result;
    };
    
    // Clean up event listeners and restore methods
    return () => {
      window.removeEventListener('navigationstart', handleNavigationStart);
      window.removeEventListener('routechangecomplete', handleNavigationEnd);
      clearNavigationTimeouts();
      
      // Restore original methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [startNavigation, endNavigation, clearNavigationTimeouts]);
  
  // Watch for pathname changes to detect navigation completion
  useEffect(() => {
    // If pathname changes, that means we've completed navigation
    isNavigatingRef.current = false;
    setIsNavigating(false);
    soundEffects.setNavigating(false);
  }, [pathname]);
  
  // Optimized navigate function with special handling for homepage sections
  const navigate = useCallback((href: string, options: {scroll?: boolean, skipTransition?: boolean} = {}) => {
    // Handle hash navigation on the homepage specially
    if (href.includes('#') && pathname === '/' && href.startsWith('/#')) {
      const targetId = href.substring(href.indexOf('#') + 1);
      const element = document.getElementById(targetId);
      
      if (element) {
        // Start a simplified navigation process for same-page section
        isNavigatingRef.current = true;
        setIsNavigating(true);
        
        // We don't need to call setNavigating(true) for the sound system
        // for same-page navigation, but we'll play a quiet transition
        if (!options.skipTransition) {
          soundEffects.playClick('soft');
        }
        
        // Calculate offset for fixed header
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        // Smooth scroll
        window.scrollTo({
          top: offsetPosition,
          behavior: options.scroll === false ? "auto" : "smooth"
        });
        
        // End navigation process after scroll animation
        setTimeout(() => {
          isNavigatingRef.current = false;
          setIsNavigating(false);
        }, 400);
        
        // Update URL without reload
        history.pushState(null, '', href);
        
        return;
      }
    }
    
    // For actual page changes, use the router directly and immediately
    startNavigation();
    
    // Force immediate navigation without waiting for any animations or delays
    setTimeout(() => {
      router.push(href);
    }, 0); // Adding a minimal timeout to ensure router.push runs after any other pending updates
  }, [pathname, router, startNavigation]);
  
  return {
    isNavigating,
    navigate,
    pathname,
    startNavigation,
    endNavigation
  };
};

export default useNavigation; 