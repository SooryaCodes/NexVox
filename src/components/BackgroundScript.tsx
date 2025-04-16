"use client";

import Script from 'next/script';

/**
 * Injects a script directly into the head to ensure backgrounds are visible 
 * This runs before React hydration, making it the earliest possible solution
 */
export default function BackgroundScript() {
  return (
    <Script 
      id="bg-fix-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Function to force all backgrounds to be visible
            function forceBackgrounds() {
              // Force background grids
              document.querySelectorAll('.bg-grid').forEach(function(el) {
                el.style.cssText += "background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px) !important; background-size: 30px 30px !important; z-index: 0 !important;";
              });
              
              // Force animations
              document.querySelectorAll('.animate-pulse, .animate-pulse-slow, .animate-pulse-slower').forEach(function(el) {
                el.style.opacity = "1";
                el.style.visibility = "visible";
                el.style.animationPlayState = "running";
              });
              
              // Force all sections with grid background
              document.querySelectorAll('section.bg-grid').forEach(function(el) {
                el.style.cssText += "background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px) !important; background-size: 30px 30px !important;";
              });
              
              // Force features section specifically
              var features = document.getElementById('features');
              if (features) {
                features.style.cssText += "background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px) !important; background-size: 30px 30px !important;";
              }
            }
            
            // Run several times with different delays
            var delays = [0, 10, 100, 500, 1000, 2000];
            delays.forEach(function(delay) {
              setTimeout(forceBackgrounds, delay);
            });
            
            // Run on load as well
            window.addEventListener('load', forceBackgrounds);
            
            // Run on DOMContentLoaded
            document.addEventListener('DOMContentLoaded', forceBackgrounds);
            
            // Run on resize
            window.addEventListener('resize', forceBackgrounds);
          })();
        `
      }}
    />
  );
} 