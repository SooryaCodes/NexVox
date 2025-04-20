import { useState, useRef, useEffect, useCallback } from 'react';
import { User, ChatMessage } from '@/types/room';
import { useRoomToasts } from "./useRoomToasts";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

interface UseVoiceConversationProps {
  users: User[];
  mutedUsers: number[];
  currentUser: User;
  room: any;
  messages: ChatMessage[];
  sendMessage: (message: ChatMessage) => void;
}

// Track conversation state for more contextual responses
interface ConversationState {
  lastSpeakerId: number;
  lastMessageType: string;
  messagesExchanged: number;
  roomTopic: string;
  currentSubtopic?: string;
  lastFewMessages: string[];
  conversationThread?: string;
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
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();
  
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
  const conversationStateRef = useRef<ConversationState>({
    lastSpeakerId: -1,
    lastMessageType: '',
    messagesExchanged: 0,
    roomTopic: room?.name?.toLowerCase() || 'general',
    lastFewMessages: [],
    conversationThread: generateConversationThread(room?.name?.toLowerCase() || 'general')
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
  
  // Update availableVoices ref whenever voices from the hook changes
  useEffect(() => {
    if (voices.length > 0) {
      availableVoices.current = voices;
      setVoicesLoaded(true);
      console.log(`Loaded ${voices.length} voices from useSpeechSynthesis hook`);
      voices.forEach((voice, i) => {
        if (i < 10) { // Log first 10 voices for debugging
          console.log(`Voice ${i}: ${voice.name} (${voice.lang})`);
        }
      });
    }
  }, [voices]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
      cancel(); // Use cancel from useSpeechSynthesis
    };
  }, [cancel]);

  const stopConversation = useCallback(() => {
    cancel(); // Use cancel from useSpeechSynthesis
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    setIsConversationActive(false);
    setActiveSpeakerIndex(null);
    setIsProcessing(false);
    setCurrentSpeaker(null);
    setEnableWaveform(false);
  }, [cancel]);

  // Test speech synthesis directly
  const testSpeech = useCallback(() => {
    if (!supported) {
      console.error("Speech synthesis not available");
      return false;
    }
    
    try {
      const testMessage = "Hello, I am testing the speech synthesis.";
      speak(testMessage, {
        pitch: 1.0,
        rate: 1.0,
        volume: 1.0,
        voice: voices.find(voice => 
          voice.lang.includes('en-') || voice.lang.includes('en_')
        ) || (voices.length > 0 ? voices[0] : null)
      });
      
      console.log("Test speech successfully initiated");
      return true;
    } catch (err) {
      console.error("Test speech failed:", err);
      return false;
    }
  }, [speak, supported, voices]);
  
