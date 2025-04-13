"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import roomsData from "../../data/rooms.json";
import usersDataRaw from "../../data/users.json";
import GlitchText from "@/components/GlitchText";
import AudioWaveform from "@/components/AudioWaveform";
import HolographicCard from "@/components/HolographicCard";
import NeonGrid from "@/components/NeonGrid";
import Link from "next/link";
import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";

// Register ScrollTrigger with GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Types
interface User {
  id: number;
  name: string;
  avatarUrl?: string;
  isHost?: boolean;
  isSpeaking?: boolean;
  badges?: string[];
  status?: 'online' | 'away' | 'busy';
  level?: number;
}

interface Room {
  id: number;
  name: string;
  description?: string;
  participantCount: number;
  type: 'music' | 'conversation' | 'gaming' | 'chill';
  isPrivate?: boolean;
}

interface ChatMessage {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  userName?: string;
}

// Cast the imported data to our defined types
const usersData = usersDataRaw as unknown as User[];

// Custom cursor component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);
    
    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);
  
  if (typeof window === 'undefined') return null;
  
  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ mixBlendMode: 'exclusion' }}
    >
      <m.div
        className="w-4 h-4 rounded-full bg-white fixed"
        style={{
          x: position.x - 8,
          y: position.y - 8,
          opacity: visible ? 1 : 0
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: visible ? 1 : 0
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut'
        }}
      />
    </div>
  );
};

