'use client';

/**
 * High-Performance Navigation Optimizer for NexVox
 * Implements aggressive prefetching and instant navigation
 */

// Includes all critical routes
const CRITICAL_ROUTES = [
  '/',
  '/rooms',
  '/rooms/[id]',
  '/rooms/create',
  '/profile',
  '/register', 
  '/login',
  '/settings',
  '/about',
  '/faq',
  '/privacy',
  '/terms'
];

// Core assets that need to be immediately available
const CORE_ASSETS = [
  '/audios/transition.mp3',
  '/audios/digital-click.mp3',
  '/audios/hover.mp3',
  '/audios/success.mp3',
  '/audios/notification.mp3'
];

// Aggressive asset preloading - highest priority
const preloadAsset = (url: string, as: 'image' | 'style' | 'script' | 'font' | 'fetch' = 'image') => {
  if (typeof window === 'undefined') return;
  
  // Remove any existing preload for this resource
  const existingLinks = document.querySelectorAll(`link[rel="preload"][href="${url}"]`);
  existingLinks.forEach(link => link.remove());
  
  // Create new high-priority preload link
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  link.setAttribute('importance', 'high');
  link.setAttribute('fetchpriority', 'high');
  
  // Add crossorigin for fonts
  if (as === 'font') {
    link.setAttribute('crossorigin', 'anonymous');
  }
  
  document.head.appendChild(link);
  
  // For critical assets, also prefetch them
  const prefetch = document.createElement('link');
  prefetch.rel = 'prefetch';
  prefetch.href = url;
  document.head.appendChild(prefetch);
  
  // For audio assets, actually preload them in memory
  if (as === 'fetch' && url.includes('.mp3')) {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;
    // Don't actually play, just load
    audio.load();
  }
};

// Ultra-fast route prefetching - no delays
const prefetchRoute = (path: string) => {
  if (typeof window === 'undefined') return;
  
  // Remove existing prefetch for this path to avoid conflicts
  const existingLinks = document.querySelectorAll(`link[rel="prefetch"][href="${path}"]`);
  existingLinks.forEach(link => link.remove());
  
  // Create a preload link with highest priority
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.setAttribute('importance', 'high');
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
  
  // Also preload the route
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.href = path;
  preload.as = 'document';
  preload.setAttribute('fetchpriority', 'high');
  document.head.appendChild(preload);
  
  // Also fetch the route data using high priority
  fetch(path, { 
    method: 'GET',
    priority: 'high',
    cache: 'force-cache',
    credentials: 'same-origin',
    headers: {
      'Purpose': 'prefetch'
    }
  }).catch(() => {
    // Silent fail - this is just preloading
  });
  
  // Also preconnect to the origin with high priority
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = window.location.origin;
  preconnect.setAttribute('crossorigin', 'anonymous');
  document.head.appendChild(preconnect);
  
  // DNS prefetch as well
  const dns = document.createElement('link');
  dns.rel = 'dns-prefetch';
  dns.href = window.location.origin;
  document.head.appendChild(dns);
};

// Initialize immediate preloading for critical routes - no delays
export const initializeNavigationOptimizer = () => {
  // Don't run on server
  if (typeof window === 'undefined') return;
  
  // Immediately preload critical resources - no timeouts
  // Preload all critical routes
  CRITICAL_ROUTES.forEach(route => {
    prefetchRoute(route);
  });
  
  // Preload core assets
  CORE_ASSETS.forEach(asset => {
    preloadAsset(asset, 'fetch');
  });
  
  // Listen for idle time to load more resources
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      // Preload additional assets during idle time
      preloadAsset('/audios/welcome.mp3', 'fetch');
    });
  }
  
  // Preconnect to critical origins
  ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(link);
  });
};

// Ultra-fast navigation handler - immediate response to clicks
export const setupInstantNavigation = () => {
  if (typeof window === 'undefined') return;
  
  // CRITICAL FIX: Implement instant navigation on link clicks
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const closestLink = target.closest('a');
    
    if (closestLink && 
        closestLink.href && 
        closestLink.href.startsWith(window.location.origin) && 
        !closestLink.hasAttribute('target')) {
        
      // Get the URL and pathname
      const url = new URL(closestLink.href);
      const targetPath = url.pathname;
      
      // Skip hash links on same page - they're handled by scroll behavior
      if (targetPath === window.location.pathname && url.hash) {
        return;
      }
      
      // Prevent default to handle navigation manually
      e.preventDefault();
      
      // Immediately dispatch navigation event
      const customEvent = new CustomEvent('navigationstart', {
        bubbles: true,
        cancelable: false
      });
      document.dispatchEvent(customEvent);
      
      // Add to browser history
      window.history.pushState({}, '', closestLink.href);
      
      // Dispatch a popstate event to trigger router navigation
      const popStateEvent = new PopStateEvent('popstate', { state: {} });
      window.dispatchEvent(popStateEvent);
      
      // Force navigation as fallback (if router doesn't respond)
      setTimeout(() => {
        window.location.href = closestLink.href;
      }, 100); // Very short timeout as last resort
    }
  }, { capture: true }); // Use capture phase to handle events before React
  
  // Clear transition loaders when page loads
  window.addEventListener('load', () => {
    document.querySelectorAll('.page-transition-loader').forEach(el => el.remove());
  });
  
  // Optimize page transitions and prevent flash of white
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Make sure background color stays black during transitions
      document.body.style.backgroundColor = '#000';
    }
  });
  
  // When document becomes visible, ensure backgrounds are still loaded
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Force grid visibility
      document.querySelectorAll('.bg-grid').forEach(el => {
        (el as HTMLElement).style.opacity = '1';
      });
    }
  });
  
  // Faster link hover preloading
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    const closestLink = target.closest('a');
    
    if (closestLink && 
        closestLink.href && 
        closestLink.href.startsWith(window.location.origin) && 
        !closestLink.hasAttribute('target')) {
        
      const url = new URL(closestLink.href);
      // Immediately prefetch on hover
      prefetchRoute(url.pathname);
    }
  }, { passive: true });
};

// Export a function to initialize all optimizations
export const setupNavigationOptimizations = () => {
  // Run immediately without any delay
  initializeNavigationOptimizer();
  setupInstantNavigation();
  
  // Ensure body background is always black for smoother transitions
  if (typeof document !== 'undefined') {
    document.body.style.backgroundColor = '#000';
  }
  
  return true; // Return success for testing
};

export default setupNavigationOptimizations; 