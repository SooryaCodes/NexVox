import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechOptions {
  voice?: SpeechSynthesisVoice | null;
  pitch?: number;
  rate?: number;
  volume?: number;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string, options?: SpeechOptions) => void;
  cancel: () => void;
  speaking: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
}

export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  
  // Keep track of active intervals for cleanup
  const activeIntervalsRef = useRef<NodeJS.Timeout[]>([]);
  
  // Keep track of current utterance
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const voiceOptions = window.speechSynthesis.getVoices();
        setVoices(voiceOptions);
      };
      
      loadVoices();
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      // Cleanup function
      return () => {
        // Cancel any active speech
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          setSpeaking(false);
        }
        
        // Clear all intervals
        activeIntervalsRef.current.forEach(intervalId => {
          clearInterval(intervalId);
        });
        activeIntervalsRef.current = [];
        
        // Remove references to current utterance
        currentUtterance.current = null;
      };
    }
  }, []);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!supported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Store reference to current utterance
    currentUtterance.current = utterance;
    
    // Set voice if provided
    if (options.voice) {
      utterance.voice = options.voice;
    }
    
    // Set other properties with defaults
    utterance.pitch = options.pitch ?? 1;
    utterance.rate = options.rate ?? 1;
    utterance.volume = options.volume ?? 1;
    
    // Set event handlers
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      currentUtterance.current = null;
    };
    utterance.onerror = () => {
      setSpeaking(false);
      currentUtterance.current = null;
    };
    
    // Speak
    window.speechSynthesis.speak(utterance);
    
    // Chrome/Firefox workaround for long speeches getting cut off
    if (utterance.text.length > 100) {
      const intervalId = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(intervalId);
          // Remove from active intervals
          activeIntervalsRef.current = activeIntervalsRef.current.filter(id => id !== intervalId);
          return;
        }
        
        // Keep speech synthesis active by temporarily pausing and resuming
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 5000) as NodeJS.Timeout;
      
      // Add to active intervals for cleanup
      activeIntervalsRef.current.push(intervalId);
      
      // Clear interval when speech ends
      utterance.onend = () => {
        clearInterval(intervalId);
        // Remove from active intervals
        activeIntervalsRef.current = activeIntervalsRef.current.filter(id => id !== intervalId);
        setSpeaking(false);
        currentUtterance.current = null;
      };
    }
    
    return utterance;
  }, [supported]);
  
  const cancel = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.cancel();
    setSpeaking(false);
    
    // Clear all intervals
    activeIntervalsRef.current.forEach(intervalId => {
      clearInterval(intervalId);
    });
    activeIntervalsRef.current = [];
    
    // Remove references to current utterance
    currentUtterance.current = null;
  }, [supported]);
  
  // Additional cleanup on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && speaking) {
        cancel();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cancel, speaking]);
  
  return { speak, cancel, speaking, supported, voices };
}; 