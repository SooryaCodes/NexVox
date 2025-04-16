"use client";

import { useEffect } from 'react';
import { initializeBackgrounds, reinitializeBackgrounds, forceRepaint } from '../utils/backgroundInitHelper';

/**
 * Component that ensures background elements and animations are properly 
 * initialized and visible when the page loads
 */
export default function BackgroundInitializer() {
  useEffect(() => {
    // Initialize backgrounds immediately
    initializeBackgrounds();
    
    // Handle AOS interference - force backgrounds to be visible after AOS initializes
    const forceBgVisibility = () => {
      // Target all background elements that might be affected
      const gridElements = document.querySelectorAll('.bg-grid');
      const pulseElements = document.querySelectorAll('.animate-pulse, .animate-pulse-slow, .animate-pulse-slower');
      const neonElements = document.querySelectorAll('[class*="shadow-[0_0_"]');
      
      // Force grid patterns to be visible
      gridElements.forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundImage = `
          linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
        `;
        element.style.backgroundSize = '30px 30px';
        forceRepaint(element);
      });
      
      // Force animations to be active
      pulseElements.forEach(el => {
        const element = el as HTMLElement;
        const hasSlowClass = element.classList.contains('animate-pulse-slow');
        const hasSlowerClass = element.classList.contains('animate-pulse-slower');
        
        // Force animation restart
        element.style.animation = 'none';
        void element.offsetWidth; // Trigger reflow
        
        // Re-apply appropriate animation
        if (hasSlowerClass) {
          element.style.animation = 'pulse-slower 12s ease-in-out infinite';
        } else if (hasSlowClass) {
          element.style.animation = 'pulse-slow 8s ease-in-out infinite';
        } else {
          element.style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';
        }
        
        // Ensure visibility
        element.style.opacity = '1';
        element.classList.add('animation-active');
      });
      
      // Force neon shadows to be visible
      neonElements.forEach(el => {
        const element = el as HTMLElement;
        forceRepaint(element);
      });
    };
    
    // Run multiple times to ensure backgrounds are visible
    forceBgVisibility();
    
    // Run again after AOS has initialized (with staggered timeouts)
    const timeouts = [100, 300, 500, 1000, 2000].map(delay => 
      setTimeout(() => {
        reinitializeBackgrounds();
        forceBgVisibility();
      }, delay)
    );
    
    // Run after window load event
    window.addEventListener('load', forceBgVisibility);
    
    // Detect if page visibility changes (tab becomes active)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        forceBgVisibility();
      }
    });
    
    // Clean up
    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('load', forceBgVisibility);
      document.removeEventListener('visibilitychange', forceBgVisibility);
    };
  }, []);

  // This component doesn't render anything
  return null;
} 