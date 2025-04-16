"use client";

/**
 * This utility injects CSS directly into the document head to force backgrounds to be visible.
 * It's a last-resort approach that should make backgrounds visible regardless of other code.
 */

const cssContent = `
/* Force all backgrounds to be visible */
.bg-grid {
  background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px) !important;
  background-size: 30px 30px !important;
  z-index: 0 !important;
}

/* Force all animations to be visible and running */
.animate-pulse,
.animate-pulse-slow,
.animate-pulse-slower {
  visibility: visible !important;
  opacity: 1 !important;
  will-change: opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  animation-play-state: running !important;
}

/* Override animation keyframes */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.1 !important; }
  50% { opacity: 0.4 !important; }
}

@keyframes pulse-slower {
  0%, 100% { opacity: 0.1 !important; }
  50% { opacity: 0.3 !important; }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite !important;
}

.animate-pulse-slower {
  animation: pulse-slower 12s ease-in-out infinite !important;
}

/* Force section-specific backgrounds */
section.bg-grid,
#features,
#features-section {
  background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px) !important;
  background-size: 30px 30px !important;
}

/* Force active animation state */
.animation-active, 
.animate-pulse, 
.animate-pulse-slow, 
.animate-pulse-slower {
  animation-play-state: running !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Fix for Safari hidden animations */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  html body .animate-pulse, 
  html body .animate-pulse-slow, 
  html body .animate-pulse-slower {
    animation-play-state: running !important;
    animation-delay: -1ms !important;
    opacity: 1 !important;
  }
}
`;

export const injectBackgroundStyles = (): void => {
  if (typeof window === 'undefined') return;
  
  // Create style element if it doesn't exist
  let styleElement = document.getElementById('background-force-styles');
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'background-force-styles';
    styleElement.innerHTML = cssContent;
    document.head.appendChild(styleElement);
  } else {
    // Update content if it already exists
    styleElement.innerHTML = cssContent;
  }
};

// Self-executing function
const initStyleInjection = () => {
  if (typeof window === 'undefined') return;
  
  // Run immediately
  injectBackgroundStyles();
  
  // Run again after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBackgroundStyles);
  }
  
  // Run again on window load
  window.addEventListener('load', injectBackgroundStyles);
  
  // Run on any resize
  window.addEventListener('resize', injectBackgroundStyles);
  
  // Also run periodically for the first few seconds after load
  const delays = [100, 500, 1000, 2000, 3000];
  delays.forEach(delay => {
    setTimeout(injectBackgroundStyles, delay);
  });
};

// Execute immediately 
if (typeof window !== 'undefined') {
  initStyleInjection();
}

export default injectBackgroundStyles; 