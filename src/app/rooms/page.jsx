"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { m, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import roomsData from "../data/rooms.json";
import GlitchText from "@/components/GlitchText";
import AudioWaveform from "@/components/AudioWaveform";
import ShimmeringText from "@/components/ShimmeringText";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import HolographicCard from "@/components/HolographicCard";
import NeonGrid from "@/components/NeonGrid";
import Image from "next/image";

// Register ScrollTrigger with GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Mock data for categories and communities
const categories = [
  { id: 1, name: "Music", icon: "🎵", count: 42, color: "#00FFFF" },
  { id: 2, name: "Gaming", icon: "🎮", count: 28, color: "#9D00FF" },
  { id: 3, name: "Tech", icon: "💻", count: 15, color: "#FF00E6" },
  { id: 4, name: "Social", icon: "🗣️", count: 23, color: "#00FFFF" },
  { id: 5, name: "Education", icon: "📚", count: 12, color: "#9D00FF" }
];

const communities = [
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
const CategoryItem = ({ category, isActive, onClick }) => (
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
      style={{ boxShadow: isActive ? `0 0 15px ${category.color}50` : "none" }}
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
const CommunityItem = ({ community }) => (
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

// Room Card Component with enhanced styling
const RoomCard = ({ room, index, activeCategory }) => {
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const isNew = room.id % 3 === 0;
  const isPopular = room.participantCount > 10;
  
  // Random gradient for variation
  const gradients = [
    "from-[#00FFFF]/20 to-[#9D00FF]/20",
    "from-[#9D00FF]/20 to-[#FF00E6]/20",
    "from-[#FF00E6]/20 to-[#00FFFF]/20"
  ];
  
  const gradient = gradients[index % gradients.length];

  // Tilt effect on hover
  useEffect(() => {
    const card = tiltRef.current;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = (y - centerY) / 15;
      const tiltY = (centerX - x) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };
    
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    }
    
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // GSAP animation
  useEffect(() => {
    const direction = index % 2 === 0 ? "left" : "right";
    const card = cardRef.current;
    
    gsap.fromTo(
      card,
      {
        opacity: 0,
        x: direction === "left" ? -100 : 100,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
      }
    );
  }, [index, activeCategory]);

  return (
    <div 
      ref={cardRef} 
      className="h-full" 
      aria-label={`Room: ${room.name} with ${room.participantCount} participants`}
    >
      <HolographicCard className="p-0 h-full overflow-hidden">
        <div 
          ref={tiltRef}
          className="h-full transition-all duration-300"
        >
          {/* Card Header with gradient */}
          <div className={`h-24 bg-gradient-to-r ${gradient} relative p-4 flex flex-col justify-between`}>
            {/* Status indicators */}
            <div className="flex gap-2">
              {isNew && (
                <div className="px-2 py-1 bg-[#00FFFF]/30 backdrop-blur-sm rounded-full text-xs text-[#00FFFF] border border-[#00FFFF]/50 animate-pulse">
                  New
                </div>
              )}
              {isPopular && (
                <div className="px-2 py-1 bg-[#FF00E6]/30 backdrop-blur-sm rounded-full text-xs text-[#FF00E6] border border-[#FF00E6]/50">
                  Popular
                </div>
              )}
            </div>
            
            {/* Audio activity visualization */}
            <AudioWaveform 
              width={240} 
              height={30} 
              bars={20} 
              color="#00FFFF" 
              activeColor="#FF00E6" 
              className="opacity-60"
            />
          </div>
          
          {/* Card content */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-orbitron text-2xl text-[#00FFFF]">{room.name}</h3>
              <div className="bg-black/40 backdrop-blur-md rounded-full px-2 py-1 text-sm border border-white/10">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FF00E6] animate-pulse mr-2"></span>
                Live
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex -space-x-2 mr-3">
                {[...Array(Math.min(3, room.participantCount))].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00FFFF]/80 to-[#9D00FF]/80 border border-black flex items-center justify-center text-xs overflow-hidden">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {room.participantCount > 3 && (
                  <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-xs">
                    +{room.participantCount - 3}
                  </div>
                )}
              </div>
              <span className="text-white/70">
                {room.participantCount} {room.participantCount === 1 ? 'participant' : 'participants'}
              </span>
            </div>
            
            {/* Room tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/70 border border-white/10">
                #cyberpunk
              </div>
              <div className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/70 border border-white/10">
                #english
              </div>
              <div className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/70 border border-white/10">
                #{categories[index % categories.length].name.toLowerCase()}
              </div>
            </div>
            
            <Link href={`/rooms/${room.id}`}>
              <m.button
                className="w-full py-3 px-6 bg-black border border-[#00FFFF] text-[#00FFFF] rounded-md font-orbitron relative overflow-hidden group"
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
        </div>
      </HolographicCard>
    </div>
  );
};

// Search Input Component
const SearchInput = () => (
  <div className="relative mb-8">
    <input
      type="text"
      placeholder="Search rooms..."
      className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-all text-white"
    />
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
      🔍
    </div>
  </div>
);

// StatsCard component - replace emojis with SVG icons
const StatsCard = ({ title, value, icon }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#00FFFF]/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]">
    <div className="p-4 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center border border-white/10">
          {/* SVG icon instead of emoji */}
          {icon}
        </div>
        <p className="text-sm text-white/70">{title}</p>
      </div>
      <p className="text-2xl font-semibold mt-auto">{value}</p>
    </div>
  </div>
);

export default function RoomsPage() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0); // 0 means "All"
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);

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
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      
      gsap.fromTo(
        sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );
    }
  }, [loading]);
  
  // Filter rooms based on active category
  const filteredRooms = activeCategory === 0 
    ? roomsData 
    : roomsData.filter((_, index) => index % categories.length + 1 === activeCategory);

  return (
    <main className="flex min-h-screen bg-black text-white">
      {/* Sidebar - Made responsive and fixed */}
      <div className={`fixed top-0 left-0 h-screen w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 z-30 transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo and application name */}
          <div className="mb-8">
            <div className="font-orbitron text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00E6]">
              <ShimmeringText text="NEXVOX" />
            </div>
            <p className="text-white/50 text-xs mt-1">Voice Rooms</p>
          </div>
          
          {/* Close sidebar button - visible only on mobile */}
          <button 
            className="lg:hidden absolute top-4 right-4 p-1 text-white/70 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Categories section */}
          <div className="mb-6">
            <h3 className="text-white/70 text-xs uppercase tracking-wider mb-3">Categories</h3>
            <div className="space-y-2">
              <CategoryItem
                category={{ id: 0, name: "All Rooms", icon: "🌐", count: roomsData.length }}
                isActive={activeCategory === 0}
                onClick={setActiveCategory}
              />
              {categories.map(category => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isActive={activeCategory === category.id}
                  onClick={setActiveCategory}
                />
              ))}
            </div>
          </div>
          
          {/* Communities section */}
          <div className="mb-6">
            <h3 className="text-white/70 text-xs uppercase tracking-wider mb-3">Communities</h3>
            <div className="space-y-2">
              {communities.map(community => (
                <CommunityItem key={community.id} community={community} />
              ))}
            </div>
          </div>
          
          {/* Stats section */}
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
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile header with menu toggle */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-md border-b border-white/10 z-20 py-4 px-6">
          <div className="flex items-center justify-between">
            <button 
              className="p-2 rounded-md hover:bg-white/5"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="font-orbitron text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00E6]">
              <ShimmeringText text="NEXVOX" />
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-6 pt-20 lg:pt-6">
          <div ref={headerRef} className="mb-12">
            <ShimmeringText
              text="Explore Voice Rooms"
              className="text-4xl font-orbitron mb-4"
              variant="gradient"
              as="h1"
            />
            <p className="text-lg opacity-70 max-w-2xl mb-8">
              Join voice rooms and connect with people from all around the world
            </p>
            
            {/* Stats row with SVG icons instead of emojis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard 
                title="Active Rooms" 
                value={roomsData.length} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                }
              />
              <StatsCard 
                title="Online Users" 
                value="1,247" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />
              <StatsCard 
                title="Communities" 
                value={communities.length} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                }
              />
              <StatsCard 
                title="Trending" 
                value={activeCategory === 0 ? "Music" : categories[activeCategory - 1].name} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
            </div>
            
            {/* Search and view toggle with improved styling */}
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-8">
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search rooms by name or category..."
                    className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-all text-white"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <m.button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#00FFFF] bg-[#00FFFF]/10 p-1 rounded"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 255, 255, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </m.button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-white/50 mr-2">View:</div>
                <m.button
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${view === 'grid' ? 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/50' : 'bg-black/40 text-white/70 border border-white/10'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </m.button>
                <m.button
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${view === 'list' ? 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/50' : 'bg-black/40 text-white/70 border border-white/10'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('list')}
                  aria-label="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </m.button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Category indicator with improved styling */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                  <span className="text-white/70">Category:</span>
                  <span className="font-orbitron text-[#00FFFF]">
                    {activeCategory === 0 ? "All Rooms" : categories[activeCategory - 1].name}
                  </span>
                  {activeCategory !== 0 && (
                    <m.button
                      className="ml-2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs"
                      whileHover={{ scale: 1.2, backgroundColor: "rgba(255,0,230,0.3)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveCategory(0)}
                      aria-label="Clear filter"
                    >
                      ×
                    </m.button>
                  )}
                </div>
              </div>
              
              {/* Room grid or list based on view */}
              {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredRooms.map((room, index) => (
                    <RoomCard 
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
                    <div 
                      key={room.id}
                      className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 hover:border-[#00FFFF]/30 transition-colors"
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
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-[#FF00E6] animate-pulse"></span>
                              <span className="text-white/70">{room.participantCount} participants</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="px-2 py-0.5 bg-black/40 text-white/50 text-xs rounded-full">#cyberpunk</span>
                              <span className="px-2 py-0.5 bg-black/40 text-white/50 text-xs rounded-full">#{categories[index % categories.length].name.toLowerCase()}</span>
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
                    </div>
                  ))}
                </div>
              )}
              
              {/* No rooms message */}
              {filteredRooms.length === 0 && (
                <div className="text-center py-20">
                  <div className="mx-auto w-16 h-16 mb-4 text-[#00FFFF] opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-orbitron mb-2 text-[#00FFFF]">No rooms found</h3>
                  <p className="text-white/70 mb-6">There are no active rooms in this category right now</p>
                  <m.button
                    className="py-2 px-6 bg-[#00FFFF]/20 border border-[#00FFFF]/50 text-[#00FFFF] rounded-md font-medium"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(0)}
                  >
                    View All Rooms
                  </m.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
} 