"use client";

import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { User } from '@/types/room';
import { getAvatarStyle, getStatusColor } from '@/utils/profileUtils';
import { IoArrowBack, IoSend, IoPaperPlane, IoMicOutline, IoEllipsisVertical, IoImage, IoAttach, IoHappy, IoChevronDown } from 'react-icons/io5';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useRouter } from 'next/navigation';

// Message interface for chat
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file' | 'audio';
    url: string;
    name?: string;
  };
}

interface ChatWindowProps {
  friend: User;
  onBack: () => void;
}

// Sample predefined messages for each friend
const getFriendMessages = (friendId: number): ChatMessage[] => {
  const commonResponses = [
    { id: crypto.randomUUID(), content: "Hi there! How are you?", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: crypto.randomUUID(), content: "I've been exploring the new features on NexVox", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23.5) },
  ];

  // Friend-specific conversations
  const friendMessages: { [key: number]: ChatMessage[] } = {
    2: [
      ...commonResponses,
      { id: crypto.randomUUID(), content: "Want to join my gaming room later tonight?", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { id: crypto.randomUUID(), content: "I'm hosting a tournament in the VR space", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 4) },
    ],
    3: [
      ...commonResponses,
      { id: crypto.randomUUID(), content: "Just finished my new music track. Want to hear it?", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
      { 
        id: crypto.randomUUID(), 
        content: "Here's a preview of what I've been working on", 
        isUser: false, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        attachment: {
          type: 'audio',
          url: '/audio/sample-track.mp3',
          name: 'synthwave_preview.mp3'
        }
      },
    ],
    4: [
      ...commonResponses,
      { id: crypto.randomUUID(), content: "Did you see the new spatial audio features?", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      { id: crypto.randomUUID(), content: "I've been working on a new algorithm for immersive audio", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
    ],
    5: [
      ...commonResponses,
      { id: crypto.randomUUID(), content: "Check out this cool VR environment I designed", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
      { 
        id: crypto.randomUUID(), 
        content: "What do you think about this new design?", 
        isUser: false, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
        attachment: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1614729373246-42ec9bf7edf1',
          name: 'vr_design.jpg'
        }
      },
      { id: crypto.randomUUID(), content: "Let me know if you want to collaborate on a project", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    ],
  };

  return friendMessages[friendId] || commonResponses;
};

// Get a random response from the friend
const getRandomResponse = (friendName: string): string => {
  const responses = [
    `That's interesting, tell me more!`,
    `Sounds great! Let's do it.`,
    `I agree, that makes a lot of sense.`,
    `Have you tried the new spatial audio features?`,
    `Want to join one of my rooms later?`,
    `Nice! That's awesome.`,
    `I've been working on something similar.`,
    `Let's create a room and invite some friends.`,
    `That's a great idea, let's explore it further.`,
    `The cyberpunk aesthetics in NexVox are amazing, right?`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export default function ChatWindow({ friend, onBack }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { playClick, playSuccess, playNotification } = useSoundEffects();
  const router = useRouter();
  
  // Load chat history for this friend
  useEffect(() => {
    setMessages(getFriendMessages(friend.id));
  }, [friend.id]);
  
  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const sendMessage = () => {
    if (!input.trim()) return;
    
    playClick('soft');
    
    // Create new message
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
      status: 'sent'
    };
    
    // Add message to chat
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Simulate message being delivered
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? {...msg, status: 'delivered'} : msg
      ));
    }, 1000);
    
    // Simulate message being read
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? {...msg, status: 'read'} : msg
      ));
    }, 2000);
    
    // Simulate friend's response
    setTimeout(() => {
      const friendResponse: ChatMessage = {
        id: crypto.randomUUID(),
        content: getRandomResponse(friend.name),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, friendResponse]);
      playNotification();
    }, 3000 + Math.random() * 2000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const createRoom = () => {
    playSuccess();
    router.push(`/rooms/create?invite=${friend.id}`);
  };
  
  // Format message time
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Group messages by date
  const getMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    }
  };
  
  // Group messages by date for display
  const groupedMessages: { [date: string]: ChatMessage[] } = {};
  messages.forEach(message => {
    const dateKey = getMessageDate(message.timestamp);
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });
  
  // Animation variants
  const messageVariants = {
    hidden: (isUser: boolean) => ({
      opacity: 0,
      x: isUser ? 20 : -20,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 40
      }
    },
    exit: (isUser: boolean) => ({
      opacity: 0,
      x: isUser ? 20 : -20,
      transition: {
        duration: 0.2
      }
    })
  };
  
  return (
    <div className="flex flex-col h-full relative">
      {/* Chat header */}
      <div className="py-3 px-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
        <div className="flex items-center">
          <button 
            onClick={() => {
              playClick();
              onBack();
            }}
            className="p-2 mr-2 text-white/60 hover:text-[#0ff] rounded-full hover:bg-white/5 transition-colors md:hidden"
          >
            <IoArrowBack size={20} />
          </button>
          
          <div className="flex items-center">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: getAvatarStyle(friend.avatarType || 'cyan').background }}
              >
                <span className="text-lg font-bold" style={{ color: getAvatarStyle(friend.avatarType || 'cyan').color }}>
                  {friend.name.charAt(0)}
                </span>
              </div>
              
              <div 
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black"
                style={{ backgroundColor: getStatusColor(friend.status || 'online') }}
              ></div>
            </div>
            
            <div className="ml-3">
              <h3 className="font-medium">{friend.name}</h3>
              <div className="flex items-center text-xs text-white/60">
                <span className="capitalize">{friend.status || 'online'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={createRoom}
            className="p-2 text-white/60 hover:text-[#FF00E6] rounded-full hover:bg-white/5 transition-colors"
            title="Create voice room"
          >
            <IoMicOutline size={20} />
          </button>
          
          <button 
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            title="More options"
          >
            <IoEllipsisVertical size={20} />
          </button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <div className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/40">
                {date}
              </div>
            </div>
            
            {dateMessages.map((message) => (
              <AnimatePresence key={message.id} mode="popLayout">
                <m.div 
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={message.isUser}
                >
                  {/* Avatar for friend's messages */}
                  {!message.isUser && (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2 self-end mb-2"
                      style={{ background: getAvatarStyle(friend.avatarType || 'cyan').background }}
                    >
                      <span className="text-sm font-bold" style={{ color: getAvatarStyle(friend.avatarType || 'cyan').color }}>
                        {friend.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[70%] ${
                      message.isUser 
                        ? 'bg-[#0ff]/20 rounded-t-lg rounded-bl-lg' 
                        : 'bg-white/10 rounded-t-lg rounded-br-lg'
                    }`}
                  >
                    {/* Message content */}
                    <div className="p-3">
                      <p className="text-white">{message.content}</p>
                      
                      {/* Attachment display if any */}
                      {message.attachment && (
                        <div className="mt-2">
                          {message.attachment.type === 'image' && (
                            <div className="mt-2 rounded-md overflow-hidden">
                              <img 
                                src={message.attachment.url} 
                                alt={message.attachment.name || "Attached image"} 
                                className="w-full h-auto max-h-60 object-cover"
                              />
                            </div>
                          )}
                          
                          {message.attachment.type === 'audio' && (
                            <div className="mt-2 p-2 bg-black/30 rounded-md">
                              <div className="flex items-center">
                                <div className="p-2 bg-[#FF00E6]/20 rounded-full mr-2">
                                  <IoMicOutline className="text-[#FF00E6]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm">{message.attachment.name}</div>
                                  <div className="h-1 w-full bg-white/10 rounded-full mt-1">
                                    <div className="h-full w-1/3 bg-gradient-to-r from-[#0ff] to-[#FF00E6] rounded-full"></div>
                                  </div>
                                </div>
                                <button className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                  <IoPaperPlane size={14} className="text-white/70" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Message timestamp and status */}
                    <div className="px-3 pb-1.5 flex justify-end items-center text-xs text-white/40">
                      <span>{formatMessageTime(message.timestamp)}</span>
                      {message.isUser && message.status && (
                        <span className="ml-1.5">
                          {message.status === 'sent' && '✓'}
                          {message.status === 'delivered' && '✓✓'}
                          {message.status === 'read' && (
                            <span className="text-[#0ff]">✓✓</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </m.div>
              </AnimatePresence>
            ))}
          </div>
        ))}
        
        {/* This div is for scrolling to the bottom */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="py-3 px-4 border-t border-white/10 bg-black/30">
        <div className="flex items-end">
          <div className="flex items-center space-x-2 mr-2">
            <button className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors">
              <IoAttach size={20} />
            </button>
            <button className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors">
              <IoImage size={20} />
            </button>
            <button className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors">
              <IoHappy size={20} />
            </button>
          </div>
          
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-md py-2 px-4 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0ff]/50 focus:border-[#0ff]/50 resize-none min-h-[42px] max-h-32"
            />
          </div>
          
          <button 
            onClick={sendMessage}
            className={`ml-2 p-3 rounded-full ${
              input.trim() 
                ? 'bg-[#0ff] text-black hover:bg-[#0ff]/80' 
                : 'bg-white/10 text-white/30'
            } transition-colors`}
            disabled={!input.trim()}
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
} 