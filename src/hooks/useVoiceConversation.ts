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
      
      // Load voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          availableVoices.current = voices;
          console.log(`Loaded ${voices.length} voices`);
        } else {
          console.warn("No voices available yet");
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
      if (availableVoices.current.length > 0) {
        // Try to find an English voice
        const englishVoice = availableVoices.current.find(voice => 
          voice.lang.includes('en-') || voice.lang.includes('en_')
        );
        
        if (englishVoice) {
          testUtterance.voice = englishVoice;
        } else {
          testUtterance.voice = availableVoices.current[0];
        }
      }
      
      // Log details
      console.log("Speaking test utterance with voice:", testUtterance.voice?.name || "default");
      
      // Speak
      window.speechSynthesis.speak(testUtterance);
      
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
  
  // Schedule speakers in sequence
  const scheduleNextSpeaker = useCallback((delay = 3000) => {
    if (!isConversationActive || users.length === 0) return;
    
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
    }
    
    speakingTimeoutRef.current = setTimeout(() => {
      if (!isConversationActive) return;
      
      // Select the next speaker that isn't the last one
      let nextSpeakerIndex = 0;
      if (users.length > 1) {
        do {
          nextSpeakerIndex = Math.floor(Math.random() * users.length);
        } while (users[nextSpeakerIndex].id === conversationStateRef.current.lastSpeakerId);
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
      speakMessage(messageContent, nextSpeaker);
      
      // Create a message object
      sendMessage({
        message: messageContent,
        isUser: false,
        timestamp: new Date(),
        userName: nextSpeaker.name
      });
      
      conversationStateRef.current.messagesExchanged++;
    }, delay);
  }, [isConversationActive, users, mutedUsers, sendMessage, getNextMessage]);
   
  // Function to speak a message with a specific voice
  const speakMessage = useCallback((content: string, speaker: User) => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not available");
      setIsProcessing(false);
      scheduleNextSpeaker(1000);
      return;
    }
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create new utterance for each message (more reliable)
      const utterance = new SpeechSynthesisUtterance(content);
      
      // Try to assign a voice based on available voices
      if (availableVoices.current.length > 0) {
        // Pick a random voice for the speaker
        const randomIndex = Math.floor(Math.random() * availableVoices.current.length);
        utterance.voice = availableVoices.current[randomIndex];
      }
      
      // Set voice properties
      utterance.pitch = 1.0 + (speaker.id % 3) * 0.1; // Subtle variation in pitch
      utterance.rate = 1.0;
      utterance.volume = 1.0; // Maximum volume
      
      // Add event listeners
      utterance.onstart = () => {
        console.log(`Started speaking: "${content.substring(0, 20)}..."`);
        setEnableWaveform(true);
      };
      
      utterance.onend = () => {
        console.log("Finished speaking");
        setIsProcessing(false);
        setCurrentSpeaker(null);
        setEnableWaveform(false);
        scheduleNextSpeaker();
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsProcessing(false);
        setCurrentSpeaker(null);
        setEnableWaveform(false);
        scheduleNextSpeaker(1000);
      };
      
      // Speak the message
      console.log(`Speaking with voice: ${utterance.voice?.name || "default"}, pitch: ${utterance.pitch}, rate: ${utterance.rate}`);
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error("Error speaking message:", error);
      setIsProcessing(false);
      setCurrentSpeaker(null);
      scheduleNextSpeaker(1000);
    }
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
    
    // Unblock audio
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
    
    // Force refresh of voices in case they weren't loaded
    if (availableVoices.current.length === 0) {
      availableVoices.current = window.speechSynthesis.getVoices();
      console.log(`Loaded ${availableVoices.current.length} voices`);
    }
    
    // Test speech synthesis first
    testSpeech();
    
    // Start the conversation
    setIsConversationActive(true);
    
    // Schedule first speaker
    setTimeout(() => {
      scheduleNextSpeaker(1000);
    }, 1000);
  }, [users, scheduleNextSpeaker, room, addToast, initAudioContext, testSpeech]);
  
  // Check for hand raising event
  const handleHandRaiseAcknowledgment = useCallback((handRaised: boolean) => {
    if (!handRaised || !window.speechSynthesis || !isConversationActive) return;
    
    // Cancel current speech to acknowledge hand raise
    window.speechSynthesis.cancel();
    
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    
    try {
      // Speak acknowledgement
      const utterance = new SpeechSynthesisUtterance(`${currentUser.name} would like to speak.`);
      
      if (availableVoices.current.length > 0) {
        utterance.voice = availableVoices.current[0];
      }
      
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
      
      utterance.onend = () => {
        // Resume conversation after acknowledgement
        scheduleNextSpeaker(1000);
      };
    } catch (err) {
      console.error("Error in hand raise acknowledgment:", err);
      scheduleNextSpeaker(1000);
    }
  }, [currentUser.name, isConversationActive, scheduleNextSpeaker]);
  
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