// Chat Bubble Component
const ChatBubble: React.FC<ChatMessage> = ({ message, isUser, userName }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div 
      className={`max-w-xs px-4 py-2 rounded-2xl ${
        isUser 
          ? 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/30 rounded-tr-none' 
          : 'bg-[#9D00FF]/20 text-white border border-[#9D00FF]/30 rounded-tl-none'
      }`}
    >
      {!isUser && userName && (
        <div className="text-xs text-[#9D00FF] mb-1 font-semibold">{userName}</div>
      )}
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

// Quick Replies for assistive chat
const quickReplies = [
  "How do I enable spatial audio?",
  "Can someone help me with my mic setup?",
  "Great discussion everyone!",
  "What topic are we discussing now?",
  "I need to step away for a minute",
  "Is this room available 24/7?",
  "How do I change my avatar?",
  "Thanks for the information!"
];

// AI assistant responses for common questions
const aiResponses = {
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

// React Messages Array
const chatMessages: ChatMessage[] = [
  { message: "Anyone know how to configure spatial audio?", isUser: false, userName: "Alex" },
  { message: "You need to enable it in settings first", isUser: true },
  { message: "Thanks! Got it working now", isUser: false, userName: "Alex" }
];

// Audio Level Indicator
const AudioLevelIndicator: React.FC<{ level: number }> = ({ level }) => (
  <div className="flex items-center gap-1 h-4">
    {[...Array(8)].map((_, i) => (
      <div 
        key={i}
        className={`w-1 rounded-full ${
          i < level 
            ? i < 3 
              ? 'bg-[#00FFFF] h-1' 
              : i < 6 
                ? 'bg-[#9D00FF] h-2' 
                : 'bg-[#FF00E6] h-3'
            : 'bg-white/20 h-1'
        }`}
      />
    ))}
  </div>
);

// User Avatar Component
const UserAvatar: React.FC<{ user: User; position: { x: number; y: number }; index: number }> = ({ user, position, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <m.div
      className="absolute"
      style={{ 
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 10 : 5 - index
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Avatar border with pulse effect for speaking indicator */}
        <div className={`absolute inset-0 rounded-full ${
          user.isSpeaking 
            ? 'border-2 border-[#00FFFF] animate-pulse' 
            : 'border border-white/20'
        }`}></div>
        
        {/* Avatar image */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center">
          {user.avatarUrl ? (
            <Image 
              src={user.avatarUrl}
              alt={user.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
              <span className="text-xl font-bold">{user.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        {/* User badges shown in avatar */}
        {user.badges && user.badges.length > 0 && (
          <div className="absolute -top-2 -right-2 flex">
            {user.badges.slice(0, 2).map((badge, i) => (
              <div 
                key={i} 
                className="w-6 h-6 rounded-full bg-black border border-[#00FFFF] flex items-center justify-center text-xs ml-1"
                title={badge}
              >
                {badge[0]}
              </div>
            ))}
          </div>
        )}
        
        {/* User name tag */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm border border-white/10 whitespace-nowrap"
        >
          {user.isHost && (
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FFFF] mr-1"></span>
          )}
          {user.name}
        </m.div>
      </div>
    </m.div>
  );
};

// Room side panel tabs
const TABS = {
  CHAT: 'chat',
  PARTICIPANTS: 'participants',
  SETTINGS: 'settings',
  PROFILE: 'profile'
};

// Control Button Component - Replace emojis with SVG icons
const ControlButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
  isActive?: boolean;
  danger?: boolean;
}> = ({ icon, label, onClick, color = "#FFFFFF", isActive = false, danger = false }) => {
  return (
    <m.button
      className={`p-3 rounded-full relative ${
        danger 
          ? 'bg-red-500/20' 
          : isActive 
            ? `bg-${color.replace('#', '')}/20` 
            : 'bg-white/5'
      } border ${
        danger 
          ? 'border-red-500/30' 
          : isActive 
            ? `border-${color.replace('#', '')}/30` 
            : 'border-white/10'
      } text-${
        danger 
          ? 'red-400' 
          : isActive 
            ? color.replace('#', '') 
            : 'white'
      }`}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: danger ? "rgba(220, 38, 38, 0.3)" : isActive ? `rgba(${color === "#00FFFF" ? "0, 255, 255" : color === "#9D00FF" ? "157, 0, 255" : "255, 255, 255"}, 0.2)` : "rgba(255, 255, 255, 0.1)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
    </m.button>
  );
};

// User profile card for sharing
const UserProfileCard: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      
      <HolographicCard className="relative max-w-md w-full p-8">
        <button 
          className="absolute top-4 right-4 text-white/70 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center mb-4">
            {user.avatarUrl ? (
              <Image 
                src={user.avatarUrl}
                alt={user.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
                <span className="text-3xl font-bold">{user.name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-orbitron text-[#00FFFF] mb-2">{user.name}</h3>
          
          {/* User level */}
          <div className="flex items-center gap-2 mb-6">
            <div className="px-3 py-1 bg-[#00FFFF]/20 rounded-full text-xs border border-[#00FFFF]/30">
              Level {user.level || 1}
            </div>
            {user.isHost && (
              <div className="px-3 py-1 bg-[#9D00FF]/20 rounded-full text-xs border border-[#9D00FF]/30">
                Host
              </div>
            )}
          </div>
          
          {/* Badges section */}
          {user.badges && user.badges.length > 0 && (
            <div className="w-full mb-6">
              <h4 className="text-sm text-white/70 mb-2">Badges</h4>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <div key={index} className="px-3 py-1 bg-black/40 rounded-full text-xs border border-[#00FFFF]/30">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Share buttons */}
          <div className="w-full mt-4">
            <div className="flex justify-center gap-4">
              <m.button
                className="p-3 rounded-full bg-[#00FFFF]/20 border border-[#00FFFF]/30 text-[#00FFFF]"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </m.button>
              <m.button
                className="p-3 rounded-full bg-[#9D00FF]/20 border border-[#9D00FF]/30 text-[#9D00FF]"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(157, 0, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </m.button>
              <m.button
                className="p-3 rounded-full bg-[#FF00E6]/20 border border-[#FF00E6]/30 text-[#FF00E6]"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(255, 0, 230, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </m.button>
            </div>
          </div>
        </div>
      </HolographicCard>
    </m.div>
  );
};

type Props = {
  params: { id: string }
}

export default function RoomPage({ params }: Props) {
  const router = useRouter();
  const roomId = parseInt(params.id as string);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isAiAssistantActive, setIsAiAssistantActive] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: "You",
    level: 24,
    badges: ["Early Adopter", "Spatial Audio Pro", "Night Owl"]
  });
  
  // Set sidebar default based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Use larger breakpoint for room page
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate avatar positions in a circle
  const calculateAvatarPositions = (containerWidth: number, containerHeight: number, userCount: number) => {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) * 0.35;
    
    return usersData.slice(0, 5).map((_, index) => {
      const angle = (index / userCount) * Math.PI * 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
  };
  
  // Send message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;
    
    const userMessage = chatInput.trim();
    setMessages([...messages, { message: userMessage, isUser: true }]);
    setChatInput('');
    
    // If AI assistant is active, process the message with AI
    if (isAiAssistantActive) {
      handleAiAssistant(userMessage);
    } else {
      // Simulate a regular user response
      setTimeout(() => {
        const responses = [
          "That's interesting!",
          "I see what you mean",
          "Thanks for sharing that",
          "Good point!",
          "I'll try that out"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { message: randomResponse, isUser: false, userName: "Alex" }]);
      }, 1000 + Math.random() * 2000);
    }
  };
  
  // Quick reply handler
  const handleQuickReply = (reply: string) => {
    setMessages([...messages, { message: reply, isUser: true }]);
    setShowQuickReplies(false);
    
    // If AI assistant is active, use AI to respond to quick replies
    if (isAiAssistantActive) {
      handleAiAssistant(reply);
    } else {
      // Simulate a response
      setTimeout(() => {
        const responses = [
          "Sure, you can find that in settings -> audio -> spatial",
          "Let me help you, have you checked your input settings?",
          "Yeah, it's been great! Looking forward to more sessions like this",
          "We're discussing AI and the future of voice interfaces",
          "No problem, take your time",
          "Yes, this room is always open, 24/7",
          "Go to your profile and click the avatar section to change it",
          "You're welcome! Happy to help"
        ];
        const responseIndex = quickReplies.indexOf(reply);
        const response = responseIndex !== -1 ? responses[responseIndex] : 
                         responses[Math.floor(Math.random() * responses.length)];
                         
        setMessages(prev => [...prev, { message: response, isUser: false, userName: "Moderator" }]);
      }, 1000 + Math.random() * 2000);
    }
  };
  
  // AI Assistant handler
  const handleAiAssistant = (message: string) => {
    setIsAiTyping(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      let response: string;
      
      // Check message content against known topics
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('spatial') || lowerMessage.includes('audio position')) {
        response = aiResponses.spatial[Math.floor(Math.random() * aiResponses.spatial.length)];
      } 
      else if (lowerMessage.includes('mic') || lowerMessage.includes('microphone') || lowerMessage.includes('audio input')) {
        response = aiResponses.microphone[Math.floor(Math.random() * aiResponses.microphone.length)];
      }
      else if (lowerMessage.includes('avatar') || lowerMessage.includes('profile picture')) {
        response = aiResponses.avatar[Math.floor(Math.random() * aiResponses.avatar.length)];
      }
      else if (lowerMessage.includes('room') || lowerMessage.includes('available') || lowerMessage.includes('24/7')) {
        response = aiResponses.room[Math.floor(Math.random() * aiResponses.room.length)];
      }
      else if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('support')) {
        response = aiResponses.help[Math.floor(Math.random() * aiResponses.help.length)];
      }
      else {
        // Generic responses for unrecognized queries
        const genericResponses = [
          "I'm not sure I understand. Could you please rephrase your question?",
          "I can help with room settings, audio configuration, and general questions about NexVox features.",
          "That's outside my current capabilities, but I'm learning more every day!",
          "Interesting question! Let me think about that and get back to you.",
          "I'm here to help with room settings and voice features. What specific aspect are you interested in?"
        ];
        response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }
      
      setIsAiTyping(false);
      setMessages(prev => [...prev, { message: response, isUser: false, userName: "NexVox AI" }]);
    }, 1500 + Math.random() * 1500); // Randomized delay between 1.5-3s for realism
  };
  
  // Toggle AI Assistant
  const toggleAiAssistant = () => {
    const newState = !isAiAssistantActive;
    setIsAiAssistantActive(newState);
    
    // Notify user about the AI assistant status
    if (newState) {
      setMessages(prev => [...prev, { 
        message: "NexVox AI Assistant is now active. How can I help you with your voice room experience?", 
        isUser: false, 
        userName: "NexVox AI" 
      }]);
    } else {
      setMessages(prev => [...prev, { 
        message: "AI Assistant has been deactivated. Regular chat mode is now active.", 
        isUser: false, 
        userName: "System" 
      }]);
    }
  };
  
  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Get room data and setup initial state
  useEffect(() => {
    const fetchRoom = () => {
      const foundRoom = roomsData.find(r => r.id === roomId);
      if (foundRoom) {
        setRoom(foundRoom as Room);
      } else {
        // Redirect to rooms page if room not found
        router.push("/rooms");
      }
      setLoading(false);
    };
    
    // Simulate API call
    setTimeout(fetchRoom, 500);
  }, [roomId, router]);
  
  // Handle avatar positions on window resize
  const [avatarPositions, setAvatarPositions] = useState<Array<{x: number; y: number}>>([]);
  
  useEffect(() => {
    if (!loading && avatarContainerRef.current) {
      const updatePositions = () => {
        const { width, height } = avatarContainerRef.current!.getBoundingClientRect();
        setAvatarPositions(calculateAvatarPositions(width, height, usersData.length));
      };
      
      updatePositions();
      window.addEventListener("resize", updatePositions);
      
      return () => {
        window.removeEventListener("resize", updatePositions);
      };
    }
  }, [loading, isSidebarOpen]);
  
  // Add scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleAudioSettings = () => {
    setIsAudioSettingsOpen(!isAudioSettingsOpen);
  };
  
  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-[#00FFFF] rounded-full animate-spin"></div>
          <div className="absolute top-1 left-1 right-1 bottom-1 border-4 border-transparent border-l-[#9D00FF] rounded-full animate-spin animate-reverse"></div>
          <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-transparent border-b-[#FF00E6] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <CustomCursor />
      
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-10 z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-[#00FFFF]/5 via-black to-[#FF00E6]/5 z-0"></div>
      <NeonGrid color="#00FFFF" secondaryColor="#9D00FF" opacity={0.05} />
      
      {/* Enhanced Header with User Profile */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/rooms" className="flex items-center gap-2 text-[#00FFFF] font-orbitron">
              <m.div
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="ml-2 hidden sm:inline">Back to Rooms</span>
              </m.div>
            </Link>
            
            {/* Room name in header - only displayed on scroll */}
            <AnimatePresence>
              {isScrolled && (
                <m.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="hidden md:block"
                >
                  <h3 className="text-lg font-orbitron text-[#00FFFF]">{room?.name}</h3>
                </m.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User Controls */}
          <div className="flex items-center gap-3">
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#00FFFF]/50 transition-colors"
              aria-label="Toggle audio settings"
              onClick={toggleAudioSettings}
            >
              {isAudioSettingsOpen ? (
                <IoSettingsOutline className="w-5 h-5 text-[#00FFFF]" />
              ) : (
                <IoSettingsOutline className="w-5 h-5" />
              )}
            </m.button>
            
            <button 
              className="relative p-3 rounded-full hover:bg-white/5 transition-colors"
              onClick={toggleUserProfile}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#00FFFF]/50">
                <Image 
                  src="/images/user-avatar.jpg" 
                  alt="Your profile" 
                  width={32} 
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="pt-16 flex h-screen">
        {/* Main Room Area */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:mr-[350px]' : ''}`}>
          <div className="py-8 px-6 h-full flex flex-col">
            <div className="mb-4 text-center">
              <GlitchText
                text={room?.name || "Voice Room"}
                className="text-4xl font-orbitron mb-2"
                color="cyan"
                intensity="medium"
                activeOnView={true}
              />
              
              {/* Room description */}
              {room?.description && (
                <p className="text-white/60 max-w-lg mx-auto mb-4">{room.description}</p>
              )}
              
              {/* Room stats */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-[#00FFFF]/10">
                  <div className="text-xs text-white/50 mb-1">Participants</div>
                  <div className="text-xl font-orbitron text-[#00FFFF]">{room?.participantCount}</div>
                </div>
                <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-[#9D00FF]/10">
                  <div className="text-xs text-white/50 mb-1">Active Speakers</div>
                  <div className="text-xl font-orbitron text-[#9D00FF]">5</div>
                </div>
                <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-[#FF00E6]/10">
                  <div className="text-xs text-white/50 mb-1">Room Type</div>
                  <div className="text-xl font-orbitron text-[#FF00E6] capitalize">{room?.type}</div>
                </div>
              </div>
              
              {/* Audio activity visualization */}
              <div className="max-w-md mx-auto mt-6">
                <AudioWaveform 
                  width={400} 
                  height={40} 
                  bars={40} 
                  color="#00FFFF" 
                  activeColor="#FF00E6" 
                  className="transform scale-90 md:scale-100"
                />
              </div>
            </div>
            
            {/* User avatars in circle layout */}
            <div 
              ref={avatarContainerRef}
              className="relative flex-1 h-[500px] mb-8 flex items-center justify-center"
              aria-label="Users in room"
            >
              {/* Center room indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00FFFF]/10 to-[#9D00FF]/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#00FFFF]/30 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Sound waves */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 rounded-full border-2 border-[#00FFFF]/10 animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-0 rounded-full border border-[#00FFFF]/5 animate-ping" style={{ animationDuration: '4s' }}></div>
                </div>
              </div>
              
              {/* User avatars */}
              {avatarPositions.length > 0 && 
                usersData.slice(0, 5).map((user: User, index) => (
                  <UserAvatar 
                    key={user.id} 
                    user={user} 
                    index={index} 
                    position={avatarPositions[index]} 
                  />
                ))
              }
            </div>
          </div>
        </div>
        
        {/* Sidebar Toggle Button - improved for accessibility */}
        <m.button
          className="fixed hidden lg:block top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-md border border-white/10 rounded-l-md p-3 z-30 hover:bg-black/90"
          whileHover={{ 
            x: -3,
            borderColor: "#00FFFF",
            color: "#00FFFF",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)"
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ right: isSidebarOpen ? '350px' : '0' }}
          aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </m.button>
        
        {/* Enhanced Sidebar Panel */}
        <div 
          className={`fixed top-16 bottom-0 right-0 w-full md:w-[350px] bg-black/80 backdrop-blur-xl border-l border-white/10 z-20 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} overflow-hidden shadow-xl`}
          aria-hidden={!isSidebarOpen}
        >
          {/* Close button for mobile */}
          <button 
            className="absolute top-4 right-4 lg:hidden text-white/70 hover:text-white p-2 z-10"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-white/10">
            {Object.values(TABS).map((tab) => (
              <m.button
                key={tab}
                className={`flex-1 py-4 text-center text-sm font-medium ${
                  activeTab === tab 
                    ? 'text-[#00FFFF] border-b-2 border-[#00FFFF]' 
                    : 'text-white/70 hover:text-white'
                }`}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </m.button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {/* Chat Tab - Enhanced with quick replies */}
            {activeTab === TABS.CHAT && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {messages.map((msg, i) => (
                    <ChatBubble key={i} {...msg} />
                  ))}
                  
                  {/* AI typing indicator */}
                  {isAiTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="max-w-xs px-4 py-2 rounded-2xl bg-[#9D00FF]/20 text-white border border-[#9D00FF]/30 rounded-tl-none">
                        <div className="text-xs text-[#9D00FF] mb-1 font-semibold">NexVox AI</div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#9D00FF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-[#9D00FF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-[#9D00FF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
                
                {/* Quick replies section */}
                <AnimatePresence>
                  {showQuickReplies && (
                    <m.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 border-t border-white/10 bg-black/40"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-[#00FFFF]">Quick Replies</h3>
                        <button 
                          onClick={() => setShowQuickReplies(false)}
                          className="text-white/50 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {quickReplies.map((reply, index) => (
                          <m.button
                            key={index}
                            className="text-left p-2 bg-[#00FFFF]/10 rounded-md border border-[#00FFFF]/20 text-sm hover:bg-[#00FFFF]/20"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickReply(reply)}
                          >
                            {reply}
                          </m.button>
                        ))}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
                
                <div className="p-4 border-t border-white/10">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={isAiAssistantActive ? "Ask the AI assistant..." : "Type a message..."}
                      className="flex-1 bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors"
                    />
                    
                    <m.button
                      type="button"
                      className={`${isAiAssistantActive ? 'bg-[#FF00E6]/20 border-[#FF00E6]/50 text-[#FF00E6]' : 'bg-black/40 border-white/10 text-white/70'} border px-3 rounded-md`}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: isAiAssistantActive ? "0 0 15px rgba(255, 0, 230, 0.3)" : "0 0 15px rgba(255, 255, 255, 0.1)" 
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleAiAssistant}
                      aria-label={isAiAssistantActive ? "Deactivate AI assistant" : "Activate AI assistant"}
                    >
                      <svg width="20" height="20" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M96 176C93.3333 176 91.1667 175.111 89.5 173.333C87.8333 171.556 87 169.333 87 166.667C87 164 87.8889 161.778 89.6667 160C91.4444 158.222 93.6667 157.333 96.3333 157.333C99 157.333 101.222 158.222 103 160C104.778 161.778 105.667 164 105.667 166.667C105.667 169.333 104.778 171.556 103 173.333C101.222 175.111 99 176 96 176ZM26.6667 146.667C24 146.667 21.8333 145.778 20.1667 144C18.5 142.222 17.6667 140 17.6667 137.333C17.6667 134.667 18.5556 132.444 20.3333 130.667C22.1111 128.889 24.3333 128 27 128C29.6667 128 31.8889 128.889 33.6667 130.667C35.4444 132.444 36.3333 134.667 36.3333 137.333C36.3333 140 35.4444 142.222 33.6667 144C31.8889 145.778 29.6667 146.667 27 146.667H26.6667ZM96 146.667C78.2222 146.667 63.6111 140.111 52.1667 127C40.7222 113.889 35 97.7778 35 78.6667C35 59.5556 40.7222 43.4444 52.1667 30.3333C63.6111 17.2222 78.2222 10.6667 96 10.6667C113.778 10.6667 128.389 17.2222 139.833 30.3333C151.278 43.4444 157 59.5556 157 78.6667C157 97.7778 151.278 113.889 139.833 127C128.389 140.111 113.778 146.667 96 146.667ZM96 128C107.333 128 116.833 123.778 124.5 115.333C132.167 106.889 136 93.7778 136 78C136 62.2222 132.167 49.1111 124.5 40.6667C116.833 32.2222 107.333 28 96 28C84.6667 28 75.1667 32.2222 67.5 40.6667C59.8333 49.1111 56 62.2222 56 78C56 93.7778 59.8333 106.889 67.5 115.333C75.1667 123.778 84.6667 128 96 128ZM165.333 146.667C162.667 146.667 160.5 145.778 158.833 144C157.167 142.222 156.333 140 156.333 137.333C156.333 134.667 157.222 132.444 159 130.667C160.778 128.889 163 128 165.667 128C168.333 128 170.556 128.889 172.333 130.667C174.111 132.444 175 134.667 175 137.333C175 140 174.111 142.222 172.333 144C170.556 145.778 168.333 146.667 165.667 146.667H165.333Z" fill="currentColor"/>
                      </svg>
                    </m.button>
                    
                    <m.button
                      type="button"
                      className="bg-[#9D00FF]/20 border border-[#9D00FF]/50 text-[#9D00FF] px-3 rounded-md"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(157, 0, 255, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      aria-label="Show quick replies"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </m.button>
                    
                    <m.button
                      type="submit"
                      className="bg-[#00FFFF]/20 border border-[#00FFFF]/50 text-[#00FFFF] px-3 rounded-md"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      disabled={chatInput.trim() === ''}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </m.button>
                  </form>
                </div>
              </div>
            )}
            
            {/* Participants Tab - Improved design */}
            {activeTab === TABS.PARTICIPANTS && (
              <div className="p-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="mb-6">
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search participants..."
                      className="w-full bg-black/40 border border-white/10 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors"
                    />
                  </div>
                </div>
                
                {/* Participant stats */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-black/40 rounded-lg p-3 text-center border border-white/5">
                    <div className="text-2xl font-orbitron text-[#00FFFF]">{usersData.length}</div>
                    <div className="text-xs text-white/50 mt-1">Total</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 text-center border border-white/5">
                    <div className="text-2xl font-orbitron text-[#9D00FF]">3</div>
                    <div className="text-xs text-white/50 mt-1">Speaking</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 text-center border border-white/5">
                    <div className="text-2xl font-orbitron text-[#FF00E6]">2</div>
                    <div className="text-xs text-white/50 mt-1">Hands Up</div>
                  </div>
                </div>
                
                {/* User list with improved card design */}
                <div className="space-y-3">
                  {usersData.map((user: User) => (
                    <m.div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:bg-white/5 hover:border-white/10 cursor-pointer"
                      whileHover={{ x: 5, boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)" }}
                    >
                      <div className={`
                        w-12 h-12 rounded-full 
                        bg-black 
                        border-2 ${user.isSpeaking ? 'border-[#00FFFF]' : 'border-[#9D00FF]/50'} 
                        flex items-center justify-center
                        ${user.isSpeaking ? 'shadow-[0_0_10px_rgba(0,255,255,0.5)]' : ''}
                        relative
                      `}>
                        {user.avatarUrl ? (
                          <Image 
                            src={user.avatarUrl}
                            alt={user.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="font-orbitron text-lg">{user.name.charAt(0)}</span>
                        )}
                        
                        {user.isSpeaking && (
                          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00FFFF] rounded-full border border-black"></span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium">{user.name}</p>
                          {user.isSpeaking && (
                            <div className="ml-2">
                              <AudioLevelIndicator level={Math.floor(Math.random() * 8)} />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-xs py-0.5 px-2 rounded-full bg-[#00FFFF]/10 text-[#00FFFF]/80 border border-[#00FFFF]/20">
                            {user.isSpeaking ? 'Speaking' : 'Not speaking'}
                          </div>
                          {user.isHost && (
                            <div className="text-xs py-0.5 px-2 rounded-full bg-[#9D00FF]/10 text-[#9D00FF]/80 border border-[#9D00FF]/20">
                              Host
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <m.button
                          className="p-2 bg-black/40 rounded-md border border-white/10 text-sm"
                          whileHover={{ borderColor: "#00FFFF", color: "#00FFFF" }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Message user"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </m.button>
                        <m.button
                          className="p-2 bg-black/40 rounded-md border border-white/10 text-sm"
                          whileHover={{ borderColor: "#FF00E6", color: "#FF00E6" }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Mute user"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          </svg>
                        </m.button>
                      </div>
                    </m.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Settings Tab - Completely redesigned with better UI */}
            {activeTab === TABS.SETTINGS && (
              <div className="overflow-y-auto h-full">
                <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 border-b border-white/10">
                  <h3 className="text-lg font-orbitron text-[#00FFFF]">Room Settings</h3>
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Audio Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Audio Settings
                    </h4>
                    
                    <div className="space-y-3 pl-2 border-l-2 border-[#00FFFF]/30">
                      <div className="space-y-2">
                        <label className="block text-sm text-white/70">Audio Input</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors">
                          <option>Default Microphone</option>
                          <option>External Microphone</option>
                          <option>Headset Microphone</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm text-white/70">Audio Output</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors">
                          <option>Default Speakers</option>
                          <option>Headphones</option>
                          <option>External Speakers</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm text-white/70">Microphone Volume</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          defaultValue="80"
                          className="w-full accent-[#00FFFF]" 
                        />
                        <div className="flex justify-between text-xs text-white/50">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Spatial Audio Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9D00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Spatial Audio Settings
                    </h4>
                    
                    <div className="space-y-4 pl-2 border-l-2 border-[#9D00FF]/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Enable Spatial Audio</span>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-black/40 border border-white/10">
                          <m.div
                            className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#9D00FF]"
                            layout
                            animate={{ x: 20 }} 
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm text-white/70">Distance Model</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] transition-colors">
                          <option>Inverse</option>
                          <option>Linear</option>
                          <option>Exponential</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm text-white/70">Room Size</label>
                        <div className="grid grid-cols-3 gap-2">
                          <m.button
                            className="py-2 bg-black/40 rounded-md border border-[#9D00FF] text-[#9D00FF] text-sm"
                            whileHover={{ backgroundColor: "rgba(157, 0, 255, 0.2)" }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Small
                          </m.button>
                          <m.button
                            className="py-2 bg-black/40 rounded-md border border-white/10 text-sm"
                            whileHover={{ borderColor: "#9D00FF", color: "#9D00FF" }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Medium
                          </m.button>
                          <m.button
                            className="py-2 bg-black/40 rounded-md border border-white/10 text-sm"
                            whileHover={{ borderColor: "#9D00FF", color: "#9D00FF" }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Large
                          </m.button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Voice Processing Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF00E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Voice Processing
                    </h4>
                    
                    <div className="space-y-3 pl-2 border-l-2 border-[#FF00E6]/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Noise Suppression</span>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-black/40 border border-white/10">
                          <m.div
                            className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#FF00E6]"
                            layout
                            animate={{ x: 20 }} 
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Echo Cancellation</span>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-black/40 border border-white/10">
                          <m.div
                            className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#FF00E6]"
                            layout
                            animate={{ x: 20 }} 
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Auto Gain Control</span>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-black/40 border border-white/10">
                          <m.div
                            className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#FF00E6]"
                            layout
                            animate={{ x: 0 }} 
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <HolographicCard className="p-4 border border-[#00FFFF]/10">
                    <h4 className="font-orbitron text-[#00FFFF] text-sm mb-3">Avatar Animation</h4>
                    <p className="text-xs text-white/70 mb-3">Choose how your avatar reacts to your voice</p>
                    <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors">
                      <option>Pulse</option>
                      <option>Wave</option>
                      <option>Bounce</option>
                      <option>None</option>
                    </select>
                    
                    {/* Avatar preview */}
                    <div className="mt-3 flex justify-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center relative">
                        <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
                          <span className="text-xl font-bold">{currentUser?.name?.charAt(0)}</span>
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-[#00FFFF] animate-pulse"></div>
                      </div>
                    </div>
                  </HolographicCard>
                  
                  <div className="pt-4 border-t border-white/10 text-center">
                    <m.button 
                      className="bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/30 rounded-md py-2 px-6 text-sm"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Settings
                    </m.button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Profile Tab */}
            {activeTab === TABS.PROFILE && (
              <div className="overflow-y-auto h-full">
                <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 border-b border-white/10">
                  <h3 className="text-lg font-orbitron text-[#9D00FF]">Your Profile</h3>
                </div>
                
                <div className="p-4 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center mb-4 relative">
                    <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
                      <span className="text-3xl font-bold">{currentUser?.name?.charAt(0)}</span>
                    </div>
                    
                    {/* Edit avatar button */}
                    <m.button
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </m.button>
                  </div>
                  
                  <h3 className="text-xl font-orbitron text-[#9D00FF] mb-1">{currentUser?.name}</h3>
                  
                  {/* User level */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="px-3 py-1 bg-[#9D00FF]/20 rounded-full text-xs border border-[#9D00FF]/30">
                      Level {currentUser?.level}
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="w-full mb-6">
                    <h4 className="text-sm text-white/70 mb-2">Your Badges</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentUser?.badges?.map((badge, index) => (
                        <div key={index} className="px-3 py-1 bg-black/40 rounded-full text-xs border border-[#9D00FF]/30">
                          {badge}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Profile Form */}
                  <div className="w-full space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="block text-sm text-white/70">Display Name</label>
                      <input 
                        type="text"
                        defaultValue={currentUser?.name}
                        className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-white/70">Status</label>
                      <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] transition-colors">
                        <option value="online">Online</option>
                        <option value="away">Away</option>
                        <option value="busy">Busy</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-white/70">Bio</label>
                      <textarea 
                        rows={3}
                        placeholder="Tell others about yourself..."
                        className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] transition-colors resize-none"
                      ></textarea>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                      <m.button 
                        className="bg-[#9D00FF]/20 text-[#9D00FF] border border-[#9D00FF]/30 rounded-md py-2 px-6 text-sm"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(157, 0, 255, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Update Profile
                      </m.button>
                    </div>
                    
                    <div className="pt-4 text-center">
                      <m.button 
                        className="text-[#FF00E6] text-sm hover:underline"
                        onClick={() => setShowUserProfile(true)}
                      >
                        View Shareable Profile Card
                      </m.button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Control toolbar with SVG icons */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-auto max-w-full px-4 sm:px-0">
          <m.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-black/70 backdrop-blur-md rounded-full border border-white/10 p-3 flex flex-wrap justify-center items-center gap-2 md:gap-4 overflow-x-auto shadow-xl"
          >
            <ControlButton
              icon={muted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
              label={muted ? "Unmute microphone" : "Mute microphone"}
              onClick={() => setMuted(!muted)}
              color="#00FFFF"
              isActive={muted}
            />
            
            <ControlButton
              icon={handRaised ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" strokeOpacity="0.7" />
                </svg>
              )}
              label={handRaised ? "Lower hand" : "Raise hand"}
              onClick={() => setHandRaised(!handRaised)}
              color="#9D00FF"
              isActive={handRaised}
            />
            
            {/* Show/hide control buttons based on screen size */}
            <div className="hidden sm:flex sm:gap-2 md:gap-4">
              <ControlButton
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                label="Toggle chat"
                onClick={() => {
                  setActiveTab(TABS.CHAT);
                  setIsSidebarOpen(true);
                }}
                isActive={activeTab === TABS.CHAT && isSidebarOpen}
              />
              
              <ControlButton
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
                label="Show participants"
                onClick={() => {
                  setActiveTab(TABS.PARTICIPANTS);
                  setIsSidebarOpen(true);
                }}
                isActive={activeTab === TABS.PARTICIPANTS && isSidebarOpen}
              />
              
              <ControlButton
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                label="Settings"
                onClick={() => {
                  setActiveTab(TABS.SETTINGS);
                  setIsSidebarOpen(true);
                }}
                isActive={activeTab === TABS.SETTINGS && isSidebarOpen}
              />
              
              <ControlButton
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                label="Profile"
                onClick={() => {
                  setActiveTab(TABS.PROFILE);
                  setIsSidebarOpen(true);
                }}
                isActive={activeTab === TABS.PROFILE && isSidebarOpen}
                color="#FF00E6"
              />
            </div>
            
            {/* Mobile sidebar toggle button */}
            <div className="sm:hidden">
              <ControlButton
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                }
                label="Show sidebar"
                onClick={() => setIsSidebarOpen(true)}
                isActive={isSidebarOpen}
              />
            </div>
            
            <ControlButton
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
              label="Leave room"
              onClick={() => router.push("/rooms")}
              danger={true}
            />
          </m.div>
        </div>
      </div>
      
      {/* User Profile Card Modal */}
      <AnimatePresence>
        {showUserProfile && (
          <UserProfileCard 
            user={currentUser} 
            onClose={() => setShowUserProfile(false)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
} 