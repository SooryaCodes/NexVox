"use client";

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoSearchOutline, IoPersonAdd, IoArrowBack, IoChatbubbleOutline, IoMicOutline, IoClose, IoAdd, 
  IoSettingsOutline, IoNotificationsOutline, IoChevronBackOutline } from "react-icons/io5";
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
    <div className="relative min-h-screen bg-black text-white pt-0 pb-16">
      {/* Ambient background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D001A] to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-10 z-0"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 mb-6">
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
            <h1 className="text-2xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] to-[#FF00E6]">Friends</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <m.button
              className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
              whileHover={{ scale: 1.05, borderColor: "#FF00E6", color: "#FF00E6" }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSearch}
              aria-label="Find Friends"
            >
              <IoSearchOutline className="h-5 w-5" />
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
        {/* Options bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <m.div 
            variants={itemVariants} 
            className="flex items-center gap-4"
          >
            <button 
              onClick={toggleSearch}
              className="px-4 py-2 rounded-md flex items-center bg-gradient-to-r from-[#0ff]/20 to-[#0ff]/5 hover:from-[#0ff]/30 hover:to-[#0ff]/10 border border-[#0ff]/20 transition-colors"
            >
              <IoSearchOutline className="mr-2" /> 
              Find Friends
            </button>
            
            <Link 
              href="/friends/requests" 
              className="px-4 py-2 rounded-md flex items-center bg-gradient-to-r from-[#FF00E6]/20 to-[#FF00E6]/5 hover:from-[#FF00E6]/30 hover:to-[#FF00E6]/10 border border-[#FF00E6]/20 transition-colors"
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
        
        {/* Friends grid */}
        {friends && friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend, index) => {
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
                  className="relative overflow-hidden group"
                >
                  {/* Card background with glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 z-0 rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-xl"
                       style={{ background: `linear-gradient(135deg, ${avatarStyle.color}20, transparent)` }}></div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-[#0ff]/30 transition-colors duration-300 z-10"></div>
                  
                  {/* Glow dot in corner */}
                  <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-[#0ff]/10 to-transparent rounded-bl-full -translate-y-1/2 translate-x-1/2 blur-md z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-5 z-10 backdrop-blur-sm rounded-xl">
                    <div className="flex items-start">
                      <div className="relative">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center border border-white/10 shadow-lg overflow-hidden group-hover:border-[#0ff]/30 transition-colors"
                          style={{ background: avatarStyle.background }}
                        >
                          <span className="text-3xl font-bold" style={{ color: avatarStyle.color }}>
                            {friend.name.charAt(0)}
                          </span>
                          
                          {/* Animated overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                               style={{ background: `linear-gradient(135deg, ${avatarStyle.color}, transparent)` }}></div>
                        </div>
                        
                        {/* Status indicator with pulse animation */}
                        <div 
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${friend.status === 'online' ? 'animate-pulse' : ''}`}
                          style={{ backgroundColor: statusColor }}
                        ></div>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h3 className="text-xl font-medium group-hover:text-[#0ff] transition-colors">{friend.name}</h3>
                        
                        <div className="flex items-center text-xs text-white/60 mt-1">
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
                                className="px-2 py-0.5 bg-black/40 border border-white/10 rounded-full text-xs group-hover:border-[#0ff]/20 transition-colors"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="mt-5 pt-4 border-t border-white/5 flex justify-between">
                      <div className="flex gap-2">
                        <m.button 
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Remove friend"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IoClose size={18} />
                        </m.button>
                      </div>
                      
                      <div className="flex gap-2">
                        <m.button 
                          onClick={() => openChat(friend)}
                          className="p-2 rounded-full bg-[#0ff]/10 hover:bg-[#0ff]/20 text-[#0ff] transition-colors"
                          title="Chat"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IoChatbubbleOutline size={18} />
                        </m.button>
                        
                        <m.button 
                          onClick={() => createRoomWithFriend(friend)}
                          className="p-2 rounded-full bg-[#FF00E6]/10 hover:bg-[#FF00E6]/20 text-[#FF00E6] transition-colors"
                          title="Create voice room"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IoMicOutline size={18} />
                        </m.button>
                      </div>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#0ff]/10 flex items-center justify-center mb-4">
                <IoPersonAdd size={40} className="text-[#0ff]/70" />
              </div>
              <h3 className="text-xl font-medium mb-2">No friends yet</h3>
              <p className="text-white/50 mb-6 max-w-md mx-auto">
                Find and add friends to chat, create voice rooms together, or join collaborative experiences
              </p>
              <button 
                onClick={toggleSearch}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0ff]/20 to-[#FF00E6]/20 hover:from-[#0ff]/30 hover:to-[#FF00E6]/30 text-white border border-white/10 transition-colors"
              >
                <IoSearchOutline className="inline mr-2" />
                Find Friends
              </button>
            </div>
          </div>
        )}
      </m.div>
      
      {/* Ambient sound effect */}
      {typeof window !== 'undefined' && (
        <audio 
          src="/audios/digital-blip.mp3" 
          autoPlay 
          loop
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
} 