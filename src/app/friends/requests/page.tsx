"use client";

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoArrowBackOutline, IoCheckmarkOutline, IoCloseOutline, IoChatbubbleOutline, IoMicOutline } from "react-icons/io5";
import { useFriends } from '@/contexts/FriendContext';
import { getAvatarStyle, getStatusColor } from '@/utils/profileUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export default function FriendRequestsPage() {
  const { incomingRequests, outgoingRequests, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest } = useFriends();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const { playClick, playToggle, playConfirm, playSuccess, playCancel } = useSoundEffects();

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
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
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

  return (
    <div className="relative min-h-screen bg-black text-white pt-24 pb-16">
      {/* Ambient background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D001A] to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-10 z-0"></div>
      
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
          >
            <IoArrowBackOutline className="mr-1.5" />
            <span>Back to Friends</span>
          </Link>
          
          <m.h1 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#FF00E6] to-[#0ff]"
          >
            Friend Requests
          </m.h1>
        </div>
        
        {/* Tab navigation */}
        <m.div 
          className="flex border-b border-white/10 mb-8"
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {incomingRequests.length > 0 ? (
                incomingRequests.map((request) => {
                  const avatarStyle = getAvatarStyle(request.avatarType || 'cyan');
                  const statusColor = getStatusColor(request.status || 'online');
                  
                  return (
                    <m.div 
                      key={request.id}
                      variants={itemVariants}
                      className="relative rounded-lg border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden hover:border-[#0ff]/20 transition-colors group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0ff]/5 to-[#FF00E6]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="p-4 flex items-center">
                        <div className="relative">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ background: avatarStyle.background }}
                          >
                            <span className="text-xl font-bold" style={{ color: avatarStyle.color }}>
                              {request.name.charAt(0)}
                            </span>
                          </div>
                          
                          {/* Status indicator */}
                          <div 
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-black"
                            style={{ backgroundColor: statusColor }}
                          ></div>
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{request.name}</h3>
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
                                  className="px-2 py-0.5 bg-white/10 rounded-full text-xs"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-3 flex justify-end gap-2">
                        <button 
                          onClick={() => handleReject(request.id)}
                          className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                          title="Reject request"
                        >
                          <IoCloseOutline size={20} />
                        </button>
                        <button 
                          onClick={() => handleAccept(request.id)}
                          className="p-2 rounded-full bg-white/10 hover:bg-green-500/20 hover:text-green-400 transition-colors"
                          title="Accept request"
                        >
                          <IoCheckmarkOutline size={20} />
                        </button>
                      </div>
                    </m.div>
                  );
                })
              ) : (
                <m.div 
                  variants={itemVariants}
                  className="col-span-full bg-white/5 rounded-lg p-8 text-center"
                >
                  <div className="mb-4">
                    <IoCheckmarkOutline className="w-16 h-16 mx-auto text-white/30" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No incoming requests</h3>
                  <p className="text-white/60 mb-4">
                    You don't have any incoming friend requests at the moment
                  </p>
                  <Link 
                    href="/friends" 
                    className="inline-block px-5 py-2.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {outgoingRequests.length > 0 ? (
                outgoingRequests.map((request) => {
                  const avatarStyle = getAvatarStyle(request.avatarType || 'cyan');
                  const statusColor = getStatusColor(request.status || 'online');
                  
                  return (
                    <m.div 
                      key={request.id}
                      variants={itemVariants}
                      className="relative rounded-lg border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden hover:border-[#0ff]/20 transition-colors group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0ff]/5 to-[#FF00E6]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="p-4 flex items-center">
                        <div className="relative">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ background: avatarStyle.background }}
                          >
                            <span className="text-xl font-bold" style={{ color: avatarStyle.color }}>
                              {request.name.charAt(0)}
                            </span>
                          </div>
                          
                          {/* Status indicator */}
                          <div 
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-black"
                            style={{ backgroundColor: statusColor }}
                          ></div>
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{request.name}</h3>
                          <div className="flex items-center text-xs text-white/60 mt-0.5">
                            <span className="capitalize">{request.status || 'online'}</span>
                            <span className="mx-1.5">•</span>
                            <span>Level {request.level || 1}</span>
                          </div>
                          
                          <div className="mt-1 text-xs text-white/40">
                            Request pending
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-3 flex justify-end">
                        <button 
                          onClick={() => handleCancel(request.id)}
                          className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm transition-colors"
                        >
                          Cancel Request
                        </button>
                      </div>
                    </m.div>
                  );
                })
              ) : (
                <m.div 
                  variants={itemVariants}
                  className="col-span-full bg-white/5 rounded-lg p-8 text-center"
                >
                  <div className="mb-4">
                    <IoChatbubbleOutline className="w-16 h-16 mx-auto text-white/30" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No outgoing requests</h3>
                  <p className="text-white/60 mb-4">
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
      
      {/* Ambient sound effects on page load */}
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