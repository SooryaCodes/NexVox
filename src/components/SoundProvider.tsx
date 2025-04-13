import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import soundEffects from '@/utils/soundEffects';

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

  // Apply sound settings when they change
  useEffect(() => {
    soundEffects.setEnabled(soundsEnabled);
  }, [soundsEnabled]);

  useEffect(() => {
    soundEffects.setVolume(volume);
  }, [volume]);

  // Initialize page transition sounds
  useEffect(() => {
    const handleRouteChangeStart = () => {
      soundEffects.play('transition');
    };

    // Initialize with browser history API for SPA
    // This could be integrated with Next.js Router in a real implementation
    window.addEventListener('popstate', handleRouteChangeStart);

    return () => {
      window.removeEventListener('popstate', handleRouteChangeStart);
    };
  }, []);

  // Function to play a sound by name
  const playSound = useCallback((name: string) => {
    soundEffects.play(name);
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
    soundEffects.play('click');
  };

  return (
    <button
      onClick={toggleSound}
      className="flex items-center justify-center p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:border-[#00FFFF]/50 transition-colors"
      aria-label={soundsEnabled ? "Mute sounds" : "Enable sounds"}
    >
      {soundsEnabled ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.95 5.05a9 9 0 010 13.9M4.582 9.582C3.29 10.874 3.29 13.126 4.582 14.418c1.292 1.292 3.544 1.292 4.836 0M6 18l8-8 6 6" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15.414a2 2 0 11-2.828-2.828L5.586 15.414zM15 5l-7 7-3-3 7-7 3 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2 2m0 0l2 2m-2-2l-2 2m0 0l-2-2m2 2l2-2m0 0l-2-2" />
        </svg>
      )}
    </button>
  );
};

export default SoundProvider; 