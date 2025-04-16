"use client";

/**
 * Utility to safely trigger resize events to fix background visibility issues
 */

/**
 * Creates and dispatches a resize event
 * This is a safe way to trigger a resize event without actually resizing the window
 */
export const triggerResizeEvent = (): void => {
  if (typeof window !== 'undefined') {
    // Create and dispatch a resize event
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
  }
};

/**
 * Simulates a resize by modifying element styles and forcing reflow
 * This creates a layout change that causes browsers to repaint elements
 */
export const simulateLayoutChange = (): void => {
  if (typeof window !== 'undefined' && document.body) {
    // Temporarily modify the body style to force a reflow
    const originalStyle = document.body.style.cssText;
    document.body.style.paddingRight = '1px';
    
    // Force a reflow by accessing offsetHeight
    void document.body.offsetHeight;
    
    // Restore original style after a short delay
    setTimeout(() => {
      document.body.style.cssText = originalStyle;
      
      // Trigger resize event after style change
      setTimeout(triggerResizeEvent, 10);
    }, 20);
  }
};

/**
 * Multiple simulated layout changes over time
 * This method aggressively attempts to force a repaint
 */
export const multipleLayoutChanges = (count: number = 3, delay: number = 100): void => {
  if (count <= 0) return;
  
  // Perform first layout change
  simulateLayoutChange();
  
  // Schedule next one with delay
  setTimeout(() => {
    multipleLayoutChanges(count - 1, delay);
    triggerResizeEvent();
  }, delay);
};

/**
 * Comprehensive approach that uses both layout changes and resize events
 * This is the recommended method to use for fixing background visibility issues
 */
export const forceBackgroundRefresh = (): void => {
  // First trigger a resize event
  triggerResizeEvent();
  
  // Then perform multiple layout changes
  multipleLayoutChanges(5, 100);
  
  // Also apply styles directly to key elements
  setTimeout(() => {
    // Features section
    const featuresSection = document.getElementById('features');
    if (featuresSection && featuresSection.classList.contains('bg-grid')) {
      featuresSection.style.backgroundImage = `
        linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px)`;
      featuresSection.style.backgroundSize = '30px 30px';
    }
    
    // Other grid elements
    document.querySelectorAll('.bg-grid').forEach(el => {
      const element = el as HTMLElement;
      element.style.backgroundImage = `
        linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px)`;
      element.style.backgroundSize = '30px 30px';
    });
    
    // Ensure animated elements are visible
    document.querySelectorAll('.animate-pulse, .animate-pulse-slow, .animate-pulse-slower').forEach(el => {
      (el as HTMLElement).style.opacity = '1';
    });
  }, 200);
};

export default forceBackgroundRefresh; 