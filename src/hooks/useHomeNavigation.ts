'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Specialized hook for handling navigation from home page
 * Uses a transition modal for certain routes that need special handling
 */
export const useHomeNavigation = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetRoute, setTargetRoute] = useState('');
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);
  const [lastNavigationTime, setLastNavigationTime] = useState(0);
  
  // Update isHomePage when pathname changes or on initial load
  useEffect(() => {
    // Also check for the URL directly in case pathname is not yet available
    const currentPath = pathname || window.location.pathname;
    setIsHomePage(currentPath === '/' || currentPath === '/#' || currentPath.startsWith('/#'));
  }, [pathname]);
  
  // Routes that need special transition handling from home page
  const specialRoutes = [
    '/rooms', 
    '/rooms/[id]',
    '/rooms/create',
    '/login', 
    '/register',
    '/profile',
    '/settings',
    '/about',
    '/faq',
    '/chats',
    '/friends',
    '/explore',
    '/events',
    '/support'
  ];
  
  // Immediately fixes any stuck scroll locks - called on page load
  useEffect(() => {
    // Emergency cleanup for any stuck scroll locks
    document.body.style.overflow = '';
    
    return () => {
      // Always clean up when unmounting
      document.body.style.overflow = '';
    };
  }, []);
  
  // Navigation handler
  const navigateTo = useCallback((route: string) => {
    // Skip if already transitioning
    if (isTransitioning) return true;
    
    // Prevent rapid repeated navigation (avoid double-clicks or multiple navigations)
    const now = Date.now();
    if (now - lastNavigationTime < 800) return true;
    setLastNavigationTime(now);
    
    // Ensure route is in the proper format
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
    
    // Check if we need special transition
    const needsSpecialTransition = (
      // Always use transition on home page for special routes
      (isHomePage && specialRoutes.some(r => normalizedRoute === r || normalizedRoute.startsWith(`${r}/`))) ||
      
      // Also handle any non-hash routes from home page
      (isHomePage && !normalizedRoute.includes('#') && normalizedRoute !== '/') ||
      
      // For transitions between special routes (even if not from home)
      (!isHomePage && specialRoutes.includes(pathname || '') && 
       specialRoutes.some(r => normalizedRoute === r || normalizedRoute.startsWith(`${r}/`)))
    );
    
    if (needsSpecialTransition) {
      // Prepare the document for transition - can help with smoother transitions
      document.body.style.overflow = 'hidden';
      
      // Show transition modal and set target route
      setTargetRoute(normalizedRoute);
      setIsTransitioning(true);
      return true; // Navigation was handled
    }
    
    // For normal routes or hash navigation, don't use special handling
    return false;
  }, [isHomePage, isTransitioning, specialRoutes, pathname, lastNavigationTime]);
  
  // Complete transition handler
  const completeTransition = useCallback(() => {
    // Restore document scroll
    document.body.style.overflow = '';
    
    // Reset state with a small delay to ensure animations complete
    setTimeout(() => {
      setIsTransitioning(false);
      setTargetRoute('');
      
      // Check for pending room navigation
      const pendingRoomId = sessionStorage.getItem('pendingRoomNavigation');
      if (pendingRoomId) {
        // Clear the storage
        sessionStorage.removeItem('pendingRoomNavigation');
        
        // Perform the navigation to the specific room
        setTimeout(() => {
          window.location.href = `/rooms/${pendingRoomId}`;
        }, 100);
      }
    }, 300);
  }, []);
  
  return {
    navigateTo,
    isTransitioning,
    targetRoute,
    completeTransition,
    isHomePage
  };
};

export default useHomeNavigation; 