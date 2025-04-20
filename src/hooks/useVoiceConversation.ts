import { useState, useRef, useEffect, useCallback } from 'react';
import { User } from '@/types/room';

interface UseVoiceConversationProps {
  users: User[];
  mutedUsers: number[];
  currentUser: User;
  room: any;
  addToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

export function useVoiceConversation({ 
  users, 
  mutedUsers, 
  currentUser,
  room,
  addToast
}: UseVoiceConversationProps) {
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState<number | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(false);
  const [activeSpeakerPulse, setActiveSpeakerPulse] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [toastShownRef, setToastShownRef] = useState(false);
  
  const synth = useRef<SpeechSynthesis | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const availableVoices = useRef<SpeechSynthesisVoice[]>([]);
  const conversationStateRef = useRef<{
    lastSpeakerId: number;
    lastMessageType: string;
    messagesExchanged: number;
    roomTopic: string;
  }>({
    lastSpeakerId: -1,
    lastMessageType: '',
    messagesExchanged: 0,
    roomTopic: room?.name?.toLowerCase() || 'general'
  });

  // Only initialize speech synthesis, don't auto-start
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
      
      // Load voices
      const loadVoices = () => {
        const voices = synth.current?.getVoices() || [];
        if (voices.length > 0) {
          availableVoices.current = voices;
          setVoicesLoaded(true);
        }
      };
      
      loadVoices();
      
      // Handle Chrome's asynchronous voice loading
      if (synth.current) {
        synth.current.onvoiceschanged = loadVoices;
      }
      
      // Show the start prompt after a delay
      const promptTimer = setTimeout(() => {
        setShowStartPrompt(true);
      }, 1000);
      
      return () => {
        clearTimeout(promptTimer);
        stopConversation();
      };
    }
    
