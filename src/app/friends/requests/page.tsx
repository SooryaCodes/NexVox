"use client";

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoArrowBackOutline, IoCheckmarkOutline, IoCloseOutline, IoChatbubbleOutline, IoMicOutline, 
  IoSettingsOutline, IoNotificationsOutline, IoChevronBackOutline, IoPersonOutline } from "react-icons/io5";
import { useFriends } from '@/contexts/FriendContext';
import { getAvatarStyle, getStatusColor } from '@/utils/profileUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useRouter } from 'next/navigation';

export default function FriendRequestsPage() {
  const { incomingRequests, outgoingRequests, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest } = useFriends();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const { playClick, playToggle, playConfirm, playSuccess, playCancel } = useSoundEffects();
  const router = useRouter();

  // Handle tab change
  const handleTabChange = (tab: 'incoming' | 'outgoing') => {
    playToggle();
    setActiveTab(tab);
  };

  // Accept a friend request
  const handleAccept = (userId: number) => {
    playSuccess();
    acceptFriendRequest(userId);
  };

  // Reject a friend request
  const handleReject = (userId: number) => {
    playCancel();
    rejectFriendRequest(userId);
  };

  // Cancel an outgoing friend request
  const handleCancel = (userId: number) => {
    playCancel();
    cancelFriendRequest(userId);
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
  
  // Handle notifications click
  const handleNotificationsClick = () => {
    playClick();
    // This would typically open a notifications panel
  };

  // Page animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({ 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: i * 0.05,
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    })
  };

  const tabVariants = {
    inactive: { 
      color: "rgba(255, 255, 255, 0.6)",
      borderColor: "transparent" 
    },
    active: { 
      color: "#00FFFF",
      borderColor: "#00FFFF",
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }),
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0, 255, 255, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white pt-0 pb-16">
      {/* Ambient background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D001A] to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-10 z-0"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/friends">
              <m.button
                className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
                whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playClick()}
                aria-label="Back to Friends"
              >
                <IoChevronBackOutline className="h-5 w-5" />
              </m.button>
            </Link>
            <h1 className="text-2xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#FF00E6] to-[#0ff]">Friend Requests</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
              whileHover={{ scale: 1.05, borderColor: "#FF00E6", color: "#FF00E6" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/friends')}
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
      
      <m.div 
        className="container mx-auto px-4 sm:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center mb-8">
          <Link 
            href="/friends" 
            className="flex items-center text-white/70 hover:text-white transition-colors mr-4"
            onClick={() => playClick()}
          >
            <IoArrowBackOutline className="mr-1.5" />
            <span>Back to Friends</span>
          </Link>
          
          <m.h1 
            custom={0}
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#FF00E6] to-[#0ff]"
          >
            Friend Requests
          </m.h1>
        </div>
        
        {/* Tab navigation */}
        <m.div 
          className="flex border-b border-white/10 mb-8"
          custom={1}
          variants={itemVariants}
        >
          <m.button
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'incoming' ? 'border-[#0ff] text-[#0ff]' : 'border-transparent text-white/60 hover:text-white/80'}`}
            onClick={() => handleTabChange('incoming')}
            variants={tabVariants}
            animate={activeTab === 'incoming' ? 'active' : 'inactive'}
          >
            Incoming ({incomingRequests.length})
          </m.button>
          
          <m.button
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'outgoing' ? 'border-[#0ff] text-[#0ff]' : 'border-transparent text-white/60 hover:text-white/80'}`}
            onClick={() => handleTabChange('outgoing')}
            variants={tabVariants}
            animate={activeTab === 'outgoing' ? 'active' : 'inactive'}
          >
            Outgoing ({outgoingRequests.length})
          </m.button>
        </m.div>
        
        {/* Requests list */}
        <AnimatePresence mode="wait">
          {activeTab === 'incoming' ? (
            <m.div 
              key="incoming"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {incomingRequests.length > 0 ? (
                incomingRequests.map((request, index) => {
                  const avatarStyle = getAvatarStyle(request.avatarType || 'cyan');
                  const statusColor = getStatusColor(request.status || 'online');
                  
                  return (
                    <m.div 
                      key={request.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="relative rounded-xl overflow-hidden"
                    >
                      {/* Card background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80 z-0"></div>
                      <div className="absolute inset-0 border border-white/10 hover:border-[#0ff]/20 transition-colors rounded-xl z-10"></div>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-[#FF00E6]/10 to-transparent rounded-bl-full -translate-y-1/2 translate-x-1/2 blur-md z-0"></div>
                      
                      <div className="relative p-5 backdrop-blur-sm z-20">
                        <div className="flex items-start">
                          <div className="relative">
                            <div 
                              className="w-14 h-14 rounded-full flex items-center justify-center border border-white/5 shadow-lg"
                              style={{ background: avatarStyle.background }}
                            >
                              <span className="text-2xl font-bold" style={{ color: avatarStyle.color }}>
                                {request.name.charAt(0)}
                              </span>
                            </div>
                            
                            {/* Status indicator */}
                            <div 
                              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${request.status === 'online' ? 'animate-pulse' : ''}`}
                              style={{ backgroundColor: statusColor }}
                            ></div>
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-medium">{request.name}</h3>
                            <div className="flex items-center text-xs text-white/60 mt-0.5">
                              <span className="capitalize">{request.status || 'online'}</span>
                              <span className="mx-1.5">•</span>
                              <span>Level {request.level || 1}</span>
                            </div>
                            
                            {/* Badges */}
                            {request.badges && request.badges.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {request.badges.slice(0, 2).map((badge, i) => (
                                  <span 
                                    key={i}
                                    className="px-2 py-0.5 bg-black/40 border border-white/10 rounded-full text-xs"
                                  >
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-end gap-2">
                          <m.button 
                            onClick={() => handleReject(request.id)}
                            className="p-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Reject request"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <IoCloseOutline size={20} />
                          </m.button>
                          <m.button 
                            onClick={() => handleAccept(request.id)}
                            className="p-2.5 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors"
                            title="Accept request"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <IoCheckmarkOutline size={20} />
                          </m.button>
                        </div>
                      </div>
                    </m.div>
                  );
                })
              ) : (
                <m.div 
                  custom={0}
                  variants={itemVariants}
                  className="col-span-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
                >
                  <div className="mb-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                      <IoCheckmarkOutline className="w-10 h-10 text-white/30" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No incoming requests</h3>
                  <p className="text-white/60 max-w-md mx-auto mb-6">
                    You don't have any incoming friend requests at the moment
                  </p>
                  <Link 
                    href="/friends" 
                    className="inline-block px-5 py-2.5 rounded-md bg-gradient-to-r from-[#0ff]/20 to-[#FF00E6]/20 hover:from-[#0ff]/30 hover:to-[#FF00E6]/30 border border-white/10 transition-colors"
                  >
                    Return to Friends
                  </Link>
                </m.div>
              )}
            </m.div>
          ) : (
            <m.div 
              key="outgoing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {outgoingRequests.length > 0 ? (
                outgoingRequests.map((request, index) => {
                  const avatarStyle = getAvatarStyle(request.avatarType || 'cyan');
                  const statusColor = getStatusColor(request.status || 'online');
                  
                  return (
                    <m.div 
                      key={request.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="relative rounded-xl overflow-hidden"
                    >
                      {/* Card background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80 z-0"></div>
                      <div className="absolute inset-0 border border-white/10 hover:border-[#0ff]/20 transition-colors rounded-xl z-10"></div>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-[#FF00E6]/10 to-transparent rounded-bl-full -translate-y-1/2 translate-x-1/2 blur-md z-0"></div>
                      
                      <div className="relative p-5 backdrop-blur-sm z-20">
                        <div className="flex items-start">
                          <div className="relative">
                            <div 
                              className="w-14 h-14 rounded-full flex items-center justify-center border border-white/5 shadow-lg"
                              style={{ background: avatarStyle.background }}
                            >
                              <span className="text-2xl font-bold" style={{ color: avatarStyle.color }}>
                                {request.name.charAt(0)}
                              </span>
                            </div>
                            
                            {/* Status indicator */}
                            <div 
                              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${request.status === 'online' ? 'animate-pulse' : ''}`}
                              style={{ backgroundColor: statusColor }}
                            ></div>
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-medium">{request.name}</h3>
                            <div className="flex items-center text-xs text-white/60 mt-0.5">
                              <span className="capitalize">{request.status || 'online'}</span>
                              <span className="mx-1.5">•</span>
                              <span>Level {request.level || 1}</span>
                            </div>
                            
                            <div className="mt-2 inline-block px-3 py-1.5 bg-[#FF00E6]/10 rounded-full text-xs text-[#FF00E6]">
                              Request pending
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                          <m.button 
                            onClick={() => handleCancel(request.id)}
                            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Cancel Request
                          </m.button>
                        </div>
                      </div>
                    </m.div>
                  );
                })
              ) : (
                <m.div 
                  custom={0}
                  variants={itemVariants}
                  className="col-span-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
                >
                  <div className="mb-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                      <IoChatbubbleOutline className="w-10 h-10 text-white/30" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No outgoing requests</h3>
                  <p className="text-white/60 max-w-md mx-auto mb-6">
                    You haven't sent any friend requests yet
                  </p>
                  <Link 
                    href="/friends" 
                    className="inline-block px-5 py-2.5 rounded-md bg-gradient-to-r from-[#0ff] to-[#FF00E6] text-black font-medium transition-transform hover:scale-105"
                  >
                    Find Friends
                  </Link>
                </m.div>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
      
      {/* Ambient sound effects */}
      {typeof window !== 'undefined' && (
        <audio 
          src="/audios/digital-blip.mp3" 
          autoPlay 
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
} 