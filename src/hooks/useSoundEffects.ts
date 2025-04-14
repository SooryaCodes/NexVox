import { useEffect, useCallback } from 'react';
import React, { cloneElement, ReactElement } from 'react';
import soundEffects from '@/utils/soundEffects';

// Hook for easy sound effect usage in React components
export const useSoundEffects = () => {
  // Set up scroll sound effect
  useEffect(() => {
    const handleScroll = () => {
      soundEffects.playScroll();
    };

    // Use a throttled/debounced scroll listener
    const throttledScroll = () => {
      let lastScrollTime = 0;
      return () => {
        const now = Date.now();
        if (now - lastScrollTime > 800) {
          lastScrollTime = now;
          handleScroll();
        }
      };
    };

    const scrollHandler = throttledScroll();
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  // Helper functions bound to our sound effects
  const playHover = useCallback(() => soundEffects.playHover(), []);
  const playClick = useCallback((type: 'default' | 'soft' | 'heavy' | 'muted' = 'default') => 
    soundEffects.playClick(type), []);
  const playTransition = useCallback(() => soundEffects.playTransition(), []);
  const playSuccess = useCallback(() => soundEffects.playSuccess(), []);
  const playError = useCallback(() => soundEffects.playError(), []);
  const playComplete = useCallback(() => soundEffects.playComplete(), []);
  const playWhoosh = useCallback(() => soundEffects.playWhoosh(), []);

  // UI sound effects
  const playToggle = useCallback(() => soundEffects.playToggle(), []);
  const playSelect = useCallback(() => soundEffects.playSelect(), []);
  const playConfirm = useCallback(() => soundEffects.playConfirm(), []);
  const playCancel = useCallback(() => soundEffects.playCancel(), []);
  const playTab = useCallback(() => soundEffects.playTab(), []);
  const playSave = useCallback(() => soundEffects.playSave(), []);
  const playEdit = useCallback(() => soundEffects.playEdit(), []);
  const playDelete = useCallback(() => soundEffects.playDelete(), []);
  const playNotification = useCallback(() => soundEffects.playNotification(), []);
  const playAvatar = useCallback(() => soundEffects.playAvatar(), []);
  const playStatus = useCallback(() => soundEffects.playStatus(), []);
  const playTheme = useCallback(() => soundEffects.playTheme(), []);
  const playLanguage = useCallback(() => soundEffects.playLanguage(), []);
  const playPrivacy = useCallback(() => soundEffects.playPrivacy(), []);
  const playDevice = useCallback(() => soundEffects.playDevice(), []);
  const playAccessibility = useCallback(() => soundEffects.playAccessibility(), []);

  // Custom sound handler
  const playCustom = useCallback((name: string, path: string) => {
    soundEffects.loadAndPlay(name, path);
  }, []);

  // Volume control
  const setVolume = useCallback((volume: number) => {
    soundEffects.setVolume(volume);
  }, []);

  // Enable/disable all sounds
  const setSoundsEnabled = useCallback((enabled: boolean) => {
    soundEffects.setEnabled(enabled);
  }, []);

  return {
    playHover,
    playClick,
    playTransition,
    playSuccess,
    playError,
    playComplete,
    playWhoosh,
    playToggle,
    playSelect,
    playConfirm,
    playCancel,
    playTab,
    playSave,
    playEdit,
    playDelete,
    playNotification,
    playAvatar,
    playStatus,
    playTheme,
    playLanguage,
    playPrivacy,
    playDevice,
    playAccessibility,
    playCustom,
    setVolume,
    setSoundsEnabled
  };
};

// Improved type definitions for withSounds utility
type ReactMouseEvent = React.MouseEvent<HTMLElement>;
type EventHandler<E extends React.SyntheticEvent> = (event: E) => void;

interface WithSoundsOptions {
  onClick?: boolean | 'soft' | 'heavy' | 'muted';
  onHover?: boolean;
  onMouseEnter?: string;
  onMouseLeave?: string;
  custom?: { 
    event: 'onClick' | 'onMouseEnter' | 'onMouseLeave', 
    sound: string 
  };
}

// Utility function to add sound effects to elements with proper typing
export const withSounds = <P extends React.HTMLAttributes<HTMLElement>>(
  element: ReactElement<P>,
  options: WithSoundsOptions
): ReactElement => {
  const { onClick, onHover, onMouseEnter, onMouseLeave, custom } = options;
  
  if (!element || !element.props) {
    return element;
  }
  
  // Create a new props object
  const newProps = { ...element.props } as React.JSX.LibraryManagedAttributes<
    typeof element.type,
    P
  >;

  // Handle click sound
  if (onClick || (custom?.event === 'onClick')) {
    const originalClick = element.props.onClick as EventHandler<ReactMouseEvent>;
    newProps.onClick = (event: ReactMouseEvent) => {
      if (custom?.event === 'onClick') {
        soundEffects.loadAndPlay(custom.sound, `/audios/${custom.sound}.mp3`);
      } else {
        if (typeof onClick === 'string' && ['soft', 'heavy', 'muted'].includes(onClick)) {
          soundEffects.playClick(onClick as 'soft' | 'heavy' | 'muted');
        } else {
          soundEffects.playClick('default');
        }
      }
      if (originalClick) originalClick(event);
    };
  }

  // Handle hover sound
  if (onHover || onMouseEnter || (custom?.event === 'onMouseEnter')) {
    const originalMouseEnter = element.props.onMouseEnter as EventHandler<ReactMouseEvent>;
    newProps.onMouseEnter = (event: ReactMouseEvent) => {
      if (custom?.event === 'onMouseEnter') {
        soundEffects.loadAndPlay(custom.sound, `/audios/${custom.sound}.mp3`);
      } else if (onMouseEnter) {
        soundEffects.loadAndPlay(onMouseEnter, `/audios/${onMouseEnter}.mp3`);
      } else {
        soundEffects.playHover();
      }
      if (originalMouseEnter) originalMouseEnter(event);
    };
  }

  // Handle mouse leave sound
  if (onMouseLeave || (custom?.event === 'onMouseLeave')) {
    const originalMouseLeave = element.props.onMouseLeave as EventHandler<ReactMouseEvent>;
    newProps.onMouseLeave = (event: ReactMouseEvent) => {
      if (custom?.event === 'onMouseLeave') {
        soundEffects.loadAndPlay(custom.sound, `/audios/${custom.sound}.mp3`);
      } else if (onMouseLeave) {
        soundEffects.loadAndPlay(onMouseLeave, `/audios/${onMouseLeave}.mp3`);
      }
      if (originalMouseLeave) originalMouseLeave(event);
    };
  }

  return cloneElement(element, newProps);
};

export default useSoundEffects; 