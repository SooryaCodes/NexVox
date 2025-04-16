"use client";

/**
 * Utility functions for ensuring background elements are properly visible
 */

/**
 * Forces a repaint of an element to ensure animations are displayed
 * @param element - The HTML element to repaint
 */
export const forceRepaint = (element: HTMLElement): void => {
  const originalDisplay = element.style.display;
  element.style.display = 'none';
  void element.offsetHeight; // Trigger reflow
  element.style.display = originalDisplay;
};

/**
 * Kicks off animations by manipulating the animation property
 * @param element - The HTML element to animate
 */
export const kickstartAnimation = (element: HTMLElement): void => {
  const originalAnimation = element.style.animation;
  element.style.animation = 'none';
  void element.offsetHeight; // Trigger reflow
  element.style.animation = originalAnimation || '';
  
  // Add a class that ensures the animation is active
  element.classList.add('animation-active');
};

/**
 * Reinitializes background elements on the page
 * @param rootSelector - CSS selector for the root element containing backgrounds
 */
export const reinitializeBackgrounds = (rootSelector: string = 'body'): void => {
  const root = document.querySelector(rootSelector);
  if (!root) return;
  
  // Get all background elements
  const gridElements = root.querySelectorAll('.bg-grid');
  const animatedElements = root.querySelectorAll('.animate-pulse, .animate-pulse-slow, .animate-pulse-slower, .bg-dot-pattern, .gradient-background, .glow-effect, .radial-background');
  const shadowElements = root.querySelectorAll('[class*="shadow-[0_0_"]');
  
  // Force repaint on grid elements
  gridElements.forEach(el => forceRepaint(el as HTMLElement));
  
  // Process each animated element with enhanced technique
  animatedElements.forEach(el => {
    const element = el as HTMLElement;
    
    // Store original animation and classes
    const originalAnimation = element.style.animation;
    const originalClassName = element.className;
    
    // Force reflow by temporarily removing animation
    element.style.animation = 'none';
    element.classList.add('force-reflow');
    
    // Trick browser into forcing a reflow
    void element.offsetWidth;
    
    // Restore original animation settings after a short delay
    setTimeout(() => {
      element.style.animation = originalAnimation;
      element.className = originalClassName + ' animation-active';
    }, 10);
  });
  
  // Force repaint on shadow elements
  shadowElements.forEach(el => forceRepaint(el as HTMLElement));
};

/**
 * Initializes background elements and sets up event listeners
 * Fixes issues with background patterns and animations not appearing on initial page load
 */
export const initializeBackgrounds = (): void => {
  const init = () => reinitializeBackgrounds();
  
  // Initialize immediately
  if (typeof window !== 'undefined') {
    // Run on DOM content loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
    
    // Run after window load
    window.addEventListener('load', init);
    
    // Run after a short delay
    setTimeout(init, 100);
    
    // Set up window resize event listener (if not already set)
    if (!window.hasOwnProperty('_backgroundListenerAdded')) {
      window.addEventListener('resize', init);
      // Mark that we've added the listener to avoid duplicates
      (window as any)._backgroundListenerAdded = true;
    }
  }
};

export default initializeBackgrounds; 