  // Generate a message based on current conversation context
  const getNextMessage = useCallback(() => {
    // Get the conversation state
    const roomTopic = conversationStateRef.current.roomTopic || 'technology';
    const messagesExchanged = conversationStateRef.current.messagesExchanged;
    const lastFewMessages = conversationStateRef.current.lastFewMessages || [];
    const conversationThread = conversationStateRef.current.conversationThread || '';
    
    console.log(`Generating message for topic: ${roomTopic}, thread: ${conversationThread}, message #${messagesExchanged}`);
    
    // Thread-specific messages about NexVox that drive a coherent conversation
    const threadSpecificContent = {
      "NexVox's voice room features and experience": [
        "The voice rooms in NexVox are really innovative - they can host up to 20 participants in a single conversation.",
        "I love how NexVox shows pulsing avatars when someone is speaking, it makes it easy to follow who's talking.",
        "The room customization is great too - you can choose from themes like 'Chill', 'Lit', or 'Epic' that change the room's visual aesthetics.",
        "One thing I appreciate is being able to make rooms public or private, with custom names like 'Cyber Lounge' that match the cyberpunk theme.",
        "The toolbar controls for muting, raising your hand, and inviting friends make the voice room experience really intuitive."
      ],
      "Spatial audio and its impact on conversations": [
        "NexVox's spatial audio feature creates a 3D sound experience that makes conversations feel more natural and immersive.",
        "Using the Web Audio API, it can pan voices from left to right based on where people would be positioned in a physical space.",
        "I've found spatial audio really helps with distinguishing between multiple speakers in larger conversations.",
        "You can actually adjust the spatial positioning in the settings from -1 to 1, which controls how far left or right a voice appears.",
        "The immersion that spatial audio creates makes it feel like you're actually sitting in a room with other people, not just in a digital space."
      ],
      "Voice customization options in NexVox": [
        "NexVox has impressive voice customization options - you can adjust your pitch from 0.5 to 2.0 to change how you sound.",
        "There's also a reverb effect that adds echo to your voice, with intensity adjustable from 0 to 1.",
        "The spatial panning control lets you position your voice left or right in the audio space, which adds to the immersion.",
        "I've found the noise cancellation toggle really useful for suppressing background noise in my conversations.",
        "You can test all your voice settings with the Test Voice button that plays a sample sound with your applied effects."
      ],
      "Creating and personalizing your NexVox profile": [
        "NexVox profiles are highly customizable with display names, avatars, and a bio of up to 100 characters.",
        "For avatars, NexVox uses the DiceBear API with 4 different style options to choose from.",
        "Your profile also shows your recent rooms - up to 3 of the voice rooms you've joined most recently.",
        "All profile changes are saved in local storage, so your personalization persists across sessions.",
        "I think the profile system really helps create a sense of identity within the NexVox community."
      ],
      "NexVox events and community building": [
        "The events page in NexVox showcases upcoming voice events like 'Global Debate Night' that bring the community together.",
        "Events are displayed as glassmorphism cards with details like titles, dates, and countdown timers to build anticipation.",
        "You can RSVP to events you're interested in, which helps organizers plan for participation.",
        "I think these events are crucial for building community around shared interests and topics.",
        "The events system really leverages the voice-first approach of NexVox to create meaningful group interactions."
      ],
      "The friends system and social networking": [
        "NexVox has a comprehensive friends system with three main tabs - Requests, Browse, and Friends List.",
        "The Requests tab lets you manage incoming connection requests with Accept or Decline options.",
        "In the Browse section, you can explore other users and send them friend requests to expand your network.",
        "The Friends List shows all your connections with options to initiate voice calls directly.",
        "When you click on a user, a profile modal appears showing their details like name, avatar, and bio."
      ],
      "Voice analytics and the vibe system": [
        "NexVox's Vibe Analytics Dashboard is a unique feature that shows your usage stats and conversation patterns.",
        "It displays your Top Vibe, like 'Chill' or 'Epic', based on the rooms you frequent the most.",
        "The dashboard also tracks your Talk Time with an animated counter showing how many minutes you've spent in conversations.",
        "I find the bar chart of your five vibes (Chill, Lit, Epic, Friendly, Calm) with neon gradients particularly visually appealing.",
        "This analytics system adds a gamification element to the platform that encourages participation."
      ],
      "NexVox's unique cyberpunk design aesthetic": [
        "The neon-cyberpunk aesthetic of NexVox with glowing interfaces creates an immersive, sci-fi inspired experience.",
        "Glassmorphism elements throughout the UI give it a futuristic, translucent quality that enhances the visual appeal.",
        "The color scheme primarily uses neon cyan and pink accents that really pop against dark backgrounds.",
        "Loading animations feature pulsing logos and orbiting glassmorphism orbs that reinforce the futuristic theme.",
        "Even small details like the particle burst Easter egg when typing 'NVX' add to the cyberpunk atmosphere."
      ],
      "Voice commands and accessibility features": [
        "NexVox has a global 'Listen' button in the navbar that triggers voice commands for hands-free navigation.",
        "You can use voice commands like 'Join Room', 'Open Profile', or 'Create Room' to navigate without clicking.",
        "During voice command listening, there's a waveform modal that provides visual feedback on your speech.",
        "The voice commands make the platform more accessible to users who might have difficulty with traditional interfaces.",
        "I think this feature really aligns with NexVox's voice-first philosophy and enhances the overall experience."
      ],
      "NexVox compared to other social platforms": [
        "Unlike text-based social media, NexVox centers on voice communication which creates more authentic connections.",
        "Traditional platforms like Twitter or Facebook prioritize content consumption, but NexVox emphasizes active participation.",
        "Compared to Discord, NexVox offers a more immersive experience with spatial audio and visual effects.",
        "The cyberpunk aesthetic sets NexVox apart visually from the more minimal or corporate designs of mainstream platforms.",
        "I think NexVox fills a unique niche by combining social networking with voice-first interaction in a visually distinctive way."
      ],
      "default": [
        "NexVox redefines online interaction by centering on voice communication rather than text or images.",
        "The platform allows users to join or create voice rooms where participants engage in live conversations.",
        "One of the most distinctive aspects of NexVox is its neon-cyberpunk aesthetic with glowing interfaces.",
        "Users can personalize their profiles, customize voice settings, and interact through various social features.",
        "The combination of spatial audio and visual effects creates an immersive experience unlike other platforms."
      ]
    };
    
    // Get thread-specific content or use default
    const threadContent = 
      threadSpecificContent[conversationThread as keyof typeof threadSpecificContent] || 
      threadSpecificContent["default"];
    
    // If we're at the beginning of a conversation, introduce the topic
    if (messagesExchanged === 0) {
      const topicIntros = [
        `I've been exploring ${conversationThread} in NexVox. What do you think about it?`,
        `${conversationThread} is one of my favorite aspects of NexVox. Have you tried it yet?`,
        `I'm really impressed with how NexVox handles ${conversationThread}. It's quite innovative.`
      ];
      
      const message = topicIntros[Math.floor(Math.random() * topicIntros.length)];
      
      // Save in conversation history
      conversationStateRef.current.lastFewMessages = [...lastFewMessages, message].slice(-3);
      
      return message;
    }
    
    // For continuation messages, use the thread content if available
    if (messagesExchanged <= threadContent.length) {
      const messageIndex = (messagesExchanged - 1) % threadContent.length;
      const message = threadContent[messageIndex];
      
      // Save in conversation history
      conversationStateRef.current.lastFewMessages = [...lastFewMessages, message].slice(-3);
      
      return message;
    }
    
    // For later messages, use NexVox-related follow-ups
    const nexvoxFollowUps = [
      "NexVox's approach to this feature really sets it apart from other platforms I've used.",
      "The way NexVox implemented this shows their focus on creating immersive social experiences.",
      "I've found this aspect of NexVox particularly useful when connecting with new people.",
      "The cyberpunk aesthetic of NexVox makes even this feature feel more engaging and futuristic.",
      "Have you noticed how this integrates with other NexVox features to create a cohesive experience?",
      "I'm curious how the NexVox team will expand on this feature in future updates.",
      "This is why I prefer NexVox over other social platforms for voice conversations.",
      "The attention to detail in this feature demonstrates NexVox's commitment to quality.",
      "What other NexVox features do you think complement this one particularly well?",
      "I think this feature really embodies the core philosophy behind NexVox as a platform."
    ];
    
    // For variety, occasionally transition to a new NexVox thread
    if (messagesExchanged > 8 && Math.random() > 0.7) {
      // Get a new thread about NexVox
      const newThread = generateConversationThread('');
      conversationStateRef.current.conversationThread = newThread;
      conversationStateRef.current.messagesExchanged = 0;
      
      const transitionMessages = [
        `Speaking of NexVox, another interesting feature is ${newThread}. Have you explored that?`,
        `That reminds me of another aspect of NexVox: ${newThread}. What do you think of it?`,
        `NexVox also offers ${newThread}, which connects to what we were discussing. Your thoughts?`,
        `Changing topics slightly, ${newThread} is another impressive part of NexVox I wanted to mention.`,
        `While we're discussing NexVox, I'm also impressed by ${newThread}. Have you tried it yet?`
      ];
      
      const message = transitionMessages[Math.floor(Math.random() * transitionMessages.length)];
      
      // Save in conversation history
      conversationStateRef.current.lastFewMessages = [...lastFewMessages, message].slice(-3);
      
      return message;
    }
    
    // Regular follow-up about NexVox
    const message = nexvoxFollowUps[Math.floor(Math.random() * nexvoxFollowUps.length)];
    
    // Save in conversation history
    conversationStateRef.current.lastFewMessages = [...lastFewMessages, message].slice(-3);
    
    return message;
  }, []);
  
