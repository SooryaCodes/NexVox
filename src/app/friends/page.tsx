"use client";

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoSearchOutline, IoPersonAdd, IoArrowBack, IoChatbubbleOutline, IoMicOutline, IoClose, IoAdd } from "react-icons/io5";
import { useFriends } from '@/contexts/FriendContext';
import { getAvatarStyle, getStatusColor } from '@/utils/profileUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useRouter } from 'next/navigation';
import { User } from '@/types/room';

export default function FriendsPage() {
  const { friends, globalUsers, sendFriendRequest, removeFriend, searchUsers } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const { playClick, playToggle, playConfirm } = useSoundEffects();
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{message: string; isUser: boolean; timestamp: Date}[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const router = useRouter();

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchUsers(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchUsers]);

  // Toggle search panel
  const toggleSearch = () => {
    playToggle();
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Send friend request
  const handleSendRequest = (userId: number) => {
    playConfirm();
    sendFriendRequest(userId);
  };

  // Remove friend
  const handleRemoveFriend = (userId: number) => {
    playConfirm();
    removeFriend(userId);
  };

  // Navigate to chat with friend
  const openChat = (friend: User) => {
    playClick();
    router.push(`/chats?friend=${friend.id}`);
  };

  // Create room with friend
  const createRoomWithFriend = (friend: User) => {
    playConfirm();
    router.push(`/rooms/create?invite=${friend.id}`);
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

  const cardVariants = {
    initial: { 
      scale: 0.95,
      y: 20,
      opacity: 0 
    },
    animate: (i: number) => ({ 
      scale: 1,
      y: 0,
      opacity: 1,
      transition: { 
        delay: i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25
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
    },
    tap: { 
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white pt-6 pb-16">
      {/* Ambient background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D001A] to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-10 z-0"></div>
      
      <m.div 
        className="container mx-auto px-4 sm:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back button + Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center">
            <Link 
              href="/rooms" 
              className="flex items-center text-white/70 hover:text-white transition-colors mr-4"
              onClick={() => playClick()}
            >
              <IoArrowBack className="mr-1.5" />
              <span>Back to Rooms</span>
            </Link>
            
            <m.h1 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] to-[#FF00E6]"
            >
              Friends
            </m.h1>
          </div>
          
          <m.div 
            variants={itemVariants} 
            className="mt-4 md:mt-0 flex items-center"
          >
            <button 
              onClick={toggleSearch}
              className="mr-4 px-4 py-2 rounded-md flex items-center bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <IoSearchOutline className="mr-2" /> 
              Find Friends
            </button>
            
            <Link 
              href="/friends/requests" 
              className="px-4 py-2 rounded-md flex items-center bg-gradient-to-r from-[#0ff]/20 to-[#FF00E6]/20 hover:from-[#0ff]/30 hover:to-[#FF00E6]/30 border border-white/10 transition-colors"
            >
              <IoPersonAdd className="mr-2" /> 
              Requests
            </Link>
          </m.div>
        </div>
        
        {/* Friend search panel */}
        <AnimatePresence>
          {showSearch && (
            <m.div 
              className="mb-8 p-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex mb-4">
                <div className="relative flex-1">
                  <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input 
                    type="text" 
                    placeholder="Search users by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0ff]/50 focus:border-[#0ff]/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => {
                    const avatarStyle = getAvatarStyle(user.avatarType || 'cyan');
                    return (
                      <m.div 
                        key={user.id} 
                        className="flex items-center justify-between p-3 rounded-md bg-black/40 backdrop-blur-sm border border-white/5 hover:border-[#0ff]/30 transition-all hover:bg-black/60"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br"
                            style={{ background: avatarStyle.background }}
                          >
                            <span className="text-lg font-bold" style={{ color: avatarStyle.color }}>{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{user.name}</h3>
                            <div className="flex items-center text-xs text-white/50">
                              <span>Level {user.level || 1}</span>
                              {user.badges && user.badges[0] && (
                                <>
                                  <span className="mx-1.5">•</span>
                                  <span className="px-1.5 py-0.5 bg-white/10 rounded-full text-xs">{user.badges[0]}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSendRequest(user.id)}
                          className="p-2 rounded-full bg-[#0ff]/10 hover:bg-[#0ff]/20 text-[#0ff] text-sm transition-colors"
                          title="Add friend"
                        >
                          <IoAdd size={18} />
                        </button>
                      </m.div>
                    );
                  })
                ) : searchQuery ? (
                  <div className="text-center py-6 text-white/50">No users found matching your search</div>
                ) : (
                  <div className="text-center py-6 text-white/50">Type to search for users</div>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
        
        {/* Friends list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.length > 0 ? (
            friends.map((friend, index) => {
              const avatarStyle = getAvatarStyle(friend.avatarType || 'cyan');
              const statusColor = getStatusColor(friend.status || 'online');
              
              return (
                <m.div 
                  key={friend.id}
                  custom={index}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  className="relative rounded-xl overflow-hidden group"
                >
                  {/* Card background with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80 z-0"></div>
                  <div className="absolute inset-0 border border-white/10 group-hover:border-[#0ff]/20 transition-colors rounded-xl z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0ff]/5 to-[#FF00E6]/5 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-[#0ff]/10 to-transparent rounded-bl-full -translate-y-1/2 translate-x-1/2 blur-md z-0"></div>
                  <div className="absolute bottom-0 left-0 h-16 w-16 bg-gradient-to-tr from-[#FF00E6]/10 to-transparent rounded-tr-full translate-y-1/2 -translate-x-1/2 blur-md z-0"></div>
                  
                  <div className="relative p-5 backdrop-blur-sm z-20">
                    <div className="flex items-start">
                      <div className="relative">
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center border border-white/5 shadow-lg"
                          style={{ background: avatarStyle.background }}
                        >
                          <span className="text-2xl font-bold" style={{ color: avatarStyle.color }}>
                            {friend.name.charAt(0)}
                          </span>
                        </div>
                        
                        {/* Status indicator with pulse animation for online */}
                        <div 
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${friend.status === 'online' ? 'animate-pulse' : ''}`}
                          style={{ backgroundColor: statusColor }}
                        ></div>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium">{friend.name}</h3>
                        <div className="flex items-center text-xs text-white/60 mt-0.5">
                          <span className="capitalize">{friend.status || 'online'}</span>
                          <span className="mx-1.5">•</span>
                          <span>Level {friend.level || 1}</span>
                        </div>
                        
                        {/* Badges */}
                        {friend.badges && friend.badges.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {friend.badges.map((badge, i) => (
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
                    
                    {/* Action buttons */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                      <div className="text-xs text-white/50">
                        {friend.stats?.roomsJoined ? `${friend.stats.roomsJoined} rooms joined` : 'New user'}
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openChat(friend)}
                          className="p-2.5 rounded-full bg-[#0ff]/10 hover:bg-[#0ff]/20 text-[#0ff] transition-colors"
                          title="Chat with friend"
                        >
                          <IoChatbubbleOutline size={18} />
                        </button>
                        <button 
                          onClick={() => createRoomWithFriend(friend)}
                          className="p-2.5 rounded-full bg-[#FF00E6]/10 hover:bg-[#FF00E6]/20 text-[#FF00E6] transition-colors"
                          title="Create voice room"
                        >
                          <IoMicOutline size={18} />
                        </button>
                        <button 
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="p-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Remove friend"
                        >
                          <IoClose size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </m.div>
              );
            })
          ) : (
            <m.div 
              variants={itemVariants}
              className="col-span-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
            >
              <div className="mb-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                  <IoPersonAdd className="w-10 h-10 text-white/30" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">No friends yet</h3>
              <p className="text-white/60 max-w-md mx-auto mb-6">
                Connect with other users in the NexVox universe. Find friends with similar interests and join voice rooms together.
              </p>
              <button 
                onClick={toggleSearch}
                className="px-5 py-2.5 rounded-md bg-gradient-to-r from-[#0ff] to-[#FF00E6] text-black font-medium transition-transform hover:scale-105"
              >
                Find Friends
              </button>
            </m.div>
          )}
        </div>
      </m.div>
      
      {/* Ambient sound effect */}
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