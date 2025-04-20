import { User, ChatMessage } from "@/types/room";

// Type definitions
type ToastType = 'success' | 'error' | 'warning';
type AddToastFn = (message: string, type?: ToastType) => void;

/**
 * Handle sending a chat message
 */
export const handleSendMessage = (
  e: React.FormEvent,
  chatInput: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setChatInput: React.Dispatch<React.SetStateAction<string>>,
  currentUser: User,
  playClick: () => void,
  playSuccess: () => void,
  isAiAssistantActive: boolean,
  handleAiAssistant: (message: string) => void,
  simulateResponse: () => void
) => {
  e.preventDefault();
  if (chatInput.trim() === "") return;

  const userMessage = chatInput.trim();
  const newMessage: ChatMessage = {
    message: userMessage,
    isUser: true,
    timestamp: new Date(),
    userName: currentUser.name,
  };

  playClick();
  setMessages((prev) => [...prev, newMessage]);
  setChatInput("");
  playSuccess();

  if (isAiAssistantActive) {
    handleAiAssistant(userMessage);
  } else {
    simulateResponse();
  }
};

/**
 * Simulate a chat response
 */
export const simulateResponse = (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  setTimeout(() => {
    const responses = [
      "That's interesting!",
      "I see what you mean",
      "Thanks for sharing that",
      "Good point!",
      "I'll try that out",
    ];
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    const aiMessage: ChatMessage = {
      message: randomResponse,
      isUser: false,
      userName: "Alex",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
  }, 1000 + Math.random() * 2000);
};

/**
 * Handle quick replies
 */
export const handleQuickReply = (
  reply: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setShowQuickReplies: React.Dispatch<React.SetStateAction<boolean>>,
  isAiAssistantActive: boolean,
  handleAiAssistant: (message: string) => void,
  simulateQuickReplyResponse: (reply: string) => void
) => {
  setMessages((prev) => [...prev, { message: reply, isUser: true }]);
  setShowQuickReplies(false);

  if (isAiAssistantActive) {
    handleAiAssistant(reply);
  } else {
    simulateQuickReplyResponse(reply);
  }
};

/**
 * Simulate a response to a quick reply
 */
export const simulateQuickReplyResponse = (
  reply: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  setTimeout(() => {
    const responses = [
      "Sure, you can find that in settings -> audio -> spatial",
      "Let me help you, have you checked your input settings?",
      "Yeah, it's been great! Looking forward to more sessions like this",
      "We're discussing AI and the future of voice interfaces",
      "No problem, take your time",
      "Yes, this room is always open, 24/7",
      "Go to your profile and click the avatar section to change it",
      "You're welcome! Happy to help",
    ];

    // Logic to select appropriate response
    const quickReplies = [
      "How do I configure spatial audio?",
      "Can someone help me with my microphone?",
      "Great session today!",
      "What's the topic?",
      "Sorry, I'll be right back",
      "Is this room available 24/7?",
      "How do I change my avatar?",
      "Thanks for the help!",
    ];
    const responseIndex = quickReplies.indexOf(reply);
    const response =
      responseIndex !== -1
        ? responses[responseIndex]
        : responses[Math.floor(Math.random() * responses.length)];

    setMessages((prev) => [
      ...prev,
      { message: response, isUser: false, userName: "Moderator" },
    ]);
  }, 1000 + Math.random() * 2000);
};

/**
 * Handle AI assistant responses
 */
export const handleAiAssistant = (
  message: string,
  setIsAiTyping: React.Dispatch<React.SetStateAction<boolean>>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  setIsAiTyping(true);

  setTimeout(() => {
    const responses = {
      spatial: [
        "To configure spatial audio, go to Settings > Audio > Spatial positioning and adjust the sliders.",
        "Spatial audio works best with headphones. Make sure they're properly connected and then enable it in audio settings.",
      ],
      microphone: [
        "For microphone issues, check your browser permissions first, then verify your input device in settings.",
        "Try selecting a different microphone input in your device settings, then refresh NexVox.",
      ],
      help: [
        "I'm here to help! What specific feature are you having trouble with?",
        "I can assist with room settings, audio configuration, and general NexVox features. Just let me know what you need.",
      ],
    };

    let response: string;
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("spatial") ||
      lowerMessage.includes("audio position")
    ) {
      response =
        responses.spatial[
          Math.floor(Math.random() * responses.spatial.length)
        ];
    } else if (
      lowerMessage.includes("mic") ||
      lowerMessage.includes("microphone")
    ) {
      response =
        responses.microphone[
          Math.floor(Math.random() * responses.microphone.length)
        ];
    } else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("assist")
    ) {
      response =
        responses.help[Math.floor(Math.random() * responses.help.length)];
    } else {
      const genericResponses = [
        "I'm not sure I understand. Could you please rephrase your question?",
        "I can help with room settings, audio configuration, and general questions about NexVox features.",
      ];
      response =
        genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }

    setIsAiTyping(false);
    setMessages((prev) => [
      ...prev,
      { message: response, isUser: false, userName: "NexVox AI" },
    ]);
  }, 1500 + Math.random() * 1500);
};

/**
 * Toggle AI assistant
 */
export const toggleAiAssistant = (
  isAiAssistantActive: boolean,
  setIsAiAssistantActive: React.Dispatch<React.SetStateAction<boolean>>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  addToast: AddToastFn
) => {
  const newState = !isAiAssistantActive;
  setIsAiAssistantActive(newState);

  if (newState) {
    setMessages((prev) => [
      ...prev,
      {
        message:
          "NexVox AI Assistant is now active. How can I help you with your voice room experience?",
        isUser: false,
        userName: "NexVox AI",
      },
    ]);
    addToast("AI Assistant activated", "success");
  } else {
    setMessages((prev) => [
      ...prev,
      {
        message:
          "AI Assistant has been deactivated. Regular chat mode is now active.",
        isUser: false,
        userName: "System",
      },
    ]);
    addToast("AI Assistant deactivated", "warning");
  }
};

/**
 * Handle user hover
 */
export const handleUserHover = (
  user: User,
  mouseX: number,
  mouseY: number,
  setHoveredUser: React.Dispatch<React.SetStateAction<{
    user: User | null;
    position: { x: number; y: number };
  }>>
) => {
  setHoveredUser({ user, position: { x: mouseX, y: mouseY } });
};

/**
 * Handle end of user hover
 */
export const handleUserHoverEnd = (
  setHoveredUser: React.Dispatch<React.SetStateAction<{
    user: User | null;
    position: { x: number; y: number };
  }>>
) => {
  setHoveredUser({ user: null, position: { x: 0, y: 0 } });
};

/**
 * Toggle user profile visibility
 */
export const toggleUserProfile = (
  showUserProfile: boolean,
  setShowUserProfile: React.Dispatch<React.SetStateAction<boolean>>,
  playClick: () => void
) => {
  playClick();
  setShowUserProfile(!showUserProfile);
};

/**
 * Toggle audio settings visibility
 */
export const toggleAudioSettings = (
  isAudioSettingsOpen: boolean,
  setIsAudioSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  playClick: () => void,
  addToast: AddToastFn
) => {
  const newSettingsState = !isAudioSettingsOpen;
  setIsAudioSettingsOpen(newSettingsState);
  playClick();
  if (newSettingsState) {
    addToast("Audio settings opened", "success");
  }
};

/**
 * Toggle share modal visibility
 */
export const toggleShareModal = (
  isShareModalOpen: boolean,
  setIsShareModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  playClick: () => void
) => {
  playClick();
  setIsShareModalOpen(!isShareModalOpen);
};
