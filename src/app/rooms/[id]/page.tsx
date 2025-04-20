"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

// Import types
import { Room, User, ChatMessage, TABS } from "@/types/room";

// Import custom components
import CustomCursor from "@/components/rooms/voice/CustomCursor";
import RoomHeader from "@/components/rooms/voice/RoomHeader";
import RoomStatsDisplay from "@/components/rooms/voice/RoomStatsDisplay";
import RoomAudioVisualizer from "@/components/rooms/voice/RoomAudioVisualizer";
import VoiceRoomContainer from "@/components/rooms/voice/VoiceRoomContainer";
import RoomControlBar from "@/components/rooms/voice/RoomControlBar";
import SidebarPanel from "@/components/rooms/voice/SidebarPanel";
import UserProfileCard from "@/components/rooms/voice/UserProfileCard";
import PublicUserProfileCard from "@/components/rooms/voice/PublicUserProfileCard";
import RoomShareModal from "@/components/rooms/RoomShareModal";
import MiniUserProfile from "@/components/rooms/voice/MiniUserProfile";
import CyberToast from "@/components/rooms/voice/CyberToast";
import RoomAudioSettings from "@/components/rooms/voice/RoomAudioSettings";
import RoomNeonGrid from "@/components/rooms/voice/RoomNeonGrid";

