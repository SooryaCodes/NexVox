"use client";

import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { User } from '@/types/room';
import { getAvatarStyle, getStatusColor } from '@/utils/profileUtils';
import { IoArrowBack, IoSend, IoPaperPlane, IoMicOutline, IoEllipsisVertical, 
  IoImage, IoAttach, IoHappy, IoChevronDown, IoPersonCircleOutline, 
  IoCall, IoVideocam, IoInformationCircleOutline, IoDocumentText } from 'react-icons/io5';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useRouter } from 'next/navigation';
import PublicUserProfileCard from '@/components/rooms/voice/PublicUserProfileCard';
import gsap from 'gsap';

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
  suggestedReplies?: string[];
  mediaOptions?: { icon: React.ReactNode; label: string; color: string }[];
  onViewProfile?: () => void;
}

// Sample predefined messages for each friend
const getFriendMessages = (friendId: number): ChatMessage[] => {
  const commonResponses = [
    { id: crypto.randomUUID(), content: "Hi there! How are you?", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: crypto.randomUUID(), content: "I've been exploring the new features on NexVox", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23.5) },
    { id: crypto.randomUUID(), content: "I'm doing great! Just finished setting up my profile.", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
  ];

  // Friend-specific conversations
  const friendMessages: { [key: number]: ChatMessage[] } = {
    2: [
      ...commonResponses,
      { id: crypto.randomUUID(), content: "Want to join my gaming room later tonight?", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 10) },
      { id: crypto.randomUUID(), content: "I'm hosting a tournament in the VR space", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 9) },
      { id: crypto.randomUUID(), content: "Sounds awesome! What game are we playing?", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 8) },
      { id: crypto.randomUUID(), content: "Cyberpunk Arena - the new multiplayer mode just dropped", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 7) },
      { id: crypto.randomUUID(), content: "Perfect! I'll be there. Should I bring anyone else?", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { id: crypto.randomUUID(), content: "The more the merrier! I've got space for 6 players total", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 4) },
    ],
    3: [
      ...commonResponses,
      { id: crypto.randomUUID(), content: "Just finished my new music track. Want to hear it?", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
      { id: crypto.randomUUID(), content: "Absolutely! I've been waiting to hear your new stuff", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.7) },
      { 
        id: crypto.randomUUID(), 
        content: "Here's a preview of what I've been working on", 
        isUser: false, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        attachment: {
          type: 'audio',
          url: '/audios/sample-track.mp3',
          name: 'synthwave_preview.mp3'
        }
      },
      { id: crypto.randomUUID(), content: "Wow! This is incredible. Love the synth wave vibes and that bass drop!", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.3) },
      { id: crypto.randomUUID(), content: "Thanks! I'm thinking of hosting a listening party next week", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
      { id: crypto.randomUUID(), content: "Count me in. Your last party was amazing with the spatial audio setup", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5) },
    ],
    4: [
      ...commonResponses,
      { id: crypto.randomUUID(), content: "Did you see the new spatial audio features?", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      { id: crypto.randomUUID(), content: "I've been working on a new algorithm for immersive audio", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
      { id: crypto.randomUUID(), content: "Yes! It's a game-changer. How did you implement the 3D positioning?", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22) },
      { id: crypto.randomUUID(), content: "I used a combination of WebAudio API and custom HRTF processing", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21) },
      { id: crypto.randomUUID(), content: "Very impressive. The echo and reverb effects feel so natural", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20) },
      { 
        id: crypto.randomUUID(), 
        content: "Here's the technical diagram of how it works", 
        isUser: false, 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        attachment: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
          name: 'audio_diagram.jpg'
        }
      },
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
      { id: crypto.randomUUID(), content: "This looks incredible! Love the neon lighting and atmospheric fog", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46) },
      { id: crypto.randomUUID(), content: "Thanks! I was inspired by Blade Runner and modern cyberpunk aesthetics", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 45) },
      { id: crypto.randomUUID(), content: "Let me know if you want to collaborate on a project", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
      { id: crypto.randomUUID(), content: "Definitely! I've been wanting to work on a virtual gallery space", isUser: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) },
      { id: crypto.randomUUID(), content: "That's perfect timing. I have some ideas for interactive installations", isUser: false, timestamp: new Date(Date.now() - 1000 * 60 * 30) },
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
    `Have you tried the new spatial audio features in NexVox? The surround sound is incredible!`,
    `Want to join one of my rooms later? I'll be hosting a group session around 8pm.`,
    `Nice! That's awesome.`,
    `I've been working on something similar. Maybe we could collaborate?`,
    `Let's create a room and invite some friends. I'm thinking a casual hangout with spatial audio.`,
    `That's a great idea, let's explore it further. I've been wanting to try that.`,
    `The cyberpunk aesthetics in NexVox are amazing, right? The neon colors really pop!`,
    `Did you check out the new VR integration? Works perfectly with the Quest headsets.`,
    `I just got back from that digital concert. The audio visualization was mind-blowing!`,
    `Have you connected your Spotify yet? The playlist integration is seamless now.`,
    `We should try the new voice effect filters sometime. They're super fun!`,
    `The latest update really improved the voice clarity. Much better than before.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export default function ChatWindow({ 
  friend, 
  onBack, 
  suggestedReplies = [], 
  mediaOptions = [],
  onViewProfile
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const mediaOptionsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { playClick, playSuccess, playNotification, playToggle } = useSoundEffects();
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

  // Animation for the header
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, 
        { y: -20, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", clearProps: "all" }
      );
    }
  }, [friend]);
  
  // Handle clicking outside suggestions/media options to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (mediaOptionsRef.current && !mediaOptionsRef.current.contains(event.target as Node)) {
        setShowMediaOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const sendMessage = (content: string = input.trim()) => {
    if (!content) return;
    
    playClick('soft');
    
    // Create new message
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      isUser: true,
      timestamp: new Date(),
      status: 'sent'
    };
    
    // Add message to chat
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Temporarily hide suggestions when sending
    setShowSuggestions(false);
    
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
      
      // Show suggestions again after receiving a response
      setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
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

  const handleSuggestedReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleMediaOption = (option: string) => {
    const newMessageId = `msg-${Date.now()}`;
    let newMessage: ChatMessage = {
      id: newMessageId,
      content: `Sent a ${option.toLowerCase()}`,
      isUser: true,
      timestamp: new Date(),
      status: 'sent',
      attachment: undefined
    };

    // Different media options with realistic attachments
    switch (option) {
      case 'Images':
        newMessage.attachment = {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1591467468450-9a2228f2cc26',
          name: 'nexvox_image.jpg'
        };
        break;
      case 'Audio':
        newMessage.attachment = {
          type: 'audio',
          url: 'https://example.com/audio.mp3',
          name: 'voice_message.mp3'
        };
        newMessage.content = 'Voice message';
        break;
      case 'Files':
        newMessage.attachment = {
          type: 'file',
          url: 'https://example.com/document.pdf',
          name: 'project_specs.pdf'
        };
        newMessage.content = 'Shared a file: project_specs.pdf';
        break;
      case 'Location':
        newMessage.attachment = {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1543039625-14cbd3802e7d',
          name: 'location_map.jpg'
        };
        newMessage.content = 'Shared my location';
        break;
      case 'Calendar':
        newMessage.attachment = {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1606327054596-ee051081ae9e',
          name: 'event_calendar.jpg'
        };
        newMessage.content = 'Event: Team Meetup on Friday';
        break;
      case 'Theme':
        newMessage.attachment = {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
          name: 'custom_theme.jpg'
        };
        newMessage.content = 'Check out this new UI theme!';
        break;
      case 'Stickers':
        newMessage.attachment = {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1612404819070-77c0da59532e',
          name: 'cyber_stickers.jpg'
        };
        newMessage.content = '';
        break;
    }

    // Add the new message to the chat
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessageId ? { ...msg, status: 'delivered' } : msg
        )
      );
      
      // Set read status after another delay
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessageId ? { ...msg, status: 'read' } : msg
          )
        );
        
        // Have friend respond with an image or text after a delay
        setTimeout(() => {
          const isImageResponse = ['Images', 'Location', 'Theme'].includes(option) && Math.random() > 0.5;
          
          const responseImages = [
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
            'https://images.unsplash.com/photo-1614729375290-b2a429dcbce1',
            'https://images.unsplash.com/photo-1558655146-9f40138edfeb'
          ];
          
          const randomImage = responseImages[Math.floor(Math.random() * responseImages.length)];
          
          const friendResponse: ChatMessage = {
            id: `msg-${Date.now()}`,
            content: isImageResponse ? 'Check this out too:' : getRandomResponse(friend.name),
            isUser: false,
            timestamp: new Date(),
            attachment: isImageResponse ? {
              type: 'image',
              url: randomImage,
              name: 'response_image.jpg'
            } : undefined
          };
          
          setMessages(prev => [...prev, friendResponse]);
          playNotification();
          
          // Show suggestions after receiving a response
          setTimeout(() => {
            setShowSuggestions(true);
          }, 500);
        }, 1500);
        
      }, 1000);
    }, 1000);
  };

  const toggleSuggestions = () => {
    playToggle();
    // Always show suggestions the first time in a conversation
    if (messages.length <= 3 && !showSuggestions) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(!showSuggestions);
    }
    setShowMediaOptions(false);
  };

  const toggleMediaOptions = () => {
    playToggle();
    setShowMediaOptions(!showMediaOptions);
    setShowSuggestions(false);
  };

  const handleViewProfile = () => {
    playClick();
    setShowProfile(true);
    if (onViewProfile) {
      onViewProfile();
    }
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
  
  return (
    <div className="flex flex-col h-full relative">
      {/* Chat header */}
      <div 
        ref={headerRef}
        className="py-3 px-4 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md"
      >
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
            <button
              onClick={handleViewProfile}
              className="relative transition-transform hover:scale-105 focus:outline-none"
            >
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
            </button>
            
            <div className="ml-3">
              <h3 
                className="font-medium cursor-pointer hover:underline hover:text-[#0ff] transition-colors"
                onClick={handleViewProfile}
              >
                {friend.name}
              </h3>
              <div className="flex items-center text-xs text-white/60">
                <span className="capitalize">{friend.status || 'online'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-white/60 hover:text-[#00FFFF] rounded-full hover:bg-white/5 transition-colors"
            title="Call"
            onClick={() => playClick()}
          >
            <IoCall size={20} />
          </button>
          
          <button 
            className="p-2 text-white/60 hover:text-[#00FFFF] rounded-full hover:bg-white/5 transition-colors"
            title="Video call"
            onClick={() => playClick()}
          >
            <IoVideocam size={20} />
          </button>
          
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
            onClick={() => playClick()}
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
              <div className="px-3 py-1 rounded-full bg-black/50 text-xs text-white/40 backdrop-blur-sm">
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
                        ? 'bg-gradient-to-r from-[#0ff]/20 to-[#0ff]/10 rounded-t-lg rounded-bl-lg border border-[#0ff]/20' 
                        : 'bg-white/10 rounded-t-lg rounded-br-lg border border-white/5'
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
                                <button 
                                  className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                  onClick={() => playClick()}
                                >
                                  <IoPaperPlane size={14} className="text-white/70" />
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {message.attachment.type === 'file' && (
                            <div className="mt-2 p-2 bg-black/30 rounded-md">
                              <div className="flex items-center">
                                <div className="p-2 bg-[#9D00FF]/20 rounded-full mr-2">
                                  <IoDocumentText className="text-[#9D00FF]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm">{message.attachment.name}</div>
                                  <div className="text-xs text-white/40">Click to download</div>
                                </div>
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
      <div className="py-3 px-4 border-t border-white/10 bg-black/40 relative">
        {/* Suggested replies */}
        <AnimatePresence>
          {showSuggestions && suggestedReplies && suggestedReplies.length > 0 && (
            <m.div 
              ref={suggestionsRef}
              className="absolute bottom-full left-0 right-0 mb-2 px-4 py-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-t-md shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
              variants={popoverVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-wrap gap-2">
                {suggestedReplies.map((reply, index) => (
                  <m.button
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/90 hover:bg-[#0ff]/10 hover:border-[#0ff]/30 transition-colors"
                    onClick={() => handleSuggestedReply(reply)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {reply}
                  </m.button>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
        
        {/* Media options */}
        <AnimatePresence>
          {showMediaOptions && mediaOptions && mediaOptions.length > 0 && (
            <m.div 
              ref={mediaOptionsRef}
              className="absolute bottom-full left-0 right-0 mb-2 px-4 py-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-t-md shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
              variants={popoverVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="grid grid-cols-4 gap-4">
                {mediaOptions.map((option, index) => (
                  <m.button
                    key={index}
                    className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-white/5 transition-colors"
                    onClick={() => handleMediaOption(option.label)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                      style={{ background: `${option.color}20` }}
                    >
                      <div style={{ color: option.color }}>
                        {option.icon}
                      </div>
                    </div>
                    <span className="text-xs text-white/90">{option.label}</span>
                  </m.button>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-end">
          <div className="flex items-center space-x-2 mr-2">
            <button 
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              onClick={toggleMediaOptions}
            >
              <IoAttach size={20} />
            </button>
            <button 
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              onClick={() => handleMediaOption("Images")}
            >
              <IoImage size={20} />
            </button>
            <button 
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              onClick={toggleSuggestions}
            >
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
              className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-4 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0ff]/50 focus:border-[#0ff]/50 resize-none min-h-[42px] max-h-32"
            />
          </div>
          
          <button 
            onClick={() => sendMessage()}
            className={`ml-2 p-3 rounded-full ${
              input.trim() 
                ? 'bg-gradient-to-r from-[#0ff] to-[#0ff]/80 text-black hover:opacity-90' 
                : 'bg-white/10 text-white/30'
            } transition-colors shadow-lg shadow-[#0ff]/20`}
            disabled={!input.trim()}
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>
      
      {/* User profile modal */}
      <AnimatePresence>
        {showProfile && (
          <PublicUserProfileCard 
            user={friend} 
            onClose={() => setShowProfile(false)}
            onConnect={() => {
              playSuccess();
              setShowProfile(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 