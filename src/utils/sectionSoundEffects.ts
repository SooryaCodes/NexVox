import { useEffect, useRef } from 'react';
import soundEffects from '@/utils/soundEffects';

/**
 * Custom hook to add sound effects to a section
 * @param sectionId Optional section ID to attach to the section element
 * @param scrollSound Whether to play a sound when the section enters the viewport
 * @param soundType The type of sound to play when section enters viewport (default: 'select')
 * @returns The section ref to be attached to the section element
 */
export const useSectionSoundEffects = (
  sectionId?: string,
  scrollSound: boolean = true,
  soundType: 'select' | 'transition' | 'whoosh' | 'oscillation' = 'select'
) => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Play sound effect when section is in view
  useEffect(() => {
    if (!scrollSound) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          switch (soundType) {
            case 'select':
              soundEffects.playSelect();
              break;
            case 'transition':
              soundEffects.playTransition();
              break;
            case 'whoosh':
              soundEffects.playWhoosh();
              break;
            case 'oscillation':
              // This is a custom sound so we're using playCustom
              soundEffects.loadAndPlay('oscillation', '/audios/oscillation.mp3');
              break;
            default:
              soundEffects.playSelect();
          }
        }
      });
    }, { threshold: 0.2 });
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [scrollSound, soundType]);
  
  return sectionRef;
};

/**
 * Click sound effect handler for different button types
 * @param type The type of click sound to play
 */
export const handleClickSound = (type: 'default' | 'soft' | 'heavy' | 'muted' = 'default') => {
  soundEffects.playClick(type);
};

/**
 * Applies a specific click sound to different UI elements
 */
export const buttonSounds = {
  primary: () => soundEffects.playClick('heavy'),
  secondary: () => soundEffects.playClick(),
  tertiary: () => soundEffects.playClick('soft'),
  icon: () => soundEffects.playClick('muted'),
  success: () => soundEffects.playSuccess(),
  error: () => soundEffects.playError(),
  toggle: () => soundEffects.playToggle(),
  option: () => soundEffects.playSelect()
};

export default {
  useSectionSoundEffects,
  handleClickSound,
  buttonSounds
}; 