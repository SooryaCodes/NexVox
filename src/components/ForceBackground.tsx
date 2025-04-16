"use client";

import { useEffect } from 'react';
import executeAllBackgroundFixes, { forceAllBackgrounds } from '@/utils/backgroundForcer';

/**
 * Component that forces all backgrounds to be visible immediately
 * This is the most aggressive approach to fix AOS issues with background elements
 */
export default function ForceBackground() {
  useEffect(() => {
    // Run immediately
    executeAllBackgroundFixes();
    
    // Run again after a short delay to catch any potential AOS interference
    const timeouts = [10, 100, 500, 1000, 2000].map(delay =>
      setTimeout(() => {
        forceAllBackgrounds();
        
        // Manually force grid background on sections
        document.querySelectorAll('section.bg-grid').forEach(section => {
          (section as HTMLElement).style.cssText += `
            background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px) !important;
            background-size: 30px 30px !important;
          `;
        });
      }, delay)
    );
    
    // Run on window load for extra guarantee
    const handleLoad = () => {
      forceAllBackgrounds();
    };
    
    window.addEventListener('load', handleLoad);
    
    // Clean up
    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // This component doesn't render anything
  return null;
} 