  // Function to speak a message with a specific voice - USING THE SPEECH SYNTHESIS HOOK
  const speakMessage = useCallback((content: string, speaker: User) => {
    console.log("Starting speakMessage function using useSpeechSynthesis hook...");
    
    // Check speech synthesis availability early
    if (!supported) {
      console.error("Speech synthesis not supported in this browser");
      setIsProcessing(false);
      setCurrentSpeaker(null);
      setEnableWaveform(false);
      
      // Still continue the conversation flow even without speech
      setTimeout(() => {
        if (isConversationActive) {
          scheduleNextSpeakerRef.current(2000);
        }
      }, 1000);
      return;
    }
    
    try {
      let voiceToUse = null;
      let voiceAssigned = false;
      
      // Try to assign a voice based on available voices
      if (voices.length > 0) {
        try {
          // Use the speaker's ID to consistently assign the same voice to the same speaker
          const voiceIndex = Math.abs(speaker.id % voices.length);
          if (voices[voiceIndex]) {
            voiceToUse = voices[voiceIndex];
            voiceAssigned = true;
            console.log(`Voice assigned: ${voiceToUse.name}`);
          }
        } catch (voiceError) {
          console.warn("Failed to assign voice:", voiceError);
        }
      }
      
      if (!voiceAssigned) {
        console.log("No specific voice assigned, using default browser voice");
      }
      
      // Set up speech options
      const speechOptions = {
        voice: voiceToUse,
        pitch: 1.0 + ((speaker.id % 3) * 0.1), // Less variation (1.0-1.2)
        rate: 0.9 + ((speaker.id % 3) * 0.1),  // Less variation (0.9-1.1)
        volume: 1.0 // Maximum volume
      };
      
      // Set visual state before speaking
      setEnableWaveform(true);
      
      // Set up speech tracking 
      const speechStartTime = Date.now();
      const estimatedDuration = content.length * 50; // Roughly 50ms per character
      console.log(`Estimated speech duration: ${estimatedDuration}ms for ${content.length} characters`);
      
      // Set up safety timeout that will move to the next speaker
      // Even if the speech synthesis fails to fire onend event
      const safetyTimeout = setTimeout(() => {
        if (isConversationActive && currentSpeaker) {
          console.log("Safety timeout triggered - ensuring conversation continues");
          setIsProcessing(false);
          setCurrentSpeaker(null);
          setEnableWaveform(false);
          scheduleNextSpeakerRef.current(1000);
        }
      }, Math.min(10000, estimatedDuration * 1.5)); // Max 10 seconds or 1.5x estimated time
      
      // Setup a polling mechanism to detect when speech has ended
      // This is more reliable than depending on the speaking state from the hook
      const pollingSpeechEnd = () => {
        const speechPollInterval = setInterval(() => {
          const speechElapsedTime = Date.now() - speechStartTime;
          
          // Check if enough time has passed based on content length
          // or if speaking state is false after we've started
          if (speechElapsedTime > estimatedDuration || !speaking) {
            clearInterval(speechPollInterval);
            clearTimeout(safetyTimeout);
            
            console.log("Speech ended (detected via polling)");
            setIsProcessing(false);
            setCurrentSpeaker(null);
            setEnableWaveform(false);
            
            // Schedule next speaker after a delay
            setTimeout(() => {
              if (isConversationActive) {
                console.log("Scheduling next speaker after speech end");
                scheduleNextSpeakerRef.current(2000);
              }
            }, 500);
          }
        }, 200); // Check every 200ms
        
        // Cleanup the interval after maximum possible duration
        setTimeout(() => {
          clearInterval(speechPollInterval);
        }, estimatedDuration * 2); // Double the estimated time as maximum
      };
      
      // Start speech
      console.log("Attempting to speak using useSpeechSynthesis...");
      speak(content, speechOptions);
      
      // Start polling for speech end after a short delay
      // to ensure speech has actually started
      setTimeout(pollingSpeechEnd, 300);
      
    } catch (error) {
      console.error("Error in speakMessage:", error);
      setIsProcessing(false);
      setCurrentSpeaker(null);
      setEnableWaveform(false);
      
      // Try to continue the conversation despite errors
      setTimeout(() => {
        if (isConversationActive) {
          console.log("Attempting to continue conversation after error");
          scheduleNextSpeakerRef.current(2000);
        }
      }, 1000);
    }
  }, [isConversationActive, currentSpeaker, speak, supported, voices, speaking]);
  
