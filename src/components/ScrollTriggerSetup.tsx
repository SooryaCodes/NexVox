"use client";

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    // Set up smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Clean up function
    return () => {
      // Reset scroll behavior
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
  
  return null;
} 