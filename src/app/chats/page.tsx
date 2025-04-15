"use client";

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoArrowBack } from "react-icons/io5";
import { useFriends } from '@/contexts/FriendContext';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { User } from '@/types/room';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import EmptyState from '@/components/chat/EmptyState';

export default function ChatsPage() {
  const { friends } = useFriends();
  const { playClick } = useSoundEffects();
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  
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
    if (isMobile) {
      setShowChatList(false);
    }
  };
  
  // Handle back button on mobile
  const handleBackToList = () => {
    playClick();
    setShowChatList(true);
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
  
  return (
    <div className="relative min-h-screen bg-black text-white pt-6 pb-16">
      {/* Ambient background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D001A] to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-10 z-0"></div>
      
      <m.div 
        className="container mx-auto px-4 sm:px-6 relative z-10 h-[calc(100vh-88px)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back button + Header */}
        <div className="flex items-center mb-6">
          <Link 
            href="/rooms" 
            className="flex items-center text-white/70 hover:text-white transition-colors mr-4"
            onClick={() => playClick()}
          >
            <IoArrowBack className="mr-1.5" />
            <span>Back to Rooms</span>
          </Link>
          
          <m.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] to-[#FF00E6]"
          >
            Chat
          </m.h1>
        </div>
        
        {/* Chat interface - responsive layout */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden h-[calc(100%-40px)]">
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
            
            {/* Chat content - right side or full width on mobile */}
            <AnimatePresence mode="wait">
              {(!showChatList || !isMobile) && (
                <m.div 
                  key="chat-content"
                  className={`${isMobile ? 'w-full' : 'w-2/3'}`}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  custom={true}
                >
                  {selectedFriend ? (
                    <ChatWindow 
                      friend={selectedFriend}
                      onBack={handleBackToList}
                    />
                  ) : (
                    <EmptyState />
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </m.div>
      
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