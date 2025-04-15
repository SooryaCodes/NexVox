"use client";

import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { User } from '@/types/room';
import { useFriends } from '@/contexts/FriendContext';
import { getAvatarStyle, getStatusColor } from '@/utils/profileUtils';
import { IoSearchOutline, IoEllipsisVertical, IoAddOutline, IoFilterOutline, IoChevronDown, IoTimeOutline, IoCalendarOutline, IoChatbubbleOutline } from 'react-icons/io5';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import gsap from 'gsap';

// Conversation interface including last message and timestamp
interface Conversation {
  friend: User;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  isTyping?: boolean;
}

// Function to get time display format for conversations
const getTimeDisplay = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today: show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffDays < 7) {
    // Within a week: show day name
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    // Older: show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

interface ChatListProps {
  onSelectConversation: (friend: User) => void;
  selectedUserId?: number;
}

// Filter options for conversations
type FilterOption = 'all' | 'unread' | 'recent';

// Placeholder for mock conversations - this would typically come from a real API/database
const mockConversations: { [key: number]: { lastMessage: string; timestamp: Date; unread: number, isTyping?: boolean } } = {
  2: { 
    lastMessage: "Want to join my gaming room later tonight?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 1,
    isTyping: true
  },
  3: { 
    lastMessage: "I'll share my new music tracks tomorrow",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    unread: 0
  },
  4: { 
    lastMessage: "Did you see the new spatial audio features?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: 0
  },
  5: { 
    lastMessage: "Check out this cool VR environment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    unread: 3
  },
};

export default function ChatList({ onSelectConversation, selectedUserId }: ChatListProps) {
  const { friends } = useFriends();
  const { playClick, playToggle, playSuccess } = useSoundEffects();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  // References for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  
  // Animation for header
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", clearProps: "all" }
      );
    }
  }, []);
  
  // Handle clicking outside filter options to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Build conversations from friends list and mock data
  useEffect(() => {
    const conversationsData = friends.map(friend => {
      const conversationData = mockConversations[friend.id] || {
        lastMessage: "Start a conversation...",
        timestamp: new Date(),
        unread: 0
      };
      
      return {
        friend,
        lastMessage: conversationData.lastMessage,
        timestamp: conversationData.timestamp,
        unread: conversationData.unread,
        isTyping: conversationData.isTyping
      };
    });
    
    // Sort conversations by most recent first
    conversationsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setConversations(conversationsData);
  }, [friends]);
  
  // Filter conversations based on search query and active filter
  const filteredConversations = conversations.filter(convo => {
    // First filter by search query
    const matchesSearch = convo.friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then apply additional filters
    if (!matchesSearch) return false;
    
    if (activeFilter === 'unread') {
      return convo.unread > 0;
    } else if (activeFilter === 'recent') {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return convo.timestamp > oneDayAgo;
    }
    
    return true;
  });
  
  const handleFilterChange = (filter: FilterOption) => {
    playToggle();
    setActiveFilter(filter);
    setShowFilterOptions(false);
  };
  
  const toggleFilterOptions = () => {
    playClick();
    setShowFilterOptions(!showFilterOptions);
  };
  
  // Animation variants
  const listItemVariants = {
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
    }),
    hover: {
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  const popoverVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 10,
      transition: { duration: 0.2 } 
    }
  };

  // Helper for filter button label
  const getFilterLabel = (filter: FilterOption) => {
    switch (filter) {
      case 'unread': return 'Unread';
      case 'recent': return 'Recent';
      default: return 'All Chats';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header with search bar */}
      <div 
        ref={headerRef}
        className="px-4 py-3 border-b border-white/10 bg-black/30"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-white/90">Messages</h2>
          <div className="flex items-center space-x-2">
            <button 
              className="p-1.5 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70 hover:text-[#0ff] hover:border-[#0ff]/50 transition-colors"
              onClick={() => playClick()}
              title="New conversation"
            >
              <IoAddOutline className="h-5 w-5" />
            </button>
            
            <div className="relative" ref={filterRef}>
              <button 
                className="p-1.5 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70 hover:text-[#0ff] hover:border-[#0ff]/50 transition-colors flex items-center gap-1"
                onClick={toggleFilterOptions}
                title="Filter conversations"
              >
                <IoFilterOutline className="h-5 w-5" />
                <IoChevronDown className="h-3 w-3" />
              </button>
              
              <AnimatePresence>
                {showFilterOptions && (
                  <m.div 
                    className="absolute right-0 mt-1 w-40 bg-black/80 backdrop-blur-xl border border-white/10 rounded-md shadow-lg z-10"
                    variants={popoverVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="py-1">
                      {(['all', 'unread', 'recent'] as FilterOption[]).map((filter) => (
                        <button
                          key={filter}
                          className={`flex items-center w-full px-4 py-2 text-sm ${
                            activeFilter === filter 
                              ? 'text-[#0ff] bg-[#0ff]/5' 
                              : 'text-white/80 hover:bg-white/5'
                          }`}
                          onClick={() => handleFilterChange(filter)}
                        >
                          {filter === 'all' ? (
                            <IoChatbubbleOutline className="mr-2 h-4 w-4" />
                          ) : filter === 'unread' ? (
                            <IoEllipsisVertical className="mr-2 h-4 w-4" />
                          ) : (
                            <IoTimeOutline className="mr-2 h-4 w-4" />
                          )}
                          {getFilterLabel(filter)}
                        </button>
                      ))}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              className="p-1.5 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70 hover:text-[#0ff] hover:border-[#0ff]/50 transition-colors"
              onClick={() => playClick()}
              title="More options"
            >
              <IoEllipsisVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input 
            type="text" 
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0ff]/50 focus:border-[#0ff]/50"
          />
        </div>
      </div>
      
      {/* Active filter indicator */}
      {activeFilter !== 'all' && (
        <div className="px-4 py-2 bg-[#0ff]/5 border-b border-[#0ff]/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#0ff]">{getFilterLabel(activeFilter)}</span>
            <span className="text-white/60">({filteredConversations.length})</span>
          </div>
          <button 
            className="text-[#0ff] text-sm hover:underline"
            onClick={() => handleFilterChange('all')}
          >
            Clear
          </button>
        </div>
      )}
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {filteredConversations.length > 0 ? (
          <AnimatePresence mode="wait">
            <div className="divide-y divide-white/5">
              {filteredConversations.map((conversation, index) => {
                const { friend, lastMessage, timestamp, unread, isTyping } = conversation;
                const isSelected = friend.id === selectedUserId;
                const avatarStyle = getAvatarStyle(friend.avatarType || 'cyan');
                const statusColor = getStatusColor(friend.status || 'online');
                
                return (
                  <m.div 
                    key={friend.id}
                    className={`py-3 px-4 cursor-pointer ${
                      isSelected ? 'bg-gradient-to-r from-[#0ff]/10 to-transparent' : 'hover:bg-black/40'
                    } transition-colors`}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                    onClick={() => {
                      playSuccess();
                      onSelectConversation(friend);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ background: avatarStyle.background }}
                        >
                          <span className="text-xl font-bold" style={{ color: avatarStyle.color }}>
                            {friend.name.charAt(0)}
                          </span>
                        </div>
                        
                        {/* Status indicator */}
                        <div 
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-black"
                          style={{ backgroundColor: statusColor }}
                        ></div>
                      </div>
                      
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className={`font-medium truncate ${isSelected ? 'text-[#0ff]' : ''}`}>{friend.name}</h3>
                          <span className="text-xs text-white/50 whitespace-nowrap pl-2 flex items-center">
                            {timestamp.getHours() >= 0 && timestamp.getHours() < 8 && (
                              <IoTimeOutline className="mr-1 text-[#FF00E6]" />
                            )}
                            {getTimeDisplay(timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                          {isTyping ? (
                            <div className="text-sm text-[#0ff] flex items-center">
                              <span className="mr-1">Typing</span>
                              <span className="flex space-x-0.5">
                                <span className="w-1 h-1 bg-[#0ff] rounded-full animate-bounce"></span>
                                <span className="w-1 h-1 bg-[#0ff] rounded-full animate-bounce animation-delay-200"></span>
                                <span className="w-1 h-1 bg-[#0ff] rounded-full animate-bounce animation-delay-400"></span>
                              </span>
                            </div>
                          ) : (
                            <p className={`text-sm truncate max-w-[180px] sm:max-w-[240px] ${
                              unread > 0 ? 'text-white/90 font-medium' : 'text-white/60'
                            }`}>
                              {lastMessage}
                            </p>
                          )}
                          
                          {unread > 0 && (
                            <span className="ml-2 flex-shrink-0 w-5 h-5 bg-[#FF00E6] rounded-full text-xs flex items-center justify-center">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </AnimatePresence>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-10 px-4">
            <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center mb-4">
              <IoSearchOutline className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/50 text-center mb-2">
              {searchQuery ? "No conversations match your search" : "No conversations yet"}
            </p>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-[#0ff]/20 to-[#FF00E6]/20 rounded-full text-white hover:from-[#0ff]/30 hover:to-[#FF00E6]/30 transition-colors text-sm mt-2"
              onClick={() => {
                playClick();
                setSearchQuery('');
                setActiveFilter('all');
              }}
            >
              Start chatting
            </button>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
} 