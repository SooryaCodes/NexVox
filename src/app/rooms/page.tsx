// src/app/rooms/page.tsx
"use client"
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { m, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import roomsData from "../data/rooms.json";
import NeonGrid from "@/components/NeonGrid";
import Image from "next/image";
import { IoSettingsOutline, IoNotificationsOutline, IoAddOutline } from "react-icons/io5";
import { FiMusic, FiUsers } from "react-icons/fi";
import { RiRobot2Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";

// Import components from new files
import EnhancedRoomCard from "@/components/rooms/EnhancedRoomCard";
import CategoryItem from "@/components/rooms/CategoryItem";
import CommunityItem from "@/components/rooms/CommunityItem";
import StatsCard from "@/components/rooms/StatsCard";
import FloatingChatbot from "@/components/rooms/FloatingChatbot";
import LoadingSpinner from "@/components/rooms/LoadingSpinner";
import NotificationPanel from "@/components/NotificationPanel";

// Import utilities
import { getAllRooms, RoomData as RoomDataType } from "@/lib/roomUtils";
import useNotifications from "@/lib/notificationService";

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

export default function RoomsPage() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0); // 0 means "All"
  const [view, setView] = useState<'grid' | 'list'>('grid'); // 'grid' or 'list'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle
  const [allRooms, setAllRooms] = useState<RoomDataType[]>([]); // All rooms including user-created ones
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // For notification panel
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Notifications system
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    addNotification 
  } = useNotifications();

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

  // Simulate loading and load rooms
  useEffect(() => {
    const timer = setTimeout(() => {
      // Load all rooms (default + user-created)
      const combinedRooms = getAllRooms(roomsData);
      setAllRooms(combinedRooms);
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Check for updated rooms when component mounts or is focused
  useEffect(() => {
    const handleFocus = () => {
      const combinedRooms = getAllRooms(roomsData);
      setAllRooms(combinedRooms);
    };

    // Add event listeners
    window.addEventListener('focus', handleFocus);
    
    // Initial check
    handleFocus();
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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

  // Toggle notifications panel
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Close notifications panel
  const closeNotifications = () => {
    setIsNotificationOpen(false);
  };

  // Navigate to create room page
  const handleCreateRoom = () => {
    router.push('/rooms/create');
  };

  // Filter rooms based on category
  const filteredRooms = activeCategory === 0 
    ? allRooms
    : allRooms.filter(room => {
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
            {/* Create Room Button - updated to use router navigation */}
            <m.button
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 rounded-md border border-[#00FFFF]/30 text-[#00FFFF] font-medium text-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateRoom}
              aria-label="Create a new room"
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
            
            {/* Notifications - Updated with working functionality */}
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70 relative"
              whileHover={{ scale: 1.05, borderColor: "#FF00E6", color: "#FF00E6" }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <IoNotificationsOutline className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF00E6] text-xs flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
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
                  category={{ id: 0, name: "All Rooms", icon: "🌐", count: allRooms.length, color: "#FF00E6" }}
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
                value={allRooms.length.toString()} 
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
                {/* Mobile Create Room button - updated to use router navigation */}
                <m.button
                  className="sm:hidden flex items-center justify-center p-2 bg-black/40 backdrop-blur-md rounded-md border border-[#00FFFF]/30 text-[#00FFFF]"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateRoom}
                  aria-label="Create a new room"
                >
                  <IoAddOutline className="h-5 w-5" />
                </m.button>
                
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
                      <div className="flex items-end justify-center h-10 w-full">
                        {[...Array(18)].map((_, i) => {
                          const height = 10 + Math.random() * 20;
                          const color = i % 2 === 0 ? "#00FFFF" : "#FF00E6";
                          return (
                            <div
                              key={i}
                              className="inline-block w-1 mx-0.5 rounded-sm transition-all duration-300 ease-in-out"
                              style={{
                                height: `${height}px`,
                                backgroundColor: color
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-orbitron text-lg text-[#00FFFF]">{room.name}</h3>
                        {room.participantCount > 10 && (
                          <span className="px-2 py-0.5 bg-[#FF00E6]/30 text-[#FF00E6] text-xs rounded-full">Popular</span>
                        )}
                        {typeof room.id === 'string' && (
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
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
        notifications={notifications}
        onMarkAllRead={markAllAsRead}
        onMarkAsRead={markAsRead}
      />
    </main>
  );
}