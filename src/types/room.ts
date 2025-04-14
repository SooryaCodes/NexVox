// Types for room page components
export interface User {
  id: number;
  name: string;
  avatarUrl?: string;
  isHost?: boolean;
  isSpeaking?: boolean;
  badges?: string[];
  status?: 'online' | 'away' | 'busy' | 'offline';
  level?: number;
  bio?: string;
  email?: string;
  joinDate?: string;
  avatarType?: 'cyan' | 'purple' | 'pink' | 'gradient' | 'blue' | 'green';
  avatarAnimation?: 'pulse' | 'wave' | 'bounce' | 'glitch' | 'none';
  stats?: {
    roomsJoined?: number;
    connectionsCount?: number;
    hoursSpent?: number;
    communitiesJoined?: number;
  };
}

// Avatar options for consistent selection
export const AVATAR_TYPES = {
  CYAN: 'cyan',
  PURPLE: 'purple',
  PINK: 'pink',
  GRADIENT: 'gradient',
  BLUE: 'blue',
  GREEN: 'green'
} as const;

// Animation types for avatar
export const AVATAR_ANIMATIONS = {
  PULSE: 'pulse',
  WAVE: 'wave',
  BOUNCE: 'bounce',
  GLITCH: 'glitch',
  NONE: 'none'
} as const;

export interface Room {
  id: number;
  name: string;
  description?: string;
  participantCount: number;
  type: 'music' | 'conversation' | 'gaming' | 'chill';
  isPrivate?: boolean;
}

export interface ChatMessage {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  userName?: string;
}

export const TABS = {
  CHAT: 'chat',
  PARTICIPANTS: 'participants',
  SETTINGS: 'settings',
  PROFILE: 'profile'
} as const;

// AI assistant responses
export const aiResponses = {
  spatial: [
    "To enable spatial audio, go to Settings tab > Spatial Audio Settings > toggle 'Enable Spatial Audio'.",
    "If you want a more immersive experience, try the 'Exponential' distance model in spatial audio settings."
  ],
  microphone: [
    "For microphone issues, first check if you've selected the correct input device in Settings > Audio Settings.",
    "If you're experiencing echo, enable Echo Cancellation in Voice Processing section."
  ],
  avatar: [
    "You can change your avatar by going to the Profile tab and clicking on your current avatar.",
    "We support custom uploads and a variety of preset avatars to choose from."
  ],
  room: [
    "This room is available 24/7 for all members.",
    "You can bookmark this room for easy access later."
  ],
  help: [
    "I can help you with: audio settings, connection issues, room features, chat commands, and avatar customization.",
    "Type what you need help with, and I'll do my best to assist you!"
  ]
};

// Quick replies
export const quickReplies = [
  "How do I enable spatial audio?",
  "Can someone help me with my mic setup?",
  "Great discussion everyone!",
  "What topic are we discussing now?",
  "I need to step away for a minute",
  "Is this room available 24/7?",
  "How do I change my avatar?",
  "Thanks for the information!"
];
