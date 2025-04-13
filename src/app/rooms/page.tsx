// src/app/rooms/page.tsx
// Enhanced room card based on AmbientRoom component

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { m, motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import roomsData from "../data/rooms.json";
import GlitchText from "@/components/GlitchText";
import AudioWaveform from "@/components/AudioWaveform";
import ShimmeringText from "@/components/ShimmeringText";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import HolographicCard from "@/components/HolographicCard";
import NeonGrid from "@/components/NeonGrid";
import AmbientRoom from "@/components/AmbientRoom";
import Image from "next/image";
import { IoSettingsOutline, IoNotificationsOutline, IoAddOutline } from "react-icons/io5";
import { FiMusic, FiUsers } from "react-icons/fi";
import { RiRobot2Fill } from "react-icons/ri";

// Register ScrollTrigger with GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Type definitions
interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
  color: string;
}

interface Community {
  id: number;
  name: string;
  members: number;
  rooms: number;
  image: string;
}

interface Room {
  id: number;
  name: string;
  description?: string;
  participantCount: number;
  type: 'music' | 'conversation' | 'gaming' | 'chill';
  isPrivate?: boolean;
}

interface CategoryItemProps {
  category: Category | { id: number; name: string; icon: string; count: number; color: string };
  isActive: boolean;
  onClick: (id: number) => void;
}

interface CommunityItemProps {
  community: Community;
}

interface RoomCardProps {
  room: Room;
  index: number;
  activeCategory: number;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

interface ChatMessage {
  text: string;
  isBot: boolean;
}

// Mock data for categories and communities
const categories: Category[] = [
  { id: 1, name: "Music", icon: "🎵", count: 42, color: "#00FFFF" },
  { id: 2, name: "Gaming", icon: "🎮", count: 28, color: "#9D00FF" },
  { id: 3, name: "Tech", icon: "💻", count: 15, color: "#FF00E6" },
  { id: 4, name: "Social", icon: "🗣️", count: 23, color: "#00FFFF" },
  { id: 5, name: "Education", icon: "📚", count: 12, color: "#9D00FF" }
];

const communities: Community[] = [
  { id: 1, name: "CyberPunk Elite", members: 1247, rooms: 8, image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Neon Dreamers", members: 863, rooms: 5, image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 3, name: "Digital Nomads", members: 2134, rooms: 12, image: "https://randomuser.me/api/portraits/men/68.jpg" }
];

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="relative w-20 h-20">
      <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-[#00FFFF] rounded-full animate-spin"></div>
      <div className="absolute top-1 left-1 right-1 bottom-1 border-4 border-transparent border-l-[#9D00FF] rounded-full animate-spin animate-reverse"></div>
      <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-transparent border-b-[#FF00E6] rounded-full animate-spin"></div>
    </div>
  </div>
);

// Sidebar Category Component
const CategoryItem: React.FC<CategoryItemProps> = ({ category, isActive, onClick }) => (
  <m.div
    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#00FFFF]/20 border border-[#00FFFF]/50" : "hover:bg-white/5"
    }`}
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(category.id)}
  >
    <div 
      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br from-black to-gray-900 border border-${isActive ? '[#00FFFF]' : 'white/10'}`}
      style={{ boxShadow: isActive ? `0 0 15px ${category.color || '#00FFFF'}50` : "none" }}
    >
      {category.icon}
    </div>
    <div className="flex-1">
      <h3 className={`font-medium ${isActive ? "text-[#00FFFF]" : "text-white"}`}>{category.name}</h3>
      <p className="text-xs text-white/60">{category.count} rooms</p>
    </div>
    {isActive && (
      <div className="w-2 h-10 bg-[#00FFFF] rounded-full glow-sm"></div>
    )}
  </m.div>
);

// Community Item Component
const CommunityItem: React.FC<CommunityItemProps> = ({ community }) => (
  <m.div
    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5"
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#FF00E6]/30">
      <Image
        src={community.image}
        alt={community.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-white">{community.name}</h3>
      <p className="text-xs text-white/60">{community.members} members</p>
    </div>
    <div className="px-2 py-1 bg-[#FF00E6]/20 rounded-md text-xs text-[#FF00E6]">
      {community.rooms} rooms
    </div>
  </m.div>
);

// Enhanced Room Card Component using AmbientRoom inspiration
const EnhancedRoomCard: React.FC<RoomCardProps> = ({ room, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  
  const isNew = room.id % 3 === 0;
  const isPopular = room.participantCount > 10;
  
  // Get room type colors
  const getRoomTypeDetails = () => {
    switch (room.type) {
      case 'music':
        return {
          primaryColor: '#FF00E6', // pink
          secondaryColor: '#9D00FF', // purple
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          )
        };
      case 'conversation':
        return {
          primaryColor: '#00FFFF', // cyan
          secondaryColor: '#0088FF', // blue
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.174 0-2.298-.222-3.335-.624C8.665 19.376 7.976 20 7 20c-1.5 0-2.5-1.5-2.5-1.5S2 14 2 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )
        };
      case 'gaming':
        return {
          primaryColor: '#9D00FF', // purple
          secondaryColor: '#FF00E6', // pink
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 8v.01M15 12v.01M14 16v.01M9 8h1v2h2v1h-2v2H9v-2H7v-1h2V8z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2" />
            </svg>
          )
        };
      case 'chill':
        return {
          primaryColor: '#00FFFF', // cyan
          secondaryColor: '#FF00E6', // pink
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        };
      default:
        return {
          primaryColor: '#00FFFF', // cyan
          secondaryColor: '#9D00FF', // purple
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        };
    }
  };
  
