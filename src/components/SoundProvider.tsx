'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import soundEffects from '@/utils/soundEffects';
import { usePathname } from 'next/navigation';
import { debounce } from '@/utils/performance';

// Create a context for sound settings
type SoundContextType = {
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  playSound: (name: string) => void;
};

const SoundContext = createContext<SoundContextType>({
  soundsEnabled: true,
  setSoundsEnabled: () => {},
  volume: 0.5,
  setVolume: () => {},
  playSound: () => {},
});

// Custom hook to use sound context
export const useSoundContext = () => useContext(SoundContext);

// Sound Provider component
export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [lastPathname, setLastPathname] = useState('');
  const pathname = usePathname();
  const isHome = pathname === '/';
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Apply sound settings when they change
  useEffect(() => {
    soundEffects.setEnabled(soundsEnabled);
  }, [soundsEnabled]);

  useEffect(() => {
    soundEffects.setVolume(volume);
  }, [volume]);

  // Detect navigation and play transition sound
  useEffect(() => {
    if (lastPathname && pathname !== lastPathname) {
      // Only for major navigation changes (ignore hash changes)
      if (!pathname.includes('#') && !lastPathname.includes('#')) {
        // Pathname changed, indicating navigation
        soundEffects.setNavigating(true);
        
        // On homepage transitions, add a special effect
        if (pathname === '/' || lastPathname === '/') {
          // Remove transition sound
          // soundEffects.playTransition();
        } else {
          // Regular page transition
          // soundEffects.playTransition();
        }
        
        // Reset navigation state after transition
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
        }
        
        navigationTimeoutRef.current = setTimeout(() => {
          soundEffects.setNavigating(false);
          navigationTimeoutRef.current = null;
        }, 350);
      }
    }
    
    setLastPathname(pathname);
    
    // Clean up timeout
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
    };
  }, [pathname, lastPathname]);

  // Initialize page transition sounds with optimized handlers
  useEffect(() => {
    // Create a debounced version of the transition handler
    let navigationDebounceTimer: NodeJS.Timeout | null = null;
    
    const handleRouteChangeStart = debounce(() => {
      // Prevent duplicate sounds
      if (navigationDebounceTimer) {
        clearTimeout(navigationDebounceTimer);
      }
      
      navigationDebounceTimer = setTimeout(() => {
        soundEffects.setNavigating(true);
        // Remove transition sound
        // soundEffects.playTransition();
      }, 50);
    }, 100);
    
    const handleRouteChangeComplete = debounce(() => {
      if (navigationDebounceTimer) {
        clearTimeout(navigationDebounceTimer);
      }
      
      // Delay to allow for animations to complete
      navigationDebounceTimer = setTimeout(() => {
        soundEffects.setNavigating(false);
      }, 300);
    }, 100);

    // Initialize with browser history API for SPA
    window.addEventListener('popstate', handleRouteChangeStart);
    
    // Clean up
    return () => {
      window.removeEventListener('popstate', handleRouteChangeStart);
      if (navigationDebounceTimer) {
        clearTimeout(navigationDebounceTimer);
      }
    };
  }, []);

  // Function to play a sound by name with optimization
  const playSound = useCallback((name: string) => {
    // Prevent sounds during navigation except for transition sounds
    if (!name.includes('transition') && soundEffects['isNavigating']) {
      return;
    }
    
    // Use dedicated sound method if available
    switch (name) {
      case 'click':
        soundEffects.playClick();
        break;
      case 'hover':
        soundEffects.playHover();
        break;
      case 'transition':
        // Disabled transition sounds
        // soundEffects.playTransition();
        break;
      case 'success':
        soundEffects.playSuccess();
        break;
      case 'error':
        soundEffects.playError();
        break;
      default:
        soundEffects.play(name);
    }
  }, []);

  // Create the context value
  const contextValue = {
    soundsEnabled,
    setSoundsEnabled,
    volume,
    setVolume,
    playSound,
  };

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};

// Sound toggle button component
export const SoundToggle: React.FC = () => {
  const { soundsEnabled, setSoundsEnabled } = useSoundContext();

  const toggleSound = () => {
    setSoundsEnabled(!soundsEnabled);
    
    // Play sound after toggling (will only be heard when turning on)
    if (!soundsEnabled) {
      setTimeout(() => soundEffects.playClick(), 10);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={toggleSound}
        className="flex items-center justify-center p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-[#00FFFF]/20 hover:border-[#00FFFF]/50 transition-all duration-300 hover:bg-[#00FFFF]/10 shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]"
        aria-label={soundsEnabled ? "Mute sounds" : "Enable sounds"}
      >
        {soundsEnabled ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00FFFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 6L8 10H4V14H8L12 18V6Z" fill="none" />
            <path d="M17.5 12C17.5 10.57 16.83 9.3 15.8 8.5" stroke="currentColor" strokeLinecap="round" />
            <path d="M21 12C21 8.17 18.52 4.96 15.2 4" stroke="currentColor" strokeLinecap="round" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF00E6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 6L8 10H4V14H8L12 18V6Z" fill="none" />
            <path d="M16 9L20 13" stroke="currentColor" strokeLinecap="round" />
            <path d="M20 9L16 13" stroke="currentColor" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-32 p-2 bg-black/80 backdrop-blur-md rounded-md border border-[#00FFFF]/30 text-xs text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
        {soundsEnabled ? "Sound On" : "Sound Off"}
      </div>
    </div>
  );
};

export default SoundProvider; 