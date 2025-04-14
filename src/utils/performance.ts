/**
 * Performance utilities for improving responsiveness
 */

// Debounce function to prevent excessive calls
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<F>): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Throttle function to limit call frequency
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let lastCall = 0;
  let lastCallTimer: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<F>): void {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    // If enough time has passed since last call
    if (timeSinceLastCall >= waitFor) {
      if (lastCallTimer !== null) {
        clearTimeout(lastCallTimer);
        lastCallTimer = null;
      }
      
      lastCall = now;
      return func(...args);
    } else {
      // If we're still in cooldown period, schedule a call
      if (lastCallTimer === null) {
        lastCallTimer = setTimeout(() => {
          lastCall = Date.now();
          lastCallTimer = null;
          func(...args);
        }, waitFor - timeSinceLastCall);
      }
    }
  };
};

// RAF-based debouncer for animation-related calls
export const rafDebounce = <F extends (...args: any[]) => any>(
  func: F
): ((...args: Parameters<F>) => void) => {
  let rafId: number | null = null;

  return function(...args: Parameters<F>): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    
    rafId = requestAnimationFrame(() => {
      rafId = null;
      func(...args);
    });
  };
};

// Sleep utility for controlled delays
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Batch multiple DOM operations to reduce reflows
export class DOMBatcher {
  private operations: (() => void)[] = [];
  private rafScheduled = false;

  add(operation: () => void): void {
    this.operations.push(operation);
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (!this.rafScheduled) {
      this.rafScheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  private flush(): void {
    const ops = [...this.operations];
    this.operations = [];
    this.rafScheduled = false;
    
    // Execute all operations in a single frame
    ops.forEach(op => op());
  }
}

// Create a singleton batcher
export const domBatcher = new DOMBatcher();

// Navigation performance helpers
export function markNavigationStart(name: string = 'navigation'): void {
  if (typeof performance !== 'undefined') {
    performance.mark(`${name}-start`);
  }
}

export function markNavigationEnd(name: string = 'navigation'): void {
  if (typeof performance !== 'undefined') {
    performance.mark(`${name}-end`);
    performance.measure(
      `${name}-duration`,
      `${name}-start`,
      `${name}-end`
    );
  }
}

// Helper to identify slow operations
export async function measure<T>(
  name: string, 
  fn: () => T | Promise<T>
): Promise<T> {
  markNavigationStart(name);
  const result = await fn();
  markNavigationEnd(name);
  
  // Log if slow
  const entries = performance.getEntriesByName(`${name}-duration`);
  if (entries.length > 0) {
    const duration = entries[0].duration;
    if (duration > 100) {
      console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`);
    }
  }
  
  return result;
} 