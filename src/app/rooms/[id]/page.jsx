"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { m, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import roomsData from "../../data/rooms.json";
import usersData from "../../data/users.json";
import GlitchText from "@/components/GlitchText";
import ShimmeringText from "@/components/ShimmeringText";
import AudioWaveform from "@/components/AudioWaveform";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import HolographicCard from "@/components/HolographicCard";
import NeonGrid from "@/components/NeonGrid";
import Link from "next/link";
import Image from "next/image";

// Register ScrollTrigger with GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom cursor component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const updatePosition = (e) => {
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
const ChatBubble = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div 
      className={`max-w-xs px-4 py-2 rounded-2xl ${
        isUser 
          ? 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/30 rounded-tr-none' 
          : 'bg-[#9D00FF]/20 text-white border border-[#9D00FF]/30 rounded-tl-none'
      }`}
    >
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

// React Messages Array
const chatMessages = [
  { message: "Anyone know how to configure spatial audio?", isUser: false },
  { message: "You need to enable it in settings first", isUser: true },
  { message: "Thanks! Got it working now", isUser: false }
];

// Audio Level Indicator
const AudioLevelIndicator = ({ level }) => (
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
const UserAvatar = ({ user, position, index }) => {
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
  SETTINGS: 'settings'
};

// Control Button Component - Replace emojis with SVG icons
const ControlButton = ({ icon, label, onClick, color = "#FFFFFF", isActive = false, danger = false }) => {
  return (
    <m.button
      className={`p-3 rounded-full relative ${
        danger 
          ? 'bg-red-500/20' 
          : isActive 
            ? `bg-${color}/20` 
            : 'bg-white/5'
      } border ${
        danger 
          ? 'border-red-500/30' 
          : isActive 
            ? `border-${color}/30` 
            : 'border-white/10'
      } text-${
        danger 
          ? 'red-400' 
          : isActive 
            ? color 
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

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = parseInt(params.id);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const avatarContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  
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
  const calculateAvatarPositions = (containerWidth, containerHeight, userCount) => {
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
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;
    
    setMessages([...messages, { message: chatInput, isUser: true }]);
    setChatInput('');
    
    // Simulate a response
    setTimeout(() => {
      const responses = [
        "That's interesting!",
        "I see what you mean",
        "Thanks for sharing that",
        "Good point!",
        "I'll try that out"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { message: randomResponse, isUser: false }]);
    }, 1000 + Math.random() * 2000);
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
        setRoom(foundRoom);
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
  const [avatarPositions, setAvatarPositions] = useState([]);
  
  useEffect(() => {
    if (!loading && avatarContainerRef.current) {
      const updatePositions = () => {
        const { width, height } = avatarContainerRef.current.getBoundingClientRect();
        setAvatarPositions(calculateAvatarPositions(width, height, usersData.length));
      };
      
      updatePositions();
      window.addEventListener("resize", updatePositions);
      
      return () => {
        window.removeEventListener("resize", updatePositions);
      };
    }
  }, [loading, isSidebarOpen]);
  
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
      
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-md border-b border-white/10 z-20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/rooms" className="flex items-center gap-2 text-[#00FFFF] font-orbitron">
            <m.div
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="ml-2">Back to Rooms</span>
            </m.div>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 text-sm border border-white/10 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FF00E6] animate-pulse"></span>
              <span>Live</span>
              <span className="mx-1 text-white/30">•</span>
              <span className="text-white/70">{room?.participantCount} participants</span>
            </div>
            
            {/* Toggle sidebar button on mobile */}
            <m.button
              className="lg:hidden p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 flex items-center gap-2 text-sm"
              whileHover={{ 
                scale: 1.05,
                borderColor: "#00FFFF",
                color: "#00FFFF" 
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </m.button>
            
            <m.button
              className="hidden md:flex p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 items-center gap-2 text-sm"
              whileHover={{ 
                scale: 1.05,
                borderColor: "#00FFFF",
                color: "#00FFFF" 
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Share</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </m.button>
          </div>
        </div>
      </div>
      
      <div className="pt-16 flex h-screen">
        {/* Main Room Area */}
        <div className="flex-1 transition-all duration-300">
          <div className="py-8 px-6 h-full flex flex-col">
            <div className="mb-4 text-center">
              <GlitchText
                text={room?.name || "Voice Room"}
                className="text-4xl font-orbitron mb-2"
                color="cyan"
                intensity="medium"
                activeOnView={true}
              />
              
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
              className="relative flex-1 h-[600px] mb-8 flex items-center justify-center"
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
                usersData.slice(0, 5).map((user, index) => (
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
        
        {/* Sidebar Toggle Button - only visible on large screens */}
        <m.button
          className="fixed hidden lg:block top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-md border border-white/10 rounded-l-md p-2 z-30"
          whileHover={{ 
            x: -3,
            borderColor: "#00FFFF",
            color: "#00FFFF" 
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ right: isSidebarOpen ? '350px' : '0' }}
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
        
        {/* Sidebar Panel */}
        <div 
          className={`fixed top-16 bottom-0 right-0 w-full md:w-[350px] bg-black/60 backdrop-blur-xl border-l border-white/10 z-20 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} overflow-hidden`}
        >
          {/* Close button for mobile */}
          <button 
            className="absolute top-2 right-2 lg:hidden text-white/70 hover:text-white p-2"
            onClick={() => setIsSidebarOpen(false)}
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
                className={`flex-1 py-3 text-center text-sm ${
                  activeTab === tab 
                    ? 'text-[#00FFFF] border-b-2 border-[#00FFFF]' 
                    : 'text-white/70'
                }`}
                whileHover={{ color: "#00FFFF" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </m.button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {/* Chat Tab */}
            {activeTab === TABS.CHAT && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {messages.map((msg, i) => (
                    <ChatBubble key={i} {...msg} />
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-white/10">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors"
                    />
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
            
            {/* Participants Tab */}
            {activeTab === TABS.PARTICIPANTS && (
              <div className="p-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search participants..."
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors"
                  />
                </div>
                
                <div className="space-y-3">
                  {usersData.map((user) => (
                    <m.div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      <div className={`
                        w-10 h-10 rounded-full 
                        bg-black/40 
                        border-2 ${user.isSpeaking ? 'border-[#00FFFF]' : 'border-[#9D00FF]/50'} 
                        flex items-center justify-center
                        ${user.isSpeaking ? 'shadow-[0_0_10px_rgba(0,255,255,0.5)]' : ''}
                        relative
                      `}>
                        <span className="font-orbitron text-sm">{user.name.charAt(0)}</span>
                        {user.isSpeaking && (
                          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00FFFF] rounded-full border border-black"></span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium">{user.name}</p>
                          {user.isSpeaking && (
                            <AudioLevelIndicator level={Math.floor(Math.random() * 8)} />
                          )}
                        </div>
                        <p className="text-xs text-white/50">
                          {user.isSpeaking ? 'Speaking' : 'Not speaking'}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <m.button
                          className="p-1.5 bg-black/40 rounded-md border border-white/10 text-sm"
                          whileHover={{ borderColor: "#00FFFF", color: "#00FFFF" }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Message user"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </m.button>
                        <m.button
                          className="p-1.5 bg-black/40 rounded-md border border-white/10 text-sm"
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
            
            {/* Settings Tab */}
            {activeTab === TABS.SETTINGS && (
              <div className="p-4 overflow-y-auto h-full">
                <h3 className="text-lg font-orbitron mb-4 text-[#00FFFF]">Room Settings</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm text-white/70">Audio Input</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors">
                      <option>Default Microphone</option>
                      <option>External Microphone</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-white/70">Audio Output</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors">
                      <option>Default Speakers</option>
                      <option>Headphones</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Spatial Audio</span>
                    <div className="relative inline-block w-10 h-6 rounded-full bg-black/40 border border-white/10">
                      <m.div
                        className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#00FFFF]"
                        layout
                        animate={{ x: 14 }} 
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Noise Suppression</span>
                    <div className="relative inline-block w-10 h-6 rounded-full bg-black/40 border border-white/10">
                      <m.div
                        className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[#00FFFF]"
                        layout
                        animate={{ x: 14 }} 
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-white/70">Room Volume</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="80"
                      className="w-full accent-[#00FFFF]" 
                    />
                  </div>
                  
                  <HolographicCard className="p-4">
                    <h4 className="font-orbitron text-sm mb-2">Avatar Animation</h4>
                    <p className="text-xs text-white/70 mb-3">Choose how your avatar reacts to your voice</p>
                    <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors">
                      <option>Pulse</option>
                      <option>Wave</option>
                      <option>Bounce</option>
                      <option>None</option>
                    </select>
                  </HolographicCard>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Control toolbar with SVG icons instead of emojis */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-auto max-w-full px-4 sm:px-0">
          <m.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-black/40 backdrop-blur-md rounded-full border border-white/10 p-3 flex flex-wrap justify-center items-center gap-2 md:gap-4 overflow-x-auto"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11" strokeOpacity="0.7" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
    </main>
  );
} 