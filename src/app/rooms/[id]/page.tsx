"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";

// Import types
import { User, Room, ChatMessage, TABS, aiResponses, quickReplies } from "@/types/room";

// Import custom components
import GlitchText from "@/components/GlitchText";
import AudioWaveform from "@/components/AudioWaveform";
import NeonGrid from "@/components/NeonGrid";
import CustomCursor from "@/components/rooms/voice/CustomCursor";
import ChatBubble from "@/components/rooms/voice/ChatBubble";
import UserAvatar from "@/components/rooms/voice/UserAvatar";
import ControlButton from "@/components/rooms/voice/ControlButton";
import UserProfileCard from "@/components/rooms/voice/UserProfileCard";
import ChatTab from "@/components/rooms/voice/ChatTab";
import ParticipantsTab from "@/components/rooms/voice/ParticipantsTab";
import SettingsTab from "@/components/rooms/voice/SettingsTab";
import ProfileTab from "@/components/rooms/voice/ProfileTab";

// Import data
import roomsData from "../../data/rooms.json";
import usersDataRaw from "../../data/users.json";

// Register ScrollTrigger with GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cast the imported data to our defined types
const usersData = usersDataRaw as unknown as User[];

// Initial chat messages
const chatMessages: ChatMessage[] = [
  { message: "Anyone know how to configure spatial audio?", isUser: false, userName: "Alex" },
  { message: "You need to enable it in settings first", isUser: true },
  { message: "Thanks! Got it working now", isUser: false, userName: "Alex" }
];

