"use client";

import { useEffect } from 'react';
import AOS from 'aos';

const AOSInit = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      // Global settings
      duration: 800, // Animation duration
      easing: 'ease-out-cubic', // Default easing
      once: false, // Allow animations to occur multiple times
      offset: 50, // Offset (in px) from the original trigger point
      delay: 0, // Default delay
      mirror: true, // Elements should animate out while scrolling past them
      anchorPlacement: 'top-bottom', // Define which position of the element regarding to window should trigger the animation
      disable: false // Enable animations on all devices
    });

    // Force refresh AOS after a short delay for initial load
    setTimeout(() => {
      AOS.refresh();
    }, 100);

    // Listen for window resize events and refresh AOS
    const handleResize = () => {
      AOS.refresh();
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AOSInit; 