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
  
  const synth = useRef<SpeechSynthesis | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
    }
    
    return () => {
      stopConversation();
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
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

  // Check for user interaction
  useEffect(() => {
    if (!users.length) return;
    
    // Check if user has interacted or if we need to show the prompt
    if (!hasUserInteracted && !showStartPrompt) {
      // Show start prompt after a short delay
      const promptTimer = setTimeout(() => {
        setShowStartPrompt(true);
      }, 1000);
      
      return () => clearTimeout(promptTimer);
    }
    
    // If user has interacted but conversation isn't active, start it
    if (hasUserInteracted && !isConversationActive && synth.current) {
      startConversation();
    }
  }, [hasUserInteracted, users, isConversationActive, showStartPrompt]);
  
  // Create conversation snippets - these could be moved to a separate data file
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
  
  // Schedule speakers in sequence
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
      
      // Set voice and properties
      const voices = synth.current?.getVoices() || [];
      if (voices.length > 0) {
        utterance.voice = voices[speakerIndex % voices.length];
      }
      
      // Adjust voice properties based on user
      utterance.pitch = 0.8 + (Math.random() * 0.8); // 0.8-1.6 range
      utterance.rate = 0.8 + (Math.random() * 0.5);  // 0.8-1.3 range
      utterance.volume = 1.0; // Ensure volume is at maximum
      
      // When speech ends, schedule next speaker
      utterance.onend = () => {
        setActiveSpeakerIndex(null);
        conversationStateRef.current.messagesExchanged++;
        
        // Verify the conversation is still active
        if (isConversationActive) {
          // Vary delay between speakers to make it feel more natural
          const naturalDelay = 1000 + Math.random() * 3000;
          scheduleNextSpeaker(naturalDelay);
        }
      };
      
      // Error handling
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        addToast("Speech synthesis error. Trying again...", "error");
        setActiveSpeakerIndex(null);
        scheduleNextSpeaker(1000);
      };
      
      // Start speaking
      if (synth.current) {
        try {
          synth.current.speak(utterance);
        } catch (err) {
          console.error("Failed to speak:", err);
          addToast("Failed to initialize speech. Please refresh and try again.", "error");
        }
      }
    }, delay);
  }, [users, mutedUsers, getNextMessage, isConversationActive, addToast]);
  
  // Start the conversation
  const startConversation = useCallback(() => {
    if (!synth.current || users.length === 0) {
      addToast("Cannot start conversation. Please try again later.", "error");
      return;
    }
    
    // Reset conversation state
    conversationStateRef.current = {
      lastSpeakerId: -1,
      lastMessageType: '',
      messagesExchanged: 0,
      roomTopic: room?.name?.toLowerCase() || 'general'
    };
    
    setIsConversationActive(true);
    addToast("Starting voice conversation...", "success");
    
    // Start the conversation after a short delay
    speakingTimeoutRef.current = setTimeout(() => {
      scheduleNextSpeaker(0);
    }, 1000);
  }, [users, scheduleNextSpeaker, room, addToast]);
  
  // Handle user triggering conversation start
  const handleStartConversation = useCallback(() => {
    setHasUserInteracted(true);
    setShowStartPrompt(false);
    
    // We don't auto-start here as the useEffect will handle that
  }, []);
  
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
      
      const voices = synth.current.getVoices() || [];
      if (voices.length > 0) {
        utterance.voice = voices[speakerIndex % voices.length];
      }
      
      synth.current.speak(utterance);
      
      utterance.onend = () => {
        setActiveSpeakerIndex(null);
        // Restart normal conversation after acknowledging the hand raise
        scheduleNextSpeaker(2000);
      };
    }
  }, [currentUser, isConversationActive, scheduleNextSpeaker, users]);
  
  // Listen for user interaction events
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        setShowStartPrompt(false);
      }
    };
    
    // Listen for common user interaction events
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [hasUserInteracted]);
  
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