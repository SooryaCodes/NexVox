import { useState, useEffect, useCallback } from 'react';

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
    }
  }, []);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!supported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
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
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    // Speak
    window.speechSynthesis.speak(utterance);
    
    // Chrome/Firefox workaround for long speeches getting cut off
    if (utterance.text.length > 100) {
      const intervalId = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(intervalId);
          return;
        }
        
        // Keep speech synthesis active by temporarily pausing and resuming
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 5000);
      
      // Clear interval when speech ends
      utterance.onend = () => {
        clearInterval(intervalId);
        setSpeaking(false);
      };
    }
    
    return utterance;
  }, [supported]);
  
  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);
  
  return { speak, cancel, speaking, supported, voices };
}; 