"use client";

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { User } from '@/types/room';
import { useFriends } from '@/contexts/FriendContext';
import { getAvatarStyle, getStatusColor } from '@/utils/profileUtils';
import { IoSearchOutline } from 'react-icons/io5';
import { useSoundEffects } from '@/hooks/useSoundEffects';

// Conversation interface including last message and timestamp
interface Conversation {
  friend: User;
  lastMessage: string;
  timestamp: Date;
  unread: number;
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

// Placeholder for mock conversations - this would typically come from a real API/database
const mockConversations: { [key: number]: { lastMessage: string; timestamp: Date; unread: number } } = {
  2: { 
    lastMessage: "Want to join my room later?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 1
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
  const { playClick, playToggle } = useSoundEffects();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
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
        unread: conversationData.unread
      };
    });
    
    // Sort conversations by most recent first
    conversationsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setConversations(conversationsData);
  }, [friends]);
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(convo => 
    convo.friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
  
  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="relative">
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input 
            type="text" 
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0ff]/50 focus:border-[#0ff]/50"
          />
        </div>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {filteredConversations.length > 0 ? (
          <AnimatePresence mode="wait">
            <div className="divide-y divide-white/5">
              {filteredConversations.map((conversation, index) => {
                const { friend, lastMessage, timestamp, unread } = conversation;
                const isSelected = friend.id === selectedUserId;
                const avatarStyle = getAvatarStyle(friend.avatarType || 'cyan');
                const statusColor = getStatusColor(friend.status || 'online');
                
                return (
                  <m.div 
                    key={friend.id}
                    className={`py-3 px-4 cursor-pointer ${
                      isSelected ? 'bg-[#0ff]/10' : 'hover:bg-white/5'
                    } transition-colors`}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                    onClick={() => {
                      playClick();
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
                          <h3 className="font-medium truncate">{friend.name}</h3>
                          <span className="text-xs text-white/50 whitespace-nowrap pl-2">
                            {getTimeDisplay(timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-white/60 truncate max-w-[180px] sm:max-w-[240px]">
                            {lastMessage}
                          </p>
                          
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
          <div className="text-center py-10 text-white/50">
            {searchQuery ? "No conversations match your search" : "No conversations yet"}
          </div>
        )}
      </div>
    </div>
  );
} 