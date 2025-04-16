'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Simple navigation hook for NexVox
 */
export function useNavigation() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Simple navigation function
  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    // Handle external links
    if (to.startsWith('http')) {
      window.open(to, '_blank', 'noopener');
      return;
    }

    // Handle hash navigation (to enable smooth scrolling)
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      const currentPath = window.location.pathname;
      
      // If only changing hash on same page
      if (path === '' || path === currentPath) {
        const element = document.getElementById(hash);
        if (element) {
          // Smooth scroll to element
          element.scrollIntoView({ behavior: 'smooth' });
          
          // Update URL without full navigation
          window.history.pushState({}, '', to);
          return;
        }
      }
    }

    // Set navigating state
    setIsNavigating(true);
    
    // Execute navigation
    try {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
      
      // Reset navigation state after a short delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  }, [router]);

  return { navigate, isNavigating };
}

export default useNavigation; 