  // Create a ref to store the latest version of scheduleNextSpeaker
  const scheduleNextSpeakerRef = useRef<(delay?: number) => void>(() => {});
  
  // Schedule speakers in sequence
  const scheduleNextSpeaker = useCallback((delay = 3000) => {
    if (!isConversationActive || users.length === 0) {
      console.log("Cannot schedule next speaker: conversation inactive or no users");
      return;
    }
    
    // Clear any existing timeout to prevent overlapping schedules
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    
    console.log(`Scheduling next speaker with delay: ${delay}ms`);
    
    speakingTimeoutRef.current = setTimeout(() => {
      // Double check conversation is still active when timeout fires
      if (!isConversationActive) {
        console.log("Conversation no longer active, canceling scheduled speaker");
        return;
      }
      
      // Debug log
      console.log("Scheduling next speaker, active speakers available:", users.length);
      console.log("Current conversation state:", conversationStateRef.current);
      
      // Select the next speaker that isn't the last one
      let nextSpeakerIndex = 0;
      const validSpeakerIndices = [];
      
      // Find valid speakers (not muted and not the last speaker)
      for (let i = 0; i < users.length; i++) {
        if (!mutedUsers.includes(users[i].id) && 
            (users.length <= 1 || users[i].id !== conversationStateRef.current.lastSpeakerId || 
             conversationStateRef.current.messagesExchanged === 0)) {
          validSpeakerIndices.push(i);
        }
      }
      
      console.log(`Valid speaker indices: ${validSpeakerIndices.join(', ')}`);
      
      if (validSpeakerIndices.length === 0) {
        console.log("No valid speakers available, using any speaker");
        // If all speakers are invalid, just pick a random one
        nextSpeakerIndex = Math.floor(Math.random() * users.length);
      } else {
        // Pick a random valid speaker
        const randomIndex = Math.floor(Math.random() * validSpeakerIndices.length);
        nextSpeakerIndex = validSpeakerIndices[randomIndex];
      }
      
      const nextSpeaker = users[nextSpeakerIndex];
      console.log(`Selected next speaker: ${nextSpeaker.name} (index ${nextSpeakerIndex})`);
      
      // Update conversation state
      conversationStateRef.current.lastSpeakerId = nextSpeaker.id;
      
      // Update UI state
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
      
      // Increment message count to progress through the conversation
      conversationStateRef.current.messagesExchanged += 1;
      
      // Generate and speak a message
      const messageContent = getNextMessage();
      console.log(`Speaker ${nextSpeaker.name} will say: "${messageContent}"`);
      
      // Force a short delay to ensure UI is updated before speech starts
      setTimeout(() => {
        // Create a message object (do this before speaking to ensure UI updates)
        sendMessage({
          message: messageContent,
          isUser: false,
          userName: nextSpeaker.name,
          timestamp: new Date(),
        });
        
        // Add to recent messages history
        conversationStateRef.current.lastFewMessages.push(messageContent);
        if (conversationStateRef.current.lastFewMessages.length > 5) {
          conversationStateRef.current.lastFewMessages.shift();
        }
        
        // Ensure we're speaking the message
        speakMessage(messageContent, nextSpeaker);
      }, 100);
    }, delay);
  }, [isConversationActive, users, mutedUsers, sendMessage, getNextMessage, speakMessage]);
  
