"use client";

import { forceRepaint } from './backgroundInitHelper';

/**
 * Ultra-aggressive background forcing utility that monitors DOM changes
 * and ensures backgrounds are always visible
 */

// Apply forceful styles directly to an element
const forceBackgroundOnElement = (element: HTMLElement): void => {
  // Handle grid backgrounds
  if (element.classList.contains('bg-grid')) {
    element.style.cssText += `
      background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px) !important;
      background-size: 30px 30px !important;
      z-index: 0;
    `;
    forceRepaint(element);
  }
  
  // Handle animations
  if (element.classList.contains('animate-pulse') || 
      element.classList.contains('animate-pulse-slow') || 
      element.classList.contains('animate-pulse-slower')) {
    
    // Make element visible
    element.style.opacity = '1';
    
    // Determine animation type
    const animClass = element.classList.contains('animate-pulse-slower') ? 'pulse-slower' : 
                     element.classList.contains('animate-pulse-slow') ? 'pulse-slow' : 'pulse';
    
    // Reset animation
    element.style.animation = 'none';
    void element.offsetWidth; // Force reflow
    
    // Apply animation directly with !important
    if (animClass === 'pulse-slower') {
      element.style.cssText += `animation: pulse-slower 12s ease-in-out infinite !important;`;
    } else if (animClass === 'pulse-slow') {
      element.style.cssText += `animation: pulse-slow 8s ease-in-out infinite !important;`;
    } else {
      element.style.cssText += `animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;`;
    }
    
    // Ensure animation is active
    element.classList.add('animation-active');
  }
};

// Force backgrounds on all relevant elements in the document
export const forceAllBackgrounds = (): void => {
  // Process grid backgrounds
  document.querySelectorAll('.bg-grid').forEach(el => {
    forceBackgroundOnElement(el as HTMLElement);
  });
  
  // Process animated elements
  document.querySelectorAll('.animate-pulse, .animate-pulse-slow, .animate-pulse-slower').forEach(el => {
    forceBackgroundOnElement(el as HTMLElement);
  });
  
  // Process each section
  document.querySelectorAll('section').forEach(section => {
    if (section.classList.contains('bg-grid')) {
      forceBackgroundOnElement(section as HTMLElement);
    }
    
    // Process animated elements within sections
    section.querySelectorAll('.animate-pulse, .animate-pulse-slow, .animate-pulse-slower').forEach(el => {
      forceBackgroundOnElement(el as HTMLElement);
    });
  });
};

// Set up DOM observation to catch newly added elements
export const setupBackgroundObserver = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  // Create observer instance
  const observer = new MutationObserver((mutations) => {
    let shouldForceAll = false;
    
    mutations.forEach(mutation => {
      // If nodes were added, check if they need background forcing
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Check if element itself needs forcing
            if (element.classList?.contains('bg-grid') || 
                element.classList?.contains('animate-pulse') || 
                element.classList?.contains('animate-pulse-slow') || 
                element.classList?.contains('animate-pulse-slower')) {
              forceBackgroundOnElement(element);
            }
            
            // Check if it's a container that might have background elements
            if (element.tagName === 'SECTION' || 
                element.id === 'features' || 
                element.classList?.contains('relative')) {
              shouldForceAll = true;
            }
          }
        });
      }
    });
    
    // If a major container was added, force all backgrounds
    if (shouldForceAll) {
      forceAllBackgrounds();
    }
  });
  
  // Start observing
  observer.observe(document.body, { 
    childList: true, 
    subtree: true, 
    attributes: true,
    attributeFilter: ['class', 'style']
  });
  
  // Return disconnect function
  return () => observer.disconnect();
};

// Function to execute all background forcing with repeated attempts
export const executeAllBackgroundFixes = (): void => {
  // Force immediately
  forceAllBackgrounds();
  
  // Set up observer
  const cleanup = setupBackgroundObserver();
  
  // Schedule multiple attempts with increasing delays
  const delays = [10, 50, 100, 300, 500, 1000, 2000, 3000];
  const timeouts = delays.map(delay => setTimeout(forceAllBackgrounds, delay));
  
  // Clean up automatically after sufficient time has passed
  const finalTimeout = setTimeout(() => {
    cleanup();
    timeouts.forEach(clearTimeout);
  }, 10000);
  
  // Store cleanup reference on window to prevent duplicate observers
  (window as any).__backgroundFixerCleanup = () => {
    cleanup();
    timeouts.forEach(clearTimeout);
    clearTimeout(finalTimeout);
  };
};

// Auto-run on import
if (typeof window !== 'undefined') {
  // Clean up previous observer if it exists
  if ((window as any).__backgroundFixerCleanup) {
    (window as any).__backgroundFixerCleanup();
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeAllBackgroundFixes);
  } else {
    executeAllBackgroundFixes();
  }
  
  // Also run on load event
  window.addEventListener('load', executeAllBackgroundFixes);
}

export default executeAllBackgroundFixes; 