// Import hooks
import { useRoomData } from "@/hooks/useRoomData";
import { useRoomControls } from "@/hooks/useRoomControls";
import { useRoomToasts } from "@/hooks/useRoomToasts";
import { useRoomSidebar } from "@/hooks/useRoomSidebar";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useUser } from "@/contexts/UserContext";

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  
  // Room data and loading state
  const { room, loading, users, roomId, setRoomId, activeSpeakers } = useRoomData(params?.id);
  
  // Room toast notifications
  const { toasts, addToast, removeToast } = useRoomToasts();
  
  // Sidebar controls
  const { isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab } = useRoomSidebar();
  
  // Room controls (mic, hand, etc)
  const { muted, setMuted, handRaised, setHandRaised } = useRoomControls(addToast);
  
  // Sound effects
  const { playClick, playSuccess } = useSoundEffects();
  
  // User contexts and states
  const { user: contextUser } = useUser();
  const [currentUser, setCurrentUser] = useState(() => ({
    id: 1,
    name: contextUser.name || "You",
    level: contextUser.level || 24,
    status: contextUser.status || "online",
    avatarType: contextUser.avatarType || "cyan",
    avatarUrl: contextUser.avatarUrl || "",
    badges: contextUser.badges || ["Early Adopter", "Spatial Audio Pro", "Night Owl"]
  }));
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { message: "Anyone know how to configure spatial audio?", isUser: false, userName: "Alex" },
    { message: "You need to enable it in settings first", isUser: true },
    { message: "Thanks! Got it working now", isUser: false, userName: "Alex" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isAiAssistantActive, setIsAiAssistantActive] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // Modal states
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<{user: User | null, position: {x: number, y: number}}>({
    user: null, position: {x: 0, y: 0}
  });
  const [selectedParticipant, setSelectedParticipant] = useState<User | null>(null);
  
  // Update room ID when params change
  useEffect(() => {
    if (params?.id) {
      setRoomId(parseInt(params.id));
    }
  }, [params?.id, setRoomId]);
  
  // Update currentUser when contextUser changes
  useEffect(() => {
    setCurrentUser(prev => ({
      ...prev,
      name: contextUser.name || prev.name,
      level: contextUser.level || prev.level,
      status: contextUser.status || prev.status,
      avatarType: contextUser.avatarType || prev.avatarType,
      avatarUrl: contextUser.avatarUrl || prev.avatarUrl,
      badges: contextUser.badges || prev.badges
    }));
  }, [contextUser]);
  
  // Chat handlers
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;
    
    const userMessage = chatInput.trim();
    const newMessage: ChatMessage = {
      message: userMessage,
      isUser: true,
      timestamp: new Date(),
      userName: currentUser.name
    };
    
    playClick();
    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
    playSuccess();
    
    if (isAiAssistantActive) {
      handleAiAssistant(userMessage);
    } else {
      simulateResponse();
    }
  };
  
  const simulateResponse = () => {
      setTimeout(() => {
        const responses = [
          "That's interesting!",
          "I see what you mean",
          "Thanks for sharing that",
          "Good point!",
          "I'll try that out"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const aiMessage: ChatMessage = {
          message: randomResponse,
          isUser: false,
          userName: "Alex",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000 + Math.random() * 2000);
  };
  
  const handleQuickReply = (reply: string) => {
    setMessages([...messages, { message: reply, isUser: true }]);
    setShowQuickReplies(false);
    
    if (isAiAssistantActive) {
      handleAiAssistant(reply);
    } else {
      simulateQuickReplyResponse(reply);
    }
  };
  
  const simulateQuickReplyResponse = (reply: string) => {
    // Implementation from the original file
      setTimeout(() => {
        const responses = [
          "Sure, you can find that in settings -> audio -> spatial",
          "Let me help you, have you checked your input settings?",
          "Yeah, it's been great! Looking forward to more sessions like this",
          "We're discussing AI and the future of voice interfaces",
          "No problem, take your time",
          "Yes, this room is always open, 24/7",
          "Go to your profile and click the avatar section to change it",
          "You're welcome! Happy to help"
        ];
      
      // Logic to select appropriate response
      const quickReplies = ["How do I configure spatial audio?", "Can someone help me with my microphone?", 
                           "Great session today!", "What's the topic?", "Sorry, I'll be right back", 
                           "Is this room available 24/7?", "How do I change my avatar?", "Thanks for the help!"];
        const responseIndex = quickReplies.indexOf(reply);
        const response = responseIndex !== -1 ? responses[responseIndex] : 
                        responses[Math.floor(Math.random() * responses.length)];
                        
        setMessages(prev => [...prev, { message: response, isUser: false, userName: "Moderator" }]);
      }, 1000 + Math.random() * 2000);
  };
  
  const handleAiAssistant = (message: string) => {
    setIsAiTyping(true);
    
    // AI response logic moved to a hook or separate component
    // This is simplified from the original implementation
    setTimeout(() => {
      const responses = {
        spatial: [
          "To configure spatial audio, go to Settings > Audio > Spatial positioning and adjust the sliders.",
          "Spatial audio works best with headphones. Make sure they're properly connected and then enable it in audio settings."
        ],
        microphone: [
          "For microphone issues, check your browser permissions first, then verify your input device in settings.",
          "Try selecting a different microphone input in your device settings, then refresh NexVox."
        ],
        help: [
          "I'm here to help! What specific feature are you having trouble with?",
          "I can assist with room settings, audio configuration, and general NexVox features. Just let me know what you need."
        ]
      };
      
      let response: string;
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('spatial') || lowerMessage.includes('audio position')) {
        response = responses.spatial[Math.floor(Math.random() * responses.spatial.length)];
      } 
      else if (lowerMessage.includes('mic') || lowerMessage.includes('microphone')) {
        response = responses.microphone[Math.floor(Math.random() * responses.microphone.length)];
      }
      else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
        response = responses.help[Math.floor(Math.random() * responses.help.length)];
      }
      else {
        const genericResponses = [
          "I'm not sure I understand. Could you please rephrase your question?",
          "I can help with room settings, audio configuration, and general questions about NexVox features."
        ];
        response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }
      
      setIsAiTyping(false);
      setMessages(prev => [...prev, { message: response, isUser: false, userName: "NexVox AI" }]);
    }, 1500 + Math.random() * 1500);
  };
  
  const toggleAiAssistant = () => {
    const newState = !isAiAssistantActive;
    setIsAiAssistantActive(newState);
    
    if (newState) {
      setMessages(prev => [...prev, { 
        message: "NexVox AI Assistant is now active. How can I help you with your voice room experience?", 
        isUser: false, 
        userName: "NexVox AI" 
      }]);
      addToast("AI Assistant activated", 'success');
    } else {
      setMessages(prev => [...prev, { 
        message: "AI Assistant has been deactivated. Regular chat mode is now active.", 
        isUser: false, 
        userName: "System" 
      }]);
      addToast("AI Assistant deactivated", 'warning');
    }
  };
  
  // User interaction handlers
  const handleUserHover = (user: User, mouseX: number, mouseY: number) => {
    setHoveredUser({user, position: {x: mouseX, y: mouseY}});
  };
  
  const handleUserHoverEnd = () => {
    setHoveredUser({user: null, position: {x: 0, y: 0}});
  };
  
  // Toggle functions
  const toggleUserProfile = () => {
    playClick();
    setShowUserProfile(!showUserProfile);
  };
  
  const toggleAudioSettings = () => {
    const newSettingsState = !isAudioSettingsOpen;
    setIsAudioSettingsOpen(newSettingsState);
    playClick();
    if (newSettingsState) {
      addToast("Audio settings opened", 'success');
    }
  };
  
  const toggleShareModal = () => {
    playClick();
    setIsShareModalOpen(!isShareModalOpen);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-[#00FFFF] rounded-full animate-spin"></div>
          <div className="absolute top-1 left-1 right-1 bottom-1 border-4 border-transparent border-l-[#9D00FF] rounded-full animate-spin animate-reverse"></div>
          <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-transparent border-b-[#FF00E6] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Custom cursor */}
      <CustomCursor />
      
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-10 z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-[#00FFFF]/5 via-black to-[#FF00E6]/5 z-0"></div>
      <RoomNeonGrid color="#00FFFF" secondaryColor="#9D00FF" opacity={0.05} />
      
      {/* Room header */}
      <RoomHeader 
        room={room} 
        currentUser={currentUser} 
        toggleAudioSettings={toggleAudioSettings} 
        toggleUserProfile={toggleUserProfile} 
        isAudioSettingsOpen={isAudioSettingsOpen}
      />
      
      <div className="pt-16 flex h-screen">
        {/* Main Room Area */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:mr-[350px]' : ''}`}>
          <div className="py-8 px-6 h-full flex flex-col">
            {/* Room title and stats */}
            <RoomStatsDisplay 
              room={room} 
              activeSpeakersCount={activeSpeakers.length} 
            />
            
            {/* Audio activity visualization */}
            <RoomAudioVisualizer />
            
            {/* 3D User avatars in circle layout */}
            <VoiceRoomContainer
              users={users}
              activeSpeakers={activeSpeakers}
              handRaised={handRaised}
              onUserHover={handleUserHover}
              onUserHoverEnd={handleUserHoverEnd}
            />
          </div>
        </div>
      </div>
      
      {/* Sidebar toggle button */}
      <button
        className="fixed hidden lg:block top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-md border border-white/10 rounded-l-md p-3 z-30 hover:bg-black/90"
        style={{ 
          right: isSidebarOpen ? '350px' : '0',
          borderColor: isSidebarOpen ? "#00FFFF" : "rgba(255,255,255,0.1)",
          color: isSidebarOpen ? "#00FFFF" : "white" 
        }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
        </button>
        
      {/* Sidebar Panel */}
      <SidebarPanel
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
              messages={messages}
              isAiAssistantActive={isAiAssistantActive}
              isAiTyping={isAiTyping}
              showQuickReplies={showQuickReplies}
              setShowQuickReplies={setShowQuickReplies}
              handleSendMessage={handleSendMessage}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleQuickReply={handleQuickReply}
              toggleAiAssistant={toggleAiAssistant}
        users={users.map((user, index) => ({
                ...user,
                isSpeaking: activeSpeakers.includes(index)
              }))}
              onUserClick={(user: User) => {
                setSelectedParticipant(user);
                addToast(`Viewing ${user.name}'s profile`, 'success');
              }}
              currentUser={currentUser}
              addToast={addToast}
      />
      
      {/* Room Control Bar */}
      <RoomControlBar
        muted={muted}
        handRaised={handRaised}
        isShareModalOpen={isShareModalOpen}
        activeTab={activeTab}
        isSidebarOpen={isSidebarOpen}
        onToggleMute={() => {
          playClick();
          setMuted(!muted);
          if (muted) {
            addToast("Microphone unmuted", 'success');
          } else {
            addToast("Microphone muted", 'warning');
          }
        }}
        onToggleHandRaise={() => {
          playClick();
          setHandRaised(!handRaised);
          if (!handRaised) {
            addToast("Hand raised", 'success');
          }
        }}
        onToggleShare={toggleShareModal}
        onTabChange={(tab) => {
          playClick();
          setActiveTab(tab);
                setIsSidebarOpen(true);
              }}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onLeaveRoom={() => {
              addToast("Leaving room...", 'warning');
              setTimeout(() => router.push("/rooms"), 1000);
            }}
          />
      
      {/* Modals and overlays */}
      <AnimatePresence>
        {showUserProfile && (
          <UserProfileCard 
            user={currentUser} 
            onClose={() => setShowUserProfile(false)} 
          />
        )}
      
        {selectedParticipant && (
          <PublicUserProfileCard
            user={selectedParticipant}
            onClose={() => setSelectedParticipant(null)}
            onConnect={() => {
              addToast(`Connection request sent to ${selectedParticipant.name}`, 'success');
              setSelectedParticipant(null);
            }}
          />
        )}
      
        {hoveredUser.user && (
          <MiniUserProfile user={hoveredUser.user} position={hoveredUser.position} />
        )}
      
        {toasts.map((toast) => (
          <CyberToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      
        {isAudioSettingsOpen && (
          <RoomAudioSettings
                currentUser={currentUser} 
            onClose={() => setIsAudioSettingsOpen(false)}
            onSave={() => {
                  setIsAudioSettingsOpen(false);
                  addToast("Audio settings saved", 'success');
                }}
                addToast={addToast}
              />
        )}
      </AnimatePresence>
      
      {/* Share modal */}
      <RoomShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        roomId={roomId} 
        roomName={room?.name || "Voice Room"} 
        addToast={addToast}
      />
    </main>
  );
}