  // Update the ref whenever scheduleNextSpeaker changes
  useEffect(() => {
    scheduleNextSpeakerRef.current = scheduleNextSpeaker;
  }, [scheduleNextSpeaker]);
  
  // Start the conversation - NOW EXPLICIT, not automatic
  const handleStartConversation = useCallback(() => {
    console.log("!! handleStartConversation function called !!");
    
    try {
      // CRITICAL: Force activation of the conversation - this must happen early
      setIsConversationActive(true);
      console.log("CONVERSATION ACTIVATED - now active state =", true);
      
      // Immediately hide the prompt
      setShowStartPrompt(false);
      setHasUserInteracted(true);
      
      // Reset toast tracker
      setToastShownRef(false);
      
      if (!supported || users.length === 0) {
        addToast("Cannot start conversation. Please try again later.", "error");
        return;
      }
      
      console.log("Starting conversation - proceeding with initialization");
      
      // Unblock audio - this is critical for browsers to allow audio
      initAudioContext();
      
      // Determine room topic from room name if available
      let detectedTopic = 'default';
      const roomName = room?.name?.toLowerCase() || '';
      
      // Try to match room name to a topic
      if (roomName.includes('tech') || roomName.includes('programming') || roomName.includes('coding') || roomName.includes('ai')) {
        detectedTopic = 'technology';
      } else if (roomName.includes('music') || roomName.includes('audio') || roomName.includes('sound')) {
        detectedTopic = 'music';
      } else if (roomName.includes('game') || roomName.includes('gaming')) {
        detectedTopic = 'gaming';
      } else if (roomName.includes('design') || roomName.includes('art')) {
        detectedTopic = 'design';
      }
      
      // Reset conversation state
      console.log(`Room topic detected: ${detectedTopic}`);
      const thread = generateConversationThread(detectedTopic);
      
      // Initialize conversation state
      conversationStateRef.current = {
        lastSpeakerId: -1,
        lastMessageType: '',
        messagesExchanged: 0,
        roomTopic: detectedTopic,
        lastFewMessages: [],
        conversationThread: thread
      };
      
      console.log(`Generated conversation thread: ${thread}`);
      
      // Important - set the active conversation state before scheduling speakers
      setIsConversationActive(true);
      console.log("Conversation state set to ACTIVE");
      
      // Tell users what topic and thread was detected
      addToast(`Starting conversation about: ${thread}`, "success");
      
      // Force speech synthesis reset and ensure access
      if (supported) {
        cancel();
        console.log("Cancelled any ongoing speech synthesis");
        
        // Some browsers need user interaction to enable speech synthesis
        // Try to speak a silent utterance to "unlock" the API
        console.log("Attempting to unlock speech synthesis with a silent utterance");
        speak(" ", {
          volume: 0.1
        });
        console.log("Speech synthesis unlock attempt complete");
      }
      
      // Force refresh of voices in case they weren't loaded
      availableVoices.current = voices;
      console.log(`Available voices: ${availableVoices.current.length}`);
      
      if (availableVoices.current.length <= 1) {
        // If only one voice is available, warn the user
        addToast("Limited voices available. Using pitch and rate variation instead.", "warning");
      }
      
      // DIRECTLY schedule the first speaker without announcement
      console.log("Directly scheduling first speaker");
      
      // Make sure we wait a moment before starting to give audio context time to initialize
      setTimeout(() => {
        scheduleNextSpeaker(500);
        
        // Ensure the conversation continues by adding another backup check
        // This helps if the first scheduling attempt fails
        setTimeout(() => {
          if (isConversationActive && !currentSpeaker && conversationStateRef.current.messagesExchanged === 0) {
            console.log("BACKUP: No speaker detected after 3 seconds, forcing reschedule");
            scheduleNextSpeaker(100);
          }
        }, 3000);
      }, 1000);
      
    } catch (error) {
      console.error("Error in handleStartConversation:", error);
      addToast("Error starting conversation. Please try again.", "error");
    }
  }, [users, scheduleNextSpeaker, room, addToast, initAudioContext, cancel, speak, supported, voices]);
  
