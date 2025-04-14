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
import { IoSettingsOutline, IoNotificationsOutline, IoAddOutline, IoSearchOutline, IoKeyOutline, IoClose, IoMenuOutline } from "react-icons/io5";
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
import { useSoundEffects } from "@/hooks/useSoundEffects";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Initialize closed by default
  const [allRooms, setAllRooms] = useState<RoomDataType[]>([]); // All rooms including user-created ones
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // For notification panel
  const [searchQuery, setSearchQuery] = useState(''); // For room search
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false); // For keyboard shortcuts modal
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Notifications system
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    addNotification 
  } = useNotifications();

  const { playClick, playSuccess, playError, playTransition } = useSoundEffects();

  // Keyboard shortcuts data
  const keyboardShortcuts = [
    { key: 'Alt+C', description: 'Open/close chat assistant' },
    { key: 'Alt+S', description: 'Toggle sidebar' },
    { key: 'Alt+N', description: 'Open notifications' },
    { key: 'Alt+K', description: 'Show keyboard shortcuts' },
    { key: 'Alt+/  or Ctrl+K', description: 'Focus search bar' },
    { key: 'Esc', description: 'Close modal/dialog' },
    { key: 'Tab', description: 'Navigate interface elements' },
    { key: 'Enter/Space', description: 'Activate selected element' },
    { key: 'Arrow keys', description: 'Navigate lists, menus' },
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Alt+S
      if (e.altKey && e.key === 's') {
        setIsSidebarOpen(prev => !prev);
        e.preventDefault();
      }
      
      // Toggle notifications with Alt+N
      if (e.altKey && e.key === 'n') {
        setIsNotificationOpen(prev => !prev);
        e.preventDefault();
      }

      // Toggle keyboard shortcuts with Alt+K
      if (e.altKey && e.key === 'k') {
        setIsShortcutsModalOpen(prev => !prev);
        e.preventDefault();
      }
      
      // Focus search bar with Alt+/ or Ctrl+K
      if ((e.altKey && e.key === '/') || (e.ctrlKey && e.key === 'k')) {
        const searchInput = document.getElementById('room-search');
        if (searchInput) {
          searchInput.focus();
          e.preventDefault();
        }
      }
      
      // Close notifications/shortcuts modal with Escape
      if (e.key === 'Escape') {
        if (isNotificationOpen) {
          setIsNotificationOpen(false);
          e.preventDefault();
        }
        if (isShortcutsModalOpen) {
          setIsShortcutsModalOpen(false);
          e.preventDefault();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotificationOpen, isShortcutsModalOpen]);

  // Update mobile detection
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      
      // Set sidebar state based on device type
      if (!isMobile) {
        setIsSidebarOpen(true); // Always open on desktop
      } else if (!isSidebarOpen && isMobile) {
        // Keep it closed on mobile initially
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
      playSuccess();
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
    playClick();
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Close notifications panel
  const closeNotifications = () => {
    playClick();
    setIsNotificationOpen(false);
  };

  // Navigate to create room page
  const handleCreateRoom = () => {
    router.push('/rooms/create');
  };

  // Close shortcuts modal
  const closeShortcutsModal = () => {
    playClick();
    setIsShortcutsModalOpen(false);
  };

  // Filter rooms based on category and search query
  const filteredRooms = allRooms
    .filter(room => {
      // Filter by category first
      if (activeCategory !== 0) {
        const categoryName = categories.find(cat => cat.id === activeCategory)?.name.toLowerCase();
        if (room.type.toLowerCase() !== categoryName) return false;
      }
      
      // Then filter by search query if it exists
      if (searchQuery.trim() === '') return true;
      
      // Search in name, description, and tags
      const query = searchQuery.toLowerCase();
      return (
        room.name.toLowerCase().includes(query) || 
        (room.description && room.description.toLowerCase().includes(query)) ||
        room.type.toLowerCase().includes(query)
      );
    });

  // Toggle sidebar function
  const toggleSidebar = () => {
    playClick();
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      {/* Header with hamburger menu for mobile */}
      <div 
        ref={headerRef} 
        className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md px-4 py-3 border-b border-[#00FFFF]/20 flex items-center justify-between"
      >
        {/* Hamburger menu for mobile */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden z-50 text-[#00FFFF] hover:text-white transition-colors p-2"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <IoClose size={24} /> : <IoMenuOutline size={24} />}
        </button>
        
        {/* Logo/Title */}
        <h1 className="text-xl font-orbitron text-[#00FFFF] glow">
          <Link href="/">Nex<span className="text-[#FF00E6]">Vox</span></Link> Rooms
        </h1>
        
        {/* Rest of header content */}
        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoSearchOutline className="h-5 w-5 text-white/50" />
              </div>
              <input
                id="room-search"
                type="text"
                className="bg-black/30 border border-white/10 text-white placeholder-white/50 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#00FFFF] focus:border-[#00FFFF]/50"
                placeholder="Search rooms... (Alt+/)"
                value={searchQuery}
                onChange={(e) => {
                  playClick();
                  setSearchQuery(e.target.value);
                }}
                aria-label="Search for rooms"
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    playClick();
                    setSearchQuery('');
                  }}
                  aria-label="Clear search"
                >
                  <IoClose className="h-5 w-5 text-white/50 hover:text-white" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Create Room Button */}
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
            
            {/* Keyboard Shortcuts Button */}
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
              whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClick();
                setIsShortcutsModalOpen(true);
              }}
              aria-label="Keyboard shortcuts"
              aria-haspopup="dialog"
              aria-expanded={isShortcutsModalOpen}
            >
              <IoKeyOutline className="h-5 w-5" />
            </m.button>
            
            {/* Settings */}
            <Link href="/settings">
              <m.button
                className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
                whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playClick()}
                aria-label="Settings"
              >
                <IoSettingsOutline className="h-5 w-5" />
              </m.button>
            </Link>
            
            {/* Notifications */}
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70 relative"
              whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleNotifications}
              aria-label="Notifications"
              aria-haspopup="dialog"
              aria-expanded={isNotificationOpen}
            >
              <IoNotificationsOutline className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF00E6] rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </m.button>
            
            {/* Profile */}
            <Link href="/profile">
              <m.button
                className="relative hover:ring-2 hover:ring-[#00FFFF]/50 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Profile"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 border border-white/10 flex items-center justify-center text-sm">
                  U
                </div>
              </m.button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content with responsive sidebar */}
      <div className="pt-16 flex flex-col md:flex-row min-h-screen">
        {/* Sidebar - overlay on mobile, fixed on desktop */}
        <aside 
          ref={sidebarRef}
          className={`
            fixed md:relative top-0 left-0 z-30 
            h-full md:h-auto w-[280px] 
            bg-black/95 md:bg-black/40 backdrop-blur-md
            border-r border-[#00FFFF]/20
            transform transition-transform duration-300 ease-in-out
            pt-20 md:pt-4 px-4 pb-6
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Close button inside sidebar (mobile only) */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 md:hidden p-2 rounded-full bg-[#00FFFF]/20 text-white hover:text-[#00FFFF] transition-colors"
            aria-label="Close sidebar"
          >
            <IoClose size={20} />
          </button>
          <div className="p-6 flex flex-col gap-6 h-full">
            <div>
              <h2 className="text-lg font-orbitron mb-4 text-[#00FFFF]" id="categories-heading">CATEGORIES</h2>
              <div className="space-y-2" role="list" aria-labelledby="categories-heading">
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
              <h2 className="text-lg font-orbitron mb-4 text-[#FF00E6]" id="communities-heading">COMMUNITIES</h2>
              <div className="space-y-2" role="list" aria-labelledby="communities-heading">
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />
              <StatsCard 
                title="Active Rooms" 
                value={allRooms.length.toString()} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF00E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                }
              />
            </div>
          </div>
        </aside>
        
        {/* Main content area - adjust for sidebar */}
        <div 
          ref={contentRef}
          className={`
            flex-1 transition-all duration-300
            p-4 md:p-6
            ${isSidebarOpen ? 'md:ml-0' : 'md:ml-0'} 
          `}
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
                <div 
                  className="flex bg-black/40 backdrop-blur-md rounded-md border border-white/10 p-1"
                  role="radiogroup"
                  aria-label="View style"
                >
                  <button 
                    className={`p-2 rounded-md ${view === 'grid' ? 'bg-white/10' : ''}`}
                    onClick={() => setView('grid')}
                    aria-label="Grid view"
                    aria-pressed={view === 'grid'}
                    role="radio"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    className={`p-2 rounded-md ${view === 'list' ? 'bg-white/10' : ''}`}
                    onClick={() => setView('list')}
                    aria-label="List view"
                    aria-pressed={view === 'list'}
                    role="radio"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Room cards */}
          {loading ? (
            <LoadingSpinner />
          ) : view === 'grid' ? (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              role="grid"
              aria-label="Available voice rooms"
            >
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
            <div 
              className="space-y-4"
              role="list"
              aria-label="Available voice rooms list view"
            >
              {filteredRooms.map((room, index) => (
                <m.div 
                  key={room.id}
                  className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 hover:border-[#00FFFF]/30 transition-colors"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", x: 5 }}
                  role="listitem"
                  tabIndex={0}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="min-w-[120px]">
                      <div className="flex items-end justify-center h-10 w-full" aria-hidden="true">
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
          
          {/* No rooms message */}
          {filteredRooms.length === 0 && (
            <div className="text-center p-8 border border-white/10 rounded-xl bg-black/40 backdrop-blur-md">
              <h3 className="text-xl font-orbitron text-[#00FFFF] mb-2">No rooms found</h3>
              <p className="text-white/70 mb-4">There are no rooms available in this category. Why not create one?</p>
              <button
                className="py-2 px-4 bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 rounded-md border border-[#00FFFF]/30 text-[#00FFFF] font-medium"
                onClick={handleCreateRoom}
              >
                Create Room
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Accessibility keyboard shortcuts info */}
      <div className="fixed bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md p-2 rounded-md text-xs text-white/50">
        <span>Alt+C: Chat • Alt+S: Sidebar • Alt+N: Notifications</span>
      </div>
      
      {/* Keyboard Shortcuts Modal */}
      {isShortcutsModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
          <m.div 
            className="bg-black/80 border border-white/10 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 id="shortcuts-title" className="text-xl font-orbitron text-[#00FFFF]">Keyboard Shortcuts</h2>
              <button 
                onClick={closeShortcutsModal}
                className="p-1 rounded-full hover:bg-white/10"
                aria-label="Close keyboard shortcuts"
              >
                <IoClose className="h-6 w-6 text-white/70" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="bg-black/70 border border-white/20 px-3 py-1 rounded-md text-white/90 font-mono text-sm">{shortcut.key}</span>
                    <span className="text-white/70">{shortcut.description}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-white/50 text-sm">Press <span className="font-mono bg-black/70 border border-white/20 px-2 py-0.5 rounded text-xs">Alt+K</span> to open this dialog anytime</p>
              </div>
            </div>
          </m.div>
        </div>
      )}

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
        notifications={notifications}
        onMarkAllRead={markAllAsRead}
        onMarkAsRead={markAsRead}
      />

      {/* Backdrop for mobile sidebar - ensure it only shows on mobile and disappears when sidebar is closed */}
      {isSidebarOpen && isMobileView && (
        <div 
          className="fixed inset-0 bg-black/70 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}