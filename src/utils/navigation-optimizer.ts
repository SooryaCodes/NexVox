'use client';

/**
 * Basic navigation optimization for NexVox
 * Simple prefetching without complex event handling
 */

// Key routes to prefetch
const CRITICAL_ROUTES = [
  '/',
  '/rooms',
  "/profile",
  "/settings",
  "/chats",
  "/friends",
  "/requests",
  '/rooms/create',
  "/rooms/[id]",
  '/login',
  '/register'
];

// Simple path prefetching
export const prefetchRoutes = () => {
  if (typeof window === 'undefined') return;
  
  // Basic prefetch using standard link rel
  CRITICAL_ROUTES.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  });
};

// Initialize prefetching
export const setupNavigationOptimizations = () => {
  // Run basic prefetching
  prefetchRoutes();
  
  // Ensure dark background for smoother transitions
  if (typeof document !== 'undefined') {
    document.body.style.backgroundColor = '#000';
  }
  
  return true;
};

export default setupNavigationOptimizations; 