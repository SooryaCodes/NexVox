'use client';

/**
 * Navigation Optimizer for NexVox
 * Preloads critical resources and optimizes navigation performance
 */

const COMMON_ROUTES = [
  '/rooms',
  '/rooms/[id]',
  '/rooms/create',
  '/profile',
  '/register', 
  '/login',
  '/settings'
];

// Asset preloading
const preloadAsset = (url: string, as: 'image' | 'style' | 'script' | 'font' | 'fetch' = 'image') => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  
  document.head.appendChild(link);
};

// Route prefetching
const prefetchRoute = (path: string) => {
  if (typeof window === 'undefined') return;
  
  // Create a preload link
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  document.head.appendChild(link);
  
  // Also fetch the route data
  try {
    fetch(path, { method: 'HEAD', priority: 'low' }).catch(() => {});
  } catch (e) {
    // Ignore errors with prefetching
  }
};

// Initialize preloading for critical routes
export const initializeNavigationOptimizer = () => {
  // Don't run on server
  if (typeof window === 'undefined') return;
  
  // Delay preloading to not block initial page load
  setTimeout(() => {
    // Preload common routes
    COMMON_ROUTES.forEach(route => {
      prefetchRoute(route);
    });
    
    // Preload critical assets
    preloadAsset('/audios/transition.mp3', 'fetch');
    preloadAsset('/audios/digital-click.mp3', 'fetch');
  }, 3000); // 3 second delay to not interfere with initial render
};

// Fast navigation manager - enable optimistic transitions
export const setupFastNavigation = () => {
  if (typeof window === 'undefined') return;
  
  // Monitor all link clicks for navigation
  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.href && link.href.startsWith(window.location.origin)) {
      // It's an internal link - prepare navigation optimistically
      const url = new URL(link.href);
      
      // Clear any old page transition loaders
      document.querySelectorAll('.page-transition-loader').forEach(el => el.remove());
      
      // If we're not navigating to the current page
      if (url.pathname !== window.location.pathname) {
        // Create a subtle loader
        const loader = document.createElement('div');
        loader.className = 'page-transition-loader';
        loader.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, #00FFFF, #FF00E6);
          z-index: 10000;
          animation: loadingBarAnimation 1s ease-in-out infinite;
        `;
        
        // Add the animation
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes loadingBarAnimation {
            0% { transform: scaleX(0); transform-origin: left; }
            50% { transform: scaleX(1); transform-origin: left; }
            50.1% { transform-origin: right; }
            100% { transform: scaleX(0); transform-origin: right; }
          }
        `;
        document.head.appendChild(style);
        document.body.appendChild(loader);
        
        // Remove the loader after navigation or timeout
        setTimeout(() => {
          loader.remove();
        }, 3000);
      }
    }
  }, { passive: true });
};

// Export a function to initialize all optimizations
export const setupNavigationOptimizations = () => {
  initializeNavigationOptimizer();
  setupFastNavigation();
};

export default setupNavigationOptimizations; 