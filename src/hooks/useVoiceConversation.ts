import { useState, useRef, useEffect, useCallback } from 'react';
import { User, ChatMessage } from '@/types/room';
import { useRoomToasts } from "./useRoomToasts";

interface UseVoiceConversationProps {
  users: User[];
  mutedUsers: number[];
  currentUser: User;
  room: any;
  messages: ChatMessage[];
  sendMessage: (message: ChatMessage) => void;
}

export const useVoiceConversation = ({
  users,
  mutedUsers,
  currentUser,
  room,
  messages,
  sendMessage
}: UseVoiceConversationProps) => {
  const { addToast } = useRoomToasts();
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState<number | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(true);
  const [activeSpeakerPulse, setActiveSpeakerPulse] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [toastShownRef, setToastShownRef] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<User | null>(null);
  const [enableWaveform, setEnableWaveform] = useState(false);
  
  const synth = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const availableVoices = useRef<SpeechSynthesisVoice[]>([]);
  
  // Keep track of conversation state
  const conversationStateRef = useRef({
    lastSpeakerId: -1,
    lastMessageType: '',
    messagesExchanged: 0,
    roomTopic: room?.name?.toLowerCase() || 'general'
  });
  
  // Initialize audio context
  const initAudioContext = useCallback(() => {
    try {
      // Create AudioContext on demand
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume().then(() => {
          console.log("AudioContext resumed successfully");
          
          // Play a silent sound to unblock audio
          const oscillator = audioContext.current!.createOscillator();
          const gainNode = audioContext.current!.createGain();
          gainNode.gain.value = 0.01; // Very low volume
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.current!.destination);
          oscillator.frequency.value = 440; // A4 note
          oscillator.start();
          oscillator.stop(audioContext.current!.currentTime + 0.1);
        });
      }
    } catch (err) {
      console.error("Error initializing AudioContext:", err);
    }
  }, []);
  
  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      console.log("Initializing speech synthesis");
      
      // Initialize speech synthesis
      synth.current = new SpeechSynthesisUtterance();
      
      // Force speech synthesis to load voices
      window.speechSynthesis.cancel();
      
      // Load voices with a more robust approach
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          availableVoices.current = voices;
          console.log(`Loaded ${voices.length} voices`);
          voices.forEach((voice, i) => {
            if (i < 10) { // Log first 10 voices for debugging
              console.log(`Voice ${i}: ${voice.name} (${voice.lang})`);
            }
          });
          setVoicesLoaded(true);
        } else {
          console.warn("No voices available yet, will retry");
          // Try again in a moment
          setTimeout(loadVoices, 500);
        }
      };
      
      // Try to load voices immediately
      loadVoices();
      
      // Also set up event listener for voices changed
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        if (speakingTimeoutRef.current) {
          clearTimeout(speakingTimeoutRef.current);
        }
      };
    } else {
      console.error("Speech synthesis not supported");
    }
  }, []);

  const stopConversation = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    setIsConversationActive(false);
    setActiveSpeakerIndex(null);
    setIsProcessing(false);
    setCurrentSpeaker(null);
    setEnableWaveform(false);
  }, []);

  // Test speech synthesis directly
  const testSpeech = useCallback(() => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not available");
      return false;
    }
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create test utterance
      const testUtterance = new SpeechSynthesisUtterance("Hello, I am testing the speech synthesis.");
      testUtterance.volume = 1.0;
      testUtterance.rate = 1.0;
      testUtterance.pitch = 1.0;
      
      // Try to use a simple voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find an English voice
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en-') || voice.lang.includes('en_')
        );
        
        if (englishVoice) {
          testUtterance.voice = englishVoice;
        } else {
          testUtterance.voice = voices[0];
        }
      }
      
      // Add event listeners for debugging
      testUtterance.onstart = () => console.log("Test speech started");
      testUtterance.onend = () => console.log("Test speech ended");
      testUtterance.onerror = (e) => console.error("Test speech error:", e);
      
      // Log details
      console.log("Speaking test utterance with voice:", testUtterance.voice?.name || "default");
      
      // Force a slight delay to ensure WebSpeech is ready
      setTimeout(() => {
        // Speak
        window.speechSynthesis.speak(testUtterance);
      }, 100);
      
      return true;
    } catch (err) {
      console.error("Test speech failed:", err);
      return false;
    }
  }, []);
  
  // Generate a simple message for testing
  const getNextMessage = useCallback(() => {
    const messages = [
      "Hello, how are you today?",
      "I'm enjoying this conversation.",
      "What do you think about this topic?",
      "That's interesting! Tell me more.",
      "I agree with what you're saying.",
      "Let's discuss something else.",
      "I have a different perspective on this.",
      "That's a good point you raised."
    ];
    
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }, []);
  
  // Function to speak a message with a specific voice
  const speakMessage = useCallback((content: string, speaker: User) => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not available");
      setIsProcessing(false);
      return;
    }
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create new utterance for each message (more reliable)
      const utterance = new SpeechSynthesisUtterance(content);
      
      // Try to assign a voice based on available voices
      const voices = window.speechSynthesis.getVoices();
      availableVoices.current = voices.length > 0 ? voices : availableVoices.current;
      
      if (availableVoices.current.length > 0) {
        // Use the speaker's ID to consistently assign the same voice to the same speaker
        const voiceIndex = speaker.id % availableVoices.current.length;
        utterance.voice = availableVoices.current[voiceIndex];
        console.log(`Speaker ${speaker.name} using voice: ${utterance.voice.name}`);
      }
      
      // Set voice properties with more variation but ensure volume is high
      utterance.pitch = 0.9 + (speaker.id % 5) * 0.1; // More variation in pitch (0.9-1.3)
      utterance.rate = 0.8 + (speaker.id % 5) * 0.1; // More variation in rate (0.8-1.2)
      utterance.volume = 1.0; // Maximum volume
      
      // Break content into shorter sentences if too long (improves reliability)
      if (content.length > 100) {
        console.log("Long message detected, will split into chunks for better reliability");
      }
      
      // Add event listeners
      utterance.onstart = () => {
        console.log(`Started speaking: "${content.substring(0, 20)}..." with voice ${utterance.voice?.name}`);
        setEnableWaveform(true);
        
        // Some browsers need a reminder to keep playing
        setTimeout(() => {
          if (window.speechSynthesis.paused) {
            console.log("Speech synthesis paused, resuming");
            window.speechSynthesis.resume();
          }
        }, 1000);
      };
      
      utterance.onend = () => {
        console.log("Finished speaking");
        setIsProcessing(false);
        setCurrentSpeaker(null);
        setEnableWaveform(false);
        
        // Use setTimeout to defer next speaker scheduling
        setTimeout(() => {
          if (isConversationActive) {
            console.log("Scheduling next speaker after speech ended");
            scheduleNextSpeakerRef.current(2000);
          }
        }, 100);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsProcessing(false);
        setCurrentSpeaker(null);
        setEnableWaveform(false);
      };
      
      // Force a slight delay to ensure all properties are set
      setTimeout(() => {
        // Speak the message
        console.log(`Actually speaking with voice: ${utterance.voice?.name || "default"}, pitch: ${utterance.pitch}, rate: ${utterance.rate}`);
        window.speechSynthesis.speak(utterance);
        
        // Chrome sometimes pauses after 15 seconds, keep it alive
        const keepAlive = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(keepAlive);
            return;
          }
          
          // Force resume if paused
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          
          // Extra insurance - force cancel and respeak if taking too long (over 10 seconds)
          // This is a fallback for browsers that might freeze
          /* Uncomment if needed for troubleshooting
          if (Date.now() - startTime > 10000) {
            console.log("Speech taking too long, restarting");
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
          }
          */
        }, 5000);
      }, 50);
      
    } catch (error) {
      console.error("Error speaking message:", error);
      setIsProcessing(false);
      setCurrentSpeaker(null);
    }
  }, [isConversationActive]);
  
  // Create a ref to store the latest version of scheduleNextSpeaker
  const scheduleNextSpeakerRef = useRef<(delay?: number) => void>(() => {});
  
  // Schedule speakers in sequence
  const scheduleNextSpeaker = useCallback((delay = 3000) => {
    if (!isConversationActive || users.length === 0) return;
    
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
    }
    
    speakingTimeoutRef.current = setTimeout(() => {
      if (!isConversationActive) return;
      
      // Debug log
      console.log("Scheduling next speaker, active speakers available:", users.length);
      
      // Select the next speaker that isn't the last one
      let nextSpeakerIndex = 0;
      if (users.length > 1) {
        do {
          nextSpeakerIndex = Math.floor(Math.random() * users.length);
        } while (
          users[nextSpeakerIndex].id === conversationStateRef.current.lastSpeakerId &&
          conversationStateRef.current.messagesExchanged > 0
        );
      }
      
      const nextSpeaker = users[nextSpeakerIndex];
      conversationStateRef.current.lastSpeakerId = nextSpeaker.id;
      
      setCurrentSpeaker(nextSpeaker);
      setActiveSpeakerIndex(nextSpeakerIndex);
      setActiveSpeakerPulse(true);
      setTimeout(() => setActiveSpeakerPulse(false), 300);
      setIsProcessing(true);
      
      // Skip if user is muted
      if (mutedUsers.includes(nextSpeaker.id)) {
        console.log(`Speaker ${nextSpeaker.name} is muted, skipping`);
        setIsProcessing(false);
        setCurrentSpeaker(null);
        scheduleNextSpeaker(1000);
        return;
      }
      
      // Generate and speak a message
      const messageContent = getNextMessage();
      console.log(`Speaker ${nextSpeaker.name} will say: "${messageContent}"`);
      
      // Force a short delay to ensure UI is updated before speech starts
      setTimeout(() => {
        // Create a message object (do this before speaking to ensure UI updates)
        sendMessage({
          message: messageContent,
          isUser: false,
          timestamp: new Date(),
          userName: nextSpeaker.name
        });
        
        // Ensure we're speaking the message
        speakMessage(messageContent, nextSpeaker);
        
        conversationStateRef.current.messagesExchanged++;
      }, 100);
    }, delay);
  }, [isConversationActive, users, mutedUsers, sendMessage, getNextMessage, speakMessage]);
  
  // Update the ref whenever scheduleNextSpeaker changes
  useEffect(() => {
    scheduleNextSpeakerRef.current = scheduleNextSpeaker;
  }, [scheduleNextSpeaker]);
  
  // Start the conversation - NOW EXPLICIT, not automatic
  const handleStartConversation = useCallback(() => {
    // Immediately hide the prompt
    setShowStartPrompt(false);
    setHasUserInteracted(true);
    
    // Reset toast tracker
    setToastShownRef(false);
    
    if (!window.speechSynthesis || users.length === 0) {
      addToast("Cannot start conversation. Please try again later.", "error");
      return;
    }
    
    // Unblock audio - this is critical for browsers to allow audio
    initAudioContext();
    
    // Reset conversation state
    conversationStateRef.current = {
      lastSpeakerId: -1,
      lastMessageType: '',
      messagesExchanged: 0,
      roomTopic: room?.name?.toLowerCase() || 'general'
    };
    
    // Show starting message
    addToast("Starting voice conversation...", "success");
    
    // Force speech synthesis reset and ensure access
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      // Some browsers need user interaction to enable speech synthesis
      // Try to speak a silent utterance to "unlock" the API
      const unlockUtterance = new SpeechSynthesisUtterance(" ");
      unlockUtterance.volume = 0.1;
      unlockUtterance.onend = () => console.log("Speech synthesis unlocked");
      window.speechSynthesis.speak(unlockUtterance);
    }
    
    // Force refresh of voices in case they weren't loaded
    availableVoices.current = window.speechSynthesis.getVoices();
    console.log(`Available voices: ${availableVoices.current.length}`);
    
    if (availableVoices.current.length <= 1) {
      // If only one voice is available, warn the user
      addToast("Limited voices available. Using pitch and rate variation instead.", "warning");
    }
    
    // Test speech synthesis first with a clearly audible message
    setTimeout(() => {
      const testUtterance = new SpeechSynthesisUtterance("Voice conversation starting now. Get ready to listen.");
      testUtterance.volume = 1.0;
      testUtterance.onend = () => {
        console.log("Test speech complete, starting conversation");
        
        // Start the conversation
        setIsConversationActive(true);
        
        // Schedule first speaker with a delay after test message
        setTimeout(() => {
          console.log("Starting conversation with first speaker...");
          scheduleNextSpeaker(100);
        }, 500);
      };
      
      testUtterance.onerror = (e) => {
        console.error("Test speech error:", e);
        addToast("Speech synthesis failed. Please ensure your browser supports this feature.", "error");
      };
      
      window.speechSynthesis.speak(testUtterance);
    }, 500);
  }, [users, scheduleNextSpeaker, room, addToast, initAudioContext]);
  
  // Store previous hand raised state to prevent repeated acknowledgments
  const prevHandRaisedRef = useRef(false);
  
  // Check for hand raising event
  const handleHandRaiseAcknowledgment = useCallback((handRaised: boolean) => {
    // Only acknowledge if this is a new hand raise (transition from false to true)
    if (handRaised && !prevHandRaisedRef.current && isConversationActive) {
      console.log("Hand raised acknowledgment triggered");
      prevHandRaisedRef.current = true;
      
      // Cancel current speech to acknowledge hand raise
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = null;
      }
      
      try {
        // Short timeout to ensure previous speech is canceled
        setTimeout(() => {
          // Speak acknowledgement
          const utterance = new SpeechSynthesisUtterance(`${currentUser.name} would like to speak.`);
          
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            utterance.voice = voices[0];
          }
          
          utterance.volume = 1.0;
          
          // Only run once
          let hasEnded = false;
          
          utterance.onend = () => {
            if (!hasEnded) {
              hasEnded = true;
              console.log("Hand raise acknowledgment completed");
              // Resume conversation after acknowledgement
              setTimeout(() => {
                if (isConversationActive) {
                  scheduleNextSpeakerRef.current(1000);
                }
              }, 100);
            }
          };
          
          window.speechSynthesis.speak(utterance);
        }, 100);
      } catch (err) {
        console.error("Error in hand raise acknowledgment:", err);
        scheduleNextSpeakerRef.current(1000);
      }
    } else if (!handRaised) {
      // Reset the ref when hand is lowered
      prevHandRaisedRef.current = false;
    }
  }, [currentUser.name, isConversationActive]);
  
  return {
    activeSpeakerIndex,
    activeSpeakerPulse,
    showStartPrompt,
    isConversationActive,
    isProcessing,
    currentSpeaker,
    hasUserInteracted,
    enableWaveform,
    startConversation: handleStartConversation,
    stopConversation,
    handleHandRaiseAcknowledgment
  };
}; 