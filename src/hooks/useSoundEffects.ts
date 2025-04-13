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
  const playClick = useCallback(() => soundEffects.playClick(), []);
  const playTransition = useCallback(() => soundEffects.playTransition(), []);
  const playSuccess = useCallback(() => soundEffects.playSuccess(), []);
  const playError = useCallback(() => soundEffects.playError(), []);
  const playLoading = useCallback(() => soundEffects.playLoading(), []);
  const playComplete = useCallback(() => soundEffects.playComplete(), []);
  const playWhoosh = useCallback(() => soundEffects.loadAndPlay('whoosh', '/audios/whoosh2.mp3'), []);

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
    playLoading,
    playComplete,
    playWhoosh,
    playCustom,
    setVolume,
    setSoundsEnabled
  };
};

// Improved type definitions for withSounds utility
type ReactMouseEvent = React.MouseEvent<HTMLElement>;
type EventHandler<E extends React.SyntheticEvent> = (event: E) => void;

interface WithSoundsOptions {
  onClick?: boolean;
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
    React.ElementType,
    P
  >;
  
  if (onClick) {
    const originalOnClick = element.props.onClick as EventHandler<ReactMouseEvent> | undefined;
    newProps.onClick = (e: ReactMouseEvent) => {
      soundEffects.playClick();
      if (originalOnClick) originalOnClick(e);
    };
  }
  
  if (onHover) {
    const originalOnMouseEnter = element.props.onMouseEnter as EventHandler<ReactMouseEvent> | undefined;
    newProps.onMouseEnter = (e: ReactMouseEvent) => {
      soundEffects.playHover();
      if (originalOnMouseEnter) originalOnMouseEnter(e);
    };
  }
  
  if (onMouseEnter) {
    const originalOnMouseEnter = element.props.onMouseEnter as EventHandler<ReactMouseEvent> | undefined;
    newProps.onMouseEnter = (e: ReactMouseEvent) => {
      soundEffects.loadAndPlay('custom-enter', onMouseEnter);
      if (originalOnMouseEnter) originalOnMouseEnter(e);
    };
  }
  
  if (onMouseLeave) {
    const originalOnMouseLeave = element.props.onMouseLeave as EventHandler<ReactMouseEvent> | undefined;
    newProps.onMouseLeave = (e: ReactMouseEvent) => {
      soundEffects.loadAndPlay('custom-leave', onMouseLeave);
      if (originalOnMouseLeave) originalOnMouseLeave(e);
    };
  }
  
  if (custom) {
    const eventName = custom.event;
    const originalHandler = element.props[eventName] as EventHandler<ReactMouseEvent> | undefined;
    newProps[eventName] = (e: ReactMouseEvent) => {
      soundEffects.loadAndPlay('custom', custom.sound);
      if (originalHandler) originalHandler(e);
    };
  }
  
  return cloneElement(element, newProps);
};

export default useSoundEffects; 