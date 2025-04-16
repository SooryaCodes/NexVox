"use client";

import { useEffect } from 'react';
import AOS from 'aos';

/**
 * Component that initializes AOS (Animate On Scroll) library
 * with optimized settings that don't interfere with backgrounds
 */
const AOSInit = () => {
  useEffect(() => {
    // Initialize AOS with settings that won't disrupt backgrounds
    AOS.init({
      duration: 500,
      easing: 'ease-out-cubic',
      once: false, 
      mirror: true,
      offset: 50,
      delay: 0,
      // Allow AOS on mobile but with adjusted settings
      disable: false
    });

    // Setup function to handle section backgrounds directly
    const fixSectionBackgrounds = () => {
      // Features section
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.style.backgroundImage = `
          linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px)`;
        featuresSection.style.backgroundSize = '30px 30px';
      }
      
      // Set all grid backgrounds directly
      document.querySelectorAll('.bg-grid').forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundImage = `
          linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px)`;
        element.style.backgroundSize = '30px 30px';
      });
      
      // Set all animated dots to be visible
      document.querySelectorAll('.rounded-full').forEach(el => {
        if ((el as HTMLElement).classList.contains('animate-pulse') ||
            (el as HTMLElement).classList.contains('animate-pulse-slow') ||
            (el as HTMLElement).classList.contains('animate-pulse-slower')) {
          (el as HTMLElement).style.opacity = '1';
        }
      });
      
      // Ensure animated lines are visible
      document.querySelectorAll('.w-px').forEach(el => {
        if ((el as HTMLElement).classList.contains('animate-pulse') ||
            (el as HTMLElement).classList.contains('animate-pulse-slow') ||
            (el as HTMLElement).classList.contains('animate-pulse-slower')) {
          (el as HTMLElement).style.opacity = '1';
        }
      });
      
      // Refresh AOS after manually fixing backgrounds
      AOS.refresh();
    };
    
    // Run the fix function with delays to catch everything
    fixSectionBackgrounds();
    setTimeout(fixSectionBackgrounds, 100);
    setTimeout(fixSectionBackgrounds, 500);
    
    // Add event listeners to ensure backgrounds are preserved
    window.addEventListener('resize', fixSectionBackgrounds);
    window.addEventListener('load', fixSectionBackgrounds);
    
    // Properly clean up event listeners
    return () => {
      window.removeEventListener('resize', fixSectionBackgrounds);
      window.removeEventListener('load', fixSectionBackgrounds);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AOSInit; 