    return () => {
      stopConversation();
    };
  }, []);

  const stopConversation = useCallback(() => {
    if (synth.current) {
      synth.current.cancel();
    }
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
    }
    setIsConversationActive(false);
    setActiveSpeakerIndex(null);
  }, []);

  // DO NOT auto-start, only set up the conversation state
  useEffect(() => {
    // Only manage the start prompt visibility here
    if (!users.length) return;
    
    // Don't auto-start the conversation based on user interaction
    // That will now happen explicitly in handleStartConversation
  }, [users, isConversationActive, hasUserInteracted]);
  
  // Create conversation snippets
  const conversationSnippets = {
    general: [
      "This spatial audio is incredible. I can hear everyone so clearly!",
      "The neon visuals in this room are amazing. Love the cyberpunk vibe.",
      "Have you tried the new voice effects? They're pretty cool.",
      "I'm loving this NexVox platform. It feels like we're actually in the same room.",
      "The avatars pulsing when speaking is such a nice touch.",
      "The cyberpunk theme really makes this stand out from other voice chat apps.",
      "I can finally have conversations that feel real, not just text.",
      "These voice rooms are going to change how we connect online."
    ],
    greetings: [
      "Hey everyone, how's it going?",
      "Nice to meet you all in this room!",
      "Hello! First time using NexVox, this is impressive.",
      "Hi there! The audio quality here is amazing."
    ],
    responses: [
      "Yeah, I totally agree with that.",
      "That's an interesting point, I hadn't thought of it that way.",
      "Makes sense, thanks for explaining.",
      "I see what you mean now.",
      "Absolutely, couldn't have said it better myself."
    ],
    questions: [
      "Has anyone tried the spatial audio settings yet?",
      "What do you think about the new avatar designs?",
      "Is anyone else experimenting with the voice effects?",
      "Does anyone know if there are plans for video integration?",
      "What other NexVox rooms would you recommend checking out?"
    ],
    topical: [
      "The AI integration in this platform is really impressive.",
      "Virtual reality is going to make these voice rooms even more immersive.",
      "I've been using this for team meetings, and it's way better than traditional video calls.",
      "The ambient background sounds really add to the atmosphere."
    ]
  };
  
  // Get contextually appropriate message
  const getNextMessage = useCallback(() => {
    const { messagesExchanged, lastMessageType, roomTopic } = conversationStateRef.current;
    
    // Start with greetings if we're just beginning
    if (messagesExchanged < 3 && Math.random() < 0.7) {
      conversationStateRef.current.lastMessageType = 'greetings';
      return conversationSnippets.greetings[Math.floor(Math.random() * conversationSnippets.greetings.length)];
    }
    
    // After someone asks a question, usually follow with a response
    if (lastMessageType === 'questions' && Math.random() < 0.8) {
      conversationStateRef.current.lastMessageType = 'responses';
      return conversationSnippets.responses[Math.floor(Math.random() * conversationSnippets.responses.length)];
    }
    
    // Choose next message type with weighting
    const messageTypes = [
      { type: 'general', weight: 0.3 },
      { type: 'questions', weight: 0.25 },
      { type: 'topical', weight: 0.25 },
      { type: 'greetings', weight: 0.05 },
      { type: 'responses', weight: 0.15 }
    ];
    
    // Use weighted random selection
    const totalWeight = messageTypes.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedType = messageTypes[0].type;
    
    for (const type of messageTypes) {
      if (random < type.weight) {
        selectedType = type.type;
        break;
      }
      random -= type.weight;
    }
    
    conversationStateRef.current.lastMessageType = selectedType;
    const messages = conversationSnippets[selectedType as keyof typeof conversationSnippets];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [conversationSnippets]);
  
  // Schedule speakers in sequence with improved voice selection
  const scheduleNextSpeaker = useCallback((delay = 2000) => {
    if (!synth.current || users.length === 0 || !isConversationActive) return;

    speakingTimeoutRef.current = setTimeout(() => {
      // Find a speaker different from the last one
      let speakerIndex;
      do {
        speakerIndex = Math.floor(Math.random() * users.length);
      } while (
        speakerIndex === conversationStateRef.current.lastSpeakerId && 
        users.length > 1
      );
      
      conversationStateRef.current.lastSpeakerId = speakerIndex;
      const user = users[speakerIndex];
      
      // Skip if user is muted
      if (mutedUsers.includes(user.id)) {
        scheduleNextSpeaker(1000);
        return;
      }
      
      setActiveSpeakerIndex(speakerIndex);
      
      // Make the avatar pulsate when speaking
      setActiveSpeakerPulse(true);
      setTimeout(() => setActiveSpeakerPulse(false), 300);
      
      // Create and configure utterance
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = getNextMessage();
      
      // Set a basic default voice if available
      if (availableVoices.current.length > 0) {
        const voiceIndex = speakerIndex % availableVoices.current.length;
        utterance.voice = availableVoices.current[voiceIndex];
      }
      
      // Simple voice properties - less variation to increase stability
      utterance.pitch = 1.0 + (speakerIndex % 3) * 0.1; // Subtle variation: 1.0, 1.1, or 1.2
      utterance.rate = 1.0;  // Keep rate normal for better stability
      utterance.volume = 1.0; // Maximum volume
      
      // When speech ends, schedule next speaker
      utterance.onend = () => {
        setActiveSpeakerIndex(null);
        conversationStateRef.current.messagesExchanged++;
        
        // Verify the conversation is still active
        if (isConversationActive) {
          // Use consistent delays to prevent timing issues
          scheduleNextSpeaker(2000);
        }
      };
      
      // Error handling
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        // Only show one error toast to prevent duplicates
        if (!toastShownRef) {
          addToast("Speech engine error. Please try refreshing the page.", "error");
          setToastShownRef(true);
        }
        setActiveSpeakerIndex(null);
        scheduleNextSpeaker(2000);
      };
      
      // Start speaking with improved error handling
      if (synth.current) {
        try {
          // Cancel any current speech to prevent overlapping
          synth.current.cancel();
          
          // Simple speak command - fewer complexities for better compatibility
          synth.current.speak(utterance);
        } catch (err) {
          console.error("Failed to speak:", err);
          if (!toastShownRef) {
            addToast("Browser speech synthesis is not available", "error");
            setToastShownRef(true);
          }
          // Try to continue conversation anyway
          scheduleNextSpeaker(2000);
        }
      }
    }, delay);
  }, [users, mutedUsers, getNextMessage, isConversationActive, toastShownRef, addToast]);
  
  // Start the conversation - NOW EXPLICIT, not automatic
  const startConversation = useCallback(() => {
    // Immediately hide the prompt
    setShowStartPrompt(false);
    setHasUserInteracted(true);
    
    // Reset toast tracker
    setToastShownRef(false);
    
    if (!synth.current || users.length === 0) {
      addToast("Cannot start conversation. Please try again later.", "error");
      return;
    }
    
    // Try to unlock audio context for browser autoplay policies
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (err) {
      console.error("Audio context error:", err);
    }
    
    // Reset conversation state
    conversationStateRef.current = {
      lastSpeakerId: -1,
      lastMessageType: '',
      messagesExchanged: 0,
      roomTopic: room?.name?.toLowerCase() || 'general'
    };
    
    // Set active state before showing toast
    setIsConversationActive(true);
    addToast("Starting voice conversation...", "success");
    
    // Clear any previous speech
    if (synth.current) {
      synth.current.cancel();
    }
    
    // Start the conversation after a short delay
    scheduleNextSpeaker(1000);
  }, [users, scheduleNextSpeaker, room, addToast]);
  
  // Handle user triggering conversation start - THIS IS THE MAIN TRIGGER NOW
  const handleStartConversation = useCallback(() => {
    startConversation();
  }, [startConversation]);
  
  // Check for hand raising event
  const handleHandRaiseAcknowledgment = useCallback((handRaised: boolean) => {
    if (!handRaised || !synth.current || !isConversationActive) return;
    
    // Cancel current speech to acknowledge hand raise
    synth.current.cancel();
    
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
    }
    
    // Use a random speaker to acknowledge the hand raise
    const speakerIndex = users.findIndex(u => u.id !== currentUser.id);
    if (speakerIndex >= 0) {
      setActiveSpeakerIndex(speakerIndex);
      
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = "I see someone has their hand raised. Go ahead!";
      
      if (availableVoices.current.length > 0) {
        utterance.voice = availableVoices.current[speakerIndex % availableVoices.current.length];
      }
      
      utterance.volume = 1.0;
      
      synth.current.speak(utterance);
      
      utterance.onend = () => {
        setActiveSpeakerIndex(null);
        // Restart normal conversation after acknowledging the hand raise
        scheduleNextSpeaker(2000);
      };
    }
  }, [currentUser, isConversationActive, scheduleNextSpeaker, users]);

  return {
    activeSpeakerIndex,
    activeSpeakerPulse,
    showStartPrompt,
    isConversationActive,
    startConversation: handleStartConversation,
    stopConversation,
    handleHandRaiseAcknowledgment
  };
} 