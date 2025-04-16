"use client";

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollTriggerSetup() {
  useEffect(() => {
    // Register the ScrollTrigger plugin
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Set up smooth scrolling
      document.documentElement.style.scrollBehavior = 'smooth';
      
      // Default ScrollTrigger configuration
      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
      });
      
      // Set up default markers for development (disable in production)
      ScrollTrigger.defaults({
        markers: process.env.NODE_ENV === 'development' ? false : false,
        toggleActions: 'play none none reverse'
      });
      
      // Refresh ScrollTrigger when the page is fully loaded
      window.addEventListener('load', () => {
        ScrollTrigger.refresh();
      });
    }
    
    // Clean up function
    return () => {
      // Reset scroll behavior
      if (typeof window !== 'undefined') {
        document.documentElement.style.scrollBehavior = '';
        
        // Kill all ScrollTrigger instances
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        ScrollTrigger.clearMatchMedia();
      }
    };
  }, []);
  
  return null;
} 