// Toast notification component
const CyberToast = ({ 
  message, 
  type = 'success',
  onClose
}: { 
  message: string; 
  type?: 'success' | 'error' | 'warning'; 
  onClose: () => void;
}) => {
  // Set color based on type
  const colors = {
    success: 'border-[#00FFFF] bg-[#00FFFF]/10 text-[#00FFFF]',
    error: 'border-[#FF00E6] bg-[#FF00E6]/10 text-[#FF00E6]',
    warning: 'border-[#FFC700] bg-[#FFC700]/10 text-[#FFC700]'
  };
  
  return (
    <m.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: '0%', opacity: 1 }}
      exit={{ x: '120%', opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-6 right-6 max-w-sm py-3 px-5 backdrop-blur-md border-l-4 rounded shadow-lg z-50 ${colors[type]}`}
      onClick={onClose}
    >
      <div className="flex items-center gap-3">
        {type === 'success' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'error' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'warning' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        <p className="font-medium text-sm">{message}</p>
      </div>
      <m.div 
        className="absolute bottom-0 left-0 h-1 bg-current" 
        initial={{ width: "100%" }}
        animate={{ width: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        onAnimationComplete={onClose}
      />
    </m.div>
  );
};

// Mini user profile card component that appears on hover
const MiniUserProfile = ({ user, position }: { user: User, position: { x: number, y: number } }) => {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bg-black/80 backdrop-blur-md rounded-lg border border-white/10 p-3 z-50 shadow-lg w-60"
      style={{ left: position.x + 20, top: position.y - 30 }}
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20">
          {user.avatarUrl ? (
            <Image 
              src={user.avatarUrl}
              alt={user.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
              <span className="text-xl font-bold">{user.name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-[#00FFFF] font-medium">{user.name}</h4>
          <div className="text-xs text-white/60 mb-1">Level {user.level || 1}</div>
          {user.isSpeaking && (
            <div className="text-xs px-2 py-0.5 bg-[#00FFFF]/20 rounded-full inline-block">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#00FFFF] rounded-full animate-pulse"></span>
                Speaking
              </span>
            </div>
          )}
        </div>
      </div>
      
      {user.badges && user.badges.length > 0 && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <div className="flex flex-wrap gap-1">
            {user.badges.slice(0, 3).map((badge, index) => (
              <div key={index} className="px-2 py-0.5 bg-black/40 rounded-full text-xs border border-[#00FFFF]/30">
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}
    </m.div>
  );
};

export default function RoomPage({ 
  params 
}: { 
  params: { id: string } 
  searchParams: Record<string, string | string[] | undefined>
}) {
  const router = useRouter();
  
  // Fix params.id direct access with React.use() - use useState instead for client component
  const [roomId, setRoomId] = useState<number>(0);
  
  useEffect(() => {
    // Parse params.id safely in useEffect
    if (params.id) {
      setRoomId(parseInt(params.id));
    }
  }, [params.id]);
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof TABS[keyof typeof TABS]>(TABS.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
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
  
  // Toast notification state
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'warning'}>>([]);
  
  // Add a toast notification
  const addToast = React.useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);
  
  // Remove a toast notification
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Hover user profile state
  const [hoveredUser, setHoveredUser] = useState<{user: User | null, position: {x: number, y: number}}>(
    {user: null, position: {x: 0, y: 0}}
  );
  
  // Manage active speakers
  const [activeSpeakers, setActiveSpeakers] = useState<number[]>([]);
  
  // Set sidebar default based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
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
  
  // Simulate random active speakers
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Randomly select 1-3 users to be speaking
      const speakerCount = Math.floor(Math.random() * 3) + 1;
      const newActiveSpeakers: number[] = [];
      
      for (let i = 0; i < speakerCount; i++) {
        const randomIndex = Math.floor(Math.random() * usersData.length);
        if (!newActiveSpeakers.includes(randomIndex)) {
          newActiveSpeakers.push(randomIndex);
        }
      }
      
      setActiveSpeakers(newActiveSpeakers);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [usersData.length]);
  
  // Calculate avatar positions in a circle with spatial awareness
  const calculateAvatarPositions = (containerWidth: number, containerHeight: number, userCount: number) => {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) * 0.35;
    
    return usersData.slice(0, 5).map((user, index) => {
      // Distribute users in a circle (or slightly elliptical for more natural feel)
      const angle = (index / userCount) * Math.PI * 2;
      // Add slight randomness to positions for more natural feeling
      const randomOffset = Math.random() * 20 - 10; // -10 to +10 pixels
      return {
        x: centerX + radius * Math.cos(angle) + randomOffset,
        y: centerY + radius * Math.sin(angle) + randomOffset,
        isSpeaking: activeSpeakers.includes(index)
      };
    });
  };
  
  // Toggle microphone
  const toggleMicrophone = () => {
    const newMutedState = !muted;
    setMuted(newMutedState);
    addToast(newMutedState ? "Microphone muted" : "Microphone activated", newMutedState ? 'warning' : 'success');
  };
  
  // Toggle hand raised
  const toggleHandRaised = () => {
    const newHandRaisedState = !handRaised;
    setHandRaised(newHandRaisedState);
    addToast(newHandRaisedState ? "Hand raised" : "Hand lowered", 'success');
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
      addToast("AI Assistant activated", 'success');
    } else {
      setMessages(prev => [...prev, { 
        message: "AI Assistant has been deactivated. Regular chat mode is now active.", 
        isUser: false, 
        userName: "System" 
      }]);
      addToast("AI Assistant deactivated", 'warning');
    }
  };
  
  // Get room data and setup initial state
  useEffect(() => {
    if (roomId === 0) return;
    
    const fetchRoom = () => {
      const foundRoom = roomsData.find(r => r.id === roomId);
      if (foundRoom) {
        setRoom(foundRoom as Room);
      } else {
        // Redirect to rooms page if room not found
        router.push("/rooms");
        addToast("Room not found", 'error');
      }
      setLoading(false);
    };
    
    // Simulate API call
    setTimeout(fetchRoom, 500);
  }, [roomId, router, addToast]);
  
  // Handle avatar positions on window resize
  const [avatarPositions, setAvatarPositions] = useState<Array<{x: number; y: number; isSpeaking: boolean}>>([]);
  
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
  }, [loading, isSidebarOpen, activeSpeakers, usersData.length]);
  
  // Add scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleAudioSettings = () => {
    const newSettingsState = !isAudioSettingsOpen;
    setIsAudioSettingsOpen(newSettingsState);
    if (newSettingsState) {
      addToast("Audio settings opened", 'success');
    }
  };
  
  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };
  
  // Handle user avatar hover
  const handleUserHover = (user: User, mouseX: number, mouseY: number) => {
    setHoveredUser({user, position: {x: mouseX, y: mouseY}});
  };
  
  const handleUserHoverEnd = () => {
    setHoveredUser({user: null, position: {x: 0, y: 0}});
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
            
            {/* Room name in header - always displayed with enhanced animation */}
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block"
            >
              <h3 className="text-lg font-orbitron text-[#00FFFF]">{room?.name}</h3>
            </m.div>
          </div>
          
          {/* User Controls */}
          <div className="flex items-center gap-3">
            <m.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
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
            
            <m.button 
              className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
              onClick={toggleUserProfile}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
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
              
              {/* Activity indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
            </m.button>
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
              
              {/* Room stats with enhanced visual style */}
              <div className="flex justify-center gap-4 mb-6">
                <m.div 
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-[#00FFFF]/10 hover:border-[#00FFFF]/30 transition-all"
                >
                  <div className="text-xs text-white/50 mb-1">Participants</div>
                  <div className="text-xl font-orbitron text-[#00FFFF]">{room?.participantCount}</div>
                </m.div>
                <m.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-[#9D00FF]/10 hover:border-[#9D00FF]/30 transition-all"
                >
                  <div className="text-xs text-white/50 mb-1">Active Speakers</div>
                  <div className="text-xl font-orbitron text-[#9D00FF]">{activeSpeakers.length}</div>
                </m.div>
                <m.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-[#FF00E6]/10 hover:border-[#FF00E6]/30 transition-all"
                >
                  <div className="text-xs text-white/50 mb-1">Room Type</div>
                  <div className="text-xl font-orbitron text-[#FF00E6] capitalize">{room?.type}</div>
                </m.div>
              </div>
              
              {/* Audio activity visualization - enhanced */}
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
            
            {/* Enhanced 3D User avatars in circle layout */}
            <div 
              ref={avatarContainerRef}
              className="relative flex-1 h-[500px] mb-8 flex items-center justify-center"
              aria-label="Users in room"
            >
              {/* Improved 3D spatial grid */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border border-[#00FFFF]/5"></div>
                ))}
              </div>
              
              {/* Center room indicator with enhanced effects */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00FFFF]/10 to-[#9D00FF]/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#00FFFF]/30 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Enhanced sound waves */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 rounded-full border-2 border-[#00FFFF]/10 animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-0 rounded-full border border-[#00FFFF]/5 animate-ping" style={{ animationDuration: '4s' }}></div>
                  <div className="absolute inset-0 rounded-full border border-[#9D00FF]/5 animate-ping" style={{ animationDuration: '5s' }}></div>
                </div>
              </div>
              
              {/* Enhanced User avatars with speaking indicators */}
              {avatarPositions.length > 0 && 
                usersData.slice(0, 5).map((user: User, index) => (
                  <div
                    key={user.id}
                    className="absolute z-10"
                    style={{ 
                      left: avatarPositions[index].x,
                      top: avatarPositions[index].y,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onMouseEnter={(e) => handleUserHover(user, e.clientX, e.clientY)}
                    onMouseMove={(e) => handleUserHover(user, e.clientX, e.clientY)}
                    onMouseLeave={handleUserHoverEnd}
                  >
                    <m.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.5, type: 'spring' }}
                      whileHover={{ scale: 1.1, zIndex: 20 }}
                      className="relative"
                    >
                      {/* Avatar border with enhanced pulse effect for speaking indicator */}
                      <div className={`absolute inset-0 rounded-full ${
                        avatarPositions[index].isSpeaking 
                          ? 'border-2 border-[#00FFFF] animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.5)]' 
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
                      <div className="absolute -top-2 -right-2 flex">
                        {user.badges && user.badges.slice(0, 2).map((badge, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 rounded-full bg-black border border-[#00FFFF] flex items-center justify-center text-xs ml-1"
                            title={badge}
                          >
                            {badge[0]}
                          </div>
                        ))}
                      </div>
                      
                      {/* Speaking indicator */}
                      {avatarPositions[index].isSpeaking && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00FFFF] rounded-full border border-black flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                      )}
                      
                      {/* User name tag with improved visibility */}
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm border border-white/10 whitespace-nowrap"
                      >
                        {user.isHost && (
                          <span className="inline-block w-2 h-2 rounded-full bg-[#00FFFF] mr-1"></span>
                        )}
                        {user.name}
                      </m.div>
                    </m.div>
                  </div>
                ))
              }
              
              {/* Hand raised indicator */}
              {handRaised && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#9D00FF]/20 backdrop-blur-md px-4 py-2 rounded-full border border-[#9D00FF]/30 z-30 flex items-center gap-2 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9D00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                  <span className="text-[#9D00FF] font-medium">Hand Raised</span>
                </div>
              )}
            </div>
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
          {/* Chat Tab */}
          {activeTab === TABS.CHAT && (
            <ChatTab
              messages={messages}
              isAiAssistantActive={isAiAssistantActive}
              isAiTyping={isAiTyping}
              showQuickReplies={showQuickReplies}
              setShowQuickReplies={setShowQuickReplies}
              handleSendMessage={handleSendMessage}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleQuickReply={handleQuickReply}
              toggleAiAssistant={toggleAiAssistant}
            />
          )}
          
          {/* Participants Tab */}
          {activeTab === TABS.PARTICIPANTS && (
            <ParticipantsTab 
              users={usersData.map((user, index) => ({
                ...user,
                isSpeaking: activeSpeakers.includes(index)
              }))}
              onUserClick={(user: User) => {
                // Show mini profile or take action
                addToast(`Viewing ${user.name}'s profile`, 'success');
              }}
            />
          )}
          
          {/* Settings Tab */}
          {activeTab === TABS.SETTINGS && (
            <SettingsTab 
              currentUser={currentUser}
            />
          )}
          
          {/* Profile Tab */}
          {activeTab === TABS.PROFILE && (
            <ProfileTab
              currentUser={currentUser}
              toggleUserProfile={toggleUserProfile}
            />
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
            onClick={toggleMicrophone}
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
            onClick={toggleHandRaised}
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
            onClick={() => {
              addToast("Leaving room...", 'warning');
              setTimeout(() => router.push("/rooms"), 1000);
            }}
            danger={true}
          />
        </m.div>
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
      
      {/* Mini User Profile on Hover */}
      <AnimatePresence>
        {hoveredUser.user && (
          <MiniUserProfile user={hoveredUser.user} position={hoveredUser.position} />
        )}
      </AnimatePresence>
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <CyberToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
      
      {/* Audio Settings Panel */}
      <AnimatePresence>
        {isAudioSettingsOpen && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl rounded-xl border border-[#00FFFF]/20 p-6 z-40 w-[90%] max-w-md shadow-[0_0_30px_rgba(0,255,255,0.2)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-orbitron text-[#00FFFF]">Spatial Audio Settings</h3>
              <button 
                onClick={() => setIsAudioSettingsOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Spatial Audio Toggle */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">Spatial Audio</div>
                  <div className="text-white/60 text-sm">Experience 3D positional audio</div>
                </div>
                <m.button
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-6 bg-white/10 rounded-full relative"
                  onClick={() => addToast("Spatial audio toggled", 'success')}
                >
                  <div className="absolute w-5 h-5 rounded-full bg-[#00FFFF] left-0.5 top-0.5 shadow-[0_0_8px_rgba(0,255,255,0.5)]"></div>
                </m.button>
              </div>
              
              {/* Input Device Selection */}
              <div>
                <label className="block text-white font-medium mb-2">Microphone</label>
                <select className="w-full bg-black/50 border border-white/20 text-white rounded-md p-2 focus:border-[#00FFFF] focus:outline-none">
                  <option>Default Microphone</option>
                  <option>Headset Microphone</option>
                  <option>External Microphone</option>
                </select>
              </div>
              
              {/* Output Device Selection */}
              <div>
                <label className="block text-white font-medium mb-2">Speaker</label>
                <select className="w-full bg-black/50 border border-white/20 text-white rounded-md p-2 focus:border-[#00FFFF] focus:outline-none">
                  <option>Default Speakers</option>
                  <option>Headphones</option>
                  <option>External Speakers</option>
                </select>
              </div>
              
              {/* Volume Slider */}
              <div>
                <label className="block text-white font-medium mb-2">Input Volume</label>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF]"></div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <m.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2 bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 hover:from-[#00FFFF]/30 hover:to-[#9D00FF]/30 border border-[#00FFFF]/30 rounded-md text-[#00FFFF] font-medium"
                  onClick={() => {
                    setIsAudioSettingsOpen(false);
                    addToast("Audio settings saved", 'success');
                  }}
                >
                  Apply Settings
                </m.button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </main>
  );
}