  // Store previous hand raised state to prevent repeated acknowledgments
  const prevHandRaisedRef = useRef(false);
  
  // React to hand raising - FIX INFINITE LOOP
  const handleHandRaiseAcknowledgment = useCallback((handRaised: boolean) => {
    // SAFETY CHECK: Only do anything if the conversation is already active
    if (!isConversationActive) {
      console.log("Hand raised, but conversation not active. Ignoring.");
      return;
    }
    
    // Only acknowledge if hand is raised AND conversation is already active
    if (handRaised && isConversationActive && !prevHandRaisedRef.current) {
      console.log("Hand raised acknowledgment triggered during active conversation");
      prevHandRaisedRef.current = true;
      
      // Only acknowledge hand raising during an active conversation,
      // not use it to start conversations
      if (supported) {
        cancel();
      }
      
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = null;
      }
      
      try {
        // Need to acknowledge hand raise during conversation
        console.log("Acknowledging hand raise inside active conversation");
        
        // First cancel any ongoing speech to make the acknowledgement immediate
        if (supported) {
          cancel();
        }
        
        try {
          // Pause before acknowledgement to make it sound more natural
          setTimeout(() => {
            // Create hand raise acknowledgement message
            const acknowledgeMessage = `${currentUser.name} would like to speak.`;
            
            let voiceToUse = null;
            let voiceAssigned = false;
            
            // Try to assign a voice based on available voices
            if (voices.length > 0) {
              try {
                // Use the speaker's ID to consistently assign the same voice to the same speaker
                const voiceIndex = Math.abs(currentUser.id % voices.length);
                if (voices[voiceIndex]) {
                  voiceToUse = voices[voiceIndex];
                  voiceAssigned = true;
                  console.log(`Voice assigned: ${voiceToUse.name}`);
                }
              } catch (voiceError) {
                console.warn("Failed to assign voice:", voiceError);
              }
            }
            
            if (!voiceAssigned) {
              console.log("No specific voice assigned, using default browser voice");
            }
            
            // Set up speech options
            const speechOptions = {
              voice: voiceToUse,
              pitch: 1.0,
              rate: 1.0,
              volume: 1.0
            };
            
            // Enable waveform for visual feedback
            setEnableWaveform(true);
            
            // Set up callbacks to track when speech ends
            const checkSpeakingInterval = setInterval(() => {
              // If speaking has stopped, handle the end of speech
              if (!speaking) {
                clearInterval(checkSpeakingInterval);
                console.log("Hand raise acknowledgment completed");
                setEnableWaveform(false);
                
                // Resume conversation after acknowledgement
                setTimeout(() => {
                  if (isConversationActive) {
                    scheduleNextSpeakerRef.current(2000);
                  }
                }, 100);
              }
            }, 100);
            
            // Speak the message using the hook
            console.log("Acknowledging hand raise with speech synthesis...");
            speak(acknowledgeMessage, speechOptions);
            
            // Clean up interval after a maximum duration to prevent memory leaks
            setTimeout(() => {
              clearInterval(checkSpeakingInterval);
            }, 5000); // 5 second maximum duration for acknowledgement
            
          }, 100);
        } catch (err) {
          console.error("Error in hand raise acknowledgment:", err);
          scheduleNextSpeakerRef.current(1000);
        }
      } catch (err) {
        console.error("Error in hand raise acknowledgment:", err);
        scheduleNextSpeakerRef.current(1000);
      }
    } else if (!handRaised) {
      // Reset the ref when hand is lowered
      prevHandRaisedRef.current = false;
    }
    // Don't start a conversation if it's not already active
  }, [currentUser.name, isConversationActive, scheduleNextSpeaker, room, addToast, initAudioContext, cancel, speak, supported, voices]);
  
  // Force starting the conversation - a more direct approach
  const forceStartConversation = useCallback(() => {
    console.log("FORCE STARTING CONVERSATION");
    
    // First, ensure any existing conversation is stopped
    if (isConversationActive) {
      stopConversation();
    }
    
    // Always hide the start prompt
    setShowStartPrompt(false);
    setHasUserInteracted(true);
    
    // Reset toast tracker
    setToastShownRef(false);
    
    if (!supported || users.length === 0) {
      addToast("Cannot start conversation. Please try again later.", "error");
      return;
    }
    
    console.log("Proceeding with forced conversation initialization");
    
    // Unblock audio
    initAudioContext();
    
    // Generate a conversation thread
    const thread = generateConversationThread('default');
    console.log(`Generated conversation thread: ${thread}`);
    
    // Reset conversation state
    conversationStateRef.current = {
      lastSpeakerId: -1,
      lastMessageType: '',
      messagesExchanged: 0,
      roomTopic: 'default',
      lastFewMessages: [],
      conversationThread: thread
    };
    
    // IMMEDIATELY set conversation as active
    setIsConversationActive(true);
    
    // User feedback
    addToast(`Starting conversation about: ${thread}`, "success");
    
    // Reset speech synthesis
    if (supported) {
      cancel();
      
      // Unlock speech synthesis
      console.log("Attempting to unlock speech synthesis with a silent utterance");
      speak(" ", {
        volume: 0.1
      });
    }
    
    // First schedule with a delay to allow audio context to initialize
    console.log("Scheduling first speaker (FORCED)...");
    
    setTimeout(() => {
      scheduleNextSpeaker(500);
      
      // Add a backup to make sure conversation starts
      setTimeout(() => {
        if (isConversationActive && !currentSpeaker && conversationStateRef.current.messagesExchanged === 0) {
          console.log("BACKUP: No speaker detected after 3 seconds, forcing reschedule");
          scheduleNextSpeaker(100);
        }
      }, 3000);
    }, 1000);
    
  }, [users, scheduleNextSpeaker, addToast, initAudioContext, stopConversation, cancel, speak, supported]);
  
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
    forceStartConversation,
    stopConversation,
    handleHandRaiseAcknowledgment
  };
};

// Function to generate a specific conversation thread based on topic
const generateConversationThread = (topic: string) => {
  // NexVox-specific threads - prioritize these regardless of room topic
  const nexvoxThreads = [
    "NexVox's voice room features and experience",
    "Spatial audio and its impact on conversations",
    "Voice customization options in NexVox",
    "Creating and personalizing your NexVox profile",
    "NexVox events and community building",
    "The friends system and social networking",
    "Voice analytics and the vibe system",
    "NexVox's unique cyberpunk design aesthetic",
    "Voice commands and accessibility features",
    "NexVox compared to other social platforms"
  ];
  
  // Always use NexVox threads
  return nexvoxThreads[Math.floor(Math.random() * nexvoxThreads.length)];
}; 