"use client";

import { useEffect } from 'react';
import AOS from 'aos';

const AOSInit = () => {
  useEffect(() => {
    AOS.init({
      // Global settings
      duration: 800, // Animation duration
      easing: 'ease-out-cubic', // Default easing
      once: true, // Whether animation should happen only once
      offset: 50, // Offset (in px) from the original trigger point
      delay: 0, // Default delay
      mirror: false, // Whether elements should animate out while scrolling past them
      anchorPlacement: 'top-bottom', // Define which position of the element regarding to window should trigger the animation
      disable: 'mobile' // Disables animation on mobile devices with width less than 768px
    });
  }, []);

  return null; // This component doesn't render anything
};

export default AOSInit; 