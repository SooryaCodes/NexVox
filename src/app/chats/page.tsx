"use client";

import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoArrowBack, IoSettingsOutline, IoNotificationsOutline, IoChevronBackOutline, 
  IoChatbubbleOutline, IoPersonOutline, IoHomeOutline, IoSearch, 
  IoEllipsisHorizontal, IoImages, IoMic, IoDocumentText, IoLocation, 
  IoCalendarOutline, IoColorPaletteOutline, IoBrushOutline } from "react-icons/io5";
import { useFriends } from '@/contexts/FriendContext';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { User } from '@/types/room';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import EmptyState from '@/components/chat/EmptyState';
import NeonGrid from "@/components/NeonGrid";
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function ChatsPage() {
  const { friends } = useFriends();
  const { playClick, playNotification, playSuccess, playToggle, playCustom } = useSoundEffects();
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const router = useRouter();
  
  // References for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const chatSuggestionsRef = useRef<HTMLDivElement>(null);
  
  // Suggested replies for quick access - these will be shown in the chat window
  const suggestedReplies = [
    "How are you today?",
    "Check out this new feature!",
    "Are you free to chat?"
  ];
  
  // Media sharing options - these will be accessible in the chat window
  const mediaOptions = [
    { label: "Photos", color: "#00FFFF", icon: <IoImages className="h-5 w-5" /> },
    { label: "Voice", color: "#FF00E6", icon: <IoMic className="h-5 w-5" /> },
    { label: "File", color: "#9D00FF", icon: <IoDocumentText className="h-5 w-5" /> },
    { label: "Location", color: "#00FF7F", icon: <IoLocation className="h-5 w-5" /> }
  ];
  
  // Animation for the header
  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "all"
      });
    }
  }, []);
  
  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On desktop, always show both panels
      if (!mobile) {
        setShowChatList(true);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // When a friend is selected on mobile, hide the chat list
  useEffect(() => {
    if (isMobile && selectedFriend) {
      setShowChatList(false);
    }
  }, [selectedFriend, isMobile]);
  
  // Handle conversation selection
  const handleSelectConversation = (friend: User) => {
    setSelectedFriend(friend);
    
    // On mobile, hide the chat list when a conversation is selected
    if (isMobile) {
      setShowChatList(false);
    }
  };
  
  // Handle back button on mobile
  const handleBackToList = () => {
    playClick();
    setShowChatList(true);
  };
  
  // Handle clicking outside suggestions to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatSuggestionsRef.current && !chatSuggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle showing the user profile of the selected friend
  const handleToggleUserProfile = () => {
    playToggle();
    setShowUserProfile(!showUserProfile);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };
  
  const panelVariants = {
    hidden: (isRight: boolean) => ({
      opacity: 0,
      x: isRight ? 20 : -20
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  // Handle notifications button click
  const handleNotificationsClick = () => {
    playNotification();
    // This would typically open a notifications panel
  };
  
  // Handle settings click
  const handleSettingsClick = () => {
    playClick();
    router.push('/settings');
  };
  
  // Handle profile click
  const handleProfileClick = () => {
    playClick();
    router.push('/profile');
  };
  
  // Handle friends page navigation
  const handleFriendsClick = () => {
    playClick();
    router.push('/friends');
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white pb-16">
      {/* Ambient background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D001A] to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[url('/assets/hyperspeed-visualization.svg')] bg-repeat opacity-10 z-0"></div>
      <NeonGrid color="#00FFFF" secondaryColor="#9D00FF" opacity={0.05} />
      
      {/* Header */}
      <header 
        ref={headerRef}
        className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/rooms">
              <m.button
                className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
                whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playClick()}
                aria-label="Back to Rooms"
              >
                <IoChevronBackOutline className="h-5 w-5" />
              </m.button>
            </Link>
            <h1 className="text-2xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] to-[#FF00E6]">Messages</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
              whileHover={{ scale: 1.05, borderColor: "#FF00E6", color: "#FF00E6" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFriendsClick}
              aria-label="Friends"
            >
              <IoPersonOutline className="h-5 w-5" />
            </m.button>
            
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
              whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSettingsClick}
              aria-label="Settings"
            >
              <IoSettingsOutline className="h-5 w-5" />
            </m.button>
            
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70 relative"
              whileHover={{ scale: 1.05, borderColor: "#FF00E6", color: "#FF00E6" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNotificationsClick}
              aria-label="Notifications"
            >
              <IoNotificationsOutline className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF00E6] text-xs flex items-center justify-center">3</span>
            </m.button>
            
            <m.button
              onClick={handleProfileClick}
              className="relative hover:ring-2 hover:ring-[#00FFFF]/50 rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Profile"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 border border-white/10 flex items-center justify-center text-sm">
                U
              </div>
            </m.button>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 mt-6 h-[calc(100vh-150px)]">
        {/* Chat interface - responsive layout with improved styling */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden h-full shadow-[0_0_30px_rgba(0,255,255,0.1)]">
          <div className="flex h-full">
            {/* Chat list - conditionally shown on mobile */}
            <AnimatePresence mode="wait">
              {(showChatList || !isMobile) && (
                <m.div 
                  key="chat-list"
                  className={`${isMobile ? 'w-full' : 'w-1/3 border-r border-white/10'}`}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  custom={false}
                >
                  <ChatList 
                    onSelectConversation={handleSelectConversation}
                    selectedUserId={selectedFriend?.id}
                  />
                </m.div>
              )}
            </AnimatePresence>
            
            {/* Chat interface or empty state depending on if a friend is selected */}
            <div className="flex-1 relative flex items-stretch">
              <AnimatePresence mode="wait">
                {selectedFriend ? (
                  <m.div 
                    key="chat-window"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="w-full"
                  >
                    <ChatWindow 
                      friend={selectedFriend} 
                      onBack={() => {
                        setSelectedFriend(null);
                        if (isMobile) setShowChatList(true);
                      }}
                      suggestedReplies={suggestedReplies}
                      mediaOptions={mediaOptions}
                      onViewProfile={() => {/* Handle profile view */}}
                    />
                  </m.div>
                ) : (
                  <m.div 
                    key="empty-state"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <EmptyState />
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ambient audio */}
      {typeof window !== 'undefined' && (
        <audio 
          src="/audios/digital-ambient.mp3" 
          autoPlay 
          loop 
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
} 