  const roomDetails = getRoomTypeDetails();

  // Define glow gradient based on mouse position
  const glowGradient = `radial-gradient(
    circle at ${mousePosition.x}% ${mousePosition.y}%, 
    ${roomDetails.primaryColor}40 0%, 
    transparent 70%
  )`;
  
  // Handle mouse movement for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    
    // Calculate mouse position relative to card center
    const mouseXRelative = e.clientX - rect.left;
    const mouseYRelative = e.clientY - rect.top;
    
    // Calculate rotation (transform mouse position to be between -10 and 10 degrees)
    const rotX = ((mouseYRelative / cardHeight) * 2 - 1) * -10;
    const rotY = ((mouseXRelative / cardWidth) * 2 - 1) * 10;
    
    // Update state
    setRotateX(rotX);
    setRotateY(rotY);
    
    // Update mouse position for glow effect
    const mouseXPercent = (mouseXRelative / cardWidth) * 100;
    const mouseYPercent = (mouseYRelative / cardHeight) * 100;
    setMousePosition({ x: mouseXPercent, y: mouseYPercent });
  };
  
  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };
  
  // GSAP animation for particles
  useEffect(() => {
    if (!visualizerRef.current) return;
    
    const visualizer = visualizerRef.current;
    const particles = 15;
    
    // Remove any existing particles
    while (visualizer.firstChild) {
      visualizer.removeChild(visualizer.firstChild);
    }
    
    // Create particles
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      
      // Randomize size
      const size = 2 + Math.random() * 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Set position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Set color
      const isAlternateColor = Math.random() > 0.5;
      particle.style.backgroundColor = isAlternateColor 
        ? roomDetails.secondaryColor 
        : roomDetails.primaryColor;
      
      // Set opacity
      particle.style.opacity = (0.3 + Math.random() * 0.5).toString();
      
      visualizer.appendChild(particle);
      
      // Animate particle
      gsap.to(particle, {
        x: () => -20 + Math.random() * 40,
        y: () => -20 + Math.random() * 40,
        opacity: () => 0.1 + Math.random() * 0.5,
        duration: 2 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      });
    }
    
    return () => {
      gsap.killTweensOf(visualizer.childNodes);
    };
  }, [roomDetails.primaryColor, roomDetails.secondaryColor]);

  return (
    <m.div
      ref={cardRef}
      className="group relative h-full rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 rounded-xl z-0"
        style={{ 
          background: `linear-gradient(135deg, ${roomDetails.primaryColor}15, ${roomDetails.secondaryColor}15)`,
        }} 
      />
      
      {/* Moving particles */}
      <div 
        ref={visualizerRef}
        className="absolute inset-0 rounded-xl overflow-hidden z-0"
      />
      
      {/* Magic glow effect that follows cursor */}
      <div
        className={`absolute inset-0 rounded-xl z-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          background: glowGradient,
        }}
      />
      
      {/* Content container */}
      <m.div 
        className="relative h-full flex flex-col p-6 bg-black/60 backdrop-blur-sm rounded-xl z-10 border border-white/10 group-hover:border-[#00FFFF]/30"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.1s ease-out',
          boxShadow: isHovered ? `0 10px 30px -5px ${roomDetails.primaryColor}30` : 'none'
        }}
      >
        {/* Room header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center" 
                style={{ 
                  backgroundColor: `${roomDetails.primaryColor}20`,
                  color: roomDetails.primaryColor
                }}
              >
                {roomDetails.icon}
              </div>
              <h3 
                className="text-xl font-orbitron"
                style={{ color: roomDetails.primaryColor }}
              >
                {room.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="inline-block w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: roomDetails.primaryColor }}
              ></span>
              <p className="text-xs opacity-70">{room.participantCount} participants</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            {isNew && (
              <div 
                className="px-2 py-0.5 rounded-full text-xs font-semibold animate-pulse"
                style={{ 
                  backgroundColor: `${roomDetails.primaryColor}20`,
                  color: roomDetails.primaryColor
                }}
              >
                NEW
              </div>
            )}
            {isPopular && (
              <div 
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: `${roomDetails.secondaryColor}20`,
                  color: roomDetails.secondaryColor
                }}
              >
                POPULAR
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm opacity-70 mb-4">
          {room.description || "Join this room to connect with others in a voice-based chat experience!"}
        </p>
        
        {/* Audio visualizer */}
        <div className="mt-2 mb-4">
          <AudioWaveform 
            width={240} 
            height={30} 
            bars={15} 
            color={roomDetails.primaryColor}
            activeColor={roomDetails.secondaryColor}
            className="opacity-60"
          />
        </div>
        
        {/* User avatars */}
        <div className="flex -space-x-2 mb-4">
          {[...Array(Math.min(5, room.participantCount))].map((_, i) => (
            <div 
              key={i} 
              className="w-8 h-8 rounded-full border border-black/50 flex items-center justify-center text-xs overflow-hidden"
              style={{
                background: `linear-gradient(to right, ${
                  i % 2 === 0 ? roomDetails.primaryColor + '80' : roomDetails.secondaryColor + '80'
                }, ${
                  i % 2 === 0 ? roomDetails.secondaryColor + '80' : roomDetails.primaryColor + '80'
                })`
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {room.participantCount > 5 && (
            <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-xs">
              +{room.participantCount - 5}
            </div>
          )}
        </div>
        
        {/* Room tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/70 border border-white/10">
            #cyberpunk
          </div>
          <div className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/70 border border-white/10">
            #{room.type}
          </div>
        </div>
        
        {/* Join button */}
        <div className="mt-auto">
          <Link href={`/rooms/${room.id}`}>
            <m.button
              className="w-full py-3 px-6 bg-black/50 backdrop-blur-sm border text-white rounded-lg relative overflow-hidden group"
              style={{ 
                borderColor: roomDetails.primaryColor + '50',
                color: roomDetails.primaryColor 
              }}
              whileHover={{ 
                y: -2,
                boxShadow: `0 10px 20px -5px ${roomDetails.primaryColor}30`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 font-medium">Join Room</span>
              <m.span 
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                style={{ 
                  background: `linear-gradient(135deg, ${roomDetails.primaryColor}30, ${roomDetails.secondaryColor}30)`,
                  borderRadius: 'inherit',
                  transformOrigin: 'center'
                }}
                transition={{ duration: 0.3 }}
              />
            </m.button>
          </Link>
        </div>
      </m.div>
    </m.div>
  );
};

// StatsCard component - enhanced design
const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <div className="bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#00FFFF]/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] group">
    <div className="p-5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00FFFF]/10 to-[#FF00E6]/10 flex items-center justify-center border border-white/10 group-hover:border-[#00FFFF]/30 transition-colors duration-300">
          <div className="text-[#00FFFF] group-hover:text-[#FF00E6] transition-colors duration-300">
            {icon}
          </div>
        </div>
        <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">{title}</p>
      </div>
      <p className="text-3xl font-orbitron mt-auto bg-clip-text text-transparent bg-gradient-to-r from-[#00FFFF] to-[#FF00E6]">{value}</p>
    </div>
  </div>
);

// FloatingChatbot Component - Fixed scrolling issue by using stopPropagation on chatbot events
const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "👋 Welcome to NexVox! How can I assist you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Add user message
    setMessages([...messages, { text: inputValue, isBot: false }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response;
      const lowercaseInput = inputValue.toLowerCase();
      
      if (lowercaseInput.includes("room") && (lowercaseInput.includes("join") || lowercaseInput.includes("enter"))) {
        response = "To join a room, simply click on the 'Join Room' button on any room card. You'll be able to start chatting and communicating right away!";
      } else if (lowercaseInput.includes("create") && lowercaseInput.includes("room")) {
        response = "To create a new room, click on the '+' button in the top right corner of the rooms list. You can customize your room's settings and invite friends.";
      } else if (lowercaseInput.includes("profile") || lowercaseInput.includes("account")) {
        response = "You can access your profile by clicking on your avatar in the top right corner of the page. There you can update your information and preferences.";
      } else if (lowercaseInput.includes("settings")) {
        response = "Settings can be accessed from your profile menu in the top right corner. You can adjust audio, privacy, and notification settings there.";
      } else if (lowercaseInput.includes("help") || lowercaseInput.includes("support")) {
        response = "I'm here to help! You can ask me about rooms, voice chat features, settings, or navigation. Is there something specific you need assistance with?";
      } else {
        response = "Thanks for your message! Is there anything specific about NexVox voice rooms you'd like to know? I can help with joining rooms, settings, or features.";
      }
      
      setMessages(prevMessages => [...prevMessages, { text: response, isBot: true }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  // Prevent scroll events from propagating to the main window
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  
  // Prevent wheel events from propagating to the main window
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Floating button - fixed position that stays on scroll */}
      <m.button
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl ${
          isOpen ? 'bg-[#FF00E6] text-white' : 'bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-white'
        } border border-white/20`}
        whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(0, 255, 255, 0.6)" }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChatbot}
        aria-label="Toggle AI assistant"
        style={{ backdropFilter: "blur(10px)" }}
      >
        {isOpen ? (
          <IoNotificationsOutline className="w-6 h-6" />
        ) : (
          <RiRobot2Fill className="w-6 h-6" />
        )}
      </m.button>

      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-black/80 backdrop-blur-xl border border-[#00FFFF]/30 rounded-lg shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-black/50 rounded-full">
                    <RiRobot2Fill className="w-5 h-5 text-[#00FFFF]" />
                  </div>
                  <h3 className="font-orbitron text-sm text-[#00FFFF]">NexVox AI Assistant</h3>
                </div>
                <m.button
                  className="text-white/60 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleChatbot}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </m.button>
              </div>
            </div>

            {/* Messages - Added event handlers to stop scroll propagation */}
            <div 
              ref={chatContainerRef}
              className="h-80 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              onScroll={handleScroll}
              onWheel={handleWheel}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.isBot
                        ? "bg-[#00FFFF]/10 text-white border border-[#00FFFF]/20 rounded-tl-none"
                        : "bg-[#FF00E6]/10 text-white border border-[#FF00E6]/20 rounded-tr-none"
                    }`}
                  >
                    {message.isBot && (
                      <div className="text-xs text-[#00FFFF] mb-1 font-semibold">NexVox AI</div>
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[85%] p-3 rounded-lg bg-[#00FFFF]/10 text-white border border-[#00FFFF]/20 rounded-tl-none">
                    <div className="text-xs text-[#00FFFF] mb-1 font-semibold">NexVox AI</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-black/60 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors text-white text-sm"
                />
                <m.button
                  type="submit"
                  className="bg-[#00FFFF]/20 border border-[#00FFFF]/50 text-[#00FFFF] p-2 rounded-md"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  disabled={inputValue.trim() === ""}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </m.button>
              </form>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function RoomsPage() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0); // 0 means "All"
  const [view, setView] = useState<'grid' | 'list'>('grid'); // 'grid' or 'list'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Set sidebar open by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
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

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Header and sidebar animations
  useEffect(() => {
    if (!loading && headerRef.current && sidebarRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );
    }
  }, [loading]);

  // Filter rooms based on category
  const filteredRooms = activeCategory === 0 
    ? roomsData
    : roomsData.filter(room => {
        const categoryName = categories.find(cat => cat.id === activeCategory)?.name.toLowerCase();
        return room.type.toLowerCase() === categoryName;
      });

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      {/* Background effects */}
      <NeonGrid color="#00FFFF" secondaryColor="#9D00FF" opacity={0.05} />
      
      {/* Header with search and user controls */}
      <header 
        ref={headerRef}
        className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-2xl font-orbitron text-[#00FFFF]">NEXVOX</h1>
            </Link>
            <div className="hidden sm:block px-2 py-1 bg-[#00FFFF]/10 text-[#00FFFF] rounded text-xs font-medium">
              Voice Rooms
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Create Room Button */}
            <m.button
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 rounded-md border border-[#00FFFF]/30 text-[#00FFFF] font-medium text-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <IoAddOutline className="h-4 w-4" />
              <span>Create Room</span>
            </m.button>
            
            {/* Settings */}
            <Link href="/settings">
              <m.button
                className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
                whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
                whileTap={{ scale: 0.95 }}
                aria-label="Settings"
              >
                <IoSettingsOutline className="h-5 w-5" />
              </m.button>
            </Link>
            
            {/* Notifications */}
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70 relative"
              whileHover={{ scale: 1.05, borderColor: "#FF00E6", color: "#FF00E6" }}
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications"
            >
              <IoNotificationsOutline className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF00E6] text-xs flex items-center justify-center">3</span>
            </m.button>
            
            {/* Profile */}
            <Link href="/profile">
              <m.button
                className="relative hover:ring-2 hover:ring-[#00FFFF]/50 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 border border-white/10 flex items-center justify-center text-sm">
                  U
                </div>
              </m.button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content with sidebar */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div 
          ref={sidebarRef}
          className={`fixed md:static top-0 bottom-0 w-72 bg-black/60 backdrop-blur-md z-20 border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } mt-[73px] md:mt-0 h-[calc(100vh-73px)] md:h-auto overflow-y-auto`}
        >
          <div className="p-6 flex flex-col gap-6 h-full">
            <div>
              <h2 className="text-lg font-orbitron mb-4 text-[#00FFFF]">CATEGORIES</h2>
              <div className="space-y-2">
                <CategoryItem 
                  category={{ id: 0, name: "All Rooms", icon: "🌐", count: roomsData.length, color: "#FF00E6" }}
                  isActive={activeCategory === 0}
                  onClick={() => setActiveCategory(0)}
                />
                {categories.map(category => (
                  <CategoryItem 
                    key={category.id}
                    category={category}
                    isActive={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-orbitron mb-4 text-[#FF00E6]">COMMUNITIES</h2>
              <div className="space-y-2">
                {communities.map(community => (
                  <CommunityItem key={community.id} community={community} />
                ))}
              </div>
            </div>
            
            <div className="mt-auto grid grid-cols-1 gap-4">
              <StatsCard 
                title="Online Users" 
                value="2,356" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />
              <StatsCard 
                title="Active Rooms" 
                value="48" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF00E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div 
          ref={contentRef}
          className="flex-1 px-4 pb-4 md:pl-6 md:pr-6 md:pb-6 relative"
        >
          {/* Header for current category */}
          <div className="sticky top-[73px] z-10 bg-black/60 backdrop-blur-lg py-4 border-b border-white/10 mb-6">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <h2 className="text-2xl font-orbitron text-[#00FFFF]">
                  {activeCategory === 0 
                    ? "All Rooms" 
                    : categories.find(cat => cat.id === activeCategory)?.name}
                </h2>
                <p className="text-sm text-white/60">{filteredRooms.length} active rooms</p>
              </div>
              
              <div className="flex gap-2">
                {/* View toggle */}
                <div className="flex bg-black/40 backdrop-blur-md rounded-md border border-white/10 p-1">
                  <button 
                    className={`p-2 rounded-md ${view === 'grid' ? 'bg-white/10' : ''}`}
                    onClick={() => setView('grid')}
                    aria-label="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    className={`p-2 rounded-md ${view === 'list' ? 'bg-white/10' : ''}`}
                    onClick={() => setView('list')}
                    aria-label="List view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                
                {/* Mobile view only - sidebar toggle */}
                <button 
                  className="md:hidden p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label="Toggle sidebar"
                >
                  {isSidebarOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Room cards */}
          {loading ? (
            <LoadingSpinner />
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room, index) => (
                <EnhancedRoomCard
                  key={room.id}
                  room={room}
                  index={index}
                  activeCategory={activeCategory}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRooms.map((room, index) => (
                <m.div 
                  key={room.id}
                  className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 hover:border-[#00FFFF]/30 transition-colors"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", x: 5 }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="min-w-[120px]">
                      <AudioWaveform 
                        width={120} 
                        height={40} 
                        bars={15} 
                        color="#00FFFF" 
                        activeColor="#FF00E6" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-orbitron text-lg text-[#00FFFF]">{room.name}</h3>
                        {room.participantCount > 10 && (
                          <span className="px-2 py-0.5 bg-[#FF00E6]/30 text-[#FF00E6] text-xs rounded-full">Popular</span>
                        )}
                        {room.id % 3 === 0 && (
                          <span className="px-2 py-0.5 bg-[#00FFFF]/30 text-[#00FFFF] text-xs rounded-full animate-pulse">New</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#FF00E6] animate-pulse"></span>
                          <span className="text-white/70">{room.participantCount} participants</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-black/40 text-white/50 text-xs rounded-full">#{room.type}</span>
                          <span className="px-2 py-0.5 bg-black/40 text-white/50 text-xs rounded-full">#cyberpunk</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/rooms/${room.id}`} className="sm:self-center">
                      <m.button
                        className="py-2 px-4 bg-black border border-[#00FFFF] text-[#00FFFF] rounded-md font-orbitron text-sm relative overflow-hidden group whitespace-nowrap"
                        whileHover={{ 
                          boxShadow: "0 0 20px rgba(0, 255, 255, 0.7)",
                          borderColor: "#FF00E6",
                          color: "#FF00E6"
                        }}
                        whileTap={{ scale: 0.98 }}
                        aria-label={`Join ${room.name} room`}
                      >
                        <span className="relative z-10">Join Room</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                      </m.button>
                    </Link>
                  </div>
                </m.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Chatbot */}
      <FloatingChatbot />